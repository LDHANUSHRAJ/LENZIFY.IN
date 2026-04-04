-- users (extended via Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT, phone TEXT, role TEXT DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE categories (id SERIAL PRIMARY KEY, name TEXT, slug TEXT, image_url TEXT);
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT, description TEXT, price NUMERIC, 
  category_id INT REFERENCES categories(id),
  stock INT DEFAULT 0, created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE product_images (id SERIAL PRIMARY KEY, product_id UUID REFERENCES products(id), image_url TEXT, is_primary BOOL DEFAULT FALSE);
CREATE TABLE cart (
  id SERIAL PRIMARY KEY, user_id UUID REFERENCES profiles(id),
  product_id UUID REFERENCES products(id), quantity INT DEFAULT 1
);
CREATE TABLE addresses (
  id SERIAL PRIMARY KEY, user_id UUID REFERENCES profiles(id),
  name TEXT, phone TEXT, address TEXT, city TEXT, state TEXT, pincode TEXT
);
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id), total NUMERIC,
  status TEXT DEFAULT 'pending', payment_status TEXT DEFAULT 'pending',
  payment_id TEXT, address_id INT REFERENCES addresses(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY, order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id), quantity INT, price NUMERIC
);
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY, user_id UUID REFERENCES profiles(id),
  product_id UUID REFERENCES products(id), rating INT, comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE coupons (
  id SERIAL PRIMARY KEY, code TEXT UNIQUE, discount NUMERIC,
  type TEXT DEFAULT 'percent', expiry DATE, is_active BOOL DEFAULT TRUE
);
CREATE TABLE wishlists (
  id SERIAL PRIMARY KEY, user_id UUID REFERENCES profiles(id),
  product_id UUID REFERENCES products(id)
);
CREATE TABLE banners (
  id SERIAL PRIMARY KEY, title TEXT, subtitle TEXT,
  image_url TEXT, link TEXT, is_active BOOL DEFAULT TRUE
);
