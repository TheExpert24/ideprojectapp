import React, { useState, useMemo } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Head from "expo-router/head";
import { useColors } from "@/hooks/useColors";
import { NewsItem } from "@/data/news";
import { useSupabaseNews } from "@/hooks/useSupabaseData";
import { useUserProfile } from "@/context/UserContext";
import * as Haptics from "expo-haptics";
import { AnimatedPressable } from "@/components/AnimatedPressable";
import { FadeInView } from "@/components/FadeInView";
import { PulseLoader } from "@/components/PulseLoader";

const FILTERS = ["All", "News", "Events", "Legal", "Advocacy"];

const BASE_URL = process.env.EXPO_PUBLIC_DOMAIN
  ? `https://${process.env.EXPO_PUBLIC_DOMAIN}`
  : "";
const JOURNAL_TITLE = "The Ide Journal — Exoneree Support App";
const JOURNAL_DESCRIPTION =
  "News, legal updates, and advocacy coverage curated for the exoneree community. Stay informed on wrongful conviction cases, resources, and events.";

export default function JournalScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile, toggleSaveNews } = useUserProfile();
  const { news: supabaseNews, loading } = useSupabaseNews();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const styles = makeStyles(colors, insets);

  const filtered = useMemo(() => {
    let items = supabaseNews;
    if (activeFilter !== "All") {
      items = items.filter((item) => item.category === activeFilter.toLowerCase());
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.source.toLowerCase().includes(q)
      );
    }
    return items;
  }, [supabaseNews, activeFilter, searchQuery]);

  const openItem = (item: NewsItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/news/${item.id}`);
  };

  const categoryLabel = (cat: string) => {
    const map: Record<string, string> = {
      news: "NEWS",
      event: "EVENT",
      legal: "LEGAL",
      advocacy: "ADVOCACY",
    };
    return map[cat] || cat.toUpperCase();
  };

  return (
    <View style={styles.container}>
      {Platform.OS === "web" && (
        <Head>
          <title>{JOURNAL_TITLE}</title>
          <meta name="description" content={JOURNAL_DESCRIPTION} />
          <meta name="robots" content="index, follow" />
          {BASE_URL && <link rel="canonical" href={`${BASE_URL}/news`} />}
          <meta property="og:type" content="website" />
          <meta property="og:title" content={JOURNAL_TITLE} />
          <meta property="og:description" content={JOURNAL_DESCRIPTION} />
          {BASE_URL && <meta property="og:url" content={`${BASE_URL}/news`} />}
          <meta property="og:site_name" content="Exoneree Support App" />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content={JOURNAL_TITLE} />
          <meta name="twitter:description" content={JOURNAL_DESCRIPTION} />
        </Head>
      )}
      {/* Masthead */}
      <View style={styles.masthead}>
        <View style={styles.mastheadTop}>
          <Text style={styles.mastheadLabel}>EST. 2024</Text>
          <Pressable onPress={() => { Haptics.selectionAsync(); setSearchOpen(!searchOpen); }}>
            <Text style={styles.searchBtn}>Search</Text>
          </Pressable>
        </View>
        <Text style={styles.mastheadTitle}>The Ide Journal</Text>
        <View style={styles.mastheadLine} />
      </View>

      {/* Search */}
      {searchOpen && (
        <FadeInView>
          <View style={styles.searchWrap}>
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search articles..."
              placeholderTextColor={colors.mutedForeground}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")} style={styles.clearBtn}>
                <Text style={{ fontSize: 12, color: colors.mutedForeground }}>Clear</Text>
              </Pressable>
            )}
          </View>
        </FadeInView>
      )}

      {/* Filters */}
      <View style={styles.filtersWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {FILTERS.map((f) => (
            <Pressable
              key={f}
              style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
              onPress={() => { Haptics.selectionAsync(); setActiveFilter(f); }}
            >
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Loading */}
      {loading && (
        <View style={{ paddingTop: 40, alignItems: "center" }}>
          <PulseLoader color={colors.primary} size={10} />
          <Text style={{ fontSize: 12, color: colors.mutedForeground, marginTop: 12 }}>Loading articles...</Text>
        </View>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <View style={{ paddingHorizontal: 20, paddingTop: 40 }}>
          <Text style={{ fontSize: 14, color: colors.mutedForeground }}>
            {searchQuery ? "No articles match your search." : "No articles yet."}
          </Text>
        </View>
      )}

      {/* Articles List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const isSaved = profile.savedNews.includes(item.id);
          const isFirst = index === 0;
          return (
            <FadeInView delay={index * 80}>
              <AnimatedPressable
                onPress={() => openItem(item)}
                style={[styles.article, ...(isFirst ? [styles.featuredArticle] : [])]}
              >
                {/* Category + Save */}
                <View style={styles.articleMetaTop}>
                  <Text style={styles.sectionLabel}>{categoryLabel(item.category)}</Text>
                  <Pressable onPress={() => { Haptics.selectionAsync(); toggleSaveNews(item.id); }}>
                    <Text style={[styles.saveText, isSaved && { color: colors.primary }]}>
                      {isSaved ? "Saved" : "Save"}
                    </Text>
                  </Pressable>
                </View>

                {/* Headline */}
                <Text style={[styles.headline, isFirst && styles.featuredHeadline]} numberOfLines={isFirst ? 4 : 3}>
                  {item.title}
                </Text>

                {/* Deck / Summary */}
                {!isFirst && (
                  <Text style={styles.deck} numberOfLines={2}>{item.summary}</Text>
                )}

                {/* Event info */}
                {item.isEvent && (
                  <View style={styles.eventBox}>
                    <Text style={styles.eventLine}>{item.eventDate}</Text>
                    {item.eventLocation && <Text style={styles.eventLine}>{item.eventLocation}</Text>}
                  </View>
                )}

                {/* Byline */}
                <View style={styles.byline}>
                  <Text style={styles.source}>{item.source}</Text>
                  <Text style={styles.dateDot}> · </Text>
                  <Text style={styles.date}>{item.date}</Text>
                  <Text style={styles.dateDot}> · </Text>
                  <Text style={styles.readTime}>{item.readTime} read</Text>
                </View>

                {/* Divider */}
                <View style={styles.divider} />
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

    masthead: {
      paddingHorizontal: 20,
      paddingTop: insets.top + 16,
      paddingBottom: 12,
      backgroundColor: colors.background,
      borderBottomWidth: 2,
      borderBottomColor: colors.foreground,
    },
    mastheadTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6,
    },
    mastheadLabel: {
      fontSize: 10,
      fontWeight: "500",
      letterSpacing: 2,
      color: colors.mutedForeground,
      textTransform: "uppercase",
    },
    mastheadTitle: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.foreground,
      letterSpacing: 1,
    },
    mastheadLine: {
      height: 1,
      backgroundColor: colors.border,
      marginTop: 8,
    },
    searchBtn: {
      fontSize: 13,
      fontWeight: "500",
      color: colors.primary,
    },

    searchWrap: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 10,
      gap: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    searchInput: {
      flex: 1,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 8,
      fontSize: 14,
      color: colors.foreground,
    },
    clearBtn: {
      paddingHorizontal: 8,
      paddingVertical: 4,
    },

    filtersWrap: { marginBottom: 4, borderBottomWidth: 1, borderBottomColor: colors.border },
    filters: { paddingHorizontal: 20, paddingVertical: 10, gap: 6 },
    filterChip: {
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
    },
    filterChipActive: {
      backgroundColor: colors.foreground,
      borderColor: colors.foreground,
    },
    filterText: { fontSize: 11, fontWeight: "500", color: colors.mutedForeground, textTransform: "uppercase", letterSpacing: 0.5 },
    filterTextActive: { color: colors.background },

    list: { paddingHorizontal: 20, paddingBottom: insets.bottom + 100, gap: 0 },
    article: { paddingVertical: 16 },
    featuredArticle: { paddingVertical: 20 },

    articleMetaTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    sectionLabel: {
      fontSize: 10,
      fontWeight: "700",
      color: colors.primary,
      letterSpacing: 1.5,
      textTransform: "uppercase",
    },
    saveText: {
      fontSize: 12,
      fontWeight: "500",
      color: colors.mutedForeground,
    },

    headline: {
      fontSize: 17,
      fontWeight: "700",
      color: colors.foreground,
      lineHeight: 23,
      marginBottom: 8,
    },
    featuredHeadline: {
      fontSize: 22,
      fontWeight: "700",
      lineHeight: 29,
      marginBottom: 10,
    },
    deck: {
      fontSize: 14,
      color: colors.mutedForeground,
      lineHeight: 20,
      marginBottom: 10,
    },

    eventBox: {
      backgroundColor: colors.orangePale,
      borderRadius: 6,
      padding: 10,
      marginBottom: 10,
    },
    eventLine: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.brown,
    },

    byline: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 2,
    },
    source: { fontSize: 11, fontWeight: "700", color: colors.foreground },
    date: { fontSize: 11, color: colors.mutedForeground },
    dateDot: { fontSize: 11, color: colors.mutedForeground },
    readTime: { fontSize: 11, color: colors.mutedForeground },

    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginTop: 16,
    },
  });
}
