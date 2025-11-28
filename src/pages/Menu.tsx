import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Dish {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string | null;
  tipo: 'principal' | 'combo' | 'postre' | 'bebida';
  disponible: boolean;
}

const Menu = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [cart, setCart] = useState<{ dish: Dish; quantity: number }[]>([]);

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    try {
      const res = await api.get('/platos');
      const data = res.data;
      setDishes(Array.isArray(data) ? data.filter((d: any) => d.disponible) : []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const filteredDishes = selectedType === 'all' 
    ? dishes 
    : dishes.filter(dish => dish.tipo === selectedType);

  const addToCart = (dish: Dish) => {
    const existing = cart.find(item => item.dish.id === dish.id);
    if (existing) {
      setCart(cart.map(item => 
        item.dish.id === dish.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { dish, quantity: 1 }]);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.dish.precio * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">{t('menu.title')}</h1>
          {cart.length > 0 && (
            <Button 
              onClick={() => navigate('/order', { state: { cart } })}
              size="lg"
              className="relative"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Order Now (${cartTotal})
              <Badge className="ml-2 bg-secondary text-secondary-foreground">
                {cartItemCount}
              </Badge>
            </Button>
          )}
        </div>

        <Tabs defaultValue="all" value={selectedType} onValueChange={setSelectedType}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="all">{t('menu.all')}</TabsTrigger>
            <TabsTrigger value="principal">{t('menu.principal')}</TabsTrigger>
            <TabsTrigger value="combo">{t('menu.combo')}</TabsTrigger>
            <TabsTrigger value="postre">{t('menu.postre')}</TabsTrigger>
            <TabsTrigger value="bebida">{t('menu.bebida')}</TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">Loading...</div>
            ) : filteredDishes.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No dishes available
              </div>
            ) : (
              filteredDishes.map((dish) => (
                <Card key={dish.id} className="overflow-hidden">
                  {dish.imagen_url && (
                    <div className="aspect-video bg-muted">
                      <img 
                        src={dish.imagen_url} 
                        alt={dish.nombre}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{dish.nombre}</CardTitle>
                    <CardDescription>{dish.descripcion}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-primary">
                      ${dish.precio}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      onClick={() => addToCart(dish)}
                    >
                      {t('menu.addToCart')}
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Menu;
