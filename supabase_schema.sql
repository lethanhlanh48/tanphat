-- Create Categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'Đang kinh doanh'
);

-- Create Suppliers table (Thương hiệu/Nhà cung cấp)
CREATE TABLE IF NOT EXISTS public.suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    address TEXT,
    category TEXT
);

-- Create Products table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image TEXT,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    category TEXT,
    brand TEXT,
    unit TEXT,
    price NUMERIC DEFAULT 0,
    cost_price NUMERIC DEFAULT 0,
    stock INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Đang kinh doanh',
    qr_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_code TEXT NOT NULL UNIQUE,
    customer_name TEXT,
    customer_phone TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_amount NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'Chờ xử lý',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Users table (Extended profile for Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT,
    full_name TEXT,
    email TEXT UNIQUE,
    role TEXT DEFAULT 'Nhân viên',
    status TEXT DEFAULT 'active',
    last_login TIMESTAMP WITH TIME ZONE,
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create Policies (Simplified for development - Adjust for production)

-- Public read access
CREATE POLICY "Public Read Access" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON public.suppliers FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON public.products FOR SELECT USING (true);
CREATE POLICY "Authenticated Users Read Access" ON public.orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Public Users Profile Read Access" ON public.users FOR SELECT USING (true);

-- Public write access for development (Use auth.role() = 'authenticated' for production)
CREATE POLICY "Public Write Access" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Write Access" ON public.suppliers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Write Access" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Write Access" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Users Manage Own Profile" ON public.users FOR ALL USING (true) WITH CHECK (true);

-- Enable Realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.suppliers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
