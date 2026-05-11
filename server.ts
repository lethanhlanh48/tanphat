import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';
import multer from 'multer';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Google Drive Auth Helper
function getOAuth2Client() {
  if (!process.env.GOOGLE_DRIVE_CLIENT_ID || !process.env.GOOGLE_DRIVE_CLIENT_SECRET) {
    throw new Error('Thiếu cấu hình GOOGLE_DRIVE_CLIENT_ID hoặc GOOGLE_DRIVE_CLIENT_SECRET trong định danh ứng dụng.');
  }
  return new google.auth.OAuth2(
    process.env.GOOGLE_DRIVE_CLIENT_ID,
    process.env.GOOGLE_DRIVE_CLIENT_SECRET,
    `${process.env.APP_URL}/auth/google/callback`
  );
}

const upload = multer({ dest: 'uploads/' });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // --- Google Drive OAuth Routes ---

  app.get('/api/auth/google/url', (req, res) => {
    try {
      const client = getOAuth2Client();
      const scopes = ['https://www.googleapis.com/auth/drive.file'];
      const url = client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent'
      });
      res.json({ url });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/auth/google/callback', async (req, res) => {
    const { code } = req.query;
    try {
      const client = getOAuth2Client();
      const { tokens } = await client.getToken(code as string);
      
      // Pass tokens message back to the main app
      res.send(`
        <html>
          <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f0f2f5;">
            <div style="background: white; padding: 2rem; border-radius: 1rem; shadow: 0 10px 25px rgba(0,0,0,0.1); text-align: center;">
              <h2 style="color: #1a73e8;">Xác thực thành công!</h2>
              <p>Thông tin đã được chuyển về ứng dụng. Cửa sổ này sẽ tự động đóng.</p>
              <script>
                if (window.opener) {
                  window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', tokens: ${JSON.stringify(tokens)} }, '*');
                  setTimeout(() => window.close(), 1000);
                } else {
                  window.location.href = '/';
                }
              </script>
            </div>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Error getting tokens:', error);
      res.status(500).send('Lỗi trong quá trình xác thực Google. Hãy kiểm tra Client ID/Secret.');
    }
  });

  // --- Google Drive Upload Route ---

  app.post('/api/drive/upload', (req, res, next) => {
    upload.single('image')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.error('Multer Error:', err);
        return res.status(400).json({ error: `Lỗi upload file: ${err.message}` });
      } else if (err) {
        console.error('Unknown Upload Error:', err);
        return res.status(500).json({ error: 'Lỗi hệ thống khi tải ảnh lên.' });
      }
      next();
    });
  }, async (req, res) => {
    try {
      console.log('--- Inbound Upload Request ---');
      
      // Try to get token from standard Authorization header or custom header
      let tokenValue = req.headers['x-google-tokens'] as string;
      if (!tokenValue && req.headers['authorization']) {
        const authHeader = req.headers['authorization'] as string;
        if (authHeader.startsWith('Bearer ')) {
          tokenValue = authHeader.substring(7);
        }
      }

      if (!req.file) {
        console.error('Upload Error: No file in request');
        return res.status(400).json({ error: 'Không tìm thấy file tải lên.' });
      }

      if (!tokenValue) {
        console.error('Upload Error: Missing tokens. Headers:', JSON.stringify(req.headers));
        return res.status(401).json({ error: 'Chưa xác thực Google Drive (Thiếu token).' });
      }

      let tokens: any;
      try {
        tokens = JSON.parse(tokenValue);
      } catch (e) {
        // If it's just the access token string directly
        tokens = { access_token: tokenValue };
      }

      if (!tokens || !tokens.access_token) {
        console.error('Upload Error: Invalid tokens structure', tokens);
        return res.status(401).json({ error: 'Chưa xác thực Google Drive (Token không hợp lệ).' });
      }

      let tokensRefreshed = false;
      const client = getOAuth2Client();
      client.setCredentials(tokens);

      // Attempt to refresh if access_token is potentially expired and refresh_token exists
      if (tokens.refresh_token) {
        try {
          console.log('Checking if token refresh is needed...');
          // google-auth-library will automatically refresh if we use getRequestHeaders or refreshAccessToken
          const { credentials } = await client.refreshAccessToken();
          if (credentials.access_token !== tokens.access_token) {
            console.log('Token refreshed successfully');
            tokens = { ...tokens, ...credentials };
            client.setCredentials(tokens);
            tokensRefreshed = true;
          }
        } catch (refreshErr) {
          console.warn('Could not refresh token (it might still be valid or refresh_token is expired):', refreshErr);
        }
      }

      const drive = google.drive({ version: 'v3', auth: client });

      const folderId = req.body.folderId;
      const parents = folderId ? [folderId] : (process.env.GOOGLE_DRIVE_FOLDER_ID ? [process.env.GOOGLE_DRIVE_FOLDER_ID] : []);

      const fileMetadata = {
        name: req.file.originalname,
        parents: parents
      };

      const media = {
        mimeType: req.file.mimetype,
        body: fs.createReadStream(req.file.path)
      };

      console.log('Finalizing upload to Google Drive...');
      const response = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id, webViewLink, webContentLink'
      });

      // Cleanup local file safely
      try {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (unlinkErr) {
        console.warn('Could not delete temp file:', unlinkErr);
      }

      // Make file public if possible (optional)
      try {
        await drive.permissions.create({
          fileId: response.data.id!,
          requestBody: {
            role: 'reader',
            type: 'anyone'
          }
        });
      } catch (err) {
        console.warn('Could not make file public automatically:', err);
      }

      const directLink = `https://lh3.googleusercontent.com/d/${response.data.id}`;

      console.log('Upload successful! ID:', response.data.id);
      res.json({
        id: response.data.id,
        link: directLink,
        originalLink: response.data.webViewLink,
        webContentLink: response.data.webContentLink,
        tokens: tokensRefreshed ? tokens : undefined
      });

    } catch (error: any) {
      console.error('Drive Upload Error Details:', error);
      const statusCode = error.code === 401 || error.message?.includes('invalid_grant') ? 401 : 500;
      
      // Ensure we always return JSON
      if (!res.headersSent) {
        res.status(statusCode).json({ 
          error: error.message || 'Lỗi không xác định khi tải lên Drive.',
          code: error.code || 'UNKNOWN_ERROR'
        });
      }
    }
  });

  // Catch-all for API 404s to ensure JSON
  app.all('/api/*', (req, res) => {
    res.status(404).json({ error: `API route not found: ${req.url}` });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true'
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
