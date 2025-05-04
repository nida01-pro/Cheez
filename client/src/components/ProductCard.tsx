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
    <div className="snack-card bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="h-36 overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-heading font-bold text-lg">{product.name}</h3>
          {product.tag && (
            <Badge variant="outline" className={`text-xs rounded-full ${getBadgeVariant(product.tag)}`}>
              {product.tag}
            </Badge>
          )}
        </div>
        <p className="text-gray-500 text-sm mt-1">{product.description}</p>
        <div className="flex justify-between items-center mt-3">
          <p className="font-bold">Rs. {product.price}</p>
          <Button
            onClick={handleAddToCart}
            className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-primary/90 p-0"
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
