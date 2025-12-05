import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const formatPrice = (value: number) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(value);

export function CartDrawer() {
  const navigate = useNavigate();
  const {
    isOpen,
    closeCart,
    items,
    removeItem,
    incrementItem,
    decrementItem,
    totalItems,
    totalPrice,
    clearCart,
  } = useCart();

  const hasItems = items.length > 0;

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!isOpen}
    >
      <div className="absolute inset-0 bg-black/20" onClick={closeCart} />

      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ backgroundColor: 'var(--cardBg)', borderColor: 'var(--border)' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        <div
          className="flex items-center justify-between px-8 py-6 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.45em]" style={{ color: 'var(--textSecondary)' }}>
              Tu selección ({totalItems})
            </p>
            <h2 id="cart-title" className="text-2xl font-display" style={{ color: 'var(--text)' }}>
              Carrito
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {hasItems ? (
              <button
                type="button"
                onClick={clearCart}
                className="text-[0.6rem] uppercase tracking-[0.35em] border-b border-transparent hover:border-[var(--primary)]"
                style={{ color: 'var(--textSecondary)' }}
              >
                Vaciar
              </button>
            ) : null}
            <button
              type="button"
              onClick={closeCart}
              className="p-2 border border-transparent hover:border-[var(--border)]"
              aria-label="Cerrar carrito"
            >
              <X className="w-4 h-4" style={{ color: 'var(--text)' }} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-10">
          {hasItems ? (
            <ul className="space-y-8">
              {items.map((item) => (
                <li key={item.id} className="flex gap-5">
                  <Link to={`/producto/${item.id}`} className="block h-24 w-20 overflow-hidden rounded-sm">
                    <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                  </Link>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          to={`/producto/${item.id}`}
                          className="text-sm font-display uppercase tracking-[0.25em]"
                          style={{ color: 'var(--text)' }}
                          onClick={closeCart}
                        >
                          {item.name}
                        </Link>
                        <p className="text-[0.6rem] uppercase tracking-[0.35em]" style={{ color: 'var(--textSecondary)' }}>
                          {item.material === 'gold' ? 'Oro 18k' : 'Plata 925'} · {item.category}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-muted-foreground hover:text-[var(--primary)]"
                        aria-label={`Eliminar ${item.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="text-sm leading-relaxed" style={{ color: 'var(--textSecondary)' }}>
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3" style={{ color: 'var(--textSecondary)' }}>
                        <button
                          type="button"
                          onClick={() => decrementItem(item.id)}
                          className="flex h-7 w-7 items-center justify-center border"
                          style={{ borderColor: 'var(--border)' }}
                          aria-label={`Restar ${item.name}`}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm uppercase tracking-[0.3em]" style={{ color: 'var(--text)' }}>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => incrementItem(item.id)}
                          className="flex h-7 w-7 items-center justify-center border"
                          style={{ borderColor: 'var(--border)' }}
                          aria-label={`Sumar ${item.name}`}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-base font-light tracking-[0.2em]" style={{ color: 'var(--text)' }}>
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="space-y-6">
              <p className="text-sm leading-relaxed" style={{ color: 'var(--textSecondary)' }}>
                Aún no hay piezas en tu carrito. Selecciona una pieza para reservarla y coordinar una cita privada.
              </p>
              <a
                href="/#coleccion"
                className="inline-block text-xs uppercase tracking-[0.45em] border-b border-transparent hover:border-[var(--primary)]"
                style={{ color: 'var(--primary)' }}
                onClick={closeCart}
              >
                Explorar colección
              </a>
            </div>
          )}
        </div>

        {hasItems ? (
          <div className="space-y-6 border-t px-8 py-6" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between text-sm uppercase tracking-[0.35em]">
              <span style={{ color: 'var(--textSecondary)' }}>Total estimado</span>
              <span style={{ color: 'var(--text)' }}>{formatPrice(totalPrice)}</span>
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              className="block w-full border px-5 py-3 text-[0.68rem] uppercase tracking-[0.4em] transition-colors duration-300 hover:bg-[var(--primary)] hover:text-[var(--bg)] hover:border-[var(--primary)]"
              style={{
                color: 'var(--text)',
                borderColor: 'var(--border)',
              }}
            >
              Proceder con la compra
            </button>
            <Link
              to="/contacto"
              className="block text-center border px-5 py-3 text-[0.68rem] uppercase tracking-[0.4em] transition-colors duration-300 hover:bg-[var(--primary)] hover:text-[var(--bg)] hover:border-[var(--primary)]"
              style={{
                color: 'var(--text)',
                borderColor: 'var(--border)',
              }}
              onClick={closeCart}
            >
              Coordinar visita
            </Link>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
