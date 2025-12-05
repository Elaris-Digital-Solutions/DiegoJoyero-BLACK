import { motion } from "framer-motion";
import ProductCard, { Product } from "./ProductCard";

const allProducts: Product[] = [
  {
    id: "5",
    name: "Nexus Band",
    price: 79,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80",
  },
  {
    id: "6",
    name: "Helios Cuff",
    price: 159,
    originalPrice: 199,
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&q=80",
    status: "sale",
  },
  {
    id: "7",
    name: "Atlas Ring",
    price: 99,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&q=80",
    status: "new",
  },
  {
    id: "8",
    name: "Orion Chain",
    price: 189,
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&q=80",
  },
  {
    id: "9",
    name: "Titan Signet",
    price: 139,
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&q=80",
    status: "sold-out",
  },
  {
    id: "10",
    name: "Nova Pendant",
    price: 119,
    image: "https://images.unsplash.com/photo-1599459183200-59c3a0e3c9e3?w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80",
  },
  {
    id: "11",
    name: "Eclipse Hoops",
    price: 89,
    originalPrice: 109,
    image: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=600&q=80",
    status: "sale",
  },
  {
    id: "12",
    name: "Vega Link",
    price: 169,
    image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&q=80",
    hoverImage: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&q=80",
  },
];

interface AllProductsProps {
  onAddToCart: (product: Product) => void;
}

const AllProducts = ({ onAddToCart }: AllProductsProps) => {
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
              {allProducts.length} products
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {allProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              index={index}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <button className="btn-outline">
            Load More
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default AllProducts;
