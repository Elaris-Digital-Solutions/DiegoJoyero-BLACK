import { motion } from "framer-motion";
import ProductCard, { Product } from "./ProductCard";

const featuredProducts: Product[] = [
  {
    id: "1",
    name: "Omega Ring",
    price: 89,
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
    status: "new",
  },
  {
    id: "2",
    name: "San Ti Bracelet",
    price: 129,
    originalPrice: 159,
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&q=80",
    status: "sale",
  },
  {
    id: "3",
    name: "Centauri Chain",
    price: 199,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&q=80",
  },
  {
    id: "4",
    name: "Lycos Pendant",
    price: 149,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
    status: "sold-out",
  },
];

interface FeaturedProductsProps {
  onAddToCart: (product: Product) => void;
}

const FeaturedProducts = ({ onAddToCart }: FeaturedProductsProps) => {
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
