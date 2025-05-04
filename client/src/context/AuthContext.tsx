import React, { createContext, useState, useContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AuthUser } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const { toast } = useToast();

  // Check if user is already logged in
  const { data, isLoading } = useQuery<AuthUser | null>({
    queryKey: ['/api/auth/me'],
    staleTime: 300000, // 5 minutes
    refetchOnWindowFocus: true,
    retry: false,
  });

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data]);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await apiRequest('POST', '/api/auth/login', { username, password });
      const userData = await response.json();
      
      setUser(userData);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.username}!`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiRequest('POST', '/api/auth/logout');
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin: user?.isAdmin || false,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
