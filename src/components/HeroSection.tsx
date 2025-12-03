import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative h-[85vh] md:h-[90vh] overflow-hidden bg-foreground">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-foreground/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-background px-4">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xs md:text-sm font-display tracking-[0.3em] mb-4 md:mb-6"
        >
          DROP 001 — NOW LIVE
        </motion.p>
        
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-center leading-[1.1] max-w-4xl tracking-tight"
        >
          JEWELRY LIKE YOU'VE
          <br />
          NEVER KNOWN IT
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-6 md:mt-8 text-sm md:text-base font-body text-background/80 tracking-wide max-w-lg text-center"
        >
          Industrial aesthetics meet timeless craftsmanship. Limited pieces, unlimited presence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 md:mt-12"
        >
          <a
            href="#products"
            className="bg-background text-foreground px-10 py-4 font-display uppercase tracking-[0.2em] text-sm
                     border border-background transition-all duration-300
                     hover:bg-transparent hover:text-background"
          >
            Shop The Drop
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      
    </section>
  );
};

export default HeroSection;
