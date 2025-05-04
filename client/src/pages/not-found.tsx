import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function NotFound() {
  const [_, setLocation] = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="text-9xl mb-6 font-bold text-primary">404</div>
        <h1 className="text-4xl font-heading font-bold mb-4">Oops! Yeh Cheez Nahi Mili</h1>
        <p className="text-lg text-gray-600 mb-8">
          Hamare paas bahut saari yummy treats hain, lekin yeh page abhi hamare menu mein nahi hai.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            className="bg-primary text-white font-heading font-bold py-3 px-6 rounded-full text-lg hover:opacity-90"
            onClick={() => setLocation("/")}
          >
            Home Page
          </Button>
          
          <Button
            variant="outline"
            className="border-2 border-primary text-primary font-heading font-bold py-3 px-6 rounded-full text-lg hover:bg-primary/5"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
      
      <div className="mt-12 flex flex-wrap justify-center gap-8">
        <div className="text-center">
          <div className="text-4xl mb-2">🍫</div>
          <p className="text-gray-600">Snacks Explore Karein</p>
        </div>
        <div className="text-center">
          <div className="text-4xl mb-2">🎁</div>
          <p className="text-gray-600">Subscription Plans</p>
        </div>
        <div className="text-center">
          <div className="text-4xl mb-2">🎮</div>
          <p className="text-gray-600">Fun Activities</p>
        </div>
      </div>
    </div>
  );
}
