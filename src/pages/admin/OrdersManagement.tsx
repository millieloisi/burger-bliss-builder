import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import { Badge } from '@/components/ui/badge';

const OrdersManagement = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles (nombre, apellido),
          order_items (
            *,
            dishes (nombre)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      toast.error('Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: 'pendiente' | 'aceptado' | 'en_camino' | 'entregado') => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ estado: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      toast.success('Order status updated');
      fetchOrders();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente': return 'bg-yellow-500';
      case 'aceptado': return 'bg-blue-500';
      case 'en_camino': return 'bg-purple-500';
      case 'entregado': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pendiente': return 'Pending';
      case 'aceptado': return 'Accepted';
      case 'en_camino': return 'On the way';
      case 'entregado': return 'Delivered';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{t('admin.orders')}</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <div>
                    <div className="text-xl font-bold">Order #{order.numero_orden}</div>
                    <div className="text-sm text-muted-foreground">
                      {order.profiles?.nombre} {order.profiles?.apellido}
                    </div>
                  </div>
                  <Badge className={getStatusColor(order.estado)}>
                    {getStatusLabel(order.estado)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Type:</strong> {order.tipo_entrega}</p>
                      {order.numero_mesa && <p><strong>Table:</strong> {order.numero_mesa}</p>}
                      {order.direccion_entrega && <p><strong>Address:</strong> {order.direccion_entrega}</p>}
                    </div>
                    <div>
                      <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
                      <p><strong>Total:</strong> ${order.total}</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold mb-2">Items:</p>
                    <ul className="list-disc list-inside text-sm">
                      {order.order_items?.map((item: any) => (
                        <li key={item.id}>
                          {item.cantidad}x {item.dishes?.nombre} - ${item.precio_unitario}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <Select
                      value={order.estado}
                      onValueChange={(value: any) => updateOrderStatus(order.id, value)}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendiente">Pending</SelectItem>
                        <SelectItem value="aceptado">Accepted</SelectItem>
                        <SelectItem value="en_camino">On the way</SelectItem>
                        <SelectItem value="entregado">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersManagement;
