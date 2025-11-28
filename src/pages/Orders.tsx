import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

interface Order {
  id: number;
  numero_orden: string;
  fecha: string;
  estado: string;
  tipo_entrega: string;
  total: number;
  qr_code: string | null;
  order_items: {
    cantidad: number;
    precio_unitario: number;
    dishes: {
      nombre: string;
    };
  }[];
}

const Orders = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/pedidos/usuario');
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'bg-warning';
      case 'aceptado': return 'bg-blue-500';
      case 'en_camino': return 'bg-purple-500';
      case 'entregado': return 'bg-success';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">{t('nav.orders')}</h1>

        {loading ? (
          <div className="text-center py-12">Loading orders...</div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              You haven't placed any orders yet
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Order #{order.numero_orden}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(order.fecha), 'PPP p')}
                      </p>
                    </div>
                    <Badge className={getStatusColor(order.estado)}>
                      {order.estado.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {order.order_items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>
                          {item.dishes.nombre} x {item.cantidad}
                        </span>
                        <span>${item.precio_unitario * item.cantidad}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Total:</span>
                      <span>${order.total}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {order.tipo_entrega.replace('_', ' ').toUpperCase()}
                    </div>
                    {order.qr_code && (
                      <div className="pt-4">
                        <img 
                          src={order.qr_code} 
                          alt="Order QR"
                          className="w-32 h-32"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
