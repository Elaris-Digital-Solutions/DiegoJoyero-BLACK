import { Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <img src="/logo.png" alt="Diego Joyero" className="h-8 object-contain" />
            <p className="mt-4 text-sm font-body text-muted-foreground leading-relaxed">
              Industrial jewelry for the modern individual. Crafted with intention.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://www.instagram.com/diego.joyero/"
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-60 transition-opacity"
              >
                <Instagram className="w-5 h-5" strokeWidth={1.5} />
              </a>
              <a
                href="https://www.facebook.com/people/Diego-Joyero/61551986008410/"
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-60 transition-opacity"
              >
                <Facebook className="w-5 h-5" strokeWidth={1.5} />
              </a>
              <a
                href="https://www.youtube.com/@DiegoJoyero-m1n/videos"
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-60 transition-opacity"
              >
                <Youtube className="w-5 h-5" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h5 className="text-xs font-display tracking-[0.15em] mb-4">SHOP</h5>
            <ul className="space-y-3">
              {["All Products", "Rings", "Bracelets", "Necklaces", "New Arrivals", "Sale"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h5 className="text-xs font-display tracking-[0.15em] mb-4">INFO</h5>
            <ul className="space-y-3">
              {["About Us", "Contact", "Shipping", "Returns", "Size Guide", "Care Instructions"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h5 className="text-xs font-display tracking-[0.15em] mb-4">LEGAL</h5>
            <ul className="space-y-3">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-xs font-body text-muted-foreground">
            © 2024 Diego Joyero. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <select
              defaultValue="SOL"
              className="bg-transparent text-xs font-display uppercase tracking-wider cursor-pointer focus:outline-none text-foreground"
            >
              <option value="SOL" style={{ color: '#000' }}>SOL S/</option>
              <option value="USD" style={{ color: '#000' }}>USD $</option>
            </select>
            <span className="text-muted-foreground">|</span>
            <select className="bg-transparent text-xs font-display uppercase tracking-wider cursor-pointer focus:outline-none text-foreground">
              <option style={{ color: '#000' }}>United States</option>
              <option style={{ color: '#000' }}>Peru</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
