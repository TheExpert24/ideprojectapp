import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";
import * as SecureStore from 'expo-secure-store';

declare const process: { env: { [key: string]: string | undefined } };

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Ensure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are set.');
}

// Fallback memory storage wrapper to prevent native crashes
const memoryStorage: Record<string, string> = {};
const MemoryAdapter = {
  getItem: async (key: string) => memoryStorage[key] ?? null,
  setItem: async (key: string, value: string) => { memoryStorage[key] = value; },
  removeItem: async (key: string) => { delete memoryStorage[key]; },
};

// Safe wrapper that uses SecureStore on mobile and Memory on Web browsers
const HybridStorageAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') return MemoryAdapter.getItem(key);
    try {
      const value = await SecureStore.getItemAsync(key);
      return value ?? null;
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') return MemoryAdapter.setItem(key, value);
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {}
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') return MemoryAdapter.removeItem(key);
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {}
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: HybridStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
