import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "@/lib/i18n";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Menu from "./pages/Menu";
import Order from "./pages/Order";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";
import DishesManagement from "./pages/admin/DishesManagement";
import OrdersManagement from "./pages/admin/OrdersManagement";
import CouponsManagement from "./pages/admin/CouponsManagement";
import IngredientsManagement from "./pages/admin/IngredientsManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/order" element={<Order />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/dishes" element={<DishesManagement />} />
              <Route path="/admin/orders" element={<OrdersManagement />} />
              <Route path="/admin/coupons" element={<CouponsManagement />} />
              <Route path="/admin/ingredients" element={<IngredientsManagement />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
