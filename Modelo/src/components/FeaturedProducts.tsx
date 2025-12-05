import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag, X } from 'lucide-react';

import { useTheme } from '../contexts/ThemeContext';
import { getSupabaseClient, type Product } from '../lib/supabase';
import { Button } from './ui/button';
import { useCart } from '../contexts/CartContext';

interface ShowcaseItem {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  description: string;
  price: string;
  image: string;
  details: string[];
  href: string;
  product: Product;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price);

const getYearLabel = (value: string | null | undefined) => {
  if (!value) return 'Colección vigente';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Colección vigente';

  return parsed.getFullYear().toString();
};

const buildDetails = (product: Product): string[] => {
  const availability =
    product.stock <= 0
      ? 'Disponibilidad: edición limitada agotada'
      : product.stock < 5
        ? `Disponibilidad: últimas ${product.stock} piezas`
        : 'Disponibilidad: en stock';

  const collectionLabel = product.category
    ? `Colección: ${product.category}`
    : `Colección ${product.material === 'gold' ? 'Oro' : 'Plata'}`;

  const materialLabel = product.material === 'gold' ? 'Material: oro 18k certificado' : 'Material: plata .925 certificada';

  return [materialLabel, collectionLabel, availability, `Referencia: ${product.id}`];
};

const mapProductToShowcase = (product: Product): ShowcaseItem => ({
  id: product.id,
  title: product.name,
  subtitle: product.category || (product.material === 'gold' ? 'Colección oro' : 'Colección plata'),
  year: getYearLabel(product.created_at),
  description: product.description,
  price: formatPrice(product.price),
  image:
    product.image_url ||
    'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=1200&fit=crop&auto=format&dpr=1',
  details: buildDetails(product),
  href: `/producto/${product.id}`,
  product,
});

const curateFeaturedProducts = (entries: Product[]): Product[] => {
  if (!entries || entries.length === 0) {
    return [];
  }

  const prioritized = [...entries].sort((a, b) => {
    if (a.featured === b.featured) {
      return b.price - a.price;
    }
    return a.featured ? -1 : 1;
  });

  return prioritized.slice(0, 3);
};

