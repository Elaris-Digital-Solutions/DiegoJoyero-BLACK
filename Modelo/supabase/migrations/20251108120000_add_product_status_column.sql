-- Adds a status column to manage product visibility from the admin panel
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive'));

CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);

-- Ensure updated_at is automatically refreshed on every update
CREATE OR REPLACE FUNCTION set_products_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_products_updated_at ON products;
CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION set_products_updated_at();
