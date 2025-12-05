import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Crown, Diamond, Heart, Palette, Sparkles, Star } from 'lucide-react';

import { useTheme } from '../contexts/ThemeContext';
import { ProductCatalog } from '../components/ProductCatalog';
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

const highlightVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1], when: 'beforeChildren', staggerChildren: 0.14 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] } },
};

const calloutVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.33, 1, 0.68, 1] } },
};

export function ColeccionesPage() {
  const { theme } = useTheme();

  const narrative = useMemo(
    () =>
      theme === 'gold'
        ? {
            title: 'Colecciones Exclusivas en Oro 18k',
            subtitle: 'Maestría artesanal',
            description:
              'Cada pieza nace de la tradición orfebre peruana, fusionando técnicas ancestrales con el diseño contemporáneo más refinado.',
            note:
              'Oro certificado, engastes precisos y acabados que capturan la luz en cada ángulo para acompañar tus momentos más especiales.',
          }
        : {
            title: 'Colecciones Contemporáneas en Plata 925',
            subtitle: 'Elegancia minimalista',
            description:
              'Líneas puras y formas geométricas que celebran la versatilidad de la plata peruana en diseños atemporales.',
            note:
              'Superficies espejo y texturas satinadas que reflejan la luz con sutileza, perfectas para el uso cotidiano y las ocasiones especiales.',
          },
    [theme]
  );

  const collections = useMemo(
    () => [
      {
        title: 'Atelier Exclusivo',
        description: 'Piezas únicas creadas en colaboración con nuestros maestros artesanos',
        image: theme === 'gold' 
          ? 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=400&fit=crop&crop=center'
          : 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=400&fit=crop&crop=center',
        icon: Crown,
        color: theme === 'gold' ? 'from-amber-500/20 to-yellow-600/20' : 'from-slate-400/20 to-gray-500/20'
      },
      {
        title: 'Serie Contemporánea',
        description: 'Diseños minimalistas para el estilo de vida moderno',
        image: theme === 'gold'
          ? 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&h=400&fit=crop&crop=center'
          : 'https://images.unsplash.com/photo-1506629905607-34b31c2e27d8?w=600&h=400&fit=crop&crop=center',
        icon: Diamond,
        color: theme === 'gold' ? 'from-amber-400/20 to-orange-500/20' : 'from-blue-400/20 to-indigo-500/20'
      },
      {
        title: 'Colección Clásica',
        description: 'Diseños atemporales inspirados en la tradición orfebre',
        image: theme === 'gold'
          ? 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=400&fit=crop&crop=center'
          : 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=400&fit=crop&crop=center',
        icon: Heart,
        color: theme === 'gold' ? 'from-yellow-500/20 to-amber-600/20' : 'from-purple-400/20 to-pink-500/20'
      }
    ],
    [theme]
  );

  const explorationPillars = useMemo(
    () => [
      {
        title: 'Curaduría Experta',
        description:
          'Selección meticulosa de gemas y materiales premium con certificación de origen y calidad garantizada.',
        icon: Star,
      },
      {
        title: 'Personalización Total',
        description:
          'Ajustes de medida, grabados exclusivos y modificaciones de diseño adaptadas a tu estilo personal.',
        icon: Sparkles,
      },
      {
        title: 'Asesoría Especializada',
        description:
          'Consultoría en imagen y estilo para crear combinaciones perfectas con tu guardarropa y ocasiones.',
        icon: Palette,
      },
    ],
    []
  );

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section Rediseñado */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={heroVariants}
        className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={theme === 'gold' 
              ? 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&h=1080&fit=crop&crop=center'
              : 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1920&h=1080&fit=crop&crop=center'
            }
            alt="Colección de joyas"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className={`absolute inset-0 bg-gradient-to-b ${
            theme === 'gold' 
              ? 'from-amber-900/20 via-transparent to-amber-900/30' 
              : 'from-slate-900/20 via-transparent to-slate-900/30'
          }`} />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
          <motion.div variants={heroContentVariants} className="space-y-6">
            <motion.p 
              className="text-xs uppercase tracking-[0.45em] text-white/80"
              variants={heroContentVariants}
            >
              {narrative.subtitle}
            </motion.p>
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight"
              variants={heroContentVariants}
            >
              {narrative.title}
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl font-light text-white/90 max-w-2xl mx-auto"
              variants={heroContentVariants}
            >
              {narrative.description}
            </motion.p>
            <motion.div variants={heroContentVariants} className="pt-4">
              <Button asChild size="lg" className="gap-3 uppercase tracking-[0.35em] bg-white text-black hover:bg-white/90">
                <a href="#catalogo">
                  Explorar Colecciones
                  <ArrowUpRight className="h-5 w-5" />
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </motion.section>

      {/* Collections Showcase */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={highlightVariants}
        className="py-24 bg-card/50"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.45em] text-muted-foreground mb-4">
              Nuestras Colecciones
            </p>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6">
              Tres Universos de Elegancia
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Cada colección representa una faceta única de nuestro arte orfebre, 
              desde piezas exclusivas hasta diseños atemporales.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {collections.map(({ title, description, image, icon: Icon, color }, index) => (
              <motion.div
                key={title}
                variants={cardVariants}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/20 transition-all duration-500"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${color} to-transparent opacity-60`} />
                </div>
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-light text-white mb-2">{title}</h3>
                      <p className="text-sm text-white/80 leading-relaxed">{description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Services Section Mejorada */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={highlightVariants}
        className="py-24"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.45em] text-muted-foreground mb-4">
              Servicios Exclusivos
            </p>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight">
              Experiencia Personalizada
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {explorationPillars.map(({ title, description, icon: Icon }, index) => (
              <motion.div
                key={title}
                variants={cardVariants}
                transition={{ delay: index * 0.1 }}
                className="group p-8 rounded-xl border border-border bg-card hover:border-primary/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="space-y-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-light tracking-tight mb-3">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Catálogo de Productos */}
      <section id="catalogo">
        <ProductCatalog />
      </section>

      {/* CTA Section Rediseñada */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={highlightVariants}
        className="relative py-24 overflow-hidden"
      >
        <div className="absolute inset-0">
          <img
            src={theme === 'gold'
              ? 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=1920&h=600&fit=crop&crop=center'
              : 'https://images.unsplash.com/photo-1506629905607-34b31c2e27d8?w=1920&h=600&fit=crop&crop=center'
            }
            alt="Atelier Diego Joyero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
          <motion.div variants={calloutVariants} className="space-y-8">
            <p className="text-xs uppercase tracking-[0.4em] text-white/80">
              Experiencia Boutique
            </p>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight">
              Agenda tu Consulta Privada
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Nuestro equipo de expertos te guiará en la selección perfecta. 
              Desde diseño personalizado hasta curaduría de gemas exclusivas.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="gap-2 bg-white text-black hover:bg-white/90">
                <a href="/contacto">
                  Agendar Cita Privada
                  <ArrowUpRight className="h-5 w-5" />
                </a>
              </Button>
              <Button asChild size="lg" className="gap-2 bg-white text-black hover:bg-white/90">
                <a href="tel:+51999999999">
                  Llamar Ahora
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
