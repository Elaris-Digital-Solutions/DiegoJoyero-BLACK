/*
  # Diego Joyero - Jewelry Products Schema

  ## Overview
  Creates the database structure for a luxury jewelry e-commerce site with dual gold/silver themes.

  ## New Tables
  
  ### `products`
  - `id` (uuid, primary key) - Unique product identifier
  - `name` (text) - Product name
  - `description` (text) - Detailed product description
  - `price` (numeric) - Product price
  - `material` (text) - Material type: 'gold' or 'silver'
  - `category` (text) - Product category (rings, necklaces, bracelets, earrings, etc.)
  - `image_url` (text) - Product image URL
  - `stock` (integer) - Available quantity
  - `featured` (boolean) - Whether product is featured
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on `products` table
  - Add policy for public read access (products are viewable by everyone)
  - Admin write access would be handled separately
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10, 2) NOT NULL CHECK (price >= 0),
  material text NOT NULL CHECK (material IN ('gold', 'silver')),
  category text NOT NULL,
  image_url text NOT NULL,
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_products_material ON products(material);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;