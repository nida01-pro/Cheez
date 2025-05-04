import { Link, useLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import { Home, Search, ShoppingCart, User } from "lucide-react";

const MobileNavigation = () => {
  const [location] = useLocation();
  const { setIsCartOpen, items } = useCart();
  
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  // Don't show mobile navigation on admin page
  if (location.startsWith("/admin")) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] md:hidden z-40">
      <div className="flex justify-around items-center py-3">
        <Link href="/">
          <button className="flex flex-col items-center">
            <Home className={`h-5 w-5 ${location === "/" ? "text-primary" : "text-gray-500"}`} />
            <span className={`text-xs font-medium mt-1 ${location === "/" ? "text-primary" : "text-gray-500"}`}>Home</span>
          </button>
        </Link>
        
        <button className="flex flex-col items-center">
          <Search className="h-5 w-5 text-gray-500" />
          <span className="text-xs font-medium mt-1 text-gray-500">Search</span>
        </button>
        
        <button 
          className="flex flex-col items-center relative"
          onClick={() => setIsCartOpen(true)}
        >
          <ShoppingCart className="h-5 w-5 text-gray-500" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {cartCount}
            </span>
          )}
          <span className="text-xs font-medium mt-1 text-gray-500">Cart</span>
        </button>
        
        <Link href="/login">
          <button className="flex flex-col items-center">
            <User className={`h-5 w-5 ${location === "/login" ? "text-primary" : "text-gray-500"}`} />
            <span className={`text-xs font-medium mt-1 ${location === "/login" ? "text-primary" : "text-gray-500"}`}>Account</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MobileNavigation;
