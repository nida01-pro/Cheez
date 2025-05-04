import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import Checkout from "@/pages/Checkout";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { useAuth } from "./context/AuthContext";

// Component that requires access to auth context
function AuthenticatedRoutes() {
  const { isAdmin } = useAuth();
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/login" component={Login} />
      {isAdmin && <Route path="/admin" component={Admin} />}
      <Route component={NotFound} />
    </Switch>
  );
}

// Main router wraps routes with all necessary providers
function MainRouter() {
  return (
    <AuthProvider>
      <CartProvider>
        <AuthenticatedRoutes />
      </CartProvider>
    </AuthProvider>
  );
}

function App() {
  return (
    <>
      <MainRouter />
      <Toaster />
    </>
  );
}

export default App;
