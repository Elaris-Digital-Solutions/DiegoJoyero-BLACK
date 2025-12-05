import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import ProductCard, { Product as CardProduct } from "./ProductCard";
import { fetchLandingProducts } from "@/lib/catalog";
import type { Product as SupabaseProduct } from "@/lib/supabase";
import type { ProductDetail } from "./ProductDetailModal";

interface FeaturedProductsProps {
  onAddToCart: (product: CardProduct) => void;
  onShowDetails: (product: ProductDetail) => void;
}

const mapToCardProduct = (product: SupabaseProduct): CardProduct => ({
  id: product.id,
  name: product.name,
  price: Number(product.price ?? 0),
  image: product.image_url,
  hoverImage: product.image_url,
  status: undefined,
  detail: product,
});

const FeaturedProducts = ({ onAddToCart, onShowDetails }: FeaturedProductsProps) => {
  const [products, setProducts] = useState<CardProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchLandingProducts({ featuredOnly: true })
      .then((items) => {
        if (!isMounted) return;
        setProducts(items.map(mapToCardProduct));
      })
      .catch((fetchError) => {
        console.error("No se pudieron cargar los featured", fetchError);
        if (!isMounted) return;
        setError("No se pudieron cargar los productos destacados.");
        setProducts([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const hasProducts = useMemo(() => products.length > 0, [products]);

  return (
    <section id="products" className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
        >
          <div>
            <p className="text-xs font-display tracking-[0.2em] text-muted-foreground mb-2">
              DROP 001
            </p>
            <h3 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
              FEATURED PIECES
            </h3>
          </div>
          <a
            href="#all-products"
            className="mt-4 md:mt-0 text-xs font-display tracking-[0.15em] border-b border-foreground pb-1 hover:border-muted-foreground hover:text-muted-foreground transition-colors"
          >
            VIEW ALL PRODUCTS →
          </a>
        </motion.div>

        {error ? (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onShowDetails={onShowDetails}
              index={index}
            />
          ))}
          {(!loading && !error && !hasProducts) ? (
            <div className="col-span-2 md:col-span-4 rounded-lg border border-border/60 bg-background/50 px-4 py-6 text-center text-sm text-muted-foreground">
              No hay piezas destacadas disponibles ahora.
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
