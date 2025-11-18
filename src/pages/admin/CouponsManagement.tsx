import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { Badge } from '@/components/ui/badge';

const CouponsManagement = () => {
  const { t } = useTranslation();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const [formData, setFormData] = useState({
    codigo: '',
    descuento_porcentaje: '',
    activo: true,
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoupons(data || []);
    } catch (error: any) {
      toast.error('Error loading coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const couponData = {
        codigo: formData.codigo.toUpperCase(),
        descuento_porcentaje: parseInt(formData.descuento_porcentaje),
        activo: formData.activo,
      };

      if (editingCoupon) {
        const { error } = await supabase
          .from('coupons')
          .update(couponData)
          .eq('id', editingCoupon.id);

        if (error) throw error;
        toast.success('Coupon updated successfully');
      } else {
        const { error } = await supabase
          .from('coupons')
          .insert([couponData]);

        if (error) throw error;
        toast.success('Coupon created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchCoupons();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (coupon: any) => {
    setEditingCoupon(coupon);
    setFormData({
      codigo: coupon.codigo,
      descuento_porcentaje: coupon.descuento_porcentaje.toString(),
      activo: coupon.activo,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Coupon deleted successfully');
      fetchCoupons();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const toggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .update({ activo: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success('Coupon status updated');
      fetchCoupons();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      codigo: '',
      descuento_porcentaje: '',
      activo: true,
    });
    setEditingCoupon(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{t('admin.coupons')}</h1>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Coupon
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo">Code</Label>
                  <Input
                    id="codigo"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                    required
                    placeholder="DISCOUNT20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descuento">Discount Percentage</Label>
                  <Input
                    id="descuento"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.descuento_porcentaje}
                    onChange={(e) => setFormData({ ...formData, descuento_porcentaje: e.target.value })}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="activo"
                    checked={formData.activo}
                    onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="activo">Active</Label>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Saving...' : editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((coupon) => (
            <Card key={coupon.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span className="text-xl font-mono">{coupon.codigo}</span>
                  <Badge variant={coupon.activo ? "default" : "secondary"}>
                    {coupon.activo ? 'Active' : 'Inactive'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary mb-4">
                  {coupon.descuento_porcentaje}% OFF
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(coupon)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => toggleActive(coupon.id, coupon.activo)}
                  >
                    {coupon.activo ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(coupon.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CouponsManagement;
