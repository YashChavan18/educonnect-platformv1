import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

type AuthContextType = {
  currentUser: User | null;                     // ✅ NEW
  isAuthenticated: boolean;
  userRole: string | null;
  fullName: string | null;
  email: string | null;
  login: (role: string, fullName: string, email: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null); // ✅ NEW
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const login = (role: string, name: string, userEmail: string) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setFullName(name);
    setEmail(userEmail);
  };

  const logout = () => {
    setCurrentUser(null);                // ✅ clear current user
    setIsAuthenticated(false);
    setUserRole(null);
    setFullName(null);
    setEmail(null);
  };

  const fetchUserProfile = async (user: User) => {
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCurrentUser(user);            // ✅ set current user
        login(data.role, data.fullName, data.email);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserProfile(user);
      } else {
        logout();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,               // ✅ provide current user
        isAuthenticated,
        userRole,
        fullName,
        email,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
