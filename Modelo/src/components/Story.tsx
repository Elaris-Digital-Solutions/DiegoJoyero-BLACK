import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const storyImages: Record<'gold' | 'silver', string> = {
  gold: 'https://images.unsplash.com/photo-1522312291041-18c175f8d0da?auto=format&fit=crop&w=1600&q=80',
  silver: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80',
};

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.33, 1, 0.68, 1],
      when: 'beforeChildren',
      staggerChildren: 0.16,
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] },
  },
};

const contentVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.33, 1, 0.68, 1] },
  },
};

export function Story() {
  const { theme } = useTheme();
  const [imageSrc, setImageSrc] = useState(storyImages[theme]);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImageSrc(storyImages[theme]);
    setHasError(false);
  }, [theme]);

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc(storyImages.silver);
    }
  };

  const narrative = useMemo(
    () => ({
      title: theme === 'gold' ? 'Nuestro legado artesanal' : 'Nuestra visión depurada',
      introduction:
        'Fundado por Diego, un artesano obsesionado con la precisión, Diego Joyero surge como la síntesis entre la tradición orfebre limeña y la experimentación contemporánea. Cada pieza comienza con un boceto trazado a mano, inspirado en historias personales y en la arquitectura de nuestra ciudad.',
      craft:
        theme === 'gold'
          ? 'En el taller trabajamos oro 18 quilates certificado, modelado en cera y fundido en crisoles pequeños para controlar cada detalle. El brillo final proviene de un pulido manual paciente que despierta el resplandor cálido del metal.'
          : 'La plata 925 toma formas precisas a través de prototipos impresos y pulido manual. Contrastamos zonas satinadas y espejadas para que la luz fluya de forma suave, casi líquida, sobre la superficie.',
      mission:
        'Crear joyas que custodien momentos íntimos con honestidad y oficio, asegurando que cada pieza hable de quien la porta y del artesano que la moldeó.',
      vision:
        'Mantener un atelier humano, donde la innovación tecnológica convive con los gestos tradicionales para diseñar piezas heredables, conscientes y atemporales.',
    }),
    [theme],
  );

  return (
    <motion.section
      id="about"
      className="py-24"
      style={{ backgroundColor: 'var(--cardBg)' }}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
    >
      <div className="max-w-6xl mx-auto px-6 grid gap-12 md:grid-cols-[1fr,1.2fr] items-start">
        <motion.figure
          className="w-full h-[420px] md:h-[520px] overflow-hidden border"
          style={{ borderColor: 'var(--border)' }}
          variants={imageVariants}
        >
          <img
            src={imageSrc}
            alt="Atelier Diego Joyero"
            className="w-full h-full object-cover"
            loading="lazy"
            onError={handleImageError}
          />
        </motion.figure>

        <motion.div className="flex flex-col gap-10" variants={contentVariants}>
          <motion.div className="space-y-3" variants={contentVariants}>
            <span className="text-xs uppercase tracking-[0.5em]" style={{ color: 'var(--textSecondary)' }}>
              Nuestra historia
            </span>
            <h2 className="text-4xl md:text-5xl font-display" style={{ color: 'var(--text)' }}>
              {narrative.title}
            </h2>
          </motion.div>

          <motion.p className="text-base leading-relaxed" style={{ color: 'var(--textSecondary)' }} variants={contentVariants}>
            {narrative.introduction}
          </motion.p>

          <motion.p className="text-base leading-relaxed" style={{ color: 'var(--textSecondary)' }} variants={contentVariants}>
            {narrative.craft}
          </motion.p>

          <div className="grid gap-8">
            <motion.div className="border-l pl-6" style={{ borderColor: 'var(--border)' }} variants={contentVariants}>
              <h3 className="text-xl font-display mb-3" style={{ color: 'var(--text)' }}>
                Misión
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--textSecondary)' }}>
                {narrative.mission}
              </p>
            </motion.div>

            <motion.div className="border-l pl-6" style={{ borderColor: 'var(--border)' }} variants={contentVariants}>
              <h3 className="text-xl font-display mb-3" style={{ color: 'var(--text)' }}>
                Visión
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--textSecondary)' }}>
                {narrative.vision}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
