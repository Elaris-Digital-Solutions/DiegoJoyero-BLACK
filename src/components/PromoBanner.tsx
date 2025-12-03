import { motion } from "framer-motion";

const PromoBanner = () => {
  return (
    <section className="py-16 md:py-20 bg-secondary">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-xs font-display tracking-[0.2em] text-muted-foreground mb-4">
            LIMITED TIME OFFER
          </p>
          <h3 className="text-3xl md:text-5xl font-display font-bold tracking-tight">
            BUY 2, GET $10 OFF
          </h3>
          <p className="mt-4 text-sm md:text-base font-body text-muted-foreground max-w-md mx-auto">
            Stack your pieces. Applied automatically at checkout on qualifying orders.
          </p>
          <div className="mt-8">
            <a
              href="#products"
              className="btn-outline inline-block"
            >
              Shop Now
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PromoBanner;
