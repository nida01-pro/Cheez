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
        case "after-school snacks":
          return "bg-primary text-white";
        case "weekend specials":
          return "bg-secondary text-white";
        case "healthy munchies":
          return "bg-accent text-amber-800";
        default:
          return "bg-gray-800 text-white";
      }
    }
    
    switch (category.name.toLowerCase()) {
      case "after-school snacks":
        return "bg-primary/10 text-primary hover:bg-primary/20";
      case "weekend specials":
        return "bg-secondary/10 text-secondary hover:bg-secondary/20";
      case "healthy munchies":
        return "bg-accent/10 text-amber-600 hover:bg-accent/20";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200";
    }
  };

  return (
    <Button
      variant="ghost"
      className={cn(
        "flex-shrink-0 font-heading font-bold py-2 px-4 rounded-full",
        getButtonColor()
      )}
      onClick={onClick}
    >
      {category.name} {category.emoji}
    </Button>
  );
};

export default CategoryPill;
