import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      product,
      quantity: 1,
    });
  };

  const getBadgeVariant = (tag: string) => {
    switch (tag.toLowerCase()) {
      case "kid's favorite":
        return "bg-accent/20 text-amber-700";
      case "new":
        return "bg-secondary/20 text-secondary";
      case "bestseller":
        return "bg-primary/20 text-primary";
      case "healthy":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="snack-card bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 h-full flex flex-col">
      <div className="relative h-40 overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {product.tag && (
          <Badge 
            variant="outline" 
            className={`absolute top-2 right-2 text-xs py-1 px-2 rounded-full ${getBadgeVariant(product.tag)}`}
          >
            {product.tag}
          </Badge>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-heading font-bold text-lg line-clamp-1">{product.name}</h3>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2 mb-3 flex-grow">{product.description}</p>
        <div className="flex justify-between items-center mt-auto">
          <p className="font-bold text-lg">Rs. {parseFloat(product.price.toString()).toFixed(0)}</p>
          <Button
            onClick={handleAddToCart}
            className="bg-primary text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-primary/90 p-0 shadow-sm"
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
