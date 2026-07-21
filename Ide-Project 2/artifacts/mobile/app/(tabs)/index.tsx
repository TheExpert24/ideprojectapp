import { useUser } from "@clerk/expo";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useUserProfile } from "@/context/UserContext";
import { useSupabaseNews, useSupabaseResources } from "@/hooks/useSupabaseData";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { AnimatedPressable } from "@/components/AnimatedPressable";
import { FadeInView } from "@/components/FadeInView";
import { PulseLoader } from "@/components/PulseLoader";

const ROLE_LABELS: Record<string, string> = {
  exoneree_support: "Exoneree",
  exoneree_helping: "Exoneree & Mentor",
  volunteer: "Volunteer",
  professional: "Professional",
  admin: "Admin",
};

const QUICK_LINKS = [
  { label: "Journal", tab: "/(tabs)/news" },
  { label: "Resources", tab: "/(tabs)/resources" },
  { label: "Profile", tab: "/(tabs)/profile" },
];

export default function HomeScreen() {
  const { user } = useUser();
  const { profile } = useUserProfile();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const styles = makeStyles(colors, insets);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const firstName = profile.name?.split(" ")[0] || user?.firstName || "there";
  const { news: supabaseNews, loading: newsLoading } = useSupabaseNews();
  const { resources: supabaseResources, loading: resLoading } = useSupabaseResources();
  const recentNews = supabaseNews.slice(0, 3);
  const featuredResources = supabaseResources.slice(0, 3);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.hero}>
        <View>
          <Text style={styles.greeting}>{greeting()},</Text>
          <Text style={styles.name}>{firstName}</Text>
          {profile.role && (
            <View style={styles.rolePill}>
              <Text style={styles.roleLabel}>{ROLE_LABELS[profile.role]}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Quick links */}
      <FadeInView delay={100}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Links</Text>
          <View style={styles.quickLinks}>
            {QUICK_LINKS.map((item, index) => (
              <AnimatedPressable
                key={item.label}
                onPress={() => { Haptics.selectionAsync(); router.push(item.tab as any); }}
                style={styles.quickLink}
              >
                <Text style={styles.quickLinkLabel}>{item.label}</Text>
              </AnimatedPressable>
            ))}
          </View>
        </View>
      </FadeInView>

      {/* Recent News */}
      <FadeInView delay={200}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent News</Text>
            <AnimatedPressable onPress={() => { Haptics.selectionAsync(); router.push("/(tabs)/news"); }}>
              <Text style={styles.seeAll}>See all</Text>
            </AnimatedPressable>
          </View>
          {newsLoading && (
            <View style={{ paddingVertical: 20, alignItems: "center" }}>
              <PulseLoader color={colors.primary} size={8} />
            </View>
          )}
          {!newsLoading && recentNews.length === 0 && (
            <Text style={styles.emptyText}>No news yet.</Text>
          )}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
            {recentNews.map((item, index) => (
              <FadeInView key={item.id} delay={index * 100}>
                <AnimatedPressable
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/(tabs)/news"); }}
                  style={styles.newsCard}
                >
                  <View style={[styles.newsBadge, { backgroundColor: item.isEvent ? "#5B9BD520" : colors.orangePale }]}>
                    <Text style={[styles.newsBadgeText, { color: item.isEvent ? "#5B9BD5" : colors.primary }]}>
                      {item.isEvent ? "Event" : "News"}
                    </Text>
                  </View>
                  <Text style={styles.newsTitle} numberOfLines={3}>{item.title}</Text>
                  <View style={styles.newsFooter}>
                    <Text style={styles.newsDate}>{item.date}</Text>
                    <Text style={styles.newsRead}>{item.readTime}</Text>
                  </View>
                </AnimatedPressable>
              </FadeInView>
            ))}
          </ScrollView>
        </View>
      </FadeInView>

      {/* Featured Resources */}
      <FadeInView delay={300}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Resources</Text>
            <AnimatedPressable onPress={() => { Haptics.selectionAsync(); router.push("/(tabs)/resources"); }}>
              <Text style={styles.seeAll}>See all</Text>
            </AnimatedPressable>
          </View>
          {resLoading && (
            <View style={{ paddingVertical: 20, alignItems: "center" }}>
              <PulseLoader color={colors.primary} size={8} />
            </View>
          )}
          {!resLoading && featuredResources.length === 0 && (
            <Text style={styles.emptyText}>No resources yet.</Text>
          )}
          {featuredResources.map((item, index) => (
            <FadeInView key={item.id} delay={index * 80}>
              <AnimatedPressable
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/(tabs)/resources"); }}
                style={[styles.resourceRow, ...(index > 0 ? [{ marginTop: 10 }] : [])]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.resourceTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.resourceMeta}>{item.readTime} · {item.type}</Text>
                </View>
                <Text style={{ fontSize: 14, color: colors.mutedForeground }}>&gt;</Text>
              </AnimatedPressable>
            </FadeInView>
          ))}
        </View>
      </FadeInView>
    </ScrollView>
  );
}

function makeStyles(colors: ReturnType<typeof useColors>, insets: { top: number; bottom: number }) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingBottom: insets.bottom + 80 },
    hero: {
      backgroundColor: colors.card,
      paddingHorizontal: 20,
      paddingTop: insets.top + 20,
      paddingBottom: 24,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    greeting: { fontSize: 13, color: colors.mutedForeground },
    name: { fontSize: 26, fontWeight: "700", color: colors.foreground, marginTop: 2 },
    rolePill: {
      alignSelf: "flex-start",
      marginTop: 8,
      backgroundColor: colors.orangePale,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 10,
    },
    roleLabel: { fontSize: 11, fontWeight: "700", color: colors.brown },
    section: { paddingHorizontal: 20, paddingTop: 24 },
    sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
    sectionTitle: { fontSize: 17, fontWeight: "700", color: colors.foreground },
    seeAll: { fontSize: 13, fontWeight: "700", color: colors.primary },
    emptyText: { fontSize: 14, color: colors.mutedForeground, marginBottom: 8 },
    quickLinks: { flexDirection: "row", gap: 12 },
    quickLink: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 14,
    },
    quickLinkLabel: { fontSize: 14, fontWeight: "500", color: colors.foreground },
    hScroll: { gap: 12, paddingRight: 4 },
    newsCard: {
      width: 200,
      backgroundColor: colors.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
    },
    newsBadge: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginBottom: 8 },
    newsBadgeText: { fontSize: 10, fontWeight: "700" },
    newsTitle: { fontSize: 13, fontWeight: "700", color: colors.foreground, lineHeight: 18, flex: 1, marginBottom: 10 },
    newsFooter: { flexDirection: "row", justifyContent: "space-between" },
    newsDate: { fontSize: 10, color: colors.mutedForeground },
    newsRead: { fontSize: 10, color: colors.mutedForeground },
    resourceRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      backgroundColor: colors.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
    },
    resourceTitle: { fontSize: 13, fontWeight: "700", color: colors.foreground, lineHeight: 18, marginBottom: 3 },
    resourceMeta: { fontSize: 11, color: colors.mutedForeground, textTransform: "capitalize" },
  });
}
