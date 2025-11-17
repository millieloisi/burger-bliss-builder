-- Create enum types
CREATE TYPE public.app_role AS ENUM ('admin', 'customer');
CREATE TYPE public.dish_type AS ENUM ('principal', 'combo', 'postre', 'bebida');
CREATE TYPE public.order_status AS ENUM ('pendiente', 'aceptado', 'en_camino', 'entregado');
CREATE TYPE public.order_type AS ENUM ('delivery', 'takeaway', 'dine_in');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Create dishes table (platos)
CREATE TABLE public.dishes (
  id SERIAL PRIMARY KEY,
  tipo dish_type NOT NULL,
  nombre VARCHAR(70) NOT NULL,
  precio INTEGER NOT NULL,
  descripcion VARCHAR(400),
  imagen_url TEXT,
  disponible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ingredients table
CREATE TABLE public.ingredients (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  precio_extra INTEGER DEFAULT 0,
  disponible BOOLEAN DEFAULT true
);

-- Create dish_ingredients table (for customizable items)
CREATE TABLE public.dish_ingredients (
  id SERIAL PRIMARY KEY,
  dish_id INTEGER REFERENCES public.dishes(id) ON DELETE CASCADE,
  ingredient_id INTEGER REFERENCES public.ingredients(id) ON DELETE CASCADE,
  incluido BOOLEAN DEFAULT true,
  UNIQUE (dish_id, ingredient_id)
);

-- Create coupons table
CREATE TABLE public.coupons (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(20) UNIQUE NOT NULL,
  descuento_porcentaje INTEGER CHECK (descuento_porcentaje >= 0 AND descuento_porcentaje <= 100),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table (pedidos)
CREATE TABLE public.orders (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  estado order_status DEFAULT 'pendiente',
  tipo_entrega order_type DEFAULT 'takeaway',
  numero_mesa INTEGER,
  direccion_entrega TEXT,
  total INTEGER NOT NULL,
  cupon_id INTEGER REFERENCES public.coupons(id),
  numero_orden VARCHAR(10) UNIQUE NOT NULL,
  qr_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table (platos x pedidos)
CREATE TABLE public.order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  dish_id INTEGER REFERENCES public.dishes(id) NOT NULL,
  cantidad INTEGER NOT NULL DEFAULT 1,
  precio_unitario INTEGER NOT NULL,
  personalizaciones JSONB
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dish_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create trigger function for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre, apellido)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre', 'Usuario'),
    COALESCE(NEW.raw_user_meta_data->>'apellido', 'Nuevo')
  );
  
  -- Assign customer role by default
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies for dishes (public read, admin write)
CREATE POLICY "Anyone can view available dishes"
  ON public.dishes FOR SELECT
  USING (disponible = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert dishes"
  ON public.dishes FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update dishes"
  ON public.dishes FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete dishes"
  ON public.dishes FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for ingredients
CREATE POLICY "Anyone can view available ingredients"
  ON public.ingredients FOR SELECT
  USING (disponible = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage ingredients"
  ON public.ingredients FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for dish_ingredients
CREATE POLICY "Anyone can view dish ingredients"
  ON public.dish_ingredients FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage dish ingredients"
  ON public.dish_ingredients FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for coupons
CREATE POLICY "Anyone can view active coupons"
  ON public.coupons FOR SELECT
  USING (activo = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage coupons"
  ON public.coupons FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create their own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete orders"
  ON public.orders FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for order_items
CREATE POLICY "Users can view their order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND (orders.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Users can create order items for their orders"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_number TEXT;
  done BOOLEAN := FALSE;
BEGIN
  WHILE NOT done LOOP
    new_number := LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    done := NOT EXISTS (SELECT 1 FROM public.orders WHERE numero_orden = new_number);
  END LOOP;
  RETURN new_number;
END;
$$;