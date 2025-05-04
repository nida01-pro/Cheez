import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  phone: z.string().regex(/^03\d{2}-\d{7}$/, "Phone must be in format 03XX-XXXXXXX"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  instructions: z.string().optional(),
  paymentMethod: z.enum(["cash_on_delivery", "jazzcash", "easypaisa"]),
  paymentPhone: z.string().regex(/^03\d{2}-\d{7}$/, "Mobile wallet number must be in format 03XX-XXXXXXX").optional(),
});

type FormData = z.infer<typeof formSchema>;

const Checkout = () => {
  const [, navigate] = useLocation();
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { toast } = useToast();
  
  const [orderSuccess, setOrderSuccess] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      instructions: "",
      paymentMethod: "cash_on_delivery",
    },
  });

  // If cart is empty and no success, redirect to home
  if (items.length === 0 && !orderSuccess) {
    navigate("/");
    return null;
  }

  const createOrderMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const orderData = {
        ...data,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        subtotal,
        deliveryFee,
        total
      };
      
      return await apiRequest('POST', '/api/orders', orderData);
    },
    onSuccess: () => {
      toast({
        title: "Order Placed Successfully!",
        description: "Your yummy snacks will be on their way soon!",
      });
      clearCart();
      setOrderSuccess(true);
    },
    onError: (error) => {
      toast({
        title: "Failed to Place Order",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: FormData) => {
    createOrderMutation.mutate(data);
  };

  if (orderSuccess) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-[70vh]">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-heading font-bold mb-4 text-center">Order Placed Successfully!</h1>
          <p className="text-gray-600 text-center mb-8 max-w-md">
            Thank you for your order! Your yummy snacks will be delivered soon.
          </p>
          <Button 
            className="bg-primary text-white font-heading font-bold"
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-6 pb-20 md:pb-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-heading font-bold">Checkout</h1>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            {/* Delivery Information */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                  <h2 className="text-xl font-heading font-bold mb-4">Apna Address Likho:</h2>
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Ahmed Khan"
                            {...field}
                            className="p-3"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 03XX-XXXXXXX"
                            {...field}
                            className="p-3"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Delivery Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Model Town, Karachi"
                            {...field}
                            className="p-3"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="instructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Instructions (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., Ring the bell twice"
                            {...field}
                            rows={2}
                            className="p-3"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Payment Options */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-heading font-bold mb-4">Payment Options:</h2>
                  
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="space-y-3"
                          >
                            <div className="flex items-center p-3 border border-gray-300 rounded-lg">
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="cash_on_delivery" id="cod" className="h-5 w-5" />
                                </FormControl>
                                <FormLabel htmlFor="cod" className="flex items-center cursor-pointer">
                                  <span className="mr-2">💵</span>
                                  <span>Cash on Delivery</span>
                                </FormLabel>
                              </FormItem>
                            </div>
                            
                            <div className="flex items-center p-3 border border-gray-300 rounded-lg">
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="jazzcash" id="jazzcash" className="h-5 w-5" />
                                </FormControl>
                                <FormLabel htmlFor="jazzcash" className="flex items-center cursor-pointer">
                                  <span className="mr-2" style={{ color: '#900' }}>📱</span>
                                  <span>JazzCash</span>
                                </FormLabel>
                              </FormItem>
                            </div>
                            
                            <div className="flex items-center p-3 border border-gray-300 rounded-lg">
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="easypaisa" id="easypaisa" className="h-5 w-5" />
                                </FormControl>
                                <FormLabel htmlFor="easypaisa" className="flex items-center cursor-pointer">
                                  <span className="mr-2" style={{ color: '#198a19' }}>📱</span>
                                  <span>EasyPaisa</span>
                                </FormLabel>
                              </FormItem>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              
                {/* Mobile Submit Button (visible on mobile only) */}
                <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t md:hidden">
                  <Button 
                    type="submit" 
                    className="w-full bg-primary text-white font-heading font-bold py-3"
                    disabled={createOrderMutation.isPending}
                  >
                    {createOrderMutation.isPending ? "Processing..." : "Place Order"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          
          <div>
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-heading font-bold mb-4">Order Summary</h2>
              
              <div className="divide-y">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between py-3">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-lg overflow-hidden">
                        <img 
                          src={item.product.imageUrl} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">{item.product.name} x{item.quantity}</p>
                        <p className="text-gray-500 text-sm">Rs. {item.product.price} each</p>
                      </div>
                    </div>
                    <p className="font-medium">Rs. {parseFloat(item.product.price.toString()) * item.quantity}</p>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span className="font-medium">Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Delivery</span>
                  <span>{deliveryFee === 0 ? "FREE" : `Rs. ${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-4">
                  <span>Total</span>
                  <span className="text-primary">Rs. {total}</span>
                </div>
              </div>
              
              {/* Desktop Submit Button (hidden on mobile) */}
              <Button 
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                className="w-full bg-primary text-white font-heading font-bold py-3 px-4 rounded-full mt-6 hover:bg-primary/90 hidden md:block"
                disabled={createOrderMutation.isPending}
              >
                {createOrderMutation.isPending ? "Processing..." : "Place Order"}
              </Button>
              
              <Link href="/">
                <Button 
                  variant="outline" 
                  className="w-full border border-gray-300 font-medium py-3 px-4 rounded-full mt-3 hover:bg-gray-50 hidden md:block"
                >
                  Back to Cart
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
