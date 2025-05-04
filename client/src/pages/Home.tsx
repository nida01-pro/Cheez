import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Cart from "@/components/Cart";
import ProductCard from "@/components/ProductCard";
import CategoryPill from "@/components/CategoryPill";
import MobileNavigation from "@/components/MobileNavigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useCart } from "@/context/CartContext";
import { Category, Product } from "@shared/schema";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [address, setAddress] = useState("Model Town, Karachi");
  const [viewMode, setViewMode] = useState<"parent" | "kid">("parent");
  const [, setLocation] = useLocation();
  const { setIsCartOpen } = useCart();

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Fetch products with optional category filter
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['/api/products', selectedCategory],
  });

  // Filter products by search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get popular products (products with tag "Kid's Favorite" or "Bestseller")
  const popularProducts = filteredProducts.filter(
    product => product.tag === "Kid's Favorite" || product.tag === "Bestseller"
  );

  // Get new products (products with tag "New")
  const newProducts = filteredProducts.filter(product => product.tag === "New");

  // Handle category selection
  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  return (
    <>
      <Navbar />
      <Cart />
      
      <main className="container mx-auto px-4 py-6 pb-20 md:pb-6 max-w-7xl">
        {/* View Mode Selector */}
        <div className="flex items-center justify-end space-x-2 mb-4">
          <Label htmlFor="view-mode" className={viewMode === "parent" ? "font-bold" : ""}>Parents</Label>
          <Switch 
            id="view-mode" 
            checked={viewMode === "kid"}
            onCheckedChange={(checked) => setViewMode(checked ? "kid" : "parent")}
          />
          <Label htmlFor="view-mode" className={viewMode === "kid" ? "font-bold" : ""}>Kids</Label>
        </div>

        {/* Hero Section */}
        <section className="py-4 md:py-8">
          <div className={`bg-gradient-to-r ${viewMode === "kid" ? "from-accent/20 to-primary/20" : "from-primary/10 to-secondary/10"} rounded-2xl p-6 md:p-8 text-center md:text-left flex flex-col md:flex-row items-center`}>
            <div className="md:w-1/2">
              <h1 className="text-3xl md:text-4xl font-heading font-bold mb-3">
                {viewMode === "kid" ? "Maze Ki Cheezein! 🎮" : "Kia Cheez Khao Gey?"}
              </h1>
              <p className="text-lg mb-6">
                {viewMode === "kid" ? (
                  <>Apni <strong>favorite treats aur masti bhare snacks</strong> ki duniya mein khud ko kho do! 🎪</>
                ) : (
                  <>Ab <strong>biscuits, chips, nimko, chocolate, saari cheez</strong> issi dukan se milegi ghar bethay ek hi din mein! ⏱️</>
                )}
              </p>
              <Button 
                className={`${viewMode === "kid" ? "bg-accent text-amber-800" : "bg-primary text-white"} font-heading font-bold py-3 px-6 rounded-full text-lg hover:opacity-90`}
                onClick={() => viewMode === "kid" ? setLocation("/games") : setIsCartOpen(true)}
              >
                {viewMode === "kid" ? "Maza Shuru Karo! 🎮" : "Abhi Order Karein! 🚀"}
              </Button>
            </div>
            <div className="md:w-1/2 mt-6 md:mt-0">
              <img 
                src={viewMode === "kid" 
                  ? "https://images.unsplash.com/photo-1558745010-d2a3c21762ab?auto=format&fit=crop&w=800&h=600" 
                  : "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=800&h=600"
                } 
                alt={viewMode === "kid" ? "Kids enjoying snacks together" : "Assorted Pakistani snacks and treats"} 
                className="rounded-xl shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* Search & Delivery */}
        <section className="flex flex-col md:flex-row gap-4 py-4">
          <div className="bg-white rounded-xl shadow-md p-4 flex-1">
            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2">
              <span className="text-gray-400 mr-2">🔍</span>
              <Input 
                type="text" 
                placeholder="Kya dhund rahe ho?" 
                className="w-full bg-transparent border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between flex-1">
            <div>
              <p className="text-sm text-gray-500">Delivery Address</p>
              <p className="font-medium truncate">{address}</p>
            </div>
            <Button variant="link" className="text-secondary font-medium">
              Change
            </Button>
          </div>
        </section>

        {/* Categories */}
        <section className="py-6 mt-2">
          <h2 className="text-2xl font-heading font-bold mb-5">Categories</h2>
          <div className="categories flex gap-4 overflow-x-auto pb-3 no-scrollbar">
            {categories.map((category) => (
              <CategoryPill
                key={category.id}
                category={category}
                isSelected={selectedCategory === category.id}
                onClick={() => handleCategoryClick(category.id)}
              />
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-6 mt-2">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-heading font-bold">Sabse Popular 🔥</h2>
            <Button 
              variant="link" 
              className="text-secondary font-medium"
              onClick={() => setSelectedCategory(null)}
            >
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {popularProducts.length > 0 ? (
              popularProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 py-8">
                No popular products found
              </p>
            )}
          </div>
        </section>

        {/* Subscription Options */}
        <section className="py-6 bg-gradient-to-r from-secondary/5 to-primary/5 rounded-2xl my-6 p-4">
          <h2 className="text-2xl font-heading font-bold mb-6 text-center">Subscription Plans 🎁</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="delivery-option bg-white rounded-xl shadow-md p-6 text-center">
              <div className="inline-block text-4xl mb-3">🚴‍♂️</div>
              <h3 className="text-xl font-heading font-bold mb-2">Ek Baar Mangwao!</h3>
              <p className="text-gray-600 mb-4">Rs. 99 delivery ({"<"} Rs. 500) <br /> FREE delivery ({">"} Rs. 500)</p>
              <p className="text-sm text-gray-500 mb-4">Perfect for trying new snacks or occasional treats</p>
              <Button 
                variant="outline" 
                className="w-full border-2 border-primary text-primary font-heading font-bold py-2 px-4 rounded-full hover:bg-primary/5"
                onClick={() => setIsCartOpen(true)}
              >
                Select
              </Button>
            </div>

            <div className="subscription-option bg-primary/10 rounded-xl shadow-md p-6 text-center relative">
              <div className="absolute -top-3 -right-3 bg-accent text-amber-800 text-xs py-1 px-3 rounded-full font-bold">
                Best Value!
              </div>
              <div className="inline-block text-4xl mb-3">🎁</div>
              <h3 className="text-xl font-heading font-bold mb-2">Cheez Club (Monthly Magic!)</h3>
              <p className="text-gray-600 mb-4">Rs. 299/month = FREE delivery + exclusive discounts!</p>
              <p className="text-sm text-gray-500 mb-4">Har hafte fresh snacks, no delivery fees, special surprises!</p>
              <Button 
                className="w-full bg-primary text-white font-heading font-bold py-2 px-4 rounded-full hover:bg-primary/90"
                onClick={() => setLocation("/subscription")}
              >
                Subscribe Now!
              </Button>
            </div>
          </div>
        </section>

        {/* Recently Added */}
        <section className="py-6 mt-2">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-heading font-bold">Naye Snacks 🆕</h2>
            <Button 
              variant="link" 
              className="text-secondary font-medium"
              onClick={() => setSelectedCategory(null)}
            >
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {newProducts.length > 0 ? (
              newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 py-8">
                No new products found
              </p>
            )}
          </div>
        </section>

        {/* Kid-friendly game or activity section - only visible in kid view */}
        {viewMode === "kid" && (
          <section className="py-6 bg-accent/10 rounded-2xl p-6">
            <h2 className="text-2xl font-heading font-bold mb-4">Fun Activity! 🎮</h2>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-heading font-bold mb-4 text-center">Snack Match Game! 🧩</h3>
              <p className="text-gray-600 mb-4 text-center">
                Cheez pe maze karo! Har baar jab snacks order karo, ek nayi game milegi. 
                Points collect karo aur special treats jeeto!
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-accent/20 rounded-lg h-24 flex items-center justify-center text-4xl cursor-pointer hover:bg-accent/40 transition-colors">
                  🍫
                </div>
                <div className="bg-accent/20 rounded-lg h-24 flex items-center justify-center text-4xl cursor-pointer hover:bg-accent/40 transition-colors">
                  🍬
                </div>
                <div className="bg-accent/20 rounded-lg h-24 flex items-center justify-center text-4xl cursor-pointer hover:bg-accent/40 transition-colors">
                  🍪
                </div>
                <div className="bg-accent/20 rounded-lg h-24 flex items-center justify-center text-4xl cursor-pointer hover:bg-accent/40 transition-colors">
                  🍿
                </div>
              </div>
              <div className="text-center">
                <Button 
                  className="bg-accent text-amber-800 font-heading font-bold py-2 px-6 rounded-full text-lg"
                  onClick={() => setLocation("/games")}
                >
                  Khel Shuru Karo!
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Testimonials - only visible in parent view */}
        {viewMode === "parent" && (
          <section className="py-6">
            <h2 className="text-2xl font-heading font-bold mb-4">Parents Ki Pasand ❤️</h2>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl">👩</div>
                <div className="ml-3">
                  <h3 className="font-bold">Sana A.</h3>
                  <div className="flex text-amber-400">★★★★★</div>
                </div>
              </div>
              <p className="text-gray-600">
                "My kids absolutely love the after-school snack packs! Delivery is always on time and the variety keeps them excited. Cheez ne meri life asaan bana di hai!"
              </p>
            </div>
          </section>
        )}

        {/* Parent-specific nutrition info section - only visible in parent view */}
        {viewMode === "parent" && (
          <section className="py-6 bg-secondary/10 rounded-2xl p-6 mb-6">
            <h2 className="text-2xl font-heading font-bold mb-4">Nutrition Information 📊</h2>
            <p className="text-gray-600 mb-4">
              Humari priority hai aapke bachon ki sehat. Har product ke sath detailed nutrition information provide ki jati hai 
              taki aap informed decisions le sakein.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🍎</div>
                <h3 className="font-heading font-bold mb-1">Ingredients</h3>
                <p className="text-sm text-gray-500">Har product ke ingredients clearly mentioned</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">⚖️</div>
                <h3 className="font-heading font-bold mb-1">Portion Sizes</h3>
                <p className="text-sm text-gray-500">Age-appropriate portion sizing ki guidance</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🔍</div>
                <h3 className="font-heading font-bold mb-1">Allergen Info</h3>
                <p className="text-sm text-gray-500">Detailed allergen information har product ke sath</p>
              </div>
            </div>
          </section>
        )}
      </main>
      
      <MobileNavigation />
    </>
  );
};

export default Home;
