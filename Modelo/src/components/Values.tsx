import { motion } from 'framer-motion';

const sectionVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.33, 1, 0.68, 1],
      when: 'beforeChildren',
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] },
  },
};

export function Values() {
  const values = [
    {
      title: 'Excelencia artesanal',
      description:
        'Cada pieza nace de manos expertas que controlan la temperatura, la tensión y el pulido final para alcanzar un acabado impecable.',
    },
    {
      title: 'Diseño atemporal',
      description:
        'Trazamos líneas sobrias y proporciones precisas para que la joya trascienda tendencias y acompañe generaciones.',
    },
    {
      title: 'Responsabilidad y autenticidad',
      description:
        'Trabajamos con metales y gemas de procedencia certificada, documentando cada etapa para garantizar transparencia y ética.',
    },
    {
      title: 'Innovación y detalle',
      description:
        'Integramos modelado 3D, fotografía macro y prototipos experimentales para refinar los acabados sin perder la esencia artesanal.',
    },
  ];

  return (
    <motion.section
      id="values"
      className="py-24"
      style={{ backgroundColor: 'var(--background)' }}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <motion.div className="text-center mb-16 space-y-3" variants={itemVariants}>
          <span className="text-xs uppercase tracking-[0.32em] md:tracking-[0.5em]" style={{ color: 'var(--textSecondary)' }}>
            Nuestros pilares
          </span>
          <h2
            className="text-3xl md:text-5xl font-display tracking-[0.12em] md:tracking-[0.18em]"
            style={{ color: 'var(--text)' }}
          >
            Valores inquebrantables
          </h2>
        </motion.div>

        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          {values.map((value) => (
            <motion.article
              key={value.title}
              className="flex flex-col gap-4 border-t pt-8 md:border-t-0 md:border-l md:pl-8 md:[&:nth-child(2n+1)]:border-l-0 md:[&:nth-child(2n+1)]:pl-0"
              style={{ borderColor: 'var(--border)' }}
              variants={itemVariants}
            >
              <h3 className="text-2xl font-display" style={{ color: 'var(--text)' }}>
                {value.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--textSecondary)' }}>
                {value.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
