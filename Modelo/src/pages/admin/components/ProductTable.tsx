import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FocusEvent, type FormEvent } from 'react';
import { Camera, Loader2, Plus, Save, Trash2, UploadCloud } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { cn } from '../../../lib/utils';
import { productImageConstraints, uploadProductImage } from '../../../lib/storage';

export type ProductStatus = 'active' | 'inactive';

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  material: 'gold' | 'silver';
  status: ProductStatus;
  featured: boolean;
  imageUrl: string;
  imagePublicId: string | null;
}

export interface ProductRecord extends ProductInput {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

type PendingImageUpload = {
  file: File;
  previewUrl: string;
};

const CATEGORY_OPTIONS = ['Anillos', 'Aros', 'Pulseras', 'Collares', 'Aretes', 'Tobilleras', 'Accesorios', 'Otros'];

const buildCategoryOptions = (currentValue?: string) => {
  if (currentValue && currentValue.trim() && !CATEGORY_OPTIONS.includes(currentValue)) {
    return [currentValue, ...CATEGORY_OPTIONS];
  }
  return CATEGORY_OPTIONS;
};

interface ProductTableProps {
  products: ProductRecord[];
  isLoading: boolean;
  onCreateProduct: (product: ProductInput) => Promise<void>;
  onUpdateProduct: (product: ProductRecord) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
  searchTerm: string;
  onSearch: (term: string) => void;
  isCreateModalOpen: boolean;
  onOpenCreateModal: () => void;
  onCloseCreateModal: () => void;
}

export function ProductTable({
  products,
  isLoading,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
  searchTerm,
  onSearch,
  isCreateModalOpen,
  onOpenCreateModal,
  onCloseCreateModal,
}: ProductTableProps) {
  const [drafts, setDrafts] = useState<Record<string, ProductRecord>>({});
  const [savingIds, setSavingIds] = useState<Record<string, boolean>>({});
  const [deletingIds, setDeletingIds] = useState<Record<string, boolean>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [imageUploadTargetId, setImageUploadTargetId] = useState<string | null>(null);
  const [pendingImageUploads, setPendingImageUploads] = useState<Record<string, PendingImageUpload>>({});
  const pendingImageUploadsRef = useRef<Record<string, PendingImageUpload>>({});
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const imageFileAccept = productImageConstraints.allowedMimeTypes.join(',');
  const maxImageSizeMb = Math.round(productImageConstraints.maxSizeBytes / (1024 * 1024));
  const imageHelpText = `Formatos: JPG, PNG, WebP o AVIF (máx. ${maxImageSizeMb} MB).`;

  const handleNumericFocus = (event: FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  useEffect(() => {
    pendingImageUploadsRef.current = pendingImageUploads;
  }, [pendingImageUploads]);

  useEffect(() => {
    return () => {
      Object.values(pendingImageUploadsRef.current).forEach((entry) => {
        URL.revokeObjectURL(entry.previewUrl);
      });
    };
  }, []);

  useEffect(() => {
    setPendingImageUploads((previous) => {
      if (!Object.keys(previous).length) {
        return previous;
      }
      const activeIds = new Set(products.map((product) => product.id));
      let changed = false;
      const next = { ...previous };
      Object.keys(previous).forEach((id) => {
        if (!activeIds.has(id)) {
          URL.revokeObjectURL(previous[id].previewUrl);
          delete next[id];
          changed = true;
        }
      });
      return changed ? next : previous;
    });
  }, [products]);

  useEffect(() => {
    setDrafts((previous) => {
      const next: Record<string, ProductRecord> = {};
      Object.keys(previous).forEach((key) => {
        if (products.some((product) => product.id === key)) {
          next[key] = previous[key];
        }
      });
      return next;
    });
  }, [products]);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return products;
    }
    return products.filter((product) => {
      return [product.name, product.category, product.description]
        .join(' ')
        .toLowerCase()
        .includes(term);
    });
  }, [products, searchTerm]);

  const handleDraftChange = <K extends keyof ProductRecord>(id: string, field: K, value: ProductRecord[K]) => {
    setDrafts((previous) => {
      const base = previous[id] ?? products.find((product) => product.id === id);
      if (!base) return previous;
      return {
        ...previous,
        [id]: {
          ...base,
          [field]: value,
        },
      };
    });
  };

  const updateImageFields = (id: string, imageUrl: string, imagePublicId: string | null) => {
    setDrafts((previous) => {
      const base = previous[id] ?? products.find((product) => product.id === id);
      if (!base) return previous;
      return {
        ...previous,
        [id]: {
          ...base,
          imageUrl,
          imagePublicId,
        },
      };
    });
  };

  const stagePendingImageUpload = (id: string, file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setPendingImageUploads((previous) => {
      const next = { ...previous };
      const existing = next[id];
      if (existing) {
        URL.revokeObjectURL(existing.previewUrl);
      }
      next[id] = { file, previewUrl };
      return next;
    });
  };

  const clearPendingImageUpload = (id: string) => {
    setPendingImageUploads((previous) => {
      const existing = previous[id];
      if (!existing) {
        return previous;
      }
      const next = { ...previous };
      URL.revokeObjectURL(existing.previewUrl);
      delete next[id];
      return next;
    });
  };

  const getPendingImagePreview = (id: string): string | null => pendingImageUploads[id]?.previewUrl ?? null;

  const handleOpenImagePicker = (id: string) => {
    setSubmitError(null);
    setImageUploadTargetId(id);
    uploadInputRef.current?.click();
  };

  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = '';
    const productId = imageUploadTargetId;
    if (!file || !productId) {
      setImageUploadTargetId(null);
      return;
    }

    const base = drafts[productId] ?? products.find((product) => product.id === productId);
    if (!base) {
      setImageUploadTargetId(null);
      return;
    }

    setSubmitError(null);
    setImageUploadTargetId(null);
    stagePendingImageUpload(productId, file);
    updateImageFields(productId, '', null);
  };

  const handleSaveRow = async (id: string) => {
    const draft = drafts[id];
    const original = products.find((product) => product.id === id);
    const snapshot = draft ?? original;
    if (!snapshot || !original) return;

    setSubmitError(null);
    setSavingIds((previous) => ({ ...previous, [id]: true }));

    let payload: ProductRecord = {
      ...snapshot,
      updatedAt: new Date().toISOString(),
    };

    const stagedImage = pendingImageUploadsRef.current[id];
    if (stagedImage) {
      try {
        const { publicUrl, publicId } = await uploadProductImage(stagedImage.file, payload.material);
        payload = {
          ...payload,
          imageUrl: publicUrl,
          imagePublicId: publicId ?? null,
        };
        updateImageFields(id, payload.imageUrl, payload.imagePublicId);
      } catch (error) {
        console.error('Error uploading staged image', error);
        setSavingIds((previous) => {
          const next = { ...previous };
          delete next[id];
          return next;
        });
        setSubmitError(
          error instanceof Error ? error.message : 'No se pudo subir la imagen seleccionada. Intenta nuevamente.'
        );
        return;
      }
    }

    try {
      await onUpdateProduct(payload);
      clearPendingImageUpload(id);
      setDrafts((previous) => {
        const next = { ...previous };
        delete next[id];
        return next;
      });
    } catch (error) {
      console.error('Error updating product', error);
      setSubmitError('No se pudieron guardar los cambios. Intenta nuevamente.');
    } finally {
      setSavingIds((previous) => {
        const next = { ...previous };
        delete next[id];
        return next;
      });
    }
  };

  const handleDeleteRow = async (id: string) => {
    setSubmitError(null);
    setDeletingIds((previous) => ({ ...previous, [id]: true }));
    try {
      await onDeleteProduct(id);
      clearPendingImageUpload(id);
      setDrafts((previous) => {
        const next = { ...previous };
        delete next[id];
        return next;
      });
    } catch (error) {
      console.error('Error deleting product', error);
      setSubmitError('No se pudo eliminar el producto. Intenta nuevamente.');
    } finally {
      setDeletingIds((previous) => {
        const next = { ...previous };
        delete next[id];
        return next;
      });
    }
  };

  const hasDraftChanges = (id: string) => Boolean(drafts[id]);
  const isSaving = (id: string) => Boolean(savingIds[id]);
  const isDeleting = (id: string) => Boolean(deletingIds[id]);
  const resultsLabel = isLoading ? 'Cargando…' : `${filteredProducts.length} resultados`;

  return (
    <Card className="min-w-0 border border-border/70 bg-card/80 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-base font-medium uppercase tracking-[0.32em] text-muted-foreground">
              Gestión del catálogo
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Edita directamente sobre la tabla y guarda los cambios al instante.
            </CardDescription>
          </div>
          <Button className="gap-2" onClick={onOpenCreateModal}>
            <Plus className="h-4 w-4" />
            Agregar producto
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 min-w-0">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-[320px]">
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Buscar por nombre, categoría o descripción"
              className="w-full rounded-lg border border-border/70 bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>
          <span className="text-xs uppercase tracking-[0.32em] text-muted-foreground">{resultsLabel}</span>
        </div>

        <div className="hidden md:block">
          <div className="overflow-x-auto rounded-xl border border-border/70 bg-background">
            <table className="w-full min-w-[1024px] text-left text-sm">
              <thead className="bg-muted/60 text-[0.7rem] uppercase tracking-[0.32em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Imagen</th>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Precio</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Categoría</th>
                  <th className="px-4 py-3">Material</th>
                  <th className="px-4 py-3">Destacado</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
              {isLoading && filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-center text-sm text-muted-foreground">
                    Cargando catálogo…
                  </td>
                </tr>
              ) : null}
              {!isLoading && filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-center text-sm text-muted-foreground">
                    No encontramos productos con ese criterio de búsqueda.
                  </td>
                </tr>
              ) : null}
              {filteredProducts.map((product) => {
                const draft = drafts[product.id];
                const current = draft ?? product;
                const pendingPreview = getPendingImagePreview(product.id);
                const resolvedImageSource = pendingPreview ?? current.imageUrl;
                const categoryOptions = buildCategoryOptions(current.category);
                return (
                  <tr key={product.id} className="align-top hover:bg-muted/40">
                    <td className="px-4 py-4 align-top">
                      <div className="flex flex-col items-start gap-2">
                        <div className="flex items-start gap-3">
                          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-muted text-xs uppercase tracking-[0.18em] text-muted-foreground">
                            {resolvedImageSource ? (
                              <img src={resolvedImageSource} alt={current.name} className="h-full w-full object-cover" />
                            ) : (
                              <Camera className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => handleOpenImagePicker(product.id)}
                          >
                            <UploadCloud className="h-3.5 w-3.5" />
                            {pendingPreview ? 'Imagen lista (guardar cambios)' : 'Subir imagen'}
                          </Button>
                          {current.imageUrl || pendingPreview ? (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                clearPendingImageUpload(product.id);
                                updateImageFields(product.id, '', null);
                              }}
                            >
                              Quitar
                            </Button>
                          ) : null}
                        </div>
                        {pendingPreview ? (
                          <p className="text-[0.65rem] text-amber-600">Se subirá cuando guardes este producto.</p>
                        ) : null}
                        <p className="text-[0.65rem] text-muted-foreground">{imageHelpText}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex min-w-[220px] max-w-[260px] flex-col gap-2">
                        <input
                          type="text"
                          value={current.name}
                          onChange={(event) => handleDraftChange(product.id, 'name', event.target.value)}
                          className="rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                        />
                        <textarea
                          value={current.description}
                          onChange={(event) => handleDraftChange(product.id, 'description', event.target.value)}
                          rows={2}
                          className="rounded-md border border-border/60 bg-background px-3 py-2 text-xs text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
                          placeholder="Descripción breve"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        value={current.price}
                        onChange={(event) => handleDraftChange(product.id, 'price', Number(event.target.value))}
                        onFocus={handleNumericFocus}
                        className="w-24 rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                      />
                    </td>
                    <td className="px-4 py-4 align-top">
                      <input
                        type="number"
                        min={0}
                        value={current.stock}
                        onChange={(event) => handleDraftChange(product.id, 'stock', Number(event.target.value))}
                        onFocus={handleNumericFocus}
                        className="w-20 rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                      />
                    </td>
                    <td className="px-4 py-4 align-top">
                      <select
                        value={current.category}
                        onChange={(event) => handleDraftChange(product.id, 'category', event.target.value)}
                        className="w-32 max-w-[8.5rem] rounded-md border border-border/60 bg-background px-3 py-2 text-xs uppercase tracking-[0.28em] focus:outline-none focus:ring-2 focus:ring-ring/40"
                      >
                        <option value="" disabled>
                          Selecciona categoría
                        </option>
                        {categoryOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <select
                        value={current.material}
                        onChange={(event) =>
                          handleDraftChange(product.id, 'material', event.target.value as ProductRecord['material'])
                        }
                        className="w-32 rounded-md border border-border/60 bg-background px-3 py-2 text-xs uppercase tracking-[0.28em] focus:outline-none focus:ring-2 focus:ring-ring/40"
                      >
                        <option value="gold">Oro</option>
                        <option value="silver">Plata</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <select
                        value={current.featured ? 'true' : 'false'}
                        onChange={(event) =>
                          handleDraftChange(product.id, 'featured', event.target.value === 'true')
                        }
                        className="w-28 rounded-md border border-border/60 bg-background px-3 py-2 text-xs uppercase tracking-[0.28em] focus:outline-none focus:ring-2 focus:ring-ring/40"
                      >
                        <option value="true">Destacado</option>
                        <option value="false">Regular</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <select
                        value={current.status}
                        onChange={(event) =>
                          handleDraftChange(product.id, 'status', event.target.value as ProductStatus)
                        }
                        className={cn(
                          'w-32 rounded-md border border-border/60 bg-background px-3 py-2 text-xs uppercase tracking-[0.28em] focus:outline-none focus:ring-2 focus:ring-ring/40',
                          current.status === 'active'
                            ? 'text-emerald-600'
                            : 'text-muted-foreground'
                        )}
                      >
                        <option value="active">Activo</option>
                        <option value="inactive">Inactivo</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          disabled={!hasDraftChanges(product.id) || isSaving(product.id)}
                          onClick={() => void handleSaveRow(product.id)}
                        >
                          {isSaving(product.id) ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Save className="h-3.5 w-3.5" />
                          )}
                          {isSaving(product.id) ? 'Guardando' : 'Guardar'}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-9 w-9"
                          onClick={() => void handleDeleteRow(product.id)}
                          aria-label="Eliminar producto"
                          disabled={isSaving(product.id) || isDeleting(product.id)}
                        >
                          {isDeleting(product.id) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>

        <div className="space-y-4 md:hidden">
          {isLoading && filteredProducts.length === 0 ? (
            <div className="rounded-xl border border-border/70 bg-card p-6 text-center text-sm text-muted-foreground">
              Cargando catálogo…
            </div>
          ) : null}
          {!isLoading && filteredProducts.length === 0 ? (
            <div className="rounded-xl border border-border/70 bg-card p-6 text-center text-sm text-muted-foreground">
              No encontramos productos con ese criterio de búsqueda.
            </div>
          ) : null}
          {filteredProducts.map((product) => {
            const draft = drafts[product.id];
            const current = draft ?? product;
            const pendingPreview = getPendingImagePreview(product.id);
            const resolvedImageSource = pendingPreview ?? current.imageUrl;
            const categoryOptions = buildCategoryOptions(current.category);
            return (
              <div key={product.id} className="space-y-3 rounded-xl border border-border/70 bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-muted">
                        {resolvedImageSource ? (
                          <img src={resolvedImageSource} alt={current.name} className="h-full w-full object-cover" />
                        ) : (
                          <Camera className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <input
                        type="text"
                        value={current.name}
                        onChange={(event) => handleDraftChange(product.id, 'name', event.target.value)}
                        className="w-44 rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                      />
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9"
                      onClick={() => handleDeleteRow(product.id)}
                      aria-label="Eliminar producto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="w-full gap-2 sm:w-auto"
                        onClick={() => handleOpenImagePicker(product.id)}
                      >
                        <UploadCloud className="h-4 w-4" />
                        {pendingPreview ? 'Imagen lista (guardar)' : 'Subir imagen'}
                      </Button>
                      {current.imageUrl || pendingPreview ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="w-full sm:w-auto"
                          onClick={() => {
                            clearPendingImageUpload(product.id);
                            updateImageFields(product.id, '', null);
                          }}
                        >
                          Quitar imagen
                        </Button>
                      ) : null}
                    </div>
                    {pendingPreview ? (
                      <p className="text-[0.7rem] text-amber-600">Sube al guardar este producto.</p>
                    ) : null}
                    <p className="text-[0.7rem] text-muted-foreground">{imageHelpText}</p>
                  </div>
                <textarea
                  value={current.description}
                  onChange={(event) => handleDraftChange(product.id, 'description', event.target.value)}
                  rows={2}
                  className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-xs text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
                  placeholder="Descripción"
                />
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.28em] text-muted-foreground">
                    Precio
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={current.price}
                      onChange={(event) => handleDraftChange(product.id, 'price', Number(event.target.value))}
                      onFocus={handleNumericFocus}
                      className="rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.28em] text-muted-foreground">
                    Stock
                    <input
                      type="number"
                      min={0}
                      value={current.stock}
                      onChange={(event) => handleDraftChange(product.id, 'stock', Number(event.target.value))}
                      onFocus={handleNumericFocus}
                      className="rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.28em] text-muted-foreground">
                    Categoría
                    <select
                      value={current.category}
                      onChange={(event) => handleDraftChange(product.id, 'category', event.target.value)}
                      className="rounded-md border border-border/60 bg-background px-3 py-2 text-xs uppercase tracking-[0.28em] focus:outline-none focus:ring-2 focus:ring-ring/40"
                    >
                      <option value="" disabled>
                        Selecciona categoría
                      </option>
                      {categoryOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.28em] text-muted-foreground">
                    Material
                    <select
                      value={current.material}
                      onChange={(event) =>
                        handleDraftChange(product.id, 'material', event.target.value as ProductRecord['material'])
                      }
                      className="rounded-md border border-border/60 bg-background px-3 py-2 text-xs uppercase tracking-[0.28em] focus:outline-none focus:ring-2 focus:ring-ring/40"
                    >
                      <option value="gold">Oro</option>
                      <option value="silver">Plata</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.28em] text-muted-foreground">
                    Destacado
                    <select
                      value={current.featured ? 'true' : 'false'}
                      onChange={(event) => handleDraftChange(product.id, 'featured', event.target.value === 'true')}
                      className="rounded-md border border-border/60 bg-background px-3 py-2 text-xs uppercase tracking-[0.28em] focus:outline-none focus:ring-2 focus:ring-ring/40"
                    >
                      <option value="true">Sí</option>
                      <option value="false">No</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.28em] text-muted-foreground">
                    Estado
                    <select
                      value={current.status}
                      onChange={(event) =>
                        handleDraftChange(product.id, 'status', event.target.value as ProductStatus)
                      }
                      className="rounded-md border border-border/60 bg-background px-3 py-2 text-xs uppercase tracking-[0.28em] focus:outline-none focus:ring-2 focus:ring-ring/40"
                    >
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                    </select>
                  </label>
                </div>
                <Button
                  size="sm"
                  className="w-full gap-2"
                  variant="outline"
                  disabled={!hasDraftChanges(product.id) || isSaving(product.id)}
                  onClick={() => void handleSaveRow(product.id)}
                >
                  {isSaving(product.id) ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {isSaving(product.id) ? 'Guardando' : 'Guardar cambios'}
                </Button>
              </div>
            );
          })}
        </div>
        {submitError ? (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {submitError}
          </div>
        ) : null}
      </CardContent>

      <input
        ref={uploadInputRef}
        type="file"
        accept={imageFileAccept}
        className="hidden"
        onChange={handleImageFileChange}
      />

      <AddProductModal
        open={isCreateModalOpen}
        onClose={onCloseCreateModal}
        onSubmit={async (product) => {
          setSubmitError(null);
          try {
            await onCreateProduct(product);
            onCloseCreateModal();
          } catch (error) {
            console.error('Error creating product', error);
            setSubmitError('No se pudo crear el producto. Revisa los datos e inténtalo nuevamente.');
          }
        }}
      />
    </Card>
  );
}

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (product: ProductInput) => Promise<void>;
}

