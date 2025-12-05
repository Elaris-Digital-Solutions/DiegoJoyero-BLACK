import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Home, User, ChevronRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { sendOrderEmail } from '../lib/email';
import type { CustomerDetails, OrderSummary, PaymentMethod } from '../types/order';

const sectionVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1], when: 'beforeChildren', staggerChildren: 0.12 },
  },
};

const initialCustomer: CustomerDetails = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  reference: '',
};

type CustomerErrors = Partial<Record<keyof CustomerDetails, string>>;

const paymentOptions: { value: PaymentMethod; title: string; description: string }[] = [
  {
    value: 'transfer',
    title: 'Transferencia bancaria',
    description: 'Transferencia a cuenta corriente en dólares o soles. Confirmaremos los datos tras tu pedido.',
  },
  {
    value: 'yape',
    title: 'Yape',
    description: 'Recibirás el código QR y el monto exacto para completar tu pago desde la app Yape.',
  },
];

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState(0);
  const [customer, setCustomer] = useState<CustomerDetails>(initialCustomer);
  const [errors, setErrors] = useState<CustomerErrors>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [orderCompleted, setOrderCompleted] = useState(false);

  useEffect(() => {
    if (items.length === 0 && !orderCompleted) {
      navigate('/');
    }
  }, [items.length, orderCompleted, navigate]);

  const subtotal = useMemo(() => totalPrice, [totalPrice]);

  const validateCustomer = () => {
    const nextErrors: CustomerErrors = {};

    if (!customer.firstName.trim()) nextErrors.firstName = 'Ingresa tu nombre.';
    if (!customer.lastName.trim()) nextErrors.lastName = 'Ingresa tu apellido.';

    if (!customer.email.trim()) {
      nextErrors.email = 'Ingresa tu correo electrónico.';
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i.test(customer.email)) {
      nextErrors.email = 'Ingresa un correo válido.';
    }

    if (!customer.phone.trim()) {
      nextErrors.phone = 'Ingresa tu teléfono.';
    } else if (customer.phone.replace(/\D/g, '').length < 9) {
      nextErrors.phone = 'Ingresa un teléfono válido.';
    }

    if (!customer.address.trim()) nextErrors.address = 'Ingresa tu dirección.';
    if (!customer.city.trim()) nextErrors.city = 'Ingresa tu ciudad.';
    if (!customer.postalCode.trim()) nextErrors.postalCode = 'Ingresa tu código postal.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleCustomerChange = (field: keyof CustomerDetails, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const goToPayment = () => {
    if (!validateCustomer()) return;
    setStep(1);
  };

  const goToConfirmation = () => {
    if (!paymentMethod) {
      setSubmitError('Selecciona un método de pago para continuar.');
      return;
    }
    setSubmitError(null);
    setStep(2);
  };

  const buildOrderSummary = (): OrderSummary => ({
    id: `DJ-${Date.now()}`,
    createdAt: new Date().toISOString(),
    customer,
    paymentMethod: paymentMethod ?? 'transfer',
    items: items.map((item) => ({ ...item })),
    subtotal,
    total: subtotal,
  });

  const handleConfirm = async () => {
    if (!termsAccepted) {
      setSubmitError('Debes aceptar los términos y condiciones.');
      return;
    }

    if (!paymentMethod) {
      setSubmitError('Selecciona un método de pago.');
      return;
    }

    setSubmitError(null);
    setSubmitting(true);

    const summary = buildOrderSummary();
    const shouldSendEmail = Boolean(import.meta.env.VITE_EMAIL_ENDPOINT);

    try {
      setOrderCompleted(true);
      if (shouldSendEmail) {
        await sendOrderEmail({ summary });
      }
      clearCart();
      navigate('/order-success', { state: { order: summary } });
    } catch (error) {
      console.error('No se pudo enviar la confirmación de pedido:', error);
      clearCart();
      navigate('/order-success', { state: { order: summary } });
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(value);

  const stepLabels = ['Información', 'Pago', 'Confirmación'];

  return (
    <motion.section
      className="bg-background text-foreground"
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
    >
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-12 flex flex-col gap-4">
          <p className="text-xs uppercase tracking-[0.45em] text-muted-foreground">Checkout</p>
          <h1 className="text-4xl font-light tracking-tight md:text-5xl">Completa tu pedido</h1>
          <div className="flex flex-wrap gap-3 text-[0.62rem] uppercase tracking-[0.4em] text-muted-foreground">
            {stepLabels.map((label, index) => (
              <span key={label} className={index === step ? 'text-foreground' : ''}>
                {index + 1}. {label}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-10">
            {step === 0 && (
              <div className="space-y-8">
                <header className="space-y-2">
                  <div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-muted-foreground">
                    <User className="h-4 w-4" />
                    Información del cliente
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Completa los datos para coordinar la entrega personalizada de tu pieza.
                  </p>
                </header>

                <form className="grid gap-6 md:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
                  <div className="space-y-2">
                    <label className="text-[0.58rem] uppercase tracking-[0.35em]" htmlFor="firstName">
                      Nombre
                    </label>
                    <input
                      id="firstName"
                      value={customer.firstName}
                      onChange={(event) => handleCustomerChange('firstName', event.target.value)}
                      className="w-full border px-4 py-3 text-sm tracking-wide"
                      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--cardBg)', color: 'var(--text)' }}
                      placeholder="Nombre"
                    />
                    {errors.firstName ? <p className="text-xs text-red-500">{errors.firstName}</p> : null}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[0.58rem] uppercase tracking-[0.35em]" htmlFor="lastName">
                      Apellido
                    </label>
                    <input
                      id="lastName"
                      value={customer.lastName}
                      onChange={(event) => handleCustomerChange('lastName', event.target.value)}
                      className="w-full border px-4 py-3 text-sm tracking-wide"
                      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--cardBg)', color: 'var(--text)' }}
                      placeholder="Apellido"
                    />
                    {errors.lastName ? <p className="text-xs text-red-500">{errors.lastName}</p> : null}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[0.58rem] uppercase tracking-[0.35em]" htmlFor="email">
                      Correo electrónico
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={customer.email}
                      onChange={(event) => handleCustomerChange('email', event.target.value)}
                      className="w-full border px-4 py-3 text-sm tracking-wide"
                      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--cardBg)', color: 'var(--text)' }}
                      placeholder="nombre@correo.com"
                    />
                    {errors.email ? <p className="text-xs text-red-500">{errors.email}</p> : null}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[0.58rem] uppercase tracking-[0.35em]" htmlFor="phone">
                      Teléfono
                    </label>
                    <input
                      id="phone"
                      value={customer.phone}
                      onChange={(event) => handleCustomerChange('phone', event.target.value)}
                      className="w-full border px-4 py-3 text-sm tracking-wide"
                      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--cardBg)', color: 'var(--text)' }}
                      placeholder="+51 999 999 999"
                    />
                    {errors.phone ? <p className="text-xs text-red-500">{errors.phone}</p> : null}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[0.58rem] uppercase tracking-[0.35em]" htmlFor="address">
                      Dirección completa
                    </label>
                    <input
                      id="address"
                      value={customer.address}
                      onChange={(event) => handleCustomerChange('address', event.target.value)}
                      className="w-full border px-4 py-3 text-sm tracking-wide"
                      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--cardBg)', color: 'var(--text)' }}
                      placeholder="Calle, número, departamento"
                    />
                    {errors.address ? <p className="text-xs text-red-500">{errors.address}</p> : null}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[0.58rem] uppercase tracking-[0.35em]" htmlFor="city">
                      Ciudad
                    </label>
                    <input
                      id="city"
                      value={customer.city}
                      onChange={(event) => handleCustomerChange('city', event.target.value)}
                      className="w-full border px-4 py-3 text-sm tracking-wide"
                      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--cardBg)', color: 'var(--text)' }}
                      placeholder="Ciudad"
                    />
                    {errors.city ? <p className="text-xs text-red-500">{errors.city}</p> : null}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[0.58rem] uppercase tracking-[0.35em]" htmlFor="postalCode">
                      Código postal
                    </label>
                    <input
                      id="postalCode"
                      value={customer.postalCode}
                      onChange={(event) => handleCustomerChange('postalCode', event.target.value)}
                      className="w-full border px-4 py-3 text-sm tracking-wide"
                      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--cardBg)', color: 'var(--text)' }}
                      placeholder="Código postal"
                    />
                    {errors.postalCode ? <p className="text-xs text-red-500">{errors.postalCode}</p> : null}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[0.58rem] uppercase tracking-[0.35em]" htmlFor="reference">
                      Referencia (opcional)
                    </label>
                    <input
                      id="reference"
                      value={customer.reference ?? ''}
                      onChange={(event) => handleCustomerChange('reference', event.target.value)}
                      className="w-full border px-4 py-3 text-sm tracking-wide"
                      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--cardBg)', color: 'var(--text)' }}
                      placeholder="Referencia adicional"
                    />
                  </div>
                </form>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.35em] border-b border-transparent hover:border-[var(--primary)]"
                    style={{ color: 'var(--textSecondary)' }}
                  >
                    <ArrowLeft className="h-4 w-4" /> Volver
                  </button>
                  <button
                    type="button"
                    onClick={goToPayment}
                    className="inline-flex items-center gap-3 border px-6 py-3 text-[0.62rem] uppercase tracking-[0.35em] transition-colors duration-300 hover:bg-[var(--primary)] hover:text-[var(--bg)]"
                    style={{ color: 'var(--text)', borderColor: 'var(--border)' }}
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-8">
                <header className="space-y-2">
                  <div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    Método de pago
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Selecciona cómo deseas completar el pago de tu pieza exclusiva.
                  </p>
                </header>

                <div className="grid gap-6">
                  {paymentOptions.map((option) => {
                    const isActive = paymentMethod === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setPaymentMethod(option.value);
                          setSubmitError(null);
                        }}
                        className={`text-left border px-6 py-5 transition-all duration-300 ${
                          isActive ? 'border-[var(--primary)]' : ''
                        }`}
                        style={{
                          borderColor: isActive ? 'var(--primary)' : 'var(--border)',
                          backgroundColor: 'var(--cardBg)',
                          color: 'var(--text)',
                        }}
                      >
                        <div className="flex items-center justify-between gap-6">
                          <div>
                            <p className="text-sm uppercase tracking-[0.3em]">{option.title}</p>
                            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{option.description}</p>
                          </div>
                          {isActive ? <CheckCircle className="h-5 w-5" style={{ color: 'var(--primary)' }} /> : null}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {submitError ? <p className="text-sm text-red-500">{submitError}</p> : null}

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="inline-flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.35em] border-b border-transparent hover:border-[var(--primary)]"
                    style={{ color: 'var(--textSecondary)' }}
                  >
                    <ArrowLeft className="h-4 w-4" /> Atrás
                  </button>
                  <button
                    type="button"
                    onClick={goToConfirmation}
                    className="inline-flex items-center gap-3 border px-6 py-3 text-[0.62rem] uppercase tracking-[0.35em] transition-colors duration-300 hover:bg-[var(--primary)] hover:text-[var(--bg)]"
                    style={{ color: 'var(--text)', borderColor: 'var(--border)' }}
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <header className="space-y-2">
                  <div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-muted-foreground">
                    <Home className="h-4 w-4" />
                    Confirmación
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Verifica los datos antes de enviar tu pedido. Podrás contactarnos luego por WhatsApp si lo deseas.
                  </p>
                </header>

                <div className="space-y-6 border p-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--cardBg)' }}>
                  <div>
                    <p className="text-[0.62rem] uppercase tracking-[0.3em] text-muted-foreground">Cliente</p>
                    <div className="mt-3 text-sm leading-relaxed">
                      <p>{customer.firstName} {customer.lastName}</p>
                      <p>{customer.email}</p>
                      <p>{customer.phone}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[0.62rem] uppercase tracking-[0.3em] text-muted-foreground">Entrega</p>
                    <div className="mt-3 text-sm leading-relaxed">
                      <p>{customer.address}</p>
                      <p>{customer.city} {customer.postalCode}</p>
                      {customer.reference ? <p>Referencia: {customer.reference}</p> : null}
                    </div>
                  </div>

                  <div>
                    <p className="text-[0.62rem] uppercase tracking-[0.3em] text-muted-foreground">Pago</p>
                    <p className="mt-3 text-sm leading-relaxed">
                      {paymentMethod === 'yape' ? 'Yape' : 'Transferencia bancaria'}
                    </p>
                  </div>

                  <div>
                    <p className="text-[0.62rem] uppercase tracking-[0.3em] text-muted-foreground">Piezas seleccionadas</p>
                    <ul className="mt-3 space-y-3 text-sm leading-relaxed">
                      {items.map((item) => (
                        <li key={item.id} className="flex items-center justify-between">
                          <span>
                            {item.name} · x{item.quantity}
                          </span>
                          <span>{formatPrice(item.price * item.quantity)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(event) => setTermsAccepted(event.target.checked)}
                    className="mt-0.5"
                  />
                  <label htmlFor="terms" className="leading-relaxed text-muted-foreground">
                    Acepto los términos y condiciones de compra y autorizo la gestión personalizada de este pedido.
                  </label>
                </div>

                {submitError ? <p className="text-sm text-red-500">{submitError}</p> : null}

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.35em] border-b border-transparent hover:border-[var(--primary)]"
                    style={{ color: 'var(--textSecondary)' }}
                  >
                    <ArrowLeft className="h-4 w-4" /> Atrás
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={submitting}
                    className="inline-flex items-center gap-3 border px-6 py-3 text-[0.62rem] uppercase tracking-[0.35em] transition-colors duration-300 hover:bg-[var(--primary)] hover:text-[var(--bg)] disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ color: 'var(--text)', borderColor: 'var(--border)' }}
                  >
                    {submitting ? 'Confirmando…' : 'Confirmar pedido'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6 border p-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--cardBg)' }}>
            <div className="space-y-2">
              <p className="text-[0.62rem] uppercase tracking-[0.3em] text-muted-foreground">Resumen</p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>Piezas ({items.length})</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Entrega</span>
                  <span>A coordinar</span>
                </div>
              </div>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between text-sm uppercase tracking-[0.35em]">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </aside>
        </div>
      </div>
    </motion.section>
  );
}
