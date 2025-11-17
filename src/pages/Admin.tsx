import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChefHat, ShoppingBag, Ticket, Package } from 'lucide-react';

const Admin = () => {
  const { t } = useTranslation();
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          Loading...
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">{t('admin.title')}</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <ChefHat className="w-8 h-8 text-primary mb-2" />
              <CardTitle>{t('admin.dishes')}</CardTitle>
              <CardDescription>Manage menu items</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Create, edit, and delete dishes from your menu
              </p>
              <Button className="w-full">
                Manage Dishes
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <ShoppingBag className="w-8 h-8 text-primary mb-2" />
              <CardTitle>{t('admin.orders')}</CardTitle>
              <CardDescription>View and manage orders</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Track orders and update their status
              </p>
              <Button className="w-full">
                View Orders
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Ticket className="w-8 h-8 text-primary mb-2" />
              <CardTitle>{t('admin.coupons')}</CardTitle>
              <CardDescription>Manage discount coupons</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Create and manage promotional coupons
              </p>
              <Button className="w-full">
                Manage Coupons
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Package className="w-8 h-8 text-primary mb-2" />
              <CardTitle>{t('admin.ingredients')}</CardTitle>
              <CardDescription>Manage ingredients</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Add and edit available ingredients
              </p>
              <Button className="w-full">
                Manage Ingredients
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              <Button>{t('admin.createDish')}</Button>
              <Button>{t('admin.createCoupon')}</Button>
              <Button variant="outline">View Reports</Button>
              <Button variant="outline">Export Data</Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 p-6 bg-muted rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Admin Panel Features</h2>
          <p className="text-muted-foreground">
            This is a basic admin dashboard. Full CRUD functionality for dishes, orders, coupons, and ingredients can be accessed through the backend database or expanded in future updates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Admin;
