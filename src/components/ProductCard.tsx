import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { ProductDetail } from "./ProductDetailModal";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  status?: "sold-out" | "sale" | "new";
  detail?: ProductDetail;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  index?: number;
  onShowDetails?: (product: ProductDetail) => void;
}

const ProductCard = ({ product, onAddToCart, onShowDetails, index = 0 }: ProductCardProps) => {
  const isSoldOut = product.status === "sold-out";
  const isOnSale = product.status === "sale" && product.originalPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="product-card group"
      role="button"
      tabIndex={0}
      onClick={() => product.detail && onShowDetails?.(product.detail)}
      onKeyDown={(event) => {
        if ((event.key === "Enter" || event.key === " ") && product.detail) {
          event.preventDefault();
          onShowDetails?.(product.detail);
        }
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-card">
        <img
          src={product.image}
          alt={product.name}
          className={`product-card-image absolute inset-0 w-full h-full object-cover ${
            isSoldOut ? "opacity-60" : ""
          }`}
        />
        
        {/* Hover Image */}
        {product.hoverImage && !isSoldOut && (
          <img
            src={product.hoverImage}
            alt={`${product.name} alternate view`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}

        {/* Status Badge */}
        {product.status && (
          <div className="absolute top-4 left-4">
            {isSoldOut && (
              <span className="badge-sold-out">SOLD OUT</span>
            )}
            {isOnSale && (
              <span className="badge-sale">SALE</span>
            )}
            {product.status === "new" && (
              <span className="bg-foreground text-background px-3 py-1 text-xs font-display uppercase tracking-wider">
                NEW
              </span>
            )}
          </div>
        )}

        {/* Quick Add Button */}
        {!isSoldOut && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="absolute bottom-4 left-4 right-4 bg-foreground text-background py-3 font-display uppercase text-xs tracking-[0.15em]
                     opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300
                     hover:bg-foreground/90 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" strokeWidth={1.5} />
            Quick Add
          </button>
        )}
      </div>

      {/* Product Info */}
      <div className="mt-4 space-y-1">
        <h4 className={`font-display text-sm tracking-wider ${isSoldOut ? "line-through text-muted-foreground" : ""}`}>
          {product.name.toUpperCase()}
        </h4>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-body ${isSoldOut ? "text-muted-foreground" : ""}`}>
            ${product.price}
          </span>
          {isOnSale && product.originalPrice && (
            <span className="text-sm font-body text-muted-foreground line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
