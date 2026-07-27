import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Head from "expo-router/head";
import { useColors } from "@/hooks/useColors";
import { CATEGORIES as ALL_CATEGORIES, Resource, ResourceCategory } from "@/data/resources";
import { useSupabaseResources } from "@/hooks/useSupabaseData";
import { useUserProfile } from "@/context/UserContext";
import * as Haptics from "expo-haptics";
import { AnimatedPressable } from "@/components/AnimatedPressable";
import { FadeInView } from "@/components/FadeInView";
import { PulseLoader } from "@/components/PulseLoader";

const BASE_URL = process.env.EXPO_PUBLIC_DOMAIN
  ? `https://${process.env.EXPO_PUBLIC_DOMAIN}`
  : "";
const RESOURCES_TITLE = "Resources — Exoneree Support App";
const RESOURCES_DESCRIPTION =
  "Guides, legal information, housing support, financial assistance, and community contacts for exonerees and their families.";

export default function ResourcesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile, toggleSaveResource } = useUserProfile();
  const [activeCategory, setActiveCategory] = useState<ResourceCategory | "all">("all");
  const styles = makeStyles(colors, insets);
  const { resources: supabaseResources, loading } = useSupabaseResources();

  const CATEGORIES = ALL_CATEGORIES;

  const filtered = activeCategory === "all"
    ? supabaseResources
    : supabaseResources.filter((r) => r.category === activeCategory);

  const catColor = (cat: ResourceCategory) => {
    const map: Record<string, string> = {
      financial: "#4CAF80",
      housing: "#5B9BD5",
      legal: "#7B68B5",
      employment: "#E07535",
      mental: "#E86D8A",
      benefits: "#5B9BD5",
      community: "#A07850",
    };
    return map[cat] || colors.orange;
  };

  const openItem = (item: Resource) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/resources/${item.id}`);
  };

  return (
    <View style={styles.container}>
      {Platform.OS === "web" && (
        <Head>
          <title>{RESOURCES_TITLE}</title>
          <meta name="description" content={RESOURCES_DESCRIPTION} />
          <meta name="robots" content="index, follow" />
          {BASE_URL && <link rel="canonical" href={`${BASE_URL}/resources`} />}
          <meta property="og:type" content="website" />
          <meta property="og:title" content={RESOURCES_TITLE} />
          <meta property="og:description" content={RESOURCES_DESCRIPTION} />
          {BASE_URL && <meta property="og:url" content={`${BASE_URL}/resources`} />}
          <meta property="og:site_name" content="Exoneree Support App" />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content={RESOURCES_TITLE} />
          <meta name="twitter:description" content={RESOURCES_DESCRIPTION} />
        </Head>
      )}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Resources</Text>
        <Text style={styles.headerSub}>Guides and tools</Text>
      </View>

      <View style={styles.catWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cats}>
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.id}
              style={[styles.catChip, activeCategory === cat.id && styles.catChipActive]}
              onPress={() => { Haptics.selectionAsync(); setActiveCategory(cat.id); }}
            >
              <Text style={[styles.catText, activeCategory === cat.id && styles.catTextActive]}>{cat.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {loading && (
        <View style={{ paddingTop: 40, alignItems: "center" }}>
          <PulseLoader color={colors.primary} size={10} />
          <Text style={{ fontSize: 12, color: colors.mutedForeground, marginTop: 12 }}>Loading resources...</Text>
        </View>
      )}

      {!loading && filtered.length === 0 && (
        <View style={{ paddingHorizontal: 20, paddingTop: 40 }}>
          <Text style={{ fontSize: 14, color: colors.mutedForeground }}>
            No resources yet.
          </Text>
        </View>
      )}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const isSaved = profile.savedResources.includes(item.id);
          const cc = catColor(item.category);
          return (
            <FadeInView delay={index * 60}>
              <AnimatedPressable
                onPress={() => openItem(item)}
                style={styles.card}
              >
                <View style={styles.cardBody}>
                  <View style={styles.cardTopRow}>
                    <View style={[styles.badge, { backgroundColor: cc + "18" }]}>
                      <Text style={[styles.badgeText, { color: cc }]}>
                        {CATEGORIES.find((c) => c.id === item.category)?.label}
                      </Text>
                    </View>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText2}>{item.type}</Text>
                    </View>
                  </View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.readTime}>{item.readTime}</Text>
                    <Pressable onPress={() => { Haptics.selectionAsync(); toggleSaveResource(item.id); }}>
                      <Text style={{ fontSize: 14, color: isSaved ? colors.primary : colors.mutedForeground }}>
                        {isSaved ? "Saved" : "Save"}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </AnimatedPressable>
            </FadeInView>
          );
        }}
      />
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof useColors>, insets: { top: number; bottom: number }) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { paddingHorizontal: 20, paddingTop: insets.top + 16, paddingBottom: 12 },
    headerTitle: { fontSize: 26, fontWeight: "700", color: colors.foreground },
    headerSub: { fontSize: 13, color: colors.mutedForeground, marginTop: 2 },
    catWrap: { marginBottom: 8 },
    cats: { paddingHorizontal: 20, gap: 8 },
    catChip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.muted,
    },
    catChipActive: { backgroundColor: colors.primary },
    catText: { fontSize: 12, fontWeight: "500", color: colors.mutedForeground },
    catTextActive: { color: "#fff" },
    list: { paddingHorizontal: 20, paddingBottom: insets.bottom + 100, gap: 12 },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
    },
    cardBody: { flex: 1 },
    cardTopRow: { flexDirection: "row", gap: 6, marginBottom: 6 },
    badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: colors.muted },
    badgeText: { fontSize: 10, fontWeight: "700" },
    badgeText2: { fontSize: 10, fontWeight: "700", color: colors.mutedForeground, textTransform: "capitalize" },
    cardTitle: { fontSize: 15, fontWeight: "700", color: colors.foreground, marginBottom: 4, lineHeight: 20 },
    cardDesc: { fontSize: 12, color: colors.mutedForeground, lineHeight: 17, marginBottom: 10 },
    cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    readTime: { fontSize: 11, color: colors.mutedForeground },
  });
}