export function FeaturedProducts() {
  const { theme } = useTheme();
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<ShowcaseItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Prevent background scrolling when modal is open and allow internal scroll in overlay
  useEffect(() => {
    if (selectedItem) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original || '';
      };
    }
    return undefined;
  }, [selectedItem]);

  useEffect(() => {
    let isMounted = true;

    const fetchFeaturedProducts = async () => {
      setLoading(true);

      try {
        const client = await getSupabaseClient();
        if (!isMounted) return;

        if (!client) {
          setProducts([]);
          setError('Supabase no está configurado. Define las variables de entorno antes de desplegar.');
          setLoading(false);
          setCurrentIndex(0);
          setSelectedItem(null);
          return;
        }

        const { data, error } = await client
          .from('products')
          .select('*')
          .eq('material', theme)
          .eq('featured', true)
          .order('price', { ascending: false })
          .limit(4);

        if (error) {
          throw error;
        }

        if (isMounted) {
          setProducts(curateFeaturedProducts(data ?? []));
          if (!data || data.length === 0) {
            setError('No hay productos destacados en Supabase.');
          } else {
            setError(null);
          }
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
        if (isMounted) {
          setProducts([]);
          setError('No se pudo cargar la selección destacada desde Supabase.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setCurrentIndex(0);
          setSelectedItem(null);
        }
      }
    };

    fetchFeaturedProducts();

    return () => {
      isMounted = false;
    };
  }, [theme]);

  const showcaseItems = useMemo(() => products.map(mapProductToShowcase), [products]);
  const hasItems = showcaseItems.length > 0;

  const showLoadingState = loading && !hasItems;

  const goToPrevious = () => {
    if (!hasItems || showcaseItems.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + showcaseItems.length) % showcaseItems.length);
  };

  const goToNext = () => {
    if (!hasItems || showcaseItems.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % showcaseItems.length);
  };

  const currentItem = hasItems ? showcaseItems[currentIndex % showcaseItems.length] : null;

  if (showLoadingState) {
    return (
      <section id="featured" className="bg-background text-foreground">
        <div className="mx-auto max-w-6xl px-6 py-24 md:px-12">
          <div className="space-y-4 text-center">
            <div className="mx-auto h-4 w-32 animate-pulse rounded-full bg-border" />
            <div className="mx-auto h-10 w-2/3 animate-pulse rounded-full bg-border" />
            <div className="mx-auto h-4 w-1/2 animate-pulse rounded-full bg-border" />
          </div>
        </div>
      </section>
    );
  }

  if ((!hasItems || !currentItem) && !loading) {
    return (
      <section id="featured" className="bg-background text-foreground">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center md:px-12">
          <p className="text-xs font-light uppercase tracking-[0.45em] text-muted-foreground">
            {error ?? 'Colección en preparación'}
          </p>
          <h2 className="mt-4 text-3xl font-light tracking-tight md:text-4xl">
            {error ? 'Revisa la conexión con Supabase' : 'Estamos curando una nueva selección de piezas destacadas.'}
          </h2>
          <p className="mt-6 text-sm font-light leading-relaxed text-muted-foreground md:text-base">
            {error
              ? 'No se pudo mostrar la curaduría destacada. Verifica las credenciales y los registros en la tabla products.'
              : 'Vuelve pronto o agenda una cita privada para conocer el catálogo completo en nuestro atelier.'}
          </p>
          <Button asChild variant="outline" className="mt-8 gap-3 uppercase tracking-[0.3em]">
            <Link to="/contacto">Coordinar visita</Link>
          </Button>
        </div>
      </section>
    );
  }

  if (!currentItem) {
    return null;
  }

  return (
    <section id="featured" className="bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="text-xs font-light uppercase tracking-[0.45em] text-muted-foreground">
            Piezas destacadas · Colección {theme === 'gold' ? 'oro' : 'plata'}
          </p>
          <h2 className="mt-4 text-4xl font-light tracking-tight md:text-5xl">
            Selección exclusiva de la maison
          </h2>
          <p className="mt-6 text-base font-light leading-relaxed text-muted-foreground md:text-lg">
            Curaduría de piezas maestras trabajadas en series limitadas. Cada engaste celebra la esencia del
            {` ${theme === 'gold' ? 'oro' : 'plata'} Diego Joyero.`}
          </p>

          <div className="mt-10 flex items-center justify-center gap-8">
            <Button
              type="button"
              onClick={goToPrevious}
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full border border-border transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex gap-3">
              {showcaseItems.map((item, itemIndex) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentIndex(itemIndex)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    itemIndex === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-border hover:bg-primary/60'
                  }`}
                  aria-label={`Ver ${item.title}`}
                />
              ))}
            </div>

            <Button
              type="button"
              onClick={goToNext}
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full border border-border transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="group relative aspect-[3/4] cursor-pointer"
            onClick={() => setSelectedItem(currentItem)}
          >
            <div className="absolute inset-0 rounded-sm bg-gradient-to-br from-primary/5 to-transparent" />
            <img
              src={currentItem.image}
              alt={currentItem.title}
              className="h-full w-full rounded-sm object-cover shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
              loading="lazy"
            />
            <div className="absolute inset-0 rounded-sm bg-black/0 transition-colors duration-500 group-hover:bg-black/15" />
          </motion.div>

          <motion.div
            key={`details-${currentItem.id}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <p className="text-xs font-light uppercase tracking-[0.35em] text-muted-foreground">
                {currentItem.year}
              </p>
              <h3 className="text-4xl font-light tracking-tight md:text-5xl">{currentItem.title}</h3>
              <p className="text-lg font-light italic text-muted-foreground md:text-xl">{currentItem.subtitle}</p>
            </div>

            <div className="h-px w-20 bg-border/60" />

            <p className="text-base font-light leading-relaxed text-muted-foreground md:text-lg">
              {currentItem.description}
            </p>

            <div className="space-y-3">
              {currentItem.details.map((detail, index) => (
                <motion.div
                  key={detail}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  <p className="text-sm font-light tracking-wide text-foreground/90">{detail}</p>
                </motion.div>
              ))}
            </div>

            <div className="pt-4">
              <p className="text-3xl font-light tracking-wide">{currentItem.price}</p>
            </div>

            <div className="pt-4">
              <Button
                onClick={() => setSelectedItem(currentItem)}
                variant="outline"
                className="mt-4 px-8 py-6 text-sm font-light uppercase tracking-[0.25em] transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
              >
                Ver detalles
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md overflow-auto"
            onClick={() => setSelectedItem(null)}
          >
            {/* Make overlay scrollable and keep content confined so scroll happens inside the overlay */}
            <div className="min-h-[100vh] px-6 py-12 md:px-12 md:py-20">
              <Button
                type="button"
                onClick={() => setSelectedItem(null)}
                variant="ghost"
                size="icon"
                className="fixed right-8 top-8 z-10 h-12 w-12 rounded-full border border-border transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
              >
                <X className="h-5 w-5" />
              </Button>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.4 }}
                className="mx-auto max-w-6xl"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="grid gap-12 md:grid-cols-5 md:gap-16">
                  <div className="md:col-span-3">
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.title}
                      className="w-full rounded-sm shadow-2xl"
                      loading="lazy"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-8">
                    <div className="space-y-4">
                      <p className="text-xs font-light uppercase tracking-[0.35em] text-muted-foreground">
                        {selectedItem.year}
                      </p>
                      <h3 className="text-4xl font-light tracking-tight md:text-5xl">{selectedItem.title}</h3>
                      <p className="text-lg font-light italic text-muted-foreground md:text-xl">
                        {selectedItem.subtitle}
                      </p>
                    </div>

                    <div className="h-px bg-border/50" />

                    <p className="text-base font-light leading-relaxed text-muted-foreground md:text-lg">
                      {selectedItem.description}
                    </p>

                    <div className="space-y-4">
                      <h4 className="text-xs font-light uppercase tracking-[0.3em] text-muted-foreground">
                        Especificaciones
                      </h4>
                      {selectedItem.details.map((detail) => (
                        <div key={detail} className="flex items-start gap-3">
                          <div className="mt-2 h-1 w-1 rounded-full bg-primary" />
                          <p className="text-sm font-light text-foreground/90">{detail}</p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4">
                      <p className="text-4xl font-light tracking-wide">{selectedItem.price}</p>
                    </div>

                    <div className="flex flex-col gap-4 pt-4">
                      <Button
                        className="w-full py-6 text-sm font-light uppercase tracking-[0.25em]"
                        onClick={() => addItem(selectedItem.product)}
                      >
                        <ShoppingBag className="mr-3 h-4 w-4" /> Agregar al carrito
                      </Button>
                      <Button asChild variant="outline" className="w-full py-6 text-sm uppercase tracking-[0.25em]">
                        <Link to={selectedItem.href} onClick={() => setSelectedItem(null)}>
                          Ver ficha completa
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
