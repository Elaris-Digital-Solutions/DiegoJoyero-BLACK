import { useState, useCallback } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PromoBanner from "@/components/PromoBanner";
import AllProducts from "@/components/AllProducts";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { Product } from "@/components/ProductCard";
import ProductDetailModal, { ProductDetail } from "@/components/ProductDetailModal";
import { useCart } from "@/contexts/CartContext";

const Index = () => {
  const { addItem } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<ProductDetail | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleAddToCart = useCallback((product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  }, [addItem]);

  const handleShowDetails = useCallback((product: ProductDetail) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  }, []);

  const handleAddToCartFromDetail = useCallback(
    (product: ProductDetail) => {
      addItem({
        id: product.id,
        name: product.name,
        price: Number(product.price ?? 0),
        image: product.image_url,
      });
    },
    [addItem]
  );

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="bottom-right" />
      <AnnouncementBar />
      <Header />
      <main>
        <HeroSection />
        <AllProducts onAddToCart={handleAddToCart} onShowDetails={handleShowDetails} />
        <PromoBanner />
        <Newsletter />
      </main>
      <Footer />
      <CartDrawer />
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
