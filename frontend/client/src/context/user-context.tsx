import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

// Mock User Type - aligned with schema
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
  companyId?: string; // Added
  avatar?: string;
  verified: boolean;
}

interface UserLogin {
  email: string;
  password?: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: UserLogin) => Promise<void>;
  register: (data: { name: string; email: string; password?: string; companyName?: string }) => Promise<boolean>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  // Language for toasts (simplified, ideally use hook)
  const language = 'es'; 

  useEffect(() => {
    // Check local storage on mount
    const storedUser = localStorage.getItem('comex_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem('comex_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: UserLogin) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Map backend response to User type if needed
      const mappedUser: User = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role || "Usuario",
          company: data.company?.name || data.company || "",
          companyId: data.company?.id || data.companyId,
          verified: !!data.verified,
          avatar: undefined 
      };

      setUser(mappedUser);
      localStorage.setItem('comex_user', JSON.stringify(mappedUser));

      toast({
        title: "¡Bienvenido de vuelta!",
        description: "Has iniciado sesión correctamente.",
      });
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: error.message || "Error al iniciar sesión",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

       // For register, backend might handle company creation. 
       // We'll rely on response data or fallback to input
       const mappedUser: User = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role || "Usuario",
          company: userData.companyName || "", 
          companyId: data.companyId, // Should come from backend or be undefined initially
          verified: !!data.verified
      };

      setUser(mappedUser);
      localStorage.setItem('comex_user', JSON.stringify(mappedUser));
      
      toast({
        title: "¡Cuenta creada!",
        description: `Bienvenido a ComexIA, ${data.name}`,
      });
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Error",
        description: error.message || "Error al registrarse",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('comex_user');
    window.location.href = '/'; 
  };

  return (
    <UserContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
