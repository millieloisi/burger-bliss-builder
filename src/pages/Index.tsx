import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import heroBg from '@/assets/hero-bg.jpg';
import { ChefHat, Clock, Award } from 'lucide-react';

const Index = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section 
        className="relative h-[600px] flex items-center justify-center text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto px-4 z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            {t('hero.title')}
          </h1>
          <p className="text-2xl text-white mb-2">
            {t('hero.subtitle')}
          </p>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            {t('hero.description')}
          </p>
          <Link to="/menu">
            <Button size="lg" className="bg-hero text-hero-foreground hover:bg-hero/90 text-lg px-8 py-6">
              {t('hero.cta')}
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <ChefHat className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Handcrafted Quality</h3>
              <p className="text-muted-foreground">
                Every burger is made fresh to order with premium ingredients
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Service</h3>
              <p className="text-muted-foreground">
                Quick preparation without compromising on taste and quality
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Award Winning</h3>
              <p className="text-muted-foreground">
                Recognized as one of the best burger joints in the region
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">About BurgerTIC</h2>
            <p className="text-lg text-muted-foreground mb-4">
              Founded with a passion for authentic American cuisine, BurgerTIC brings you the finest burgers crafted with love and expertise. 
              Our commitment to quality ingredients and exceptional service has made us a favorite destination for burger lovers.
            </p>
            <p className="text-lg text-muted-foreground">
              From classic cheeseburgers to creative specialty combinations, every item on our menu is designed to deliver an unforgettable dining experience. 
              Visit us today and taste the difference!
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-xl mb-8">Experience the best burgers in town</p>
          <Link to="/menu">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              View Our Menu
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
