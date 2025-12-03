import { Search, User, ShoppingBag } from "lucide-react";
import { useState } from "react";
import CartDrawer from "./CartDrawer";

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
}

const Header = ({ cartItemCount, onCartClick }: HeaderProps) => {
  const [currency, setCurrency] = useState("SOL");

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Currency Selector - Desktop */}
          <div className="hidden md:flex items-center gap-2 w-32">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent text-xs font-display uppercase tracking-wider cursor-pointer focus:outline-none text-foreground"
            >
              <option value="SOL" style={{ color: '#000' }}>SOL S/</option>
              <option value="USD" style={{ color: '#000' }}>USD $</option>
            </select>
          </div>

          {/* Logo */}
          <a href="/" className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:flex-1 md:flex md:justify-center">
            <img src="/logo.png" alt="Diego Joyero" className="h-8 md:h-10 object-contain" />
          </a>

          {/* Icons */}
          <div className="flex items-center gap-4 md:gap-6 w-32 justify-end">
            <button className="p-1 hover:opacity-60 transition-opacity">
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <button className="p-1 hover:opacity-60 transition-opacity hidden md:block">
              <User className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <button
              onClick={onCartClick}
              className="p-1 hover:opacity-60 transition-opacity relative"
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-foreground text-background text-[10px] font-display w-4 h-4 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
