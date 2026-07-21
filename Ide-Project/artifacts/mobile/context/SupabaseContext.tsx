import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface SupabaseContextType {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType>({
  isInitialized: false,
  isLoading: true,
  error: null,
  refresh: async () => {},
});

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initialize = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: userError } = await supabase.auth.getSession();
      if (userError) throw userError;
      setIsInitialized(true);
    } catch (err: any) {
      setError(err.message || "Failed to connect to Supabase");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initialize();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      initialize();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <SupabaseContext.Provider value={{ isInitialized, isLoading, error, refresh: initialize }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  return useContext(SupabaseContext);
}
