-- Adds Cloudinary public identifier reference to products.
ALTER TABLE products
ADD COLUMN IF NOT EXISTS image_public_id text;
