import { useAuth, useSignUp } from "@clerk/expo";
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

const SIGN_UP_TITLE = "Create Account — Exoneree Support App";
const SIGN_UP_DESCRIPTION =
  "Create a free account to access support resources, news, and community for exonerees and their advocates.";

export default function SignUpScreen() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");

  const styles = makeStyles(colors, insets);
  const isLoading = fetchStatus === "fetching";

  const needsVerification =
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields?.includes("email_address") &&
    signUp.missingFields?.length === 0;

  React.useEffect(() => {
    if (signUp.status === "complete" || isSignedIn) {
      router.replace("/" as Href);
    }
  }, [signUp.status, isSignedIn]);

  const handleSubmit = async () => {
    const { error } = await signUp.password({ emailAddress: email, password });
    if (error) {
      console.error("[SignUp error]", JSON.stringify(error, null, 2));
      return;
    }
    if (!error) await signUp.verifications.sendEmailCode();
  };

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({ code });
    if (signUp.status === "complete") {
      await signUp.finalize({
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

  if (needsVerification) {
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.topBar} />
          <View style={styles.content}>
            <View style={styles.logoArea}>
              <Text style={styles.heading}>Check your email</Text>
              <Text style={styles.subheading}>Code sent to {email}</Text>
            </View>
            <View style={styles.form}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Verification Code</Text>
                <TextInput
                  style={[styles.input, { textAlign: "center", fontSize: 24, letterSpacing: 8 }]}
                  value={code}
                  onChangeText={setCode}
                  placeholder="------"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="numeric"
                  maxLength={6}
                />
                {errors?.fields?.code && (
                  <Text style={styles.errorText}>{errors.fields.code.message}</Text>
                )}
              </View>
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
              <Pressable style={styles.textBtn} onPress={() => signUp.verifications.sendEmailCode()}>
                <Text style={styles.textBtnText}>Resend</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      {Platform.OS === "web" && (
        <Head>
          <title>{SIGN_UP_TITLE}</title>
          <meta name="description" content={SIGN_UP_DESCRIPTION} />
          <meta name="robots" content="noindex, nofollow" />
          <meta property="og:title" content={SIGN_UP_TITLE} />
          <meta property="og:description" content={SIGN_UP_DESCRIPTION} />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Exoneree Support App" />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content={SIGN_UP_TITLE} />
        </Head>
      )}
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.topBar} />
        <View style={styles.content}>
          <View style={styles.logoArea}>
            <Text style={styles.appName}>IDE APP</Text>
            <Text style={styles.heading}>Create an account</Text>
            <Text style={styles.subheading}>Join our community</Text>
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
              {errors?.fields?.emailAddress && (
                <Text style={styles.errorText}>{errors.fields.emailAddress.message}</Text>
              )}
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="At least 8 characters"
                  placeholderTextColor={colors.mutedForeground}
                  secureTextEntry={!showPassword}
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
              {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Create Account</Text>}
            </Pressable>
            <View nativeID="clerk-captcha" />
            <View style={styles.linkRow}>
              <Text style={styles.linkText}>Have an account? </Text>
              <Link href="/(auth)/sign-in" asChild>
                <Pressable>
                  <Text style={styles.linkAction}>Sign in</Text>
                </Pressable>
              </Link>
            </View>
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
    logoArea: { alignItems: "center", marginBottom: 36, marginTop: 16 },
    appName: { fontSize: 14, fontWeight: "700", color: colors.primary, letterSpacing: 3, marginBottom: 12 },
    heading: { fontSize: 26, fontWeight: "700", color: colors.foreground, marginBottom: 6 },
    subheading: { fontSize: 14, color: colors.mutedForeground, textAlign: "center" },
    form: { gap: 4 },
    fieldGroup: { marginBottom: 14 },
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
