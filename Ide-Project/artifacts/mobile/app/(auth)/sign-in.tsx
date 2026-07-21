import { useSignIn } from "@clerk/expo";
import { Link, type Href, useRouter } from "expo-router";
import Head from "expo-router/head";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useAdmin } from "@/context/AdminContext";

const SIGN_IN_TITLE = "Sign In — Exoneree Support App";
const SIGN_IN_DESCRIPTION =
  "Sign in to access your Exoneree Support App account and connect with resources, news, and community support.";

export default function SignInScreen() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { adminSignIn } = useAdmin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");

  const styles = makeStyles(colors, insets);
  const isLoading = fetchStatus === "fetching";

  const handleSubmit = async () => {
    const { error } = await signIn.password({ emailAddress: email, password });
    if (error) {
      console.error("[SignIn error]", JSON.stringify(error, null, 2));
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return;
          const url = decorateUrl("/");
          if (typeof window !== "undefined" && url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.replace(url as Href);
          }
        },
      });
    } else if (signIn.status === "needs_client_trust") {
      const factor = signIn.supportedSecondFactors?.find(
        (f) => f.strategy === "email_code"
      );
      if (factor) await signIn.mfa.sendEmailCode();
    } else {
      console.error("[SignIn] Incomplete:", signIn);
    }
  };

  const handleVerify = async () => {
    await signIn.mfa.verifyEmailCode({ code });
    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return;
          const url = decorateUrl("/");
          if (typeof window !== "undefined" && url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.replace(url as Href);
          }
        },
      });
    }
  };

  const handleAdminLogin = () => {
    const ok = adminSignIn(email, password);
    if (ok) {
      router.replace("/(tabs)" as Href);
    } else {
      // fall through to normal error display if credentials wrong
    }
  };

  if (signIn.status === "needs_client_trust") {
    return (
      <View style={styles.container}>
        {Platform.OS === "web" && (
          <Head>
            <title>Verify Identity — Exoneree Support App</title>
          </Head>
        )}
        <View style={styles.topBar} />
        <View style={styles.content}>
          <View style={styles.logoArea}>
            <Text style={styles.heading}>Verify Your Identity</Text>
            <Text style={styles.subheading}>Enter the code sent to your email</Text>
          </View>
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              value={code}
              onChangeText={setCode}
              placeholder="6-digit code"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="numeric"
              textAlign="center"
              maxLength={6}
            />
            {errors?.fields?.code && (
              <Text style={styles.errorText}>{errors.fields.code.message}</Text>
            )}
            <Pressable
              style={({ pressed }) => [
                styles.primaryBtn,
                pressed && styles.pressed,
                (isLoading || !code) && styles.disabled,
              ]}
              onPress={handleVerify}
              disabled={isLoading || !code}
            >
              {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Verify</Text>}
            </Pressable>
            <Pressable style={styles.textBtn} onPress={() => signIn.mfa.sendEmailCode()}>
              <Text style={styles.textBtnText}>Resend code</Text>
            </Pressable>
            <Pressable style={styles.textBtn} onPress={() => signIn.reset()}>
              <Text style={styles.textBtnText}>Start over</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      {Platform.OS === "web" && (
        <Head>
          <title>{SIGN_IN_TITLE}</title>
          <meta name="description" content={SIGN_IN_DESCRIPTION} />
          <meta name="robots" content="noindex, nofollow" />
          <meta property="og:title" content={SIGN_IN_TITLE} />
          <meta property="og:description" content={SIGN_IN_DESCRIPTION} />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Exoneree Support App" />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content={SIGN_IN_TITLE} />
        </Head>
      )}
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.topBar} />
        <View style={styles.content}>
          <View style={styles.logoArea}>
            <Text style={styles.appName}>IDE APP</Text>
            <Text style={styles.heading}>Welcome back</Text>
            <Text style={styles.subheading}>Sign in or use admin credentials</Text>
          </View>
          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={colors.mutedForeground}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
              {errors?.fields?.identifier && (
                <Text style={styles.errorText}>{errors.fields.identifier.message}</Text>
              )}
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Your password"
                  placeholderTextColor={colors.mutedForeground}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                />
                <Pressable style={styles.showBtn} onPress={() => setShowPassword((s) => !s)}>
                  <Text style={styles.showBtnText}>{showPassword ? "Hide" : "Show"}</Text>
                </Pressable>
              </View>
              {errors?.fields?.password && (
                <Text style={styles.errorText}>{errors.fields.password.message}</Text>
              )}
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.primaryBtn,
                pressed && styles.pressed,
                (isLoading || !email || !password) && styles.disabled,
              ]}
              onPress={handleSubmit}
              disabled={isLoading || !email || !password}
            >
              {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Sign In</Text>}
            </Pressable>

            <View style={styles.linkRow}>
              <Text style={styles.linkText}>No account? </Text>
              <Link href="/(auth)/sign-up" asChild>
                <Pressable>
                  <Text style={styles.linkAction}>Sign up</Text>
                </Pressable>
              </Link>
            </View>

            <Pressable
              style={({ pressed }) => [styles.adminLink, pressed && styles.pressed]}
              onPress={handleAdminLogin}
            >
              <Text style={styles.adminLinkText}>Admin access</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function makeStyles(colors: ReturnType<typeof useColors>, insets: { top: number; bottom: number }) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { flexGrow: 1 },
    topBar: { height: insets.top + 16 },
    content: { flex: 1, paddingHorizontal: 28, paddingBottom: insets.bottom + 40 },
    logoArea: { alignItems: "center", marginBottom: 40, marginTop: 20 },
    appName: { fontSize: 14, fontWeight: "700", color: colors.primary, letterSpacing: 3, marginBottom: 12 },
    heading: { fontSize: 28, fontWeight: "700", color: colors.foreground, marginBottom: 6 },
    subheading: { fontSize: 15, color: colors.mutedForeground, textAlign: "center" },
    form: { gap: 4 },
    fieldGroup: { marginBottom: 16 },
    label: { fontSize: 13, fontWeight: "700", color: colors.foreground, marginBottom: 8 },
    input: {
      backgroundColor: colors.card,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      color: colors.foreground,
    },
    passwordRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    showBtn: {
      height: 50,
      paddingHorizontal: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.card,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 12,
    },
    showBtnText: { fontSize: 13, fontWeight: "500", color: colors.mutedForeground },
    primaryBtn: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: "center", marginTop: 8 },
    primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
    adminLink: { alignItems: "center", marginTop: 6 },
    adminLinkText: { color: colors.mutedForeground, fontSize: 12 },
    pressed: { opacity: 0.85 },
    disabled: { opacity: 0.5 },
    textBtn: { alignItems: "center", paddingVertical: 12 },
    textBtnText: { color: colors.primary, fontSize: 14, fontWeight: "500" },
    linkRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 20 },
    linkText: { color: colors.mutedForeground, fontSize: 14 },
    linkAction: { color: colors.primary, fontSize: 14, fontWeight: "700" },
    errorText: { color: colors.destructive, fontSize: 12, marginTop: 4 },
  });
}
