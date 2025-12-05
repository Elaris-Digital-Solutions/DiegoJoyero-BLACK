import { useState, useCallback } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import PromoBanner from "@/components/PromoBanner";
import AllProducts from "@/components/AllProducts";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import { Product } from "@/components/ProductCard";
import ProductDetailModal, { ProductDetail } from "@/components/ProductDetailModal";

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDetail | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleAddToCart = useCallback((product: Product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        toast.success(`Added another ${product.name} to cart`);
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      toast.success(`${product.name} added to cart`);
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  }, []);

  const handleShowDetails = useCallback((product: ProductDetail) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  }, []);

  const handleAddToCartFromDetail = useCallback(
    (product: ProductDetail) => {
      const mapped: Product = {
        id: product.id,
        name: product.name,
        price: Number(product.price ?? 0),
        image: product.image_url,
        hoverImage: product.image_url,
        status:
          product.status === "inactive" || Number(product.stock ?? 0) <= 0
            ? "sold-out"
            : undefined,
      };

      handleAddToCart(mapped);
    },
    [handleAddToCart]
  );

  const handleUpdateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }, []);

  const handleRemoveItem = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    toast.info("Item removed from cart");
  }, []);

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="bottom-right" />
      <AnnouncementBar />
      <Header cartItemCount={cartItemCount} onCartClick={() => setIsCartOpen(true)} />
      <main>
        <HeroSection />
        <CategoryGrid />
        <FeaturedProducts onAddToCart={handleAddToCart} onShowDetails={handleShowDetails} />
        <PromoBanner />
        <AllProducts onAddToCart={handleAddToCart} onShowDetails={handleShowDetails} />
        <Newsletter />
      </main>
      <Footer />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
      <ProductDetailModal
        open={isDetailOpen}
        product={selectedProduct}
        onClose={() => setIsDetailOpen(false)}
        onAddToCart={handleAddToCartFromDetail}
      />
    </div>
  );
};

export default Index;
