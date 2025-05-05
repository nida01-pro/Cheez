import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { X, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Cart = () => {
  const { 
    items, 
    isCartOpen, 
    setIsCartOpen, 
    removeItem, 
    updateQuantity,
    subtotal,
    deliveryFee,
    total
  } = useCart();
  const [location] = useLocation();

  // Don't show cart on checkout page
  if (location === "/checkout") return null;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
        >
          <motion.div 
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-lg flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-heading font-bold">Your Cart 🛒</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsCartOpen(false)}
                className="text-2xl"
              >
                <X />
              </Button>
            </div>
            
            <div className="overflow-auto p-4 h-[calc(100vh-250px)]">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center h-full">
                  <div className="text-5xl mb-4">🛒</div>
                  <h3 className="text-xl font-heading font-bold">Your cart is empty</h3>
                  <p className="text-gray-500 mt-2">Add some yummy snacks to get started!</p>
                  <Button 
                    className="mt-4 bg-primary text-white font-heading font-bold hover:bg-primary/90"
                    onClick={() => setIsCartOpen(false)}
                  >
                    Browse Snacks
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-3 border-b">
                      <div className="flex items-center">
                        <div className="w-16 h-16 rounded-lg overflow-hidden">
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-3">
                          <h3 className="font-heading font-medium">{item.product.name}</h3>
                          <p className="text-gray-500 text-sm">Rs. {item.product.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="w-7 h-7 rounded-full"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="mx-3 font-medium">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="w-7 h-7 rounded-full"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="border-t p-4 bg-gray-50 mt-auto">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span className="font-bold">Rs. {subtotal}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? "FREE" : `Rs. ${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-lg font-bold mb-4">
                <span>Total</span>
                <span className="text-primary">Rs. {total}</span>
              </div>
              <Link href="/checkout" className="block w-full">
                <Button 
                  className="w-full bg-primary text-white font-heading font-bold py-3 px-4 rounded-full text-lg hover:bg-primary/90"
                  disabled={items.length === 0}
                  onClick={() => setIsCartOpen(false)}
                >
                  Checkout Now
                </Button>
              </Link>
              <Button 
                className="w-full mt-2 bg-white text-primary border border-primary font-heading font-medium hover:bg-gray-50"
                onClick={() => setIsCartOpen(false)}
              >
                Continue Shopping
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Cart;
