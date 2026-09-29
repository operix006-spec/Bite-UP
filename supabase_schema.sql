-- Clean up existing tables if re-running
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS site_content CASCADE;

-- 1. Products Table
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC NOT NULL,
    calories INTEGER,
    protein INTEGER,
    carbs INTEGER,
    fat INTEGER,
    "sugarNote" TEXT,
    image TEXT NOT NULL,
    featured BOOLEAN DEFAULT false,
    "nutritionFeatured" BOOLEAN DEFAULT false,
    "nutritionTabName" TEXT,
    "orderIndex" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Locations Table
CREATE TABLE locations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    area TEXT NOT NULL,
    city TEXT NOT NULL,
    category TEXT NOT NULL,
    "mapUrl" TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Site Content Table (Key-Value pair)
CREATE TABLE site_content (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Create Policies to allow ANYONE to read and write (since we have no auth yet)
-- WARNING: This makes your database publicly writable. It is for development/prototyping only.
-- Later, these policies should be restricted to authenticated users.

CREATE POLICY "Enable read access for all users" ON products FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON products FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON products FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON locations FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON locations FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON locations FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON locations FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON site_content FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON site_content FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON site_content FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON site_content FOR DELETE USING (true);
