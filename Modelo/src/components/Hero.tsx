import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const heroImages: Record<'gold' | 'silver', string> = {
  gold: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1800&q=80',
  silver: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=1800&q=80',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.33, 1, 0.68, 1],
      when: 'beforeChildren',
      staggerChildren: 0.15,
    },
  },
};

const contentVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] },
  },
};

const linkVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] },
  },
};

export function Hero() {
  const { theme } = useTheme();

  const palette = useMemo(
    () => ({
      overlay: theme === 'gold' ? 'rgba(248, 244, 236, 0.88)' : 'rgba(247, 247, 247, 0.88)',
      heading: theme === 'gold' ? 'Elegancia Atemporal' : 'Pureza Contemporánea',
      description:
        theme === 'gold'
          ? 'Joyas concebidas para honrar los rituales más íntimos, elaboradas a mano por maestros orfebres.'
          : 'Piezas precisas y luminosas, trabajadas con técnicas artesanales que realzan cada detalle.',
    }),
    [theme],
  );

  return (
    <motion.section
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: 'var(--background)' }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="absolute inset-0">
        <img
          src={heroImages[theme]}
          alt="Joyas Diego Joyero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ backgroundColor: palette.overlay }} />
      </div>

      <motion.div className="relative z-10 max-w-3xl mx-auto px-6 py-24 text-center space-y-8" variants={contentVariants}>
        <motion.div className="space-y-4" variants={contentVariants}>
          <span className="text-xs uppercase tracking-[0.6em]" style={{ color: 'var(--textSecondary)' }}>
            Diego Joyero · Alta Joyería Lima
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl leading-tight font-display" style={{ color: 'var(--text)' }}>
            {palette.heading}
          </h1>
        </motion.div>

        <motion.p
          className="text-base md:text-lg leading-relaxed mx-auto max-w-2xl"
          style={{ color: 'var(--textSecondary)' }}
          variants={contentVariants}
        >
          {palette.description}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2"
          variants={contentVariants}
        >
          <motion.a
            href="#featured"
            className="text-xs uppercase tracking-[0.45em] border-b border-transparent hover:border-[var(--primary)]"
            style={{ color: 'var(--primary)' }}
            variants={linkVariants}
            whileHover={{ y: -2 }}
            whileFocus={{ y: -2 }}
          >
            Ver catálogo
          </motion.a>
          <motion.a
            href="#values"
            className="text-xs uppercase tracking-[0.45em] border-b border-transparent hover:border-[var(--primary)]"
            style={{ color: 'var(--text)' }}
            variants={linkVariants}
            whileHover={{ y: -2 }}
            whileFocus={{ y: -2 }}
          >
            Conocer la maison
          </motion.a>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
