import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export interface AdminSession {
  isAdmin: boolean;
  username: string;
  name: string;
}

interface AdminContextType {
  isAdmin: boolean;
  adminSignIn: (username: string, password: string) => boolean;
  adminSignOut: () => Promise<void>;
  isLoaded: boolean;
}

const ADMIN_KEY = "@ide_admin_session";
const ADMIN_USER = "admin62826";
const ADMIN_PASS = "adminpassword";

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  adminSignIn: () => false,
  adminSignOut: async () => {},
  isLoaded: false,
});

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(ADMIN_KEY).then((raw) => {
      if (raw) {
        try {
          const parsed: AdminSession = JSON.parse(raw);
          if (parsed.isAdmin) setIsAdmin(true);
        } catch {}
      }
      setIsLoaded(true);
    });
  }, []);

  const adminSignIn = useCallback((username: string, password: string) => {
    if (username.trim() === ADMIN_USER && password.trim() === ADMIN_PASS) {
      const session: AdminSession = { isAdmin: true, username: ADMIN_USER, name: "Administrator" };
      AsyncStorage.setItem(ADMIN_KEY, JSON.stringify(session));
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const adminSignOut = useCallback(async () => {
    await AsyncStorage.removeItem(ADMIN_KEY);
    setIsAdmin(false);
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, adminSignIn, adminSignOut, isLoaded }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
