import { ClerkLoaded, ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@/lib/tokenCache";
import { setBaseUrl } from "@workspace/api-client-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import Head from "expo-router/head";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { UserProvider } from "@/context/UserContext";
import { SupabaseProvider } from "@/context/SupabaseContext";
import { AdminProvider } from "@/context/AdminContext";
import { ThemeProvider } from "@/context/ThemeContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const domain = process.env.EXPO_PUBLIC_DOMAIN;
if (domain) setBaseUrl(`https://${domain}`);

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
const proxyUrl = process.env.EXPO_PUBLIC_CLERK_PROXY_URL || undefined;

const SITE_DESCRIPTION =
  "The Ide App connects people who have been wrongfully convicted with resources, news, legal guidance, and a supportive community.";

function RootLayoutNav() {
  return (
    <>
      {Platform.OS === "web" && (
        <Head>
          <title>The Ide App</title>
          <meta name="description" content={SITE_DESCRIPTION} />
          <meta name="robots" content="index, follow" />
          <meta property="og:site_name" content="The Ide App" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="The Ide App" />
          <meta property="og:description" content={SITE_DESCRIPTION} />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content="The Ide App" />
          <meta name="twitter:description" content={SITE_DESCRIPTION} />
        </Head>
      )}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      tokenCache={tokenCache}
      proxyUrl={proxyUrl}
    >
      <ClerkLoaded>
        <SafeAreaProvider>
          <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
              <SupabaseProvider>
                <ThemeProvider>
                  <AdminProvider>
                    <UserProvider>
                      <GestureHandlerRootView>
                        <KeyboardProvider>
                          <RootLayoutNav />
                        </KeyboardProvider>
                      </GestureHandlerRootView>
                    </UserProvider>
                  </AdminProvider>
                </ThemeProvider>
              </SupabaseProvider>
            </QueryClientProvider>
          </ErrorBoundary>
        </SafeAreaProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
