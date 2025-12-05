import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const OrderSuccess = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!orderId) return;
        // Here you could fetch order details if needed
    }, [orderId]);

    const handleCopy = () => {
        if (orderId) {
            navigator.clipboard.writeText(orderId);
            setCopied(true);
            toast.success('ID de pedido copiado');
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                <div className="max-w-md w-full space-y-6">
                    <div className="flex justify-center">
                        <CheckCircle2 className="w-20 h-20 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-display font-bold">¡Gracias por tu compra!</h1>
                    <p className="text-muted-foreground">
                        Tu pedido ha sido recibido correctamente. Te enviaremos un correo con los detalles.
                    </p>

                    {orderId && (
                        <div className="bg-card border border-border p-4 rounded-lg space-y-2">
                            <p className="text-sm text-muted-foreground uppercase tracking-wider">Tu número de pedido</p>
                            <div className="flex items-center justify-center gap-2">
                                <code className="bg-background px-3 py-1 rounded border border-border font-mono text-lg">
                                    {orderId}
                                </code>
                                <Button variant="ghost" size="icon" onClick={handleCopy}>
                                    <Copy className="w-4 h-4" />
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Guarda este ID para rastrear tu pedido.
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        <Link to={`/tracking?orderId=${orderId}`}>
                            <Button className="w-full" variant="outline">
                                Rastrear Pedido
                            </Button>
                        </Link>
                        <Link to="/">
                            <Button className="w-full">
                                Volver a la tienda
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default OrderSuccess;
