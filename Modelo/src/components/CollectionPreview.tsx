import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useTheme } from '../contexts/ThemeContext';
import { getSupabaseClient, type Product } from '../lib/supabase';
import { Button } from './ui/button';

const heroVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const gridVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

export function CollectionPreview() {
  const { theme } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const priceFormatter = useMemo(
    () =>
      new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD',
      }),
    []
  );

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const client = await getSupabaseClient();
        if (!isMounted) return;

        if (!client) {
          setProducts([]);
          setError('Supabase no está configurado. Define las variables de entorno antes de desplegar.');
          setIsLoading(false);
          return;
        }

        const { data, error } = await client
          .from('products')
          .select('*')
          .eq('material', theme)
          .order('featured', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(6);

        if (!isMounted) return;
        if (error) throw error;

        const items = data?.slice(0, 3) ?? [];
        setProducts(items);
        if (items.length === 0) {
          setError('No hay piezas recientes en Supabase para mostrar en la previsualización.');
        }
      } catch (error) {
        console.error('Error loading collection preview:', error);
        if (!isMounted) return;
        setProducts([]);
        setError('No se pudo cargar la previsualización desde Supabase.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [theme]);

  const hasProducts = products.length > 0;

  const narrative = useMemo(
    () =>
      theme === 'gold'
        ? {
            eyebrow: 'Colección oro 18k',
            title: 'Deseos para el ritual cotidiano',
            description:
              'Tres piezas esenciales para un gesto diario de lujo artesanal. Contempla la selección y continúa hacia la colección completa para elegir tu ritual.',
          }
        : {
            eyebrow: 'Colección plata 925',
            title: 'Luz depurada, formas eternas',
            description:
              'Tres diseños que revelan la pureza de la plata peruana. Explora la colección completa y encuentra la pieza que dialogue con tu estilo.',
          },
    [theme]
  );

  return (
    <section id="coleccion" className="bg-background py-24 text-foreground">
      <div className="mx-auto max-w-6xl space-y-16 px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={heroVariants}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <p className="text-xs uppercase tracking-[0.45em] text-muted-foreground">{narrative.eyebrow}</p>
          <h2 className="text-3xl font-light tracking-tight md:text-5xl">{narrative.title}</h2>
          <p className="mx-auto max-w-2xl text-sm font-light leading-relaxed text-muted-foreground md:text-base">
            {narrative.description}
          </p>
        </motion.div>

        {error && !isLoading && (
          <p className="text-center text-[0.7rem] uppercase tracking-[0.35em] text-muted-foreground">
            {error}
          </p>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin" style={{ color: 'var(--primary)' }} />
          </div>
  ) : hasProducts ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={gridVariants}
            transition={{ duration: 0.6 }}
            className="grid gap-12 md:grid-cols-3"
          >
            {products.map((product) => {
              const detailPath = `/producto/${product.id}`;
              const isAvailable = product.stock > 0;
              const stockLabel = !isAvailable
                ? 'Agotado'
                : product.stock <= 2
                  ? product.stock === 1
                    ? 'Última unidad'
                    : 'Últimas piezas'
                  : 'Disponibilidad inmediata';

              return (
                <article
                  key={product.id}
                  className="group flex flex-col overflow-hidden rounded-[28px] border border-[#e8e0d3] bg-[#f9f6f1] shadow-sm transition-transform duration-500 hover:-translate-y-[6px]"
                >
                  <Link
                    to={detailPath}
                    className="relative block aspect-[3/4] overflow-hidden bg-[#f1ece4]"
                    aria-label={`Ver ${product.name}`}
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col gap-6 p-8">
                    <div className="space-y-3">
                      <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#9b9184]">
                        {product.material === 'gold' ? 'Oro 18k' : 'Plata 925'}
                      </p>
                      <Link
                        to={detailPath}
                        className="block text-[#322c24] transition-colors duration-300 hover:text-[#746c60]"
                      >
                        <h3 className="text-2xl font-light leading-snug tracking-tight">{product.name}</h3>
                      </Link>
                      <p className="text-sm leading-relaxed text-[#6a6157] line-clamp-4">{product.description}</p>
                    </div>

                    <div className="mt-auto space-y-4">
                      <div className="flex items-end justify-between border-t border-[#e8e0d3] pt-6">
                        <div>
                          <span className="text-xs uppercase tracking-[0.3em] text-[#a79d90]">Inversión</span>
                          <p className="mt-2 text-lg font-medium text-[#322c24]">
                            {priceFormatter.format(product.price)}
                          </p>
                        </div>
                        <Link
                          to={detailPath}
                          className="inline-flex items-center justify-center rounded-full border border-[#dcd2c5] bg-white px-6 py-3 text-xs font-medium uppercase tracking-[0.25em] text-[#322c24] transition-colors duration-300 hover:bg-[#f0ebe4]"
                        >
                          Ver pieza
                        </Link>
                      </div>
                      <p className="text-xs uppercase tracking-[0.25em] text-[#a79d90]">{stockLabel}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <p className="text-sm uppercase tracking-[0.4em]" style={{ color: 'var(--textSecondary)' }}>
              {error ? 'Revisa la conexión con Supabase.' : 'Próximamente nuevas piezas en esta colección.'}
            </p>
          </div>
        )}

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={heroVariants}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center"
        >
          <Button
            asChild
            className="gap-3 px-6 py-4 text-[0.65rem] uppercase tracking-[0.22em] md:text-sm md:tracking-[0.32em]"
          >
            <a href="/colecciones" className="flex items-center gap-3">
              Explorar colección completa
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
