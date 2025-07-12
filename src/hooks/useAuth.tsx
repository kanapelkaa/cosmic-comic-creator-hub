
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { userStorage, User } from '@/services/userStorage';

interface AuthContextType {
  user: User | null;
  login: (emailOrUsername: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (emailOrUsername: string, password: string): Promise<boolean> => {
    try {
      // Try to find user by email first, then by username
      let foundUser = await userStorage.findUserByEmail(emailOrUsername);
      if (!foundUser) {
        foundUser = await userStorage.findUserByUsername(emailOrUsername);
      }
      
      if (foundUser && foundUser.password === password) {
        // Remove password from stored user data for security
        const userWithoutPassword = { ...foundUser };
        delete (userWithoutPassword as any).password;
        
        setUser(userWithoutPassword);
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      // Check if user already exists by email or username
      const existingUserByEmail = await userStorage.findUserByEmail(email);
      const existingUserByUsername = await userStorage.findUserByUsername(username);
      
      if (existingUserByEmail || existingUserByUsername) {
        return false;
      }
      
      const newUser = await userStorage.createUser({
        username,
        email,
        password,
        role: 'user'
      });
      
      // Remove password from stored user data for security
      const userWithoutPassword = { ...newUser };
      delete (userWithoutPassword as any).password;
      
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
