import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.33, 1, 0.68, 1],
      when: 'beforeChildren',
      staggerChildren: 0.14,
    },
  },
};

const blockVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] },
  },
};

export function Guarantees() {
  const { theme } = useTheme();

  const guarantees = [
    {
      title: 'Excelencia certificada',
      description:
        theme === 'gold'
          ? 'Oro 18 quilates con certificación de pureza, trazabilidad completa y auditorías gemológicas externas.'
          : 'Plata ley 925 de origen responsable, controlada en laboratorio y acompañada por certificados de pureza.',
    },
    {
      title: 'Hecho a mano',
      description:
        'Un equipo de maestros artesanos supervisa cada soldadura, engaste y pulido para conservar la integridad de la pieza.',
    },
    {
      title: 'Garantía dedicada',
      description:
        'Durante los primeros 12 meses ofrecemos limpieza profesional, pulido artesanal y ajustes de talla incluidos para que tu joya conserve su presencia.',
    },
  ];

  return (
    <motion.section
      id="guarantees"
      className="py-24"
      style={{ backgroundColor: 'var(--background)' }}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="max-w-6xl mx-auto px-6 space-y-16">
        <motion.div className="text-center space-y-3" variants={blockVariants}>
          <span className="text-xs uppercase tracking-[0.5em]" style={{ color: 'var(--textSecondary)' }}>
            Garantía y cuidado
          </span>
          <h2 className="text-4xl md:text-5xl font-display" style={{ color: 'var(--text)' }}>
            Promesa Diego Joyero
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--textSecondary)' }}>
            Nuestras piezas están diseñadas para acompañarte toda la vida. Ofrecemos mantenimiento, limpieza profesional y una garantía
            extendida que protege cada detalle del diseño.
          </p>
        </motion.div>

        <motion.div className="grid gap-10 md:grid-cols-3" variants={blockVariants}>
          {guarantees.map((guarantee) => (
            <motion.article
              key={guarantee.title}
              className="border-t pt-8 flex flex-col gap-4"
              style={{ borderColor: 'var(--border)' }}
              variants={blockVariants}
            >
              <h3 className="text-xl font-display" style={{ color: 'var(--text)' }}>
                {guarantee.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--textSecondary)' }}>
                {guarantee.description}
              </p>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          className="grid gap-12 md:grid-cols-2 border-t pt-12"
          style={{ borderColor: 'var(--border)' }}
          variants={blockVariants}
        >
          <motion.div className="space-y-4" variants={blockVariants}>
            <h3 className="text-xl font-display" style={{ color: 'var(--text)' }}>
              {theme === 'gold' ? 'Oro 18 quilates' : 'Plata ley 925'}
            </h3>
            <ul className="space-y-3 text-sm" style={{ color: 'var(--textSecondary)' }}>
              <li className="uppercase tracking-[0.35em]">Certificado de pureza emitido por gemólogos</li>
              <li className="uppercase tracking-[0.35em]">Trazabilidad completa de metales y gemas</li>
              <li className="uppercase tracking-[0.35em]">Producción en talleres propios</li>
            </ul>
          </motion.div>

          <motion.div className="space-y-4" variants={blockVariants}>
            <h3 className="text-xl font-display" style={{ color: 'var(--text)' }}>
              Servicio después de la entrega
            </h3>
            <ul className="space-y-3 text-sm" style={{ color: 'var(--textSecondary)' }}>
              <li className="uppercase tracking-[0.35em]">Limpieza y pulido profesional incluidos por 12 meses</li>
              <li className="uppercase tracking-[0.35em]">Revisión integral de engastes y ajustes dentro de la garantía</li>
              <li className="uppercase tracking-[0.35em]">Soporte especializado para restauraciones y renovaciones</li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
