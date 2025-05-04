import { Category } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategoryPillProps {
  category: Category;
  isSelected: boolean;
  onClick: () => void;
}

const CategoryPill: React.FC<CategoryPillProps> = ({ category, isSelected, onClick }) => {
  const getButtonColor = () => {
    if (isSelected) {
      switch (category.name.toLowerCase()) {
        case "biscuits":
          return "bg-primary text-white";
        case "chips":
          return "bg-secondary text-white";
        case "chocolates":
          return "bg-accent text-amber-800";
        case "nimko":
          return "bg-orange-500 text-white";
        case "juices":
          return "bg-green-600 text-white";
        case "choti moti cheez":
          return "bg-pink-500 text-white";
        case "homemade treats":
          return "bg-amber-600 text-white";
        default:
          return "bg-gray-800 text-white";
      }
    }
    
    switch (category.name.toLowerCase()) {
      case "biscuits":
        return "bg-primary/10 text-primary hover:bg-primary/20";
      case "chips":
        return "bg-secondary/10 text-secondary hover:bg-secondary/20";
      case "chocolates":
        return "bg-accent/10 text-amber-800 hover:bg-accent/20";
      case "nimko":
        return "bg-orange-100 text-orange-600 hover:bg-orange-200";
      case "juices":
        return "bg-green-100 text-green-600 hover:bg-green-200";
      case "choti moti cheez":
        return "bg-pink-100 text-pink-600 hover:bg-pink-200";
      case "homemade treats":
        return "bg-amber-100 text-amber-600 hover:bg-amber-200";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200";
    }
  };

  return (
    <Button
      variant="ghost"
      className={cn(
        "flex-shrink-0 font-heading font-bold py-2 px-4 rounded-full transition-all duration-200 shadow-sm border",
        isSelected ? "border-transparent shadow-md scale-105" : "border-gray-200",
        getButtonColor()
      )}
      onClick={onClick}
    >
      <span className="mr-2">{category.emoji}</span> {category.name}
    </Button>
  );
};

export default CategoryPill;
