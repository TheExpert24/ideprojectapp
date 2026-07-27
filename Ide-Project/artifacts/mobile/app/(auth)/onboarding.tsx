import { useRouter } from "expo-router";
import Head from "expo-router/head";
import React, { useState } from "react";
import {
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
import { useUserProfile, UserRole } from "@/context/UserContext";

const ONBOARDING_TITLE = "Complete Your Profile — Exoneree Support App";
const ONBOARDING_DESCRIPTION =
  "Set up your profile to personalise your Exoneree Support App experience and connect with the right resources for your role.";

const ROLES: { id: UserRole; title: string; subtitle: string }[] = [
  { id: "exoneree_support", title: "Exoneree", subtitle: "Looking for support after release." },
  { id: "exoneree_helping", title: "Mentor", subtitle: "Supporting fellow exonerees." },
  { id: "volunteer", title: "Volunteer", subtitle: "Helping the community." },
  { id: "professional", title: "Professional", subtitle: "Lawyer, advisor, or advocate." },
];

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { updateProfile } = useUserProfile();

  const [step, setStep] = useState<"name" | "role">("name");
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<UserRole>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const styles = makeStyles(colors, insets);

  const handleNameContinue = () => {
    if (!name.trim()) return;
    setStep("role");
  };

  const handleFinish = async () => {
    if (!selected || saving) return;
    setSaving(true);
    setSaveError(null);
    try {
      await updateProfile({
        name: name.trim(),
        role: selected,
        onboardingComplete: true,
      });
      router.replace("/(tabs)");
    } catch {
      setSaveError(
        "We couldn't save your profile. Please check your connection and try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (step === "name") {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {Platform.OS === "web" && (
          <Head>
            <title>{ONBOARDING_TITLE}</title>
            <meta name="description" content={ONBOARDING_DESCRIPTION} />
            <meta name="robots" content="noindex, nofollow" />
            <meta property="og:title" content={ONBOARDING_TITLE} />
            <meta property="og:site_name" content="Exoneree Support App" />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content={ONBOARDING_TITLE} />
          </Head>
        )}
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.appName}>IDE APP</Text>
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.subtitle}>What should we call you?</Text>
          </View>

          <View style={styles.nameSection}>
            <Text style={styles.label}>Your name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Full name"
              placeholderTextColor={colors.mutedForeground}
              autoCapitalize="words"
              autoFocus
              returnKeyType="next"
              onSubmitEditing={handleNameContinue}
            />
            <Text style={styles.hint}>
              This is how you'll appear to others in the community.
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.continueBtn,
              (!name.trim()) && styles.disabled,
              pressed && styles.pressed,
            ]}
            onPress={handleNameContinue}
            disabled={!name.trim()}
          >
            <Text style={styles.continueBtnText}>Continue</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.appName}>IDE APP</Text>
        <Text style={styles.title}>Hi, {name.trim().split(" ")[0]}!</Text>
        <Text style={styles.subtitle}>
          Which best describes you? This helps us personalize your experience.
        </Text>
      </View>

      <View style={styles.cards}>
        {ROLES.map((role) => {
          const isSelected = selected === role.id;
          return (
            <Pressable
              key={role.id}
              style={({ pressed }) => [
                styles.card,
                isSelected && styles.cardSelected,
                pressed && styles.pressed,
              ]}
              onPress={() => setSelected(role.id)}
            >
              <View style={styles.cardText}>
                <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
                  {role.title}
                </Text>
                <Text style={[styles.cardSub, isSelected && styles.cardSubSelected]}>
                  {role.subtitle}
                </Text>
              </View>
              {isSelected && (
                <Text style={{ fontSize: 18, color: colors.primary }}>✓</Text>
              )}
            </Pressable>
          );
        })}
      </View>

      {saveError && <Text style={styles.errorText}>{saveError}</Text>}

      <Pressable
        style={({ pressed }) => [
          styles.continueBtn,
          (!selected || saving) && styles.disabled,
          pressed && styles.pressed,
        ]}
        onPress={handleFinish}
        disabled={!selected || saving}
      >
        <Text style={styles.continueBtnText}>
          {saving ? "Saving…" : "Get Started"}
        </Text>
      </Pressable>

      <Pressable style={styles.backBtn} onPress={() => setStep("name")}>
        <Text style={styles.backBtnText}>← Back</Text>
      </Pressable>
    </ScrollView>
  );
}

function makeStyles(colors: ReturnType<typeof useColors>, insets: { top: number; bottom: number }) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: {
      paddingHorizontal: 24,
      paddingTop: insets.top + 24,
      paddingBottom: insets.bottom + 48,
      flexGrow: 1,
    },
    header: { alignItems: "center", marginBottom: 32 },
    appName: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.primary,
      letterSpacing: 3,
      marginBottom: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.foreground,
      textAlign: "center",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 15,
      color: colors.mutedForeground,
      textAlign: "center",
      lineHeight: 22,
      paddingHorizontal: 8,
    },
    nameSection: { marginBottom: 32 },
    label: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.foreground,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.card,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 17,
      color: colors.foreground,
      marginBottom: 10,
    },
    hint: {
      fontSize: 12,
      color: colors.mutedForeground,
      lineHeight: 17,
    },
    cards: { gap: 12, marginBottom: 32 },
    card: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: colors.border,
      paddingHorizontal: 18,
      paddingVertical: 16,
      gap: 12,
    },
    cardSelected: { borderColor: colors.primary, backgroundColor: colors.orangePale },
    cardText: { flex: 1 },
    cardTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.foreground,
      marginBottom: 3,
    },
    cardTitleSelected: { color: colors.primary },
    cardSub: { fontSize: 13, color: colors.mutedForeground, lineHeight: 18 },
    cardSubSelected: { color: colors.brown },
    pressed: { opacity: 0.88 },
    disabled: { opacity: 0.45 },
    continueBtn: {
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: "center",
    },
    continueBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
    errorText: {
      color: "#E05353",
      fontSize: 14,
      textAlign: "center",
      marginBottom: 12,
    },
    backBtn: { alignItems: "center", marginTop: 14 },
    backBtnText: { color: colors.mutedForeground, fontSize: 14 },
  });
}
