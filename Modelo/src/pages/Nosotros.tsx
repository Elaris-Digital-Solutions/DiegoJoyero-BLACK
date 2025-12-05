import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Feather, Gem, Gift, Hammer, Quote, Sparkles } from 'lucide-react';

import { useTheme } from '../contexts/ThemeContext';
import { Story } from '../components/Story';
import { Values } from '../components/Values';
import { Guarantees } from '../components/Guarantees';
import { Button } from '../components/ui/button';

const heroVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const heroContentVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.33, 1, 0.68, 1] } },
};

const timelineVariants = {
  hidden: { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0 },
};

const maintenanceVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.33, 1, 0.68, 1] } },
};

export function NosotrosPage() {
  const { theme } = useTheme();

  const heroNarrative = useMemo(
    () =>
      theme === 'gold'
    ? {
      headline: 'Diego Joyero nace del arte, la precisión y la pasión por la forma.',
            subheading: 'El arte del oro 18 quilates',
            description:
              'Desde nuestro atelier en Lima, Diego y su equipo modelan el oro con técnicas heredadas y herramientas contemporáneas para crear piezas que perduren.',
            backdrop:
              'linear-gradient(135deg, rgba(248,244,236,0.85), rgba(199,161,91,0.12)), url(https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?auto=format&fit=crop&w=1600&q=80)',
          }
    : {
      headline: 'Diego Joyero nace del arte, la precisión y la pasión por la forma.',
            subheading: 'La luz de la plata 925',
            description:
              'Contrastamos acabados perlados y espejados para lograr piezas depuradas que celebran la sutileza de la plata peruana.',
            backdrop:
              'linear-gradient(135deg, rgba(247,247,247,0.9), rgba(183,183,183,0.18)), url(https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80)',
          },
    [theme]
  );

  const processTimeline = useMemo(
    () => [
      {
        step: 'Inspiración y boceto',
        description:
          'Diego traduce memorias, gestos y referencias arquitectónicas en bocetos a lápiz, definiendo proporciones y volúmenes.',
        icon: Feather,
      },
      {
        step: 'Selección de materiales',
        description:
          'Gemas calibradas, metales certificados y aleaciones propias se eligen según la intención y el equilibrio de cada pieza.',
        icon: Gem,
      },
      {
        step: 'Fundición y modelado',
        description:
          'El modelo en cera se funde en crisoles pequeños. Cada estructura se refuerza y se texturiza manualmente para garantizar resistencia.',
        icon: Hammer,
      },
      {
        step: 'Pulido y acabado',
        description:
          'Capas sucesivas de pulido, satinados y microgranulados despiertan la luz del metal y definen su carácter.',
        icon: Sparkles,
      },
      {
        step: 'Presentación final',
        description:
          'Entregamos la pieza con certificaciones, documentación fotográfica y recomendaciones de cuidado personalizadas.',
        icon: Gift,
      },
    ],
    []
  );

  const quote = useMemo(
    () =>
      theme === 'gold'
        ? '“El oro conserva la memoria de nuestras manos. Colocamos intención en cada trazo para que la joya trascienda lo efímero.”'
        : '“En la plata buscamos la pureza de la forma: líneas limpias que abracen la luz y acompañen al cuerpo con suavidad.”',
    [theme]
  );

  return (
    <div className="bg-background text-foreground">
      <motion.section
        initial="hidden"
        animate="visible"
        variants={heroVariants}
        transition={{ duration: 0.6 }}
        className="border-b py-24"
        style={{
          borderColor: 'var(--border)',
          backgroundImage: heroNarrative.backdrop,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="mx-auto max-w-6xl px-6">
          <motion.p className="text-xs uppercase tracking-[0.45em] text-muted-foreground" variants={heroContentVariants}>
            Nosotros
          </motion.p>
          <motion.h1
            className="mt-6 text-4xl font-light tracking-tight md:text-6xl"
            variants={heroContentVariants}
          >
            {heroNarrative.headline}
          </motion.h1>
          <motion.div className="mt-8 max-w-3xl space-y-4" variants={heroContentVariants}>
            <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">{heroNarrative.subheading}</p>
            <p className="text-lg font-light text-muted-foreground md:text-xl">{heroNarrative.description}</p>
          </motion.div>
          <motion.div variants={heroContentVariants}>
            <Button asChild variant="outline" className="mt-12 gap-2 uppercase tracking-[0.35em]">
              <a href="#timeline">Conoce nuestro proceso</a>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        id="timeline"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={timelineVariants}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-6xl px-6 py-24"
      >
        <div className="mb-16 space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Proceso artesanal</p>
          <h2 className="text-3xl font-light tracking-tight md:text-4xl">Cinco etapas que cincelan cada pieza</h2>
        </div>

        <div className="relative before:absolute before:left-[22px] before:top-0 before:h-full before:w-px before:bg-border md:before:left-1/2">
          <div className="grid gap-12">
            {processTimeline.map(({ step, description, icon: Icon }, index) => (
              <motion.article
                key={step}
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex flex-col gap-4 rounded-xl border p-8 md:w-[calc(50%-2rem)] ${
                  index % 2 === 0 ? 'md:ml-0 md:self-start md:translate-x-0 md:text-right' : 'md:ml-auto md:self-end'
                }`}
                style={{ borderColor: 'var(--border)' }}
              >
                <div
                  className={`absolute left-6 top-8 flex h-10 w-10 items-center justify-center rounded-full border bg-background md:left-1/2 md:-translate-x-1/2`}
                  style={{ borderColor: 'var(--border)' }}
                >
                  <Icon className="h-5 w-5" style={{ color: 'var(--primary)' }} />
                </div>
                <div className="mt-12">
                  <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Etapa {index + 1}</p>
                  <h3 className="mt-2 text-2xl font-light tracking-tight">{step}</h3>
                </div>
                <p className="text-sm font-light leading-relaxed text-muted-foreground">{description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="bg-card py-20"
      >
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Quote className="mx-auto h-10 w-10" style={{ color: 'var(--primary)' }} />
          <p className="mt-6 text-lg font-light leading-relaxed text-muted-foreground md:text-xl">{quote}</p>
          <span className="mt-4 block text-xs uppercase tracking-[0.4em] text-muted-foreground">Diego Ledesma · Fundador</span>
        </div>
      </motion.section>

      <Story />

      <motion.section
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="border-y bg-background py-24"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="mx-auto grid max-w-6xl gap-16 px-6 md:grid-cols-[1.1fr,0.9fr] md:items-center">
          <motion.div className="space-y-6" variants={maintenanceVariants}>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Cuidado perpetuo</p>
            <h2 className="text-3xl font-light tracking-tight md:text-4xl">Un ritual de mantenimiento artesanal</h2>
            <p className="text-sm font-light leading-relaxed text-muted-foreground">
              Cada seis meses nuestros especialistas verifican engastes, pulen a mano y reavivan el brillo original de tu joya. El
              servicio está incluido de por vida para piezas creadas en la maison.
            </p>
            <Button asChild variant="outline" className="gap-2 uppercase tracking-[0.35em]">
              <a href="/contacto">Programar mantenimiento</a>
            </Button>
          </motion.div>

          <motion.div
            className="space-y-8 rounded-xl border p-8"
            style={{ borderColor: 'var(--border)' }}
            variants={maintenanceVariants}
          >
            <div className="flex items-center gap-4">
              <Hammer className="h-6 w-6" style={{ color: 'var(--primary)' }} />
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Proceso artesanal</p>
                <p className="text-sm font-light text-muted-foreground">Pulido manual, revisión de tensión y soldaduras.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Feather className="h-6 w-6" style={{ color: 'var(--primary)' }} />
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Documentación</p>
                <p className="text-sm font-light text-muted-foreground">Historial de mantenimiento adjunto a tu certificado.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Gem className="h-6 w-6" style={{ color: 'var(--primary)' }} />
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Garantía vitalicia</p>
                <p className="text-sm font-light text-muted-foreground">Cobertura integral ante ajustes y reemplazos.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <Values />
      <Guarantees />
    </div>
  );
}
