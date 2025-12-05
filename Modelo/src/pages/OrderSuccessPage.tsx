import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, MessageCircle, Home } from 'lucide-react';
import type { OrderSummary } from '../types/order';

const sectionVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1], when: 'beforeChildren', staggerChildren: 0.12 },
  },
};

const nextSteps = [
  {
    title: 'Confirmación',
    description: 'Nos pondremos en contacto contigo en las próximas horas para confirmar disponibilidad.',
  },
  {
    title: 'Pago',
    description: 'Te enviaremos los datos bancarios o de Yape para completar la transferencia.',
  },
  {
    title: 'Preparación',
    description: 'Una vez confirmado el pago, prepararemos cuidadosamente tu pedido con el embalaje de lujo.',
  },
  {
    title: 'Entrega',
    description: 'Te notificaremos cuando tu pedido esté en camino e incluiremos información de seguimiento.',
  },
];

export function OrderSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const order: OrderSummary | undefined = location.state?.order;

  useEffect(() => {
    if (!order) {
      navigate('/', { replace: true });
    }
  }, [order, navigate]);

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(value);

  const whatsappLink = useMemo(() => {
    if (!order) return 'https://wa.me/51992856599';

    const formatter = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' });
    const client = order.customer;
    const productLines = order.items
      .map((item) => `• ${item.name} x${item.quantity} — ${formatter.format(item.price * item.quantity)}`)
      .join('\n');

    const message = `Hola, he realizado un pedido en Diego Joyero. Aquí están los detalles del pedido para su confirmación. Gracias.\n\nNombre: ${client.firstName} ${client.lastName}\nCorreo: ${client.email}\nTeléfono: ${client.phone}\nDirección: ${client.address}, ${client.city} ${client.postalCode}${
      client.reference ? `\nReferencia: ${client.reference}` : ''
    }\nMétodo de pago: ${order.paymentMethod === 'yape' ? 'Yape' : 'Transferencia bancaria'}\n\nProductos:\n${productLines}\n\nTotal: ${formatter.format(order.total)}`;

    return `https://wa.me/51992856599?text=${encodeURIComponent(message)}`;
  }, [order]);

  if (!order) {
    return null;
  }

  return (
    <motion.section
      className="bg-background text-foreground"
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
    >
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="mb-14 space-y-6 text-center">
          <div className="inline-flex items-center justify-center rounded-full border px-6 py-3 text-xs uppercase tracking-[0.4em]" style={{ borderColor: 'var(--border)', color: 'var(--primary)' }}>
            Pedido confirmado
          </div>
          <h1 className="text-4xl font-light tracking-tight md:text-5xl">Pedido realizado con éxito.</h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Gracias por tu compra, hemos recibido tu pedido y nos pondremos pronto en contacto contigo para coordinar los siguientes pasos.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-10">
            <section className="space-y-6 border p-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--cardBg)' }}>
              <header className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-muted-foreground">
                <CheckCircle2 className="h-4 w-4" /> Detalles del pedido
              </header>

              <div className="space-y-5 text-sm leading-relaxed">
                <div>
                  <p className="text-[0.62rem] uppercase tracking-[0.3em] text-muted-foreground">Cliente</p>
                  <p className="mt-2">{order.customer.firstName} {order.customer.lastName}</p>
                  <p>{order.customer.email}</p>
                  <p>{order.customer.phone}</p>
                </div>

                <div>
                  <p className="text-[0.62rem] uppercase tracking-[0.3em] text-muted-foreground">Dirección de entrega</p>
                  <p className="mt-2">{order.customer.address}</p>
                  <p>{order.customer.city} {order.customer.postalCode}</p>
                  {order.customer.reference ? <p>Referencia: {order.customer.reference}</p> : null}
                </div>

                <div>
                  <p className="text-[0.62rem] uppercase tracking-[0.3em] text-muted-foreground">Método de pago</p>
                  <p className="mt-2">{order.paymentMethod === 'yape' ? 'Yape' : 'Transferencia bancaria'}</p>
                </div>

                <div>
                  <p className="text-[0.62rem] uppercase tracking-[0.3em] text-muted-foreground">Piezas adquiridas</p>
                  <ul className="mt-3 space-y-3">
                    {order.items.map((item) => (
                      <li key={item.id} className="flex items-center justify-between text-sm">
                        <span>{item.name} · x{item.quantity}</span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between border-t pt-4 text-sm uppercase tracking-[0.35em]" style={{ borderColor: 'var(--border)' }}>
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </section>

            <section className="space-y-6 border p-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--cardBg)' }}>
              <header className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-muted-foreground">
                <MessageCircle className="h-4 w-4" /> Próximos pasos
              </header>
              <ul className="space-y-4 text-sm leading-relaxed">
                {nextSteps.map((item) => (
                  <li key={item.title}>
                    <p className="text-[0.62rem] uppercase tracking-[0.3em] text-muted-foreground">{item.title}</p>
                    <p className="mt-1 text-foreground/90">{item.description}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="space-y-6 border p-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--cardBg)' }}>
            <p className="text-[0.62rem] uppercase tracking-[0.3em] text-muted-foreground">Confirma tu pedido</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Para acelerar la preparación y entrega, contáctanos ahora mismo por WhatsApp con los datos ya prellenados. El correo de confirmación puede tardar unas horas, pero el mensaje directo nos permite verificar tu pedido de inmediato.
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-3 border px-5 py-3 text-[0.68rem] uppercase tracking-[0.4em] transition-colors duration-300 hover:bg-[var(--primary)] hover:text-[var(--bg)]"
              style={{ color: 'var(--text)', borderColor: 'var(--border)' }}
            >
              <MessageCircle className="h-4 w-4" /> Contactar por WhatsApp
            </a>
            <div className="h-px bg-border" />
            <Link
              to="/"
              className="inline-flex items-center gap-3 text-[0.62rem] uppercase tracking-[0.35em] border-b border-transparent hover:border-[var(--primary)]"
              style={{ color: 'var(--text)' }}
            >
              <Home className="h-4 w-4" /> Volver al inicio
            </Link>
          </aside>
        </div>

        <div className="mt-16 flex items-center justify-center gap-6 text-[0.62rem] uppercase tracking-[0.35em] text-muted-foreground">
          <Link
            to="/colecciones"
            className="inline-flex items-center gap-3 border-b border-transparent hover:border-[var(--primary)]"
            style={{ color: 'var(--text)' }}
          >
            Explorar nuevas piezas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
