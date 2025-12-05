import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CartDrawer = () => {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, subtotal, clearCart } = useCart();
  const freeShippingThreshold = 150;
  const remainingForFreeShipping = freeShippingThreshold - subtotal;
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = () => {
    toggleCart(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-foreground/50 z-50"
            onClick={() => toggleCart(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-background z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
              <h2 className="text-lg font-display tracking-wider">YOUR CART ({items.length})</h2>
              <button onClick={() => toggleCart(false)} className="p-1 hover:opacity-60 transition-opacity">
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Free Shipping Progress */}
            {remainingForFreeShipping > 0 && items.length > 0 && (
              <div className="px-4 md:px-6 py-3 bg-card">
                <p className="text-xs font-body text-center">
                  You're <span className="font-bold">${remainingForFreeShipping.toFixed(2)}</span> away from free shipping!
                </p>
                <div className="mt-2 h-1 bg-border">
                  <div
                    className="h-full bg-foreground transition-all duration-300"
                    style={{ width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground mb-4" strokeWidth={1} />
                  <p className="font-display text-lg tracking-wider">YOUR CART IS EMPTY</p>
                  <p className="mt-2 text-sm font-body text-muted-foreground">
                    Add some pieces to get started
                  </p>
                  <button onClick={() => toggleCart(false)} className="mt-6 btn-primary">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-24 h-24 bg-card flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-display text-sm tracking-wider">{item.name.toUpperCase()}</h4>
                          <p className="text-sm font-body mt-1">${item.price}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-border">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                              className="p-2 hover:bg-card transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-4 text-sm font-body">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-card transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-xs font-display tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                          >
                            REMOVE
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 md:p-6 border-t border-border space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-display tracking-wider">SUBTOTAL</span>
                  <span className="font-display tracking-wider">${subtotal.toFixed(2)}</span>
                </div>
                <p className="text-xs font-body text-muted-foreground text-center">
                  Shipping and taxes calculated at checkout
                </p>
                <button
                  className="w-full btn-primary"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? "Processing..." : "Checkout"}
                </button>
                <button onClick={() => toggleCart(false)} className="w-full btn-ghost text-center block">
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
