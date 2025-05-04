import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import MobileNavigation from "@/components/MobileNavigation";
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
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof formSchema>;

const Login = () => {
  const [, navigate] = useLocation();
  const { login, user, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Redirect if already logged in
  if (user) {
    if (isAdmin) {
      navigate("/admin");
    } else {
      navigate("/");
    }
    return null;
  }

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const success = await login(data.username, data.password);
      if (success) {
        // Redirect will happen automatically due to user state change
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h1 className="text-2xl font-heading font-bold mb-6 text-center">Login</h1>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary text-white font-heading font-bold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </Form>
            
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>For demo purpose:</p>
              <p>Admin login: admin / admin123</p>
              <p>User login: user / password</p>
            </div>
          </div>
        </div>
      </div>
      <MobileNavigation />
    </>
  );
};

export default Login;
