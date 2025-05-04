import { Link } from "wouter";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { items, setIsCartOpen } = useCart();
  const { user, isAdmin, logout } = useAuth();

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <span className="text-primary text-3xl font-heading font-bold">Cheez</span>
          <span className="ml-1 text-accent text-xl">🧀</span>
        </Link>
        <div className="flex items-center">
          <button 
            className="p-2 mr-2 bg-gray-100 rounded-full relative" 
            aria-label="Cart"
            onClick={() => setIsCartOpen(true)}
          >
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
            🛒
          </button>
          
          {!user ? (
            <Link href="/login">
              <Button variant="ghost" size="sm" className="p-2 bg-gray-100 rounded-full hidden md:flex">
                👤
              </Button>
            </Link>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              {isAdmin && (
                <Link href="/admin">
                  <Button variant="outline" size="sm">Admin</Button>
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={() => logout()}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
