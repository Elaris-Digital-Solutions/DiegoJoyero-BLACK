import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownWideNarrow, ArrowUpWideNarrow, Clock3, Loader2, Search, Sparkles, Star, X } from 'lucide-react';

import { useTheme } from '../contexts/ThemeContext';
import { getSupabaseClient, type Product } from '../lib/supabase';
import { normalizeCategory } from '../lib/utils';
import { ProductCard } from './ProductCard';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'popularity' | 'newest';
const staticCategories = ['Anillos', 'Aros', 'Broches', 'Cadenas', 'Dijes', 'Sets'];

const panelVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const productVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const filterVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0 },
};

const sortConfigurations: Array<{
  value: SortOption;
  label: string;
  description: string;
  icon: typeof Star;
}> = [
  {
    value: 'featured',
    label: 'Curaduría',
    description: 'Selección destacada de la maison',
    icon: Sparkles,
  },
  {
    value: 'price-asc',
    label: 'Menor precio',
    description: 'Inversión ascendente',
    icon: ArrowDownWideNarrow,
  },
  {
    value: 'price-desc',
    label: 'Mayor precio',
    description: 'Inversión descendente',
    icon: ArrowUpWideNarrow,
  },
  {
    value: 'popularity',
    label: 'Popularidad',
    description: 'Preferidos por nuestros clientes',
    icon: Star,
  },
  {
    value: 'newest',
    label: 'Nuevas piezas',
    description: 'Incorporaciones recientes',
    icon: Clock3,
  },
];

function getPopularityScore(product: Product) {
  const featuredBoost = product.featured ? 1000 : 0;
  const stockSignal = Math.min(product.stock ?? 0, 12) * 12;
  const recencyDays = Math.max(0, (Date.now() - new Date(product.created_at).getTime()) / 86400000);
  const recencyBoost = Math.max(0, 365 - recencyDays);
  return featuredBoost + stockSignal + recencyBoost;
}

export function ProductCatalog() {
  const { theme } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<SortOption>('featured');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const client = await getSupabaseClient();
        if (!isMounted) return;

        if (!client) {
          setProducts([]);
          setError('Supabase no está configurado. Define las variables de entorno antes de desplegar.');
          setLoading(false);
          return;
        }

        const { data, error } = await client
          .from('products')
          .select('*')
          .eq('material', theme)
          .order('featured', { ascending: false })
          .order('created_at', { ascending: false });

        if (!isMounted) return;
        if (error) throw error;

        setProducts(data ?? []);
        if (!data || data.length === 0) {
          setError('No hay productos disponibles. Crea piezas en Supabase para mostrarlas aquí.');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        if (!isMounted) return;
        setProducts([]);
        setError('No se pudo obtener el catálogo desde Supabase.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadProducts();
    setSelectedCategory('all');
    setSortOption('featured');

    return () => {
      isMounted = false;
    };
  }, [theme]);

  const categories = useMemo(() => {
    const available = new Set<string>();

    products.forEach((product) => {
      const value = normalizeCategory(product.category);
      available.add(value);
    });

    const curated = staticCategories.filter((category) => available.has(category));
    const extras = Array.from(available).filter((category) => !staticCategories.includes(category));

    return ['all', ...curated, ...extras];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return products;
    }

    return products.filter((product) => normalizeCategory(product.category) === selectedCategory);
  }, [products, selectedCategory]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];

    switch (sortOption) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'newest':
        return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'popularity':
        return list.sort((a, b) => getPopularityScore(b) - getPopularityScore(a));
      case 'featured':
      default:
        return list.sort((a, b) => {
          if (a.featured === b.featured) {
            return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
          }
          return a.featured ? -1 : 1;
        });
    }
  }, [filteredProducts, sortOption]);

  return (
    <section id="collection" className="py-24" style={{ backgroundColor: 'var(--background)' }}>
      <div className="mx-auto max-w-7xl space-y-12 px-6">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={panelVariants}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.45em] text-muted-foreground">
              Catálogo Completo
            </p>
            <h2 className="text-4xl md:text-6xl font-light tracking-tight">
              {theme === 'gold' ? 'Colección Oro' : 'Colección Plata'}
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground leading-relaxed">
              Descubre cada pieza de nuestra {theme === 'gold' ? 'colección en oro 18k' : 'colección en plata 925'}.
              Desde anillos únicos hasta conjuntos completos, cada joya está diseñada para perdurar en el tiempo.
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar joyas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-border rounded-xl bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Category Filter Chips */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={filterVariants}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full text-sm font-medium uppercase tracking-[0.2em] transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105' 
                    : 'bg-card border border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
                }`}
              >
                {category === 'all' ? 'Todas' : category}
              </button>
            );
          })}
        </motion.div>

        {/* Sort Options */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={panelVariants}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          {sortConfigurations.map(({ value, label, icon: Icon }) => {
            const isActive = sortOption === value;
            return (
              <button
                key={value}
                onClick={() => setSortOption(value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs uppercase tracking-[0.3em] transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'bg-card border border-border text-muted-foreground hover:border-primary/20 hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            );
          })}
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={panelVariants}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8"
        >
          {error && !loading && (
            <div className="text-center p-6 bg-card/50 rounded-xl border border-border">
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground uppercase tracking-[0.3em]">
                  Cargando catálogo...
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {sortedProducts.length} {sortedProducts.length === 1 ? 'pieza encontrada' : 'piezas encontradas'}
                  {selectedCategory !== 'all' && ` en ${selectedCategory}`}
                </p>
              </div>

              {/* Products Grid */}
              <motion.div 
                layout 
                className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {sortedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={productVariants}
                    transition={{ duration: 0.55, delay: index * 0.05 }}
                    layout
                  >
                    <ProductCard product={product} variant="collectionsMinimal" />
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}

          {!loading && sortedProducts.length === 0 && (
            <div className="text-center py-20">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No se encontraron productos
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Intenta ajustar los filtros o buscar otros términos
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchTerm('');
                    setSortOption('featured');
                  }}
                  className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
