import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import Head from "expo-router/head";
import { useColors } from "@/hooks/useColors";
import { CATEGORIES } from "@/data/resources";
import { useSupabaseResourceItem } from "@/hooks/useSupabaseData";
import { useUserProfile } from "@/context/UserContext";
import * as Haptics from "expo-haptics";
import { PulseLoader } from "@/components/PulseLoader";
import { ResourceCategory } from "@/data/resources";

const SITE_NAME = "Exoneree Support App";
const BASE_URL = process.env.EXPO_PUBLIC_DOMAIN
  ? `https://${process.env.EXPO_PUBLIC_DOMAIN}`
  : "";

export default function ResourceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile, toggleSaveResource } = useUserProfile();
  const { item, loading, error } = useSupabaseResourceItem(id);
  const styles = makeStyles(colors, insets);

  const isSaved = item ? profile.savedResources.includes(item.id) : false;

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

  const catLabel = item
    ? CATEGORIES.find((c) => c.id === item.category)?.label ?? item.category
    : "";

  const canonicalUrl = item ? `${BASE_URL}/resources/${item.id}` : undefined;
  const pageTitle = item ? `${item.title} | ${SITE_NAME}` : SITE_NAME;
  const pageDescription = item?.description ?? "";

  return (
    <>
      {Platform.OS === "web" && item && (
        <Head>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
          <meta property="og:type" content="article" />
          <meta property="og:title" content={item.title} />
          <meta property="og:description" content={pageDescription} />
          {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
          <meta property="og:site_name" content={SITE_NAME} />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content={item.title} />
          <meta name="twitter:description" content={pageDescription} />
          <meta property="article:section" content={item.category} />
          {item.tags?.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </Head>
      )}

      <Stack.Screen options={{ title: item?.title ?? "Resource" }} />

      <View style={styles.container}>
        {/* Header bar */}
        <View style={styles.headerBar}>
          <Pressable
            style={styles.backBtn}
            onPress={() => router.back()}
            accessibilityLabel="Go back"
          >
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
          {item && (
            <Pressable
              onPress={() => { Haptics.selectionAsync(); toggleSaveResource(item.id); }}
              accessibilityLabel={isSaved ? "Unsave resource" : "Save resource"}
            >
              <Text style={[styles.saveText, isSaved && { color: colors.primary }]}>
                {isSaved ? "Saved" : "Save"}
              </Text>
            </Pressable>
          )}
        </View>

        {/* Loading */}
        {loading && (
          <View style={styles.centered}>
            <PulseLoader color={colors.primary} size={10} />
            <Text style={styles.loadingText}>Loading resource...</Text>
          </View>
        )}

        {/* Error / Not found */}
        {!loading && (error || !item) && (
          <View style={styles.centered}>
            <Text style={styles.errorText}>Resource not found.</Text>
            <Pressable onPress={() => router.back()} style={styles.errorBack}>
              <Text style={{ color: colors.primary, fontSize: 14 }}>Go back</Text>
            </Pressable>
          </View>
        )}

        {/* Resource content */}
        {item && (
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Badges */}
            <View style={styles.badges}>
              <View style={[styles.badge, { backgroundColor: catColor(item.category) + "18" }]}>
                <Text style={[styles.badgeText, { color: catColor(item.category) }]}>
                  {catLabel}
                </Text>
              </View>
              <View style={styles.badge2}>
                <Text style={styles.badgeText2}>{item.type}</Text>
              </View>
            </View>

            {/* Title */}
            <Text style={styles.title}>{item.title}</Text>

            {/* Read time */}
            <Text style={styles.readTime}>{item.readTime}</Text>

            {/* Description */}
            <Text style={styles.description}>{item.description}</Text>

            <View style={styles.divider} />

            {/* Body */}
            <Text style={styles.body}>{item.content}</Text>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <View style={styles.tagsWrap}>
                {item.tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </>
  );
}

function makeStyles(colors: ReturnType<typeof useColors>, insets: { top: number; bottom: number }) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    headerBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingTop: insets.top + 12,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backBtn: {
      paddingVertical: 4,
      paddingRight: 12,
    },
    backText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.primary,
    },
    saveText: {
      fontSize: 13,
      fontWeight: "500",
      color: colors.mutedForeground,
    },
    centered: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
    },
    loadingText: {
      fontSize: 13,
      color: colors.mutedForeground,
      marginTop: 12,
    },
    errorText: {
      fontSize: 15,
      color: colors.mutedForeground,
    },
    errorBack: {
      marginTop: 8,
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: insets.bottom + 60,
    },
    badges: {
      flexDirection: "row",
      gap: 6,
      marginBottom: 14,
    },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 6,
    },
    badge2: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 6,
      backgroundColor: colors.muted,
    },
    badgeText: { fontSize: 11, fontWeight: "700" },
    badgeText2: { fontSize: 11, fontWeight: "700", color: colors.mutedForeground, textTransform: "capitalize" },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.foreground,
      lineHeight: 32,
      marginBottom: 8,
    },
    readTime: {
      fontSize: 12,
      color: colors.mutedForeground,
      marginBottom: 16,
    },
    description: {
      fontSize: 15,
      fontWeight: "500",
      color: colors.foreground,
      lineHeight: 23,
      marginBottom: 20,
    },
    divider: { height: 1, backgroundColor: colors.border, marginBottom: 20 },
    body: {
      fontSize: 15,
      color: colors.foreground,
      lineHeight: 26,
      marginBottom: 24,
    },
    tagsWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    tag: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
      backgroundColor: colors.muted,
    },
    tagText: {
      fontSize: 11,
      color: colors.mutedForeground,
    },
  });
}
