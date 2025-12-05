import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, CheckCircle2, Clock, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getSupabaseClient } from '@/lib/supabase';
import { Order, OrderStatus } from '@/types/order';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const STEPS: { status: OrderStatus; label: string; icon: any }[] = [
    { status: 'received', label: 'Pedido Recibido', icon: Package },
    { status: 'paid', label: 'Pago Confirmado', icon: CheckCircle2 },
    { status: 'preparing', label: 'En Preparación', icon: Clock },
    { status: 'sent', label: 'Enviado', icon: Truck },
];

const OrderTracking = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialOrderId = searchParams.get('orderId') || '';
    const [orderId, setOrderId] = useState(initialOrderId);
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOrder = async (id: string) => {
        if (!id) return;
        setLoading(true);
        setError(null);
        const client = await getSupabaseClient();
        if (!client) {
            setError('Error de conexión');
            setLoading(false);
            return;
        }

        const { data, error } = await client
            .from('orders')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            setError('No se encontró el pedido. Verifica el ID.');
            setOrder(null);
        } else {
            setOrder(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (initialOrderId) {
            fetchOrder(initialOrderId);
        }
    }, [initialOrderId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchParams({ orderId });
        fetchOrder(orderId);
    };

    const getCurrentStepIndex = (status: OrderStatus) => {
        return STEPS.findIndex((step) => step.status === status);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
                <h1 className="text-3xl font-display font-bold text-center mb-8">Rastrea tu Pedido</h1>

                <form onSubmit={handleSubmit} className="flex gap-2 mb-12 max-w-md mx-auto">
                    <Input
                        placeholder="Ingresa tu ID de pedido"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        className="font-mono"
                    />
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Buscando...' : <Search className="w-4 h-4" />}
                    </Button>
                </form>

                {error && (
                    <div className="text-center text-destructive mb-8 bg-destructive/10 p-4 rounded-lg">
                        {error}
                    </div>
                )}

                {order && (
                    <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-lg">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-border">
                            <div>
                                <p className="text-sm text-muted-foreground uppercase tracking-wider">Pedido</p>
                                <p className="font-mono text-lg font-bold">{order.id}</p>
                            </div>
                            <div className="mt-2 md:mt-0 text-right">
                                <p className="text-sm text-muted-foreground">Fecha</p>
                                <p className="font-medium">
                                    {format(new Date(order.created_at), "d 'de' MMMM, yyyy", { locale: es })}
                                </p>
                            </div>
                        </div>

                        <div className="relative">
                            {/* Progress Bar Background */}
                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border md:left-0 md:right-0 md:top-4 md:h-0.5 md:w-full" />

                            {/* Steps */}
                            <div className="flex flex-col md:flex-row justify-between relative gap-8 md:gap-0">
                                {STEPS.map((step, index) => {
                                    const currentStepIndex = getCurrentStepIndex(order.status);
                                    const isCompleted = index <= currentStepIndex;
                                    const isCurrent = index === currentStepIndex;
                                    const Icon = step.icon;

                                    return (
                                        <div key={step.status} className="flex md:flex-col items-center gap-4 md:gap-2 z-10 bg-card md:bg-transparent">
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${isCompleted
                                                        ? 'bg-primary border-primary text-primary-foreground'
                                                        : 'bg-background border-muted text-muted-foreground'
                                                    }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <div className="md:text-center">
                                                <p
                                                    className={`text-sm font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'
                                                        }`}
                                                >
                                                    {step.label}
                                                </p>
                                                {isCurrent && (
                                                    <p className="text-xs text-primary animate-pulse">En curso</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-12 pt-6 border-t border-border flex justify-between items-center">
                            <span className="text-muted-foreground">Total</span>
                            <span className="text-2xl font-display font-bold">
                                {new Intl.NumberFormat('es-PE', {
                                    style: 'currency',
                                    currency: 'PEN',
                                }).format(order.total)}
                            </span>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default OrderTracking;
