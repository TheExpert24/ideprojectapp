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
import { useSupabaseNewsItem } from "@/hooks/useSupabaseData";
import { useUserProfile } from "@/context/UserContext";
import * as Haptics from "expo-haptics";
import { PulseLoader } from "@/components/PulseLoader";

const SITE_NAME = "The Ide Journal";
const BASE_URL = process.env.EXPO_PUBLIC_DOMAIN
  ? `https://${process.env.EXPO_PUBLIC_DOMAIN}`
  : "";

export default function NewsDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile, toggleSaveNews } = useUserProfile();
  const { item, loading, error } = useSupabaseNewsItem(id);
  const styles = makeStyles(colors, insets);

  const isSaved = item ? profile.savedNews.includes(item.id) : false;

  const categoryLabel = (cat: string) => {
    const map: Record<string, string> = {
      news: "NEWS",
      event: "EVENT",
      legal: "LEGAL",
      advocacy: "ADVOCACY",
    };
    return map[cat] || cat.toUpperCase();
  };

  const canonicalUrl = item ? `${BASE_URL}/news/${item.id}` : undefined;
  const pageTitle = item ? `${item.title} | ${SITE_NAME}` : SITE_NAME;
  const pageDescription = item?.summary ?? "";

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
          {item.isEvent && <meta property="article:tag" content="event" />}
          <meta property="article:section" content={item.category} />
          <meta property="article:published_time" content={item.date} />
          <meta name="author" content={item.source} />
        </Head>
      )}

      <Stack.Screen options={{ title: item?.title ?? "Article" }} />

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
              onPress={() => { Haptics.selectionAsync(); toggleSaveNews(item.id); }}
              accessibilityLabel={isSaved ? "Unsave article" : "Save article"}
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
            <Text style={styles.loadingText}>Loading article...</Text>
          </View>
        )}

        {/* Error */}
        {!loading && (error || !item) && (
          <View style={styles.centered}>
            <Text style={styles.errorText}>Article not found.</Text>
            <Pressable onPress={() => router.back()} style={styles.errorBack}>
              <Text style={{ color: colors.primary, fontSize: 14 }}>Go back</Text>
            </Pressable>
          </View>
        )}

        {/* Article */}
        {item && (
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Category badge */}
            <Text style={styles.sectionLabel}>{categoryLabel(item.category)}</Text>

            {/* Headline */}
            <Text style={styles.headline}>{item.title}</Text>

            {/* Byline */}
            <View style={styles.byline}>
              <Text style={styles.source}>{item.source}</Text>
              <Text style={styles.dot}> · </Text>
              <Text style={styles.meta}>{item.date}</Text>
              <Text style={styles.dot}> · </Text>
              <Text style={styles.meta}>{item.readTime} read</Text>
            </View>

            {/* Event banner */}
            {item.isEvent && (
              <View style={styles.eventBanner}>
                <Text style={styles.eventText}>{item.eventDate}</Text>
                {item.eventLocation && (
                  <Text style={styles.eventText}>{item.eventLocation}</Text>
                )}
              </View>
            )}

            {/* Lead / summary */}
            <Text style={styles.lead}>{item.summary}</Text>

            {/* Body */}
            <Text style={styles.body}>{item.content}</Text>
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
    sectionLabel: {
      fontSize: 10,
      fontWeight: "700",
      color: colors.primary,
      letterSpacing: 1.5,
      textTransform: "uppercase",
      marginBottom: 10,
    },
    headline: {
      fontSize: 26,
      fontWeight: "700",
      color: colors.foreground,
      lineHeight: 34,
      marginBottom: 14,
    },
    byline: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      marginBottom: 20,
      gap: 2,
    },
    source: { fontSize: 12, fontWeight: "700", color: colors.foreground },
    dot: { fontSize: 12, color: colors.mutedForeground },
    meta: { fontSize: 12, color: colors.mutedForeground },
    eventBanner: {
      backgroundColor: colors.orangePale,
      borderRadius: 8,
      padding: 14,
      gap: 4,
      marginBottom: 20,
    },
    eventText: { fontSize: 13, fontWeight: "700", color: colors.brown },
    lead: {
      fontSize: 17,
      fontWeight: "500",
      color: colors.foreground,
      lineHeight: 26,
      marginBottom: 20,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    body: {
      fontSize: 15,
      color: colors.foreground,
      lineHeight: 26,
    },
  });
}
