import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { getSupabaseClient } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2, CreditCard, Banknote, Smartphone } from 'lucide-react';

const Checkout = () => {
    const { items, subtotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        notes: '',
        paymentMethod: 'transfer'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (items.length === 0) {
            toast.error("Tu carrito está vacío");
            return;
        }

        setLoading(true);
        const client = await getSupabaseClient();

        if (!client) {
            toast.error("Error de configuración de base de datos");
            setLoading(false);
            return;
        }

        try {
            // 1. Create Order
            const { data: orderData, error: orderError } = await client
                .from('orders')
                .insert({
                    customer_email: formData.email,
                    customer_name: formData.name,
                    customer_phone: formData.phone,
                    customer_address: formData.address,
                    notes: formData.notes,
                    total: subtotal,
                    subtotal: subtotal, // Assuming subtotal is same as total for now (no tax/shipping logic yet)
                    payment_method: formData.paymentMethod,
                    status: 'received'
                })
                .select()
                .single();

            if (orderError || !orderData) throw orderError;

            // 2. Create Order Items
            const orderItems = items.map(item => ({
                order_id: orderData.id,
                product_id: item.id,
                product_name: item.name,
                quantity: item.quantity,
                price: item.price
            }));

            const { error: itemsError } = await client
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // 3. Success
            clearCart();
            navigate(`/order-success?orderId=${orderData.id}`);
            toast.success("¡Pedido creado exitosamente!");

        } catch (error) {
            console.error("Checkout error:", error);
            toast.error("Hubo un error al procesar el pedido. Inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center p-4">
                    <h1 className="text-2xl font-display mb-4">Tu carrito está vacío</h1>
                    <Button onClick={() => navigate('/')}>Volver a la tienda</Button>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
                <h1 className="text-3xl md:text-4xl font-display mb-8 text-center">Finalizar Compra</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Left Column: Form */}
                    <div className="space-y-8">
                        <div className="bg-card border border-border p-6 rounded-lg">
                            <h2 className="text-xl font-display mb-6">Información de Contacto y Envío</h2>
                            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nombre Completo *</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Juan Pérez"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Teléfono *</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+51 999 999 999"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Correo Electrónico *</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="juan@ejemplo.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Dirección de Envío *</Label>
                                    <Textarea
                                        id="address"
                                        name="address"
                                        required
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Calle, Número, Distrito, Provincia, País"
                                        className="min-h-[80px]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notas del Pedido (Opcional)</Label>
                                    <Textarea
                                        id="notes"
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        placeholder="Instrucciones especiales de entrega..."
                                    />
                                </div>
                            </form>
                        </div>

                        <div className="bg-card border border-border p-6 rounded-lg">
                            <h2 className="text-xl font-display mb-6">Método de Pago</h2>
                            <RadioGroup
                                defaultValue="transfer"
                                onValueChange={(val) => setFormData(prev => ({ ...prev, paymentMethod: val }))}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                <div>
                                    <RadioGroupItem value="transfer" id="transfer" className="peer sr-only" />
                                    <Label
                                        htmlFor="transfer"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                    >
                                        <Banknote className="mb-3 h-6 w-6" />
                                        Transferencia
                                    </Label>
                                </div>
                                <div>
                                    <RadioGroupItem value="yape" id="yape" className="peer sr-only" />
                                    <Label
                                        htmlFor="yape"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                    >
                                        <Smartphone className="mb-3 h-6 w-6" />
                                        Yape
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>

                    {/* Right Column: Summary */}
                    <div className="space-y-8">
                        <div className="bg-card border border-border p-6 rounded-lg sticky top-24">
                            <h2 className="text-xl font-display mb-6">Resumen del Pedido</h2>
                            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-sm">{item.name}</h4>
                                            <p className="text-sm text-muted-foreground">Cant: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Separator className="my-4" />

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Envío</span>
                                    <span>Calculado al confirmar</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2">
                                    <span>Total</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                form="checkout-form"
                                className="w-full mt-6 btn-primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Procesando...
                                    </>
                                ) : (
                                    "Confirmar Pedido"
                                )}
                            </Button>

                            <p className="text-xs text-center text-muted-foreground mt-4">
                                Al confirmar, aceptas nuestros términos y condiciones.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Checkout;
