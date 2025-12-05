import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Order, OrderStatus } from '@/types/order';
import { getSupabaseClient } from '@/lib/supabase';
import { toast } from 'sonner';

const STATUS_LABELS: Record<OrderStatus, string> = {
    received: 'Recibido',
    paid: 'Pagado',
    preparing: 'En preparación',
    sent: 'Enviado',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
    received: 'bg-gray-500',
    paid: 'bg-blue-500',
    preparing: 'bg-yellow-500',
    sent: 'bg-green-500',
};

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export function OrdersTable() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        const client = await getSupabaseClient();
        if (!client) return;

        const { data, error } = await client
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching orders:', error);
            toast.error('Error al cargar pedidos');
        } else {
            setOrders(data || []);
        }
        setLoading(false);
    };

    const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
        const client = await getSupabaseClient();
        if (!client) return;

        // Optimistic update
        setOrders((prev) =>
            prev.map((order) =>
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        );

        const { data, error } = await client
            .from('orders')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', orderId)
            .select()
            .single();

        if (error || !data) {
            console.error('Error updating status:', error);
            toast.error('Error al actualizar estado. Verifique permisos.');
            // Revert optimistic update
            fetchOrders();
        } else {
            toast.success('Estado actualizado');
        }
    };

    if (loading) {
        return <div className="text-center py-10">Cargando pedidos...</div>;
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID Pedido</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center h-24">
                                No hay pedidos registrados.
                            </TableCell>
                        </TableRow>
                    ) : (
                        orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}...</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{order.customer_name}</span>
                                        <span className="text-xs text-muted-foreground">{order.customer_email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {format(new Date(order.created_at), "d 'de' MMMM, yyyy", { locale: es })}
                                </TableCell>
                                <TableCell>
                                    {new Intl.NumberFormat('es-PE', {
                                        style: 'currency',
                                        currency: 'PEN',
                                    }).format(order.total)}
                                </TableCell>
                                <TableCell>
                                    <Badge className={`${STATUS_COLORS[order.status]} hover:${STATUS_COLORS[order.status]}`}>
                                        {STATUS_LABELS[order.status]}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Select
                                            value={order.status}
                                            onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
                                        >
                                            <SelectTrigger className="w-[130px]">
                                                <SelectValue placeholder="Estado" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                                                    <SelectItem key={key} value={key}>
                                                        {label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle>Detalles del Pedido</DialogTitle>
                                                    <DialogDescription>
                                                        ID: {order.id}
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <h4 className="font-semibold text-sm">Cliente</h4>
                                                            <p className="text-sm">{order.customer_name}</p>
                                                            <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                                                            <p className="text-sm text-muted-foreground">{order.customer_phone || 'Sin teléfono'}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-sm">Pago</h4>
                                                            <p className="text-sm capitalize">{order.payment_method || 'No especificado'}</p>
                                                            <p className="text-sm font-bold mt-1">
                                                                {new Intl.NumberFormat('es-PE', {
                                                                    style: 'currency',
                                                                    currency: 'PEN',
                                                                }).format(order.total)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h4 className="font-semibold text-sm">Dirección de Envío</h4>
                                                        <p className="text-sm whitespace-pre-wrap">{order.customer_address || 'Sin dirección'}</p>
                                                    </div>

                                                    {order.notes && (
                                                        <div>
                                                            <h4 className="font-semibold text-sm">Notas</h4>
                                                            <p className="text-sm italic text-muted-foreground">{order.notes}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
