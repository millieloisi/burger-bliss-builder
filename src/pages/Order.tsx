import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import QRCode from 'qrcode';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Order = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const cart = location.state?.cart || [];
  const [orderType, setOrderType] = useState<'delivery' | 'takeaway' | 'dine_in'>('takeaway');
  const [tableNumber, setTableNumber] = useState('');
  const [address, setAddress] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [qrCode, setQrCode] = useState('');

  const subtotal = cart.reduce((sum: number, item: any) => sum + item.dish.precio * item.quantity, 0);
  const total = Math.round(subtotal * (1 - discount / 100));

  const applyCoupon = async () => {
    if (!couponCode) return;

    try {
      const res = await api.get(`/coupons/${encodeURIComponent(couponCode)}`);
      const data = res.data;
      if (!data || (data.descuento_porcentaje === undefined || data.descuento_porcentaje === null)) {
        toast.error('Invalid coupon code');
        return;
      }
      setDiscount(data.descuento_porcentaje);
      toast.success(`Coupon applied! ${data.descuento_porcentaje}% discount`);
    } catch (err) {
      toast.error('Invalid coupon code');
    }
  };

  const placeOrder = async () => {
    if (!user) {
      toast.error('Please login to place an order');
      navigate('/auth');
      return;
    }

    if (orderType === 'dine_in' && !tableNumber) {
      toast.error('Please enter table number');
      return;
    }

    if (orderType === 'delivery' && !address) {
      toast.error('Please enter delivery address');
      return;
    }

    setLoading(true);
    try {
      const orderNum = Math.floor(1000 + Math.random() * 9000).toString();
      const qr = await QRCode.toDataURL(`ORDER-${orderNum}`);

      const platos = cart.map((item: any) => ({ id: item.dish.id, cantidad: item.quantity }));
      const body: any = {
        platos,
        tipo_entrega: orderType,
        numero_mesa: orderType === 'dine_in' ? parseInt(tableNumber) : null,
        direccion_entrega: orderType === 'delivery' ? address : null,
        qr_code: qr
      };
      if (couponCode) body.cupon_codigo = couponCode;

      const res = await api.post('/pedidos', body);
      const created = res.data;

      setOrderNumber(created.numero_orden || orderNum);
      setQrCode(created.qr_code || qr);
      setOrderSuccess(true);
      toast.success('Order placed successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Error placing order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl mb-4">Your cart is empty</h1>
          <Button onClick={() => navigate('/menu')}>Go to Menu</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">{t('order.title')}</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Type</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={orderType} onValueChange={(value: any) => setOrderType(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery">{t('order.delivery')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="takeaway" id="takeaway" />
                    <Label htmlFor="takeaway">{t('order.takeaway')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dine_in" id="dine_in" />
                    <Label htmlFor="dine_in">{t('order.dineIn')}</Label>
                  </div>
                </RadioGroup>

                {orderType === 'dine_in' && (
                  <div className="mt-4">
                    <Label htmlFor="table">{t('order.tableNumber')}</Label>
                    <Input
                      id="table"
                      type="number"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      placeholder="Enter table number"
                    />
                  </div>
                )}

                {orderType === 'delivery' && (
                  <div className="mt-4">
                    <Label htmlFor="address">{t('order.address')}</Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter delivery address"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Coupon Code</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                  />
                  <Button onClick={applyCoupon} variant="secondary">
                    {t('order.applyCoupon')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between">
                    <span>
                      {item.dish.nombre} x {item.quantity}
                    </span>
                    <span>${item.dish.precio * item.quantity}</span>
                  </div>
                ))}
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-success">
                      <span>Discount ({discount}%):</span>
                      <span>-${Math.round(subtotal * discount / 100)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold">
                    <span>{t('order.total')}:</span>
                    <span>${total}</span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={placeOrder}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : t('order.placeOrder')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={orderSuccess} onOpenChange={setOrderSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('order.orderSuccess')}</DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t('order.orderNumber')}</p>
              <p className="text-4xl font-bold text-primary">{orderNumber}</p>
            </div>
            {qrCode && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">{t('order.pickupQR')}</p>
                <img src={qrCode} alt="Order QR Code" className="mx-auto w-48 h-48" />
              </div>
            )}
            <Button onClick={() => navigate('/orders')} className="w-full">
              View My Orders
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Order;
