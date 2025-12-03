import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <section className="py-16 md:py-24 bg-foreground text-background">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h3 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
            JOIN THE DROP LIST
          </h3>
          <p className="mt-4 text-sm md:text-base font-body text-background/70">
            Be the first to know about new releases, exclusive offers, and limited drops.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <div className="flex-1 relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full bg-transparent border-b border-background/50 focus:border-background py-3 px-0 
                         text-background placeholder:text-background/50 font-body text-sm
                         focus:outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              className="bg-background text-foreground px-6 py-3 font-display uppercase text-xs tracking-[0.15em]
                       hover:bg-background/90 transition-colors flex items-center justify-center gap-2"
            >
              Subscribe
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="mt-4 text-xs font-body text-background/50">
            No spam. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
