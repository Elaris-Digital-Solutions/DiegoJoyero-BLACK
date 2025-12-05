import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import ProductCard, { Product as CardProduct } from "./ProductCard";
import { fetchLandingProducts } from "@/lib/catalog";
import type { Product as SupabaseProduct } from "@/lib/supabase";

interface AllProductsProps {
  onAddToCart: (product: CardProduct) => void;
}

const mapToCardProduct = (product: SupabaseProduct): CardProduct => ({
  id: product.id,
  name: product.name,
  price: Number(product.price ?? 0),
  image: product.image_url,
  hoverImage: product.image_url,
  status: undefined,
});

const AllProducts = ({ onAddToCart }: AllProductsProps) => {
  const [products, setProducts] = useState<CardProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchLandingProducts({ featuredOnly: false })
      .then((items) => {
        if (!isMounted) return;
        setProducts(items.map(mapToCardProduct));
      })
      .catch((fetchError) => {
        console.error("No se pudo cargar el catálogo", fetchError);
        if (!isMounted) return;
        setError("No se pudo cargar el catálogo. Intenta más tarde.");
        setProducts([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const productCount = useMemo(() => products.length, [products]);

  return (
    <section id="all-products" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
        >
          <div>
            <h3 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
              ALL PIECES
            </h3>
            <p className="mt-2 text-sm text-muted-foreground font-body">
              {loading ? "Loading…" : `${productCount} products`}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <select className="bg-transparent text-xs font-display uppercase tracking-wider cursor-pointer focus:outline-none border-b border-foreground pb-1 text-white" style={{ color: '#FFF' }}>
              <option style={{ color: "#000" }}>Sort by: Featured</option>
              <option style={{ color: "#000" }}>Price: Low to High</option>
              <option style={{ color: "#000" }}>Price: High to Low</option>
              <option style={{ color: "#000" }}>Newest</option>
            </select>
          </div>
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
              index={index}
            />
          ))}
          {(!loading && products.length === 0 && !error) ? (
            <div className="col-span-2 md:col-span-4 rounded-lg border border-border/60 bg-card/50 px-4 py-6 text-center text-sm text-muted-foreground">
              No hay productos disponibles en este momento.
            </div>
          ) : null}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <button className="btn-outline" disabled>
            Load More
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default AllProducts;
