import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { NEWS_ITEMS, NewsItem } from "@/data/news";
import { RESOURCES, Resource } from "@/data/resources";

export function useSupabaseNews() {
  const [news, setNews] = useState<NewsItem[]>(NEWS_ITEMS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("news_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      if (data && data.length > 0) {
        const mapped: NewsItem[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          summary: item.summary,
          content: item.content,
          category: item.category,
          source: item.source,
          date: item.date,
          readTime: item.read_time,
          isEvent: item.is_event,
          eventDate: item.event_date,
          eventLocation: item.event_location,
        }));
        setNews(mapped);
      } else {
        setNews([]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { news, loading, error, refresh };
}

export function useSupabaseNewsItem(id: string | undefined) {
  const [item, setItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    supabase
      .from("news_items")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error: fetchError }) => {
        if (cancelled) return;
        if (fetchError) {
          setError(fetchError.message);
          setItem(null);
        } else if (data) {
          setItem({
            id: data.id,
            title: data.title,
            summary: data.summary,
            content: data.content,
            category: data.category,
            source: data.source,
            date: data.date,
            readTime: data.read_time,
            isEvent: data.is_event,
            eventDate: data.event_date,
            eventLocation: data.event_location,
          });
        } else {
          setItem(null);
        }
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  return { item, loading, error };
}

export function useSupabaseResources() {
  const [resources, setResources] = useState<Resource[]>(RESOURCES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("resources")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      if (data && data.length > 0) {
        const mapped: Resource[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          category: item.category,
          type: item.type,
          readTime: item.read_time,
          tags: item.tags || [],
          content: item.content,
        }));
        setResources(mapped);
      } else {
        setResources([]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { resources, loading, error, refresh };
}

export function useSupabaseResourceItem(id: string | undefined) {
  const [item, setItem] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    supabase
      .from("resources")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error: fetchError }) => {
        if (cancelled) return;
        if (fetchError) {
          setError(fetchError.message);
          setItem(null);
        } else if (data) {
          setItem({
            id: data.id,
            title: data.title,
            description: data.description,
            category: data.category,
            type: data.type,
            readTime: data.read_time,
            tags: data.tags || [],
            content: data.content,
          });
        } else {
          setItem(null);
        }
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  return { item, loading, error };
}
