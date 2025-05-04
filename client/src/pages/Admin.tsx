import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import OrderItem from "@/components/OrderItem";
import { Input } from "@/components/ui/input";
import { OrderWithItems } from "@/lib/types";
import { Product } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  quantity: z.coerce.number().int().min(1, "Must add at least 1 item"),
});

type FormData = z.infer<typeof formSchema>;

const Admin = () => {
  const { user, isAdmin, logout } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 1,
    },
  });

  // Redirect if not admin
  if (!isAdmin) {
    navigate("/login");
    return null;
  }

  // Fetch orders
  const { data: orders = [] } = useQuery<OrderWithItems[]>({
    queryKey: ['/api/orders/admin'],
  });

  // Fetch inventory (products with stock)
  const { data: inventory = [] } = useQuery<Product[]>({
    queryKey: ['/api/products/inventory'],
  });

  // Filter and sort orders
  const pendingOrders = orders.filter(order => 
    order.status !== "delivered" && order.status !== "cancelled"
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const completedOrders = orders.filter(order => 
    order.status === "delivered" || order.status === "cancelled"
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Today's stats
  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    const today = new Date();
    return orderDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
  });

  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
  
  const todayCustomers = [...new Set(todayOrders.map(order => order.name))].length;
  
  const todayItemsSold = todayOrders.reduce((sum, order) => 
    sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
  );

  const handleUpdateInventory = async (data: FormData) => {
    if (!selectedProductId) return;

    try {
      await apiRequest('PATCH', `/api/products/${selectedProductId}/inventory`, {
        quantity: data.quantity
      });
      
      toast({
        title: "Inventory Updated",
        description: "The product stock has been updated successfully.",
      });
      
      // Reset form and close dialog
      form.reset();
      setIsUpdateDialogOpen(false);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update inventory",
        variant: "destructive",
      });
    }
  };

  const openUpdateDialog = (productId: number) => {
    setSelectedProductId(productId);
    setIsUpdateDialogOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-heading font-bold">Admin Dashboard</h1>
        <Button onClick={() => logout()}>Logout</Button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="col-span-2">
          {/* Orders */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-heading font-bold mb-4">Pending Orders</h2>
            
            <div className="space-y-4">
              {pendingOrders.length > 0 ? (
                pendingOrders.map((order) => (
                  <OrderItem key={order.id} order={order} />
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No pending orders</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-heading font-bold mb-4">Completed Orders</h2>
            
            <div className="space-y-4">
              {completedOrders.length > 0 ? (
                completedOrders.slice(0, 5).map((order) => (
                  <OrderItem key={order.id} order={order} />
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No completed orders</p>
              )}
            </div>
          </div>
        </div>
        
        <div>
          {/* Inventory */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-heading font-bold mb-4">Inventory Status</h2>
            
            <div className="space-y-3">
              {inventory.map((product) => (
                <div key={product.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">Rs. {product.price} per item</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">{product.stock} items left</span>
                    <Button 
                      className="bg-secondary text-white w-6 h-6 rounded-full text-sm flex items-center justify-center p-0"
                      onClick={() => openUpdateDialog(product.id)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <Button className="w-full bg-secondary text-white font-medium py-2 px-4 rounded-lg mt-4">
              Add New Item
            </Button>
          </div>
          
          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-heading font-bold mb-4">Today's Stats</h2>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primary/10 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-primary">{todayOrders.length}</p>
                <p className="text-sm">Orders</p>
              </div>
              <div className="bg-secondary/10 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-secondary">Rs. {todayRevenue}</p>
                <p className="text-sm">Revenue</p>
              </div>
              <div className="bg-accent/10 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-amber-600">{todayCustomers}</p>
                <p className="text-sm">New Customers</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold">{todayItemsSold}</p>
                <p className="text-sm">Items Sold</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Inventory Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Inventory</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateInventory)} className="space-y-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Add Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter quantity to add"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button type="submit">Update Stock</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
