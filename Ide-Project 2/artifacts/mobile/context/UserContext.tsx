import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth, useUser } from "@clerk/expo";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type UserRole =
  | "exoneree_support"
  | "exoneree_helping"
  | "volunteer"
  | "professional"
  | "admin"
  | null;

export interface UserProfile {
  name: string;
  bio: string;
  location: string;
  role: UserRole;
  onboardingComplete: boolean;
  savedResources: string[];
  savedNews: string[];
}

const defaultProfile: UserProfile = {
  name: "",
  bio: "",
  location: "",
  role: null,
  onboardingComplete: false,
  savedResources: [],
  savedNews: [],
};

interface UserContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  toggleSaveResource: (id: string) => Promise<void>;
  toggleSaveNews: (id: string) => Promise<void>;
  isLoaded: boolean;
  isSyncing: boolean;
}

const UserContext = createContext<UserContextType>({
  profile: defaultProfile,
  updateProfile: async () => {},
  toggleSaveResource: async () => {},
  toggleSaveNews: async () => {},
  isLoaded: false,
  isSyncing: false,
});

const CACHE_KEY_PREFIX = "@ide_profile_v3_";

function cacheKey(userId: string) {
  return `${CACHE_KEY_PREFIX}${userId}`;
}

// Convert API server row (snake_case) to UserProfile
function rowToProfile(row: Record<string, unknown>): UserProfile {
  return {
    name: (row.name as string) || "",
    bio: (row.bio as string) || "",
    location: (row.location as string) || "",
    role: (row.role as UserRole) || null,
    onboardingComplete: (row.onboarding_complete as boolean) || false,
    savedResources: (row.saved_resources as string[]) || [],
    savedNews: (row.saved_news as string[]) || [],
  };
}

// Build the API base URL. Prefer the build-time domain (works in native Expo Go
// and on the .expo dev domain). Fall back to the current web origin, and only
// then to a relative path. A relative "/api" cannot reach the API server from
// native or the .expo dev domain, so it is the last resort.
function getApiBase(): string {
  const domain = process.env.EXPO_PUBLIC_DOMAIN;
  if (domain) return `https://${domain}/api`;
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}/api`;
  }
  return "/api";
}

async function fetchProfile(userId: string): Promise<UserProfile | null> {
  const res = await fetch(`${getApiBase()}/profile/${encodeURIComponent(userId)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`fetchProfile HTTP ${res.status}`);
  const row = await res.json();
  return rowToProfile(row);
}

async function upsertProfile(userId: string, profile: UserProfile): Promise<void> {
  const body = {
    name: profile.name,
    bio: profile.bio,
    location: profile.location,
    role: profile.role,
    onboarding_complete: profile.onboardingComplete,
    saved_resources: profile.savedResources,
    saved_news: profile.savedNews,
  };

  // Retry a few times so a transient network blip doesn't silently drop data.
  let lastErr: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(
        `${getApiBase()}/profile/${encodeURIComponent(userId)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      if (!res.ok) throw new Error(`upsertProfile HTTP ${res.status}`);
      return;
    } catch (err) {
      lastErr = err;
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
      }
    }
  }
  throw lastErr;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { userId, isSignedIn, isLoaded: authIsLoaded } = useAuth();
  const { user: clerkUser } = useUser();
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const loadedForRef = useRef<string | null>(null);

  // When not signed in (or signed out): reset immediately and mark ready
  useEffect(() => {
    if (!authIsLoaded) return;
    if (!isSignedIn || !userId) {
      setProfile(defaultProfile);
      setIsLoaded(true);
      loadedForRef.current = null;
    }
  }, [authIsLoaded, isSignedIn, userId]);

  // When signed in: load from API server (source of truth), fall back to cache
  useEffect(() => {
    if (!isSignedIn || !userId) return;
    if (loadedForRef.current === userId) return; // already loaded for this user

    let cancelled = false;

    const load = async () => {
      setIsSyncing(true);
      try {
        const remote = await fetchProfile(userId);

        if (cancelled) return;

        if (remote !== null) {
          // Profile exists — use it and update local cache
          setProfile(remote);
          await AsyncStorage.setItem(cacheKey(userId), JSON.stringify(remote));
        } else {
          // New user — create a fresh profile on the server
          const firstName = clerkUser?.firstName || "";
          const newProfile: UserProfile = { ...defaultProfile, name: firstName };
          await upsertProfile(userId, newProfile);
          setProfile(newProfile);
          await AsyncStorage.setItem(cacheKey(userId), JSON.stringify(newProfile));
        }
      } catch (err) {
        console.warn("[UserContext] API error, using local cache:", err);
        // Network failure — fall back to cached profile
        if (!cancelled) {
          const cached = await AsyncStorage.getItem(cacheKey(userId));
          if (cached) {
            try {
              setProfile({ ...defaultProfile, ...JSON.parse(cached) });
            } catch {}
          }
        }
      } finally {
        if (!cancelled) {
          loadedForRef.current = userId;
          setIsLoaded(true);
          setIsSyncing(false);
        }
      }
    };

    load();
    return () => { cancelled = true; };
  }, [isSignedIn, userId]);

  // Optimistic update: set state + cache immediately, then confirm to server.
  // We AWAIT the server write (with retries) so callers like onboarding only
  // proceed once the data is durably persisted. On failure we throw so the
  // caller can keep the user on the current screen instead of losing data.
  const save = useCallback(async (updated: UserProfile) => {
    setProfile(updated);

    if (!isSignedIn || !userId) return;

    // Write to local cache immediately (optimistic)
    await AsyncStorage.setItem(cacheKey(userId), JSON.stringify(updated));

    // Confirm the write to the API server (retries internally).
    await upsertProfile(userId, updated);
  }, [isSignedIn, userId]);

  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      await save({ ...profile, ...updates });
    },
    [profile, save]
  );

  const toggleSaveResource = useCallback(
    async (id: string) => {
      const saved = profile.savedResources.includes(id)
        ? profile.savedResources.filter((s) => s !== id)
        : [...profile.savedResources, id];
      await save({ ...profile, savedResources: saved });
    },
    [profile, save]
  );

  const toggleSaveNews = useCallback(
    async (id: string) => {
      const saved = profile.savedNews.includes(id)
        ? profile.savedNews.filter((s) => s !== id)
        : [...profile.savedNews, id];
      await save({ ...profile, savedNews: saved });
    },
    [profile, save]
  );

  return (
    <UserContext.Provider
      value={{ profile, updateProfile, toggleSaveResource, toggleSaveNews, isLoaded, isSyncing }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserProfile() {
  return useContext(UserContext);
}