function AddProductModal({ open, onClose, onSubmit }: AddProductModalProps) {
  type AddProductFormState = Omit<ProductInput, 'price' | 'stock'> & {
    price: string;
    stock: string;
  };

  const [form, setForm] = useState<AddProductFormState>({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: CATEGORY_OPTIONS[0],
    status: 'active',
    imageUrl: '',
    imagePublicId: null,
    material: 'gold',
    featured: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [pendingImagePreview, setPendingImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalPreviewImage = pendingImagePreview ?? form.imageUrl;

  const imageFileAccept = productImageConstraints.allowedMimeTypes.join(',');
  const maxImageSizeMb = Math.round(productImageConstraints.maxSizeBytes / (1024 * 1024));
  const imageHelpText = `Formatos: JPG, PNG, WebP o AVIF (máx. ${maxImageSizeMb} MB).`;

  const handleNumericFocus = (event: FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  useEffect(() => {
    if (open) {
      setForm({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: CATEGORY_OPTIONS[0],
        status: 'active',
        imageUrl: '',
        imagePublicId: null,
        material: 'gold',
        featured: false,
      });
      setErrorMessage(null);
      setIsSubmitting(false);
      setPendingImageFile(null);
      setPendingImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else {
      setPendingImageFile(null);
      setPendingImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [open]);

  useEffect(() => {
    return () => {
      if (pendingImagePreview) {
        URL.revokeObjectURL(pendingImagePreview);
      }
    };
  }, [pendingImagePreview]);

  if (!open) return null;

  const handlePickImage = () => {
    setErrorMessage(null);
    fileInputRef.current?.click();
  };

  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = '';
    if (!file) {
      return;
    }

    setErrorMessage(null);
    setPendingImageFile(file);
    setPendingImagePreview(URL.createObjectURL(file));
    setForm((previous) => ({
      ...previous,
      imageUrl: '',
      imagePublicId: null,
    }));
  };

  const handleChange = <K extends keyof AddProductFormState>(field: K, value: AddProductFormState[K]) => {
    if (field === 'imageUrl') {
      setPendingImageFile(null);
      setPendingImagePreview(null);
    }

    setForm((previous) => {
      if (field === 'imageUrl') {
        return {
          ...previous,
          imageUrl: value as string,
          imagePublicId: null,
        };
      }

      return {
        ...previous,
        [field]: value,
      };
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = form.name.trim();
    if (!trimmedName) return;
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      let resolvedImageUrl = form.imageUrl.trim();
      let resolvedImagePublicId = form.imagePublicId;
      if (pendingImageFile) {
        const { publicUrl, publicId } = await uploadProductImage(pendingImageFile, form.material);
        resolvedImageUrl = publicUrl;
        resolvedImagePublicId = publicId ?? null;
      }

      const parsedPrice = Number.parseFloat(form.price.replace(',', '.'));
      const parsedStock = Number.parseInt(form.stock, 10);
      const sanitizedPrice = Number.isFinite(parsedPrice) && parsedPrice >= 0 ? parsedPrice : 0;
      const sanitizedStock = Number.isFinite(parsedStock) && parsedStock >= 0 ? parsedStock : 0;

      await onSubmit({
        ...form,
        name: trimmedName,
        category: form.category || CATEGORY_OPTIONS[0],
        price: sanitizedPrice,
        stock: sanitizedStock,
        imageUrl: resolvedImageUrl,
        imagePublicId: resolvedImagePublicId,
      });
      setPendingImageFile(null);
      setPendingImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onClose();
    } catch (error) {
      console.error('Error submitting product modal', error);
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo guardar el producto. Verifica los campos e inténtalo nuevamente.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-10 overflow-hidden">
      <div className="relative w-full max-w-2xl rounded-2xl border border-border/80 bg-background shadow-2xl max-h-[calc(100vh-4rem)] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <header className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-lg tracking-[0.22em]">Nuevo producto</h2>
              <p className="text-sm text-muted-foreground">
                Completa los datos principales para mostrarlo en el catálogo digital.
              </p>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cerrar
            </Button>
          </header>

          <input
            ref={fileInputRef}
            type="file"
            accept={imageFileAccept}
            className="hidden"
            onChange={handleImageFileChange}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Nombre del producto
              <input
                type="text"
                value={form.name}
                onChange={(event) => handleChange('name', event.target.value)}
                placeholder="Ej. Anillo Petra"
                className="rounded-md border border-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Categoría
              <select
                value={form.category}
                onChange={(event) => handleChange('category', event.target.value)}
                className="rounded-md border border-border/70 bg-background px-3 py-2 text-xs uppercase tracking-[0.28em] focus:outline-none focus:ring-2 focus:ring-ring/40"
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground sm:col-span-2">
              Descripción
              <textarea
                value={form.description}
                onChange={(event) => handleChange('description', event.target.value)}
                rows={4}
                placeholder="Describe materiales, inspiración o detalles clave."
                className="rounded-md border border-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </label>
            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Precio (S/)
              <input
                type="number"
                min={0}
                step={0.01}
                value={form.price}
                onChange={(event) => handleChange('price', event.target.value)}
                onFocus={handleNumericFocus}
                className="rounded-md border border-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Stock disponible
              <input
                type="number"
                min={0}
                value={form.stock}
                onChange={(event) => handleChange('stock', event.target.value)}
                onFocus={handleNumericFocus}
                className="rounded-md border border-border/70 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Estado
              <select
                value={form.status}
                onChange={(event) => handleChange('status', event.target.value as ProductStatus)}
                className="rounded-md border border-border/70 bg-background px-3 py-2 text-xs uppercase tracking-[0.28em] focus:outline-none focus:ring-2 focus:ring-ring/40"
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Material
              <select
                value={form.material}
                onChange={(event) => handleChange('material', event.target.value as ProductInput['material'])}
                className="rounded-md border border-border/70 bg-background px-3 py-2 text-xs uppercase tracking-[0.28em] focus:outline-none focus:ring-2 focus:ring-ring/40"
              >
                <option value="gold">Oro</option>
                <option value="silver">Plata</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Destacado en la web
              <select
                value={form.featured ? 'true' : 'false'}
                onChange={(event) => handleChange('featured', event.target.value === 'true')}
                className="rounded-md border border-border/70 bg-background px-3 py-2 text-xs uppercase tracking-[0.28em] focus:outline-none focus:ring-2 focus:ring-ring/40"
              >
                <option value="false">No</option>
                <option value="true">Sí</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Imagen principal
              <div className="space-y-2">
                {modalPreviewImage ? (
                  <div className="flex items-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-muted">
                      <img src={modalPreviewImage} alt={form.name || 'Producto'} className="h-full w-full object-cover" />
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleChange('imageUrl', '')}
                    >
                      Quitar imagen
                    </Button>
                  </div>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    onClick={handlePickImage}
                  >
                    <UploadCloud className="h-3.5 w-3.5" />
                    {pendingImageFile ? 'Imagen lista (guardar)' : 'Subir imagen'}
                  </Button>
                </div>
                {pendingImageFile ? (
                  <p className="text-[0.7rem] text-amber-600">Se cargará cuando guardes el producto.</p>
                ) : null}
                <p className="text-[0.7rem] lowercase tracking-normal text-muted-foreground">
                  {imageHelpText}
                </p>
              </div>
            </label>
          </div>

          {errorMessage ? (
            <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {errorMessage}
            </div>
          ) : null}

          <footer className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose} className="sm:w-auto">
              Cancelar
            </Button>
            <Button type="submit" className="sm:w-auto" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSubmitting ? 'Guardando…' : 'Guardar producto'}
            </Button>
          </footer>
        </form>
      </div>
    </div>
  );
}
