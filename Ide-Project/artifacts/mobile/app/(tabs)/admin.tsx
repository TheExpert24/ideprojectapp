import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useAdmin } from "@/context/AdminContext";
import { useSupabaseNews, useSupabaseResources } from "@/hooks/useSupabaseData";
import { supabase } from "@/lib/supabase";
import { NewsItem } from "@/data/news";
import { Resource, ResourceCategory } from "@/data/resources";
import * as Haptics from "expo-haptics";

const NEWS_CATS = ["news", "event", "legal", "advocacy"];
const RES_CATS: ResourceCategory[] = ["financial", "housing", "legal", "employment", "mental", "benefits", "community"];
const RES_TYPES = ["article", "guide", "video", "tool"];

export default function AdminScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { isAdmin } = useAdmin();
  const { news, loading: newsLoading, error: newsError, refresh: refreshNews } = useSupabaseNews();
  const { resources, loading: resLoading, error: resError, refresh: refreshResources } = useSupabaseResources();
  const styles = makeStyles(colors, insets);

  const hasSetupError = (newsError && newsError.includes("Could not find")) || (resError && resError.includes("Could not find"));

  const [section, setSection] = useState<"news" | "resources">("news");

  // News form
  const [nTitle, setNTitle] = useState("");
  const [nSummary, setNSummary] = useState("");
  const [nContent, setNContent] = useState("");
  const [nCategory, setNCategory] = useState("news");
  const [nSource, setNSource] = useState("");
  const [nDate, setNDate] = useState("");
  const [nReadTime, setNReadTime] = useState("");
  const [nIsEvent, setNIsEvent] = useState(false);
  const [nEventDate, setNEventDate] = useState("");
  const [nEventLocation, setNEventLocation] = useState("");
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);

  // Resource form
  const [rTitle, setRTitle] = useState("");
  const [rDesc, setRDesc] = useState("");
  const [rCategory, setRCategory] = useState<ResourceCategory>("financial");
  const [rType, setRType] = useState("article");
  const [rReadTime, setRReadTime] = useState("");
  const [rTags, setRTags] = useState("");
  const [rContent, setRContent] = useState("");
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  const clearNewsForm = () => {
    setNTitle(""); setNSummary(""); setNContent(""); setNCategory("news");
    setNSource(""); setNDate(""); setNReadTime(""); setNIsEvent(false);
    setNEventDate(""); setNEventLocation(""); setEditingNews(null);
  };

  const clearResourceForm = () => {
    setRTitle(""); setRDesc(""); setRCategory("financial"); setRType("article");
    setRReadTime(""); setRTags(""); setRContent(""); setEditingResource(null);
  };

  const loadNewsForEdit = (item: NewsItem) => {
    setEditingNews(item);
    setNTitle(item.title);
    setNSummary(item.summary);
    setNContent(item.content);
    setNCategory(item.category);
    setNSource(item.source);
    setNDate(item.date);
    setNReadTime(item.readTime);
    setNIsEvent(item.isEvent);
    setNEventDate(item.eventDate || "");
    setNEventLocation(item.eventLocation || "");
  };

  const loadResourceForEdit = (item: Resource) => {
    setEditingResource(item);
    setRTitle(item.title);
    setRDesc(item.description);
    setRCategory(item.category);
    setRType(item.type);
    setRReadTime(item.readTime);
    setRTags(item.tags.join(", "));
    setRContent(item.content);
  };

  const handleSaveNews = async () => {
    if (!nTitle.trim() || !nSummary.trim() || !nContent.trim()) {
      Alert.alert("Missing fields", "Title, summary, and content are required.");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const payload = {
      title: nTitle.trim(),
      summary: nSummary.trim(),
      content: nContent.trim(),
      category: nCategory,
      source: nSource.trim() || "Ide App",
      date: nDate.trim() || new Date().toISOString().split("T")[0],
      read_time: nReadTime.trim() || "5 min",
      is_event: nIsEvent,
      event_date: nEventDate.trim() || null,
      event_location: nEventLocation.trim() || null,
    };

    let error: any = null;
    if (editingNews) {
      const res = await supabase.from("news_items").update(payload).eq("id", editingNews.id);
      error = res.error;
    } else {
      const res = await supabase.from("news_items").insert(payload);
      error = res.error;
    }

    if (error) {
      Alert.alert("Error", error.message || "Failed to save news item.");
      return;
    }

    clearNewsForm();
    await refreshNews();
  };

  const handleDeleteNews = (id: string, title: string) => {
    Alert.alert("Delete", `Delete "${title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          const { error } = await supabase.from("news_items").delete().eq("id", id);
          if (error) {
            Alert.alert("Error", error.message || "Failed to delete.");
          } else {
            await refreshNews();
          }
        },
      },
    ]);
  };

  const handleSaveResource = async () => {
    if (!rTitle.trim() || !rDesc.trim() || !rContent.trim()) {
      Alert.alert("Missing fields", "Title, description, and content are required.");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const payload = {
      title: rTitle.trim(),
      description: rDesc.trim(),
      category: rCategory,
      type: rType,
      read_time: rReadTime.trim() || "5 min",
      tags: rTags.split(",").map((t) => t.trim()).filter(Boolean),
      content: rContent.trim(),
    };

    let error: any = null;
    if (editingResource) {
      const res = await supabase.from("resources").update(payload).eq("id", editingResource.id);
      error = res.error;
    } else {
      const res = await supabase.from("resources").insert(payload);
      error = res.error;
    }

    if (error) {
      Alert.alert("Error", error.message || "Failed to save resource.");
      return;
    }

    clearResourceForm();
    await refreshResources();
  };

  const handleDeleteResource = (id: string, title: string) => {
    Alert.alert("Delete", `Delete "${title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          const { error } = await supabase.from("resources").delete().eq("id", id);
          if (error) {
            Alert.alert("Error", error.message || "Failed to delete.");
          } else {
            await refreshResources();
          }
        },
      },
    ]);
  };

  if (!isAdmin) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground }}>Admin Access Only</Text>
        <Text style={{ fontSize: 13, color: colors.mutedForeground, marginTop: 8 }}>
          You do not have permission to view this page.
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Admin</Text>
          <Text style={styles.headerSub}>Manage news and resources</Text>
        </View>

        {hasSetupError && (
          <View style={{ backgroundColor: colors.orangePale, borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: colors.orangeLight }}>
            <Text style={{ fontSize: 13, fontWeight: "700", color: colors.brown, marginBottom: 6 }}>
              Supabase tables are missing
            </Text>
            <Text style={{ fontSize: 12, color: colors.brownLight, lineHeight: 18 }}>
              Go to your Supabase Dashboard &gt; SQL Editor and run the setup query to create the news_items and resources tables.
            </Text>
          </View>
        )}

        <View style={styles.tabRow}>
          <Pressable
            style={[styles.tabBtn, section === "news" && styles.tabBtnActive]}
            onPress={() => { Haptics.selectionAsync(); setSection("news"); }}
          >
            <Text style={[styles.tabText, section === "news" && styles.tabTextActive]}>News</Text>
          </Pressable>
          <Pressable
            style={[styles.tabBtn, section === "resources" && styles.tabBtnActive]}
            onPress={() => { Haptics.selectionAsync(); setSection("resources"); }}
          >
            <Text style={[styles.tabText, section === "resources" && styles.tabTextActive]}>Resources</Text>
          </Pressable>
        </View>

        {section === "news" ? (
          <View style={styles.formSection}>
            <Text style={styles.formTitle}>{editingNews ? "Edit News" : "Add News"}</Text>
            <TextInput style={styles.input} value={nTitle} onChangeText={setNTitle} placeholder="Title" placeholderTextColor={colors.mutedForeground} />
            <TextInput style={[styles.input, styles.textArea]} value={nSummary} onChangeText={setNSummary} placeholder="Summary" placeholderTextColor={colors.mutedForeground} multiline numberOfLines={3} textAlignVertical="top" />
            <TextInput style={[styles.input, styles.textArea]} value={nContent} onChangeText={setNContent} placeholder="Full content" placeholderTextColor={colors.mutedForeground} multiline numberOfLines={5} textAlignVertical="top" />
            <View style={styles.rowInputs}>
              <TextInput style={[styles.input, { flex: 1 }]} value={nSource} onChangeText={setNSource} placeholder="Source" placeholderTextColor={colors.mutedForeground} />
              <TextInput style={[styles.input, { flex: 1 }]} value={nDate} onChangeText={setNDate} placeholder="Date (YYYY-MM-DD)" placeholderTextColor={colors.mutedForeground} />
            </View>
            <TextInput style={styles.input} value={nReadTime} onChangeText={setNReadTime} placeholder="Read time (e.g. 5 min)" placeholderTextColor={colors.mutedForeground} />
            <View style={styles.chipRow}>
              {NEWS_CATS.map((c) => (
                <Pressable key={c} style={[styles.chip, nCategory === c && styles.chipActive]} onPress={() => setNCategory(c)}>
                  <Text style={[styles.chipText, nCategory === c && styles.chipTextActive]}>{c}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.label}>Event</Text>
              <Switch value={nIsEvent} onValueChange={setNIsEvent} trackColor={{ false: colors.border, true: colors.primary }} />
            </View>
            {nIsEvent && (
              <View style={styles.rowInputs}>
                <TextInput style={[styles.input, { flex: 1 }]} value={nEventDate} onChangeText={setNEventDate} placeholder="Event date" placeholderTextColor={colors.mutedForeground} />
                <TextInput style={[styles.input, { flex: 1 }]} value={nEventLocation} onChangeText={setNEventLocation} placeholder="Location" placeholderTextColor={colors.mutedForeground} />
              </View>
            )}
            <View style={styles.btnRow}>
              <Pressable style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]} onPress={handleSaveNews}>
                <Text style={styles.primaryBtnText}>{editingNews ? "Update" : "Add"}</Text>
              </Pressable>
              {editingNews && (
                <Pressable style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]} onPress={clearNewsForm}>
                  <Text style={styles.secondaryBtnText}>Cancel</Text>
                </Pressable>
              )}
            </View>

            <Text style={styles.listTitle}>Existing News</Text>
            {newsLoading && <Text style={styles.emptyText}>Loading...</Text>}
            {news.length === 0 && !newsLoading && <Text style={styles.emptyText}>No news items.</Text>}
            {news.map((item) => (
              <View key={item.id} style={styles.listItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.listItemTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.listItemMeta}>{item.category} &middot; {item.date}</Text>
                </View>
                <Pressable onPress={() => loadNewsForEdit(item)}>
                  <Text style={{ fontSize: 13, fontWeight: "500", color: colors.primary }}>Edit</Text>
                </Pressable>
                <Pressable onPress={() => handleDeleteNews(item.id, item.title)}>
                  <Text style={{ fontSize: 13, fontWeight: "500", color: colors.destructive }}>Delete</Text>
                </Pressable>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.formSection}>
            <Text style={styles.formTitle}>{editingResource ? "Edit Resource" : "Add Resource"}</Text>
            <TextInput style={styles.input} value={rTitle} onChangeText={setRTitle} placeholder="Title" placeholderTextColor={colors.mutedForeground} />
            <TextInput style={[styles.input, styles.textArea]} value={rDesc} onChangeText={setRDesc} placeholder="Description" placeholderTextColor={colors.mutedForeground} multiline numberOfLines={3} textAlignVertical="top" />
            <TextInput style={[styles.input, styles.textArea]} value={rContent} onChangeText={setRContent} placeholder="Full content" placeholderTextColor={colors.mutedForeground} multiline numberOfLines={5} textAlignVertical="top" />
            <TextInput style={styles.input} value={rReadTime} onChangeText={setRReadTime} placeholder="Read time" placeholderTextColor={colors.mutedForeground} />
            <TextInput style={styles.input} value={rTags} onChangeText={setRTags} placeholder="Tags (comma separated)" placeholderTextColor={colors.mutedForeground} />
            <View style={styles.chipRow}>
              {RES_CATS.map((c) => (
                <Pressable key={c} style={[styles.chip, rCategory === c && styles.chipActive]} onPress={() => setRCategory(c)}>
                  <Text style={[styles.chipText, rCategory === c && styles.chipTextActive]}>{c}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.chipRow}>
              {RES_TYPES.map((t) => (
                <Pressable key={t} style={[styles.chip, rType === t && styles.chipActive]} onPress={() => setRType(t)}>
                  <Text style={[styles.chipText, rType === t && styles.chipTextActive]}>{t}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.btnRow}>
              <Pressable style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]} onPress={handleSaveResource}>
                <Text style={styles.primaryBtnText}>{editingResource ? "Update" : "Add"}</Text>
              </Pressable>
              {editingResource && (
                <Pressable style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]} onPress={clearResourceForm}>
                  <Text style={styles.secondaryBtnText}>Cancel</Text>
                </Pressable>
              )}
            </View>

            <Text style={styles.listTitle}>Existing Resources</Text>
            {resLoading && <Text style={styles.emptyText}>Loading...</Text>}
            {resources.length === 0 && !resLoading && <Text style={styles.emptyText}>No resources.</Text>}
            {resources.map((item) => (
              <View key={item.id} style={styles.listItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.listItemTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.listItemMeta}>{item.category} &middot; {item.type}</Text>
                </View>
                <Pressable onPress={() => loadResourceForEdit(item)}>
                  <Text style={{ fontSize: 13, fontWeight: "500", color: colors.primary }}>Edit</Text>
                </Pressable>
                <Pressable onPress={() => handleDeleteResource(item.id, item.title)}>
                  <Text style={{ fontSize: 13, fontWeight: "500", color: colors.destructive }}>Delete</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function makeStyles(colors: ReturnType<typeof useColors>, insets: { top: number; bottom: number }) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingHorizontal: 20, paddingTop: insets.top + 16, paddingBottom: insets.bottom + 100 },
    header: { marginBottom: 16 },
    headerTitle: { fontSize: 26, fontWeight: "700", color: colors.foreground },
    headerSub: { fontSize: 13, color: colors.mutedForeground, marginTop: 2 },
    tabRow: { flexDirection: "row", gap: 8, marginBottom: 20 },
    tabBtn: { flex: 1, alignItems: "center", paddingVertical: 12, borderRadius: 12, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
    tabBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    tabText: { fontSize: 14, fontWeight: "500", color: colors.foreground },
    tabTextActive: { color: "#fff", fontWeight: "700" },
    formSection: { gap: 10 },
    formTitle: { fontSize: 16, fontWeight: "700", color: colors.foreground, marginBottom: 6 },
    input: {
      backgroundColor: colors.card,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      color: colors.foreground,
    },
    textArea: { height: 80, paddingTop: 12 },
    rowInputs: { flexDirection: "row", gap: 10 },
    chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 4 },
    chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: colors.muted },
    chipActive: { backgroundColor: colors.primary },
    chipText: { fontSize: 12, fontWeight: "500", color: colors.mutedForeground },
    chipTextActive: { color: "#fff", fontWeight: "700" },
    switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4 },
    label: { fontSize: 13, fontWeight: "700", color: colors.foreground },
    btnRow: { flexDirection: "row", gap: 10, marginTop: 4 },
    primaryBtn: { flex: 1, backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: "center" },
    primaryBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
    secondaryBtn: { paddingHorizontal: 20, borderRadius: 12, borderWidth: 1.5, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
    secondaryBtnText: { color: colors.foreground, fontSize: 15, fontWeight: "500" },
    pressed: { opacity: 0.85 },
    listTitle: { fontSize: 16, fontWeight: "700", color: colors.foreground, marginTop: 24, marginBottom: 10 },
    listItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
      marginBottom: 8,
    },
    listItemTitle: { fontSize: 14, fontWeight: "700", color: colors.foreground },
    listItemMeta: { fontSize: 11, color: colors.mutedForeground, marginTop: 2 },
    emptyText: { fontSize: 13, color: colors.mutedForeground, marginBottom: 8 },
  });
}
