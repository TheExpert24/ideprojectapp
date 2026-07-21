import { useAuth, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { useAdmin } from "@/context/AdminContext";
import { useTheme } from "@/context/ThemeContext";
import * as Haptics from "expo-haptics";

const ROLE_LABELS: Record<string, string> = {
  exoneree_support: "Exoneree",
  exoneree_helping: "Mentor",
  volunteer: "Volunteer",
  professional: "Professional",
};

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const { profile, updateProfile, isLoaded } = useUserProfile();
  const { isAdmin, adminSignOut } = useAdmin();
  const { mode, resolved, setMode } = useTheme();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const styles = makeStyles(colors, insets);

  // Sync edit fields whenever the server-loaded profile arrives or changes
  useEffect(() => {
    if (!editing) {
      setName(profile.name || user?.firstName || "");
      setBio(profile.bio || "");
      setLocation(profile.location || "");
    }
  }, [profile.name, profile.bio, profile.location, isLoaded, editing]);

  const isRegularUser = !isAdmin;

  const handleSave = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await updateProfile({ name, bio, location });
    setEditing(false);
  };

  const doSignOut = async () => {
    setSigningOut(true);
    try {
      if (isAdmin) {
        await adminSignOut();
      } else {
        await signOut();
      }
      // index.tsx redirects automatically when auth state clears
    } finally {
      setSigningOut(false);
      setConfirmSignOut(false);
    }
  };

  const doDeleteAccount = async () => {
    setDeleting(true);
    try {
      await user?.delete?.();
      await signOut();
    } catch {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const savedCount = profile.savedResources.length;
  const newsCount = profile.savedNews.length;

  const themeLabel = resolved === "dark" ? "Dark" : "Light";
  const themeOptions: Array<{ label: string; value: "light" | "dark" | "system" }> = [
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
    { label: "System", value: "system" },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {isAdmin ? "Administrator" : (profile.name || user?.firstName || user?.emailAddresses[0]?.emailAddress || "User")}
          </Text>
          {isRegularUser && (
            <Text style={styles.userEmail}>{user?.emailAddresses[0]?.emailAddress}</Text>
          )}
          {isAdmin && (
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>Admin</Text>
            </View>
          )}
          {isRegularUser && profile.role && (
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{ROLE_LABELS[profile.role] || profile.role}</Text>
            </View>
          )}
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{savedCount}</Text>
            <Text style={styles.statLabel}>Saved Resources</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{newsCount}</Text>
            <Text style={styles.statLabel}>Saved News</Text>
          </View>
        </View>
      </View>

      {isRegularUser && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Profile</Text>
            <Pressable onPress={() => { Haptics.selectionAsync(); setEditing(!editing); }}>
              <Text style={styles.editBtn}>{editing ? "Cancel" : "Edit"}</Text>
            </Pressable>
          </View>

          {editing ? (
            <View style={styles.editForm}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  placeholderTextColor={colors.mutedForeground}
                />
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Location</Text>
                <TextInput
                  style={styles.input}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="City, State"
                  placeholderTextColor={colors.mutedForeground}
                />
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Bio</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Tell others about yourself..."
                  placeholderTextColor={colors.mutedForeground}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
              <Pressable style={({ pressed }) => [styles.saveBtn, pressed && styles.pressed]} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.profileFields}>
              <ProfileRow label="Name" value={profile.name || user?.firstName || "Not set"} colors={colors} />
              <ProfileRow label="Location" value={profile.location || "Not set"} colors={colors} />
              <ProfileRow label="Bio" value={profile.bio || "No bio yet"} colors={colors} />
            </View>
          )}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.menuCard}>
          {themeOptions.map((opt, idx) => (
            <React.Fragment key={opt.value}>
              {idx > 0 && <View style={styles.menuDivider} />}
              <Pressable
                style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
                onPress={() => { Haptics.selectionAsync(); setMode(opt.value); }}
              >
                <Text style={styles.menuText}>{opt.label}</Text>
                {mode === opt.value && (
                  <Text style={{ fontSize: 14, color: colors.primary, fontWeight: "700" }}>Active</Text>
                )}
              </Pressable>
            </React.Fragment>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.menuCard}>
          {isRegularUser && (
            <>
              <Pressable
                style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
                onPress={() => {
                  Haptics.selectionAsync();
                  updateProfile({ onboardingComplete: false, role: null });
                  router.replace("/(auth)/onboarding");
                }}
              >
                <Text style={styles.menuText}>Change My Role</Text>
                <Text style={{ fontSize: 14, color: colors.mutedForeground }}>›</Text>
              </Pressable>
              <View style={styles.menuDivider} />
            </>
          )}

          {confirmSignOut ? (
            <View style={styles.menuItem}>
              <Text style={[styles.menuText, { color: colors.destructive }]}>Sign out?</Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Pressable
                  onPress={() => setConfirmSignOut(false)}
                  style={({ pressed }) => [styles.inlineBtn, pressed && styles.pressed]}
                >
                  <Text style={styles.inlineBtnCancel}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={doSignOut}
                  disabled={signingOut}
                  style={({ pressed }) => [styles.inlineBtn, styles.inlineBtnDanger, pressed && styles.pressed]}
                >
                  {signingOut
                    ? <ActivityIndicator size="small" color="#fff" />
                    : <Text style={styles.inlineBtnDangerText}>Sign Out</Text>}
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable
              style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
              onPress={() => { Haptics.selectionAsync(); setConfirmSignOut(true); }}
            >
              <Text style={[styles.menuText, { color: colors.destructive }]}>Sign Out</Text>
            </Pressable>
          )}

          {isRegularUser && (
            <>
              <View style={styles.menuDivider} />
              {confirmDelete ? (
                <View style={styles.menuItem}>
                  <Text style={[styles.menuText, { color: colors.destructive, fontSize: 13 }]}>Delete forever?</Text>
                  <View style={{ flexDirection: "row", gap: 10 }}>
                    <Pressable
                      onPress={() => setConfirmDelete(false)}
                      style={({ pressed }) => [styles.inlineBtn, pressed && styles.pressed]}
                    >
                      <Text style={styles.inlineBtnCancel}>Cancel</Text>
                    </Pressable>
                    <Pressable
                      onPress={doDeleteAccount}
                      disabled={deleting}
                      style={({ pressed }) => [styles.inlineBtn, styles.inlineBtnDanger, pressed && styles.pressed]}
                    >
                      {deleting
                        ? <ActivityIndicator size="small" color="#fff" />
                        : <Text style={styles.inlineBtnDangerText}>Delete</Text>}
                    </Pressable>
                  </View>
                </View>
              ) : (
                <Pressable
                  style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
                  onPress={() => { Haptics.selectionAsync(); setConfirmDelete(true); }}
                >
                  <Text style={[styles.menuText, { color: colors.destructive }]}>Delete Account</Text>
                </Pressable>
              )}
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

function ProfileRow({ label, value, colors }: { label: string; value: string; colors: any }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 11, fontWeight: "700", color: colors.mutedForeground, marginBottom: 2 }}>{label}</Text>
        <Text style={{ fontSize: 14, color: colors.foreground }}>{value}</Text>
      </View>
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof useColors>, insets: { top: number; bottom: number }) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingBottom: insets.bottom + 100 },
    header: {
      backgroundColor: colors.card,
      paddingHorizontal: 20,
      paddingTop: insets.top + 20,
      paddingBottom: 24,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    userInfo: { marginBottom: 20 },
    userName: { fontSize: 18, fontWeight: "700", color: colors.foreground },
    userEmail: { fontSize: 12, color: colors.mutedForeground, marginBottom: 6 },
    roleBadge: {
      alignSelf: "flex-start",
      backgroundColor: colors.orangePale,
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 3,
      marginTop: 6,
    },
    roleText: { fontSize: 11, fontWeight: "700", color: colors.brown },
    stats: {
      flexDirection: "row",
      backgroundColor: colors.muted,
      borderRadius: 14,
      overflow: "hidden",
    },
    statItem: { flex: 1, alignItems: "center", paddingVertical: 14 },
    statNum: { fontSize: 22, fontWeight: "700", color: colors.primary },
    statLabel: { fontSize: 11, color: colors.mutedForeground, marginTop: 2 },
    statDivider: { width: 1, backgroundColor: colors.border },
    section: { paddingHorizontal: 20, paddingTop: 24, marginBottom: 8 },
    sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
    sectionTitle: { fontSize: 16, fontWeight: "700", color: colors.foreground },
    editBtn: { fontSize: 14, fontWeight: "700", color: colors.primary },
    editForm: { gap: 4 },
    fieldGroup: { marginBottom: 14 },
    label: { fontSize: 12, fontWeight: "700", color: colors.mutedForeground, marginBottom: 6 },
    input: {
      backgroundColor: colors.card,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 14,
      color: colors.foreground,
    },
    textArea: { height: 96, paddingTop: 12 },
    saveBtn: { backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: "center", marginTop: 4 },
    saveBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
    pressed: { opacity: 0.88 },
    profileFields: {},
    menuCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    menuItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 14 },
    menuText: { fontSize: 14, fontWeight: "500", color: colors.foreground },
    menuDivider: { height: 1, backgroundColor: colors.border, marginHorizontal: 16 },
    inlineBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
    inlineBtnCancel: { fontSize: 13, fontWeight: "600", color: colors.mutedForeground },
    inlineBtnDanger: { backgroundColor: colors.destructive, borderColor: colors.destructive },
    inlineBtnDangerText: { fontSize: 13, fontWeight: "600", color: "#fff" },
  });
}
