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

        {/* USPs Section - always visible */}
        <section className="py-6 bg-secondary/10 rounded-2xl p-6 mb-6">
          <h2 className="text-2xl font-heading font-bold mb-4 text-center">Kyu Cheez? Hamari Khas Batein 🌟</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-heading font-bold mb-1">Same Day Delivery</h3>
              <p className="text-sm text-gray-500">Aaj order karein, aaj hi paye!</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">🇵🇰</div>
              <h3 className="font-heading font-bold mb-1">Pakistani Flavors</h3>
              <p className="text-sm text-gray-500">Desi mazay, local favorites</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">💯</div>
              <h3 className="font-heading font-bold mb-1">Quality Guaranteed</h3>
              <p className="text-sm text-gray-500">Fresh snacks, trusted brands</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">💰</div>
              <h3 className="font-heading font-bold mb-1">Paisa Vasool</h3>
              <p className="text-sm text-gray-500">Great deals, affordable prices</p>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-8 bg-primary/10 rounded-2xl p-6 mb-6 text-center">
          <h2 className="text-3xl font-heading font-bold mb-3">Ready to Order? 🚀</h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Apnay favorite Pakistani snacks ghar bethay abhi order karein. Same day delivery guaranteed!
          </p>
          <Button 
            className="bg-primary text-white font-heading font-bold py-3 px-8 rounded-full text-lg hover:opacity-90"
            onClick={() => setIsCartOpen(true)}
          >
            Abhi Order Karein! 🚀
          </Button>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-100 py-8 mt-6 border-t">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-heading font-bold mb-4">Cheez</h3>
              <p className="text-gray-600 mb-4">
                Pakistan's first kid-centric snack delivery platform! Bringing joy and convenience to families across the country.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-500 hover:text-primary">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-primary">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-primary">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-heading font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-primary">About Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Categories</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Subscription Plans</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">FAQs</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-heading font-bold mb-4">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-primary mr-3">📍</span>
                  <span className="text-gray-600">123 Main Street, Karachi, Pakistan</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3">📱</span>
                  <span className="text-gray-600">+92-123-4567890</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3">✉️</span>
                  <span className="text-gray-600">info@cheez.pk</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-500">
            <p>© {new Date().getFullYear()} Cheez. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      <MobileNavigation />
    </>
  );
};

export default Home;
