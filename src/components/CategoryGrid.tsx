import { motion } from "framer-motion";

const categories = [
  {
    name: "Bracelets",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80",
    count: 12,
  },
  {
    name: "Necklaces",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
    count: 8,
  },
  {
    name: "Rings",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
    count: 15,
  },
];

const CategoryGrid = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
            COLLECTIONS
          </h3>
          <p className="mt-4 text-sm text-muted-foreground font-body">
            Explore our curated categories
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <motion.a
              key={category.name}
              href={`#${category.name.toLowerCase()}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative aspect-[4/5] overflow-hidden cursor-pointer"
            >
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-foreground/30 group-hover:bg-foreground/50 transition-colors duration-500" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-background">
                <h4 className="text-2xl md:text-3xl font-display font-bold tracking-wider">
                  {category.name.toUpperCase()}
                </h4>
                <p className="mt-2 text-xs font-display tracking-[0.2em] opacity-80">
                  {category.count} PIECES
                </p>
              </div>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="text-xs font-display tracking-[0.2em] text-background border-b border-background pb-1">
                  VIEW ALL
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
