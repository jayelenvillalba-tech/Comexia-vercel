import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

// User Type - aligned with schema and backend response
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
  companyId?: string;
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
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
            const userData = await res.json();
             // Map backend response to Frontend User interface
            const mappedUser: User = {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                role: userData.role || "Usuario",
                company: userData.companyName || "",
                companyId: userData.companyId,
                verified: false // Backend needs to send this if needed, defaulting for now
            };
            setUser(mappedUser);
        } else {
            console.log('Token expired or invalid');
            logout(); // Clear bad token
        }
      } catch (error) {
        console.error('Auth check error', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
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
        throw new Error(data.error || 'Login failed');
      }

      const mappedUser: User = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role || "Usuario",
          company: data.user.companyName || "",
          companyId: data.user.companyId,
          verified: !!data.user.verified
      };

      localStorage.setItem('token', data.token);
      setUser(mappedUser);

      toast({
        title: "¡Bienvenido de vuelta!",
        description: `Hola ${mappedUser.name}`,
      });
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: error.message || "Error al iniciar sesión",
        variant: "destructive",
      });
      throw error; 
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    try {
        // Map frontend params to backend expectation if needed
        const payload = {
            userName: userData.name,
            companyName: userData.companyName,
            email: userData.email,
            password: userData.password
        };

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

       const mappedUser: User = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role || "Usuario",
          company: data.user.companyName || "", 
          companyId: data.user.companyId,
          verified: false
      };

      localStorage.setItem('token', data.token);
      setUser(mappedUser);
      
      toast({
        title: "¡Cuenta creada!",
        description: `Bienvenido a ComexIA, ${data.user.name}`,
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
    localStorage.removeItem('token');
    window.location.href = '/auth'; // Redirect to login
  };

  return (
    <UserContext.Provider value={{ user, isLoading, login, logout, register, isAuthenticated: !!user }}>
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
