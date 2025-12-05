import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import type { Product as SupabaseProduct } from "@/lib/supabase";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ProductDetail = SupabaseProduct & {
  gallery?: string[]; // optional extra images if available
};

interface ProductDetailModalProps {
  open: boolean;
  product: ProductDetail | null;
  onClose: () => void;
  onAddToCart?: (product: ProductDetail) => void;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 0,
  }).format(price || 0);

const buildDetails = (product: ProductDetail) => {
  const materialLabel = product.material === "gold" ? "Material: oro 18k certificado" : "Material: plata .925 certificada";
  const categoryLabel = product.category ? `Colección: ${product.category}` : "Colección: Sin categoría";
  const availability = (() => {
    const stock = Number(product.stock ?? 0);
    if (stock <= 0) return "Disponibilidad: agotado";
    if (stock < 5) return `Disponibilidad: últimas ${stock} piezas`;
    return "Disponibilidad: en stock";
  })();
  return [materialLabel, categoryLabel, availability, `Referencia: ${product.id}`];
};

export function ProductDetailModal({ open, product, onClose, onAddToCart }: ProductDetailModalProps) {
  const [imageIndex, setImageIndex] = useState(0);

  const gallery = useMemo(() => {
    if (!product) return [] as string[];
    const base = product.image_url ? [product.image_url] : [];
    const extras = Array.isArray(product.gallery) ? product.gallery.filter(Boolean) : [];
    const merged = [...base, ...extras];
    return merged.length > 0
      ? Array.from(new Set(merged))
      : ["https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=900&h=1200&fit=crop&auto=format&dpr=1"];
  }, [product]);

  const currentImage = gallery[imageIndex] ?? gallery[0] ?? "";

  const details = product ? buildDetails(product) : [];

  const handlePrev = () => setImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  const handleNext = () => setImageIndex((prev) => (prev + 1) % gallery.length);

  return (
    <Dialog open={open} onOpenChange={(value) => (!value ? onClose() : undefined)}>
      <DialogContent
        className="max-w-6xl border border-border/70 bg-background/95 text-foreground shadow-2xl backdrop-blur-xl p-0 overflow-hidden"
        onPointerDownOutside={(event) => event.preventDefault()}
      >
        <div className="grid gap-8 md:grid-cols-2">
          <div className="relative bg-card/60">
            <div className="relative aspect-[4/5] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImage}
                  src={currentImage}
                  alt={product?.name ?? "Producto"}
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={{ opacity: 0.6, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.4, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
              {gallery.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-background/80 text-foreground transition-colors hover:bg-foreground hover:text-background"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-background/80 text-foreground transition-colors hover:bg-foreground hover:text-background"
                    aria-label="Imagen siguiente"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              ) : null}
            </div>
            {gallery.length > 1 ? (
              <div className="flex items-center gap-2 overflow-x-auto px-4 py-3">
                {gallery.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setImageIndex(index)}
                    className={cn(
                      "h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-border/70 ring-offset-background transition",
                      index === imageIndex ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100"
                    )}
                  >
                    <img src={image} alt={`Vista ${index + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-6 p-6 md:p-8">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <p className="text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground">{product?.category}</p>
                <h3 className="text-3xl font-display tracking-tight text-foreground md:text-4xl">{product?.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{product?.description}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:bg-foreground hover:text-background"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <p className="text-3xl font-display tracking-wide">{product ? formatPrice(product.price) : ""}</p>
              {product?.status === "active" ? (
                <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-200">
                  Disponible
                </span>
              ) : (
                <span className="rounded-full border border-destructive/50 bg-destructive/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-destructive">
                  Inactivo
                </span>
              )}
              {Number(product?.stock ?? 0) <= 0 ? (
                <span className="rounded-full border border-border/60 bg-border/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Sin stock
                </span>
              ) : Number(product?.stock ?? 0) < 5 ? (
                <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-amber-200">
                  Últimas {product?.stock}
                </span>
              ) : null}
            </div>

            <div className="space-y-3 rounded-lg border border-border/70 bg-card/60 p-4">
              <h4 className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Detalles</h4>
              <div className="space-y-2">
                {details.map((detail) => (
                  <div key={detail} className="flex items-start gap-2 text-sm text-foreground/90">
                    <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {onAddToCart ? (
                <Button
                  className="w-full gap-2 bg-foreground text-background hover:bg-foreground/90"
                  size="lg"
                  onClick={() => product && onAddToCart(product)}
                  disabled={!product || Number(product.stock ?? 0) <= 0}
                >
                  <ShoppingBag className="h-4 w-4" />
                  Agregar al carrito
                </Button>
              ) : null}
              <Button
                variant="outline"
                className="w-full border-border/80 text-foreground hover:bg-foreground hover:text-background"
                size="lg"
                onClick={onClose}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailModal;
