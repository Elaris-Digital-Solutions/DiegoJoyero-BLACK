import { Facebook, Instagram, Youtube, Music2 } from "lucide-react";

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
                href="https://www.tiktok.com/@diego.joyero925?_t=8iIxkY9zR4v&_r=1"
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-60 transition-opacity"
              >
                <Music2 className="w-5 h-5" strokeWidth={1.5} />
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
              {["Home", "Collections", "Featured", "Offer", "All Pieces", "Drop List"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="text-xs font-display tracking-[0.15em] mb-4">CONTACT</h5>
            <ul className="space-y-3">
              <li>
                <a href="https://www.instagram.com/diego.joyero/" target="_blank" rel="noreferrer" className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@diego.joyero925?_t=8iIxkY9zR4v&_r=1"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Music2 className="w-4 h-4" strokeWidth={1.5} />
                  TikTok
                </a>
              </li>
              <li className="text-sm font-body text-muted-foreground">
                <span className="uppercase font-display text-xs tracking-[0.15em] text-foreground block mb-1">
                  Trabaja con nosotros:
                </span>
                <a href="mailto:partnersdiegojoyero@gmail.com" className="hover:text-foreground transition-colors">
                  partnersdiegojoyero@gmail.com
                </a>
              </li>
              <li className="text-sm font-body text-muted-foreground">
                <span className="uppercase font-display text-xs tracking-[0.15em] text-foreground block mb-1">
                  Dudas / reclamos:
                </span>
                <a href="mailto:clientesdiegojoyero@gmail.com" className="hover:text-foreground transition-colors">
                  clientesdiegojoyero@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-xs font-body text-muted-foreground">
            © 2024 Diego Joyero. All rights reserved. {" "}
            <a
              href="https://www.instagram.com/elarisdigitalsolutions/"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-muted-foreground decoration-[1px] underline-offset-4 hover:text-foreground transition-colors"
            >
              Desarrollado por Elaris Digital Solutions.
            </a>
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
