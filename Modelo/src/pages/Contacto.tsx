import { FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Clock, Instagram, Mail, MapPin, Phone } from 'lucide-react';

import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/button';

const heroVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1], when: 'beforeChildren', staggerChildren: 0.12 },
  },
};

const heroContentVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] } },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1], when: 'beforeChildren', staggerChildren: 0.16 },
  },
};

const columnVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.33, 1, 0.68, 1] } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] } },
};

export function ContactoPage() {
  const { theme } = useTheme();

  const palette = theme === 'gold'
    ? {
        gradient: 'linear-gradient(135deg, rgba(199,161,91,0.08), rgba(248,244,236,0.95))',
      }
    : {
        gradient: 'linear-gradient(135deg, rgba(183,183,183,0.08), rgba(247,247,247,0.95))',
      };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Placeholder submission handler – integrate with backend or service when ready.
  };

  return (
    <div className="bg-background text-foreground">
      <motion.section
        initial="hidden"
        animate="visible"
        variants={heroVariants}
        className="border-b py-20"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="mx-auto max-w-6xl px-6">
          <motion.p className="text-xs uppercase tracking-[0.45em] text-muted-foreground" variants={heroContentVariants}>
            Contacto
          </motion.p>
          <motion.h1 className="mt-6 text-4xl font-light tracking-tight md:text-6xl" variants={heroContentVariants}>
            Agenda tu experiencia en la maison
          </motion.h1>
          <motion.p
            className="mt-6 max-w-3xl text-lg font-light text-muted-foreground md:text-xl"
            variants={heroContentVariants}
          >
            Coordina una cita privada, solicita información o comparte tu proyecto. Nuestro equipo responderá dentro de las
            siguientes 24 horas hábiles.
          </motion.p>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        className="mx-auto max-w-6xl px-6 py-24"
      >
        <div className="grid gap-16 md:grid-cols-[0.9fr,1.1fr]">
          <motion.aside
            className="space-y-10 rounded-xl border p-10"
            style={{ borderColor: 'var(--border)', background: palette.gradient }}
            variants={columnVariants}
          >
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Información directa</p>
              <div className="mt-6 space-y-4 text-sm font-light leading-relaxed text-muted-foreground">
                <p className="flex items-center gap-3 uppercase tracking-[0.35em]">
                  <Mail className="h-4 w-4" /> atelier@diegoartesano.com
                </p>
                <p className="flex items-center gap-3 uppercase tracking-[0.35em]">
                  <Phone className="h-4 w-4" /> +51 1 2345 6789
                </p>
                <p className="flex items-center gap-3 uppercase tracking-[0.35em]">
                  <MapPin className="h-4 w-4" /> Atelier · Lima, Perú
                </p>
                <p className="flex items-center gap-3 uppercase tracking-[0.35em]">
                  <Instagram className="h-4 w-4" /> @diegoartesano
                </p>
                <p className="flex items-center gap-3 uppercase tracking-[0.35em]">
                  <Clock className="h-4 w-4" /> Lunes a viernes · 10:00 – 19:00
                </p>
              </div>
            </div>

            <div className="space-y-4 border-t pt-6" style={{ borderColor: 'var(--border)' }}>
              <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Visitas presenciales</p>
              <p className="text-sm font-light leading-relaxed text-muted-foreground">
                Trabajamos exclusivamente con agenda previa para asegurar una atención íntima. Podemos coordinar sesiones en el
                atelier o en ubicaciones especiales bajo solicitud.
              </p>
            </div>
          </motion.aside>

          <motion.div className="space-y-10" variants={columnVariants}>
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6 rounded-xl border p-10"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
              variants={cardVariants}
              noValidate
            >
              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2 text-sm font-light">
                  <span className="uppercase tracking-[0.35em] text-muted-foreground">Nombre</span>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre completo"
                    className="w-full rounded-md border bg-background px-4 py-3 text-sm focus:border-[var(--primary)] focus:outline-none"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </label>

                <label className="space-y-2 text-sm font-light">
                  <span className="uppercase tracking-[0.35em] text-muted-foreground">Correo electrónico</span>
                  <input
                    type="email"
                    name="correo"
                    placeholder="nombre@correo.com"
                    className="w-full rounded-md border bg-background px-4 py-3 text-sm focus:border-[var(--primary)] focus:outline-none"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </label>
              </div>

              <label className="space-y-2 text-sm font-light">
                <span className="uppercase tracking-[0.35em] text-muted-foreground">Asunto</span>
                <input
                  type="text"
                  name="asunto"
                  placeholder="Mantenimiento / Pieza personalizada / Otros"
                  className="w-full rounded-md border bg-background px-4 py-3 text-sm focus:border-[var(--primary)] focus:outline-none"
                  style={{ borderColor: 'var(--border)' }}
                />
              </label>

              <label className="space-y-2 text-sm font-light">
                <span className="uppercase tracking-[0.35em] text-muted-foreground">Mensaje</span>
                <textarea
                  name="mensaje"
                  rows={5}
                  placeholder="Cuéntanos lo que buscas y cómo prefieres que te contactemos"
                  className="w-full rounded-md border bg-background px-4 py-3 text-sm focus:border-[var(--primary)] focus:outline-none"
                  style={{ borderColor: 'var(--border)' }}
                />
              </label>

              <div className="flex justify-end">
                <Button type="submit" className="gap-2 uppercase tracking-[0.35em]">
                  Enviar mensaje
                </Button>
              </div>
            </motion.form>

            <motion.div
              className="rounded-xl border p-10"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
              variants={cardVariants}
            >
              <p className="text-sm font-light leading-relaxed text-muted-foreground">
                ¿Prefieres una consulta personalizada? Agenda una cita privada para una experiencia exclusiva, donde podrás ver
                nuestras piezas en persona y recibir asesoramiento experto.
              </p>
              <Button asChild variant="outline" className="mt-6 gap-2 uppercase tracking-[0.35em]">
                <a href="/colecciones">Agendar cita</a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
