export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: "news" | "event" | "legal" | "advocacy";
  source: string;
  date: string;
  readTime: string;
  isEvent: boolean;
  eventDate?: string;
  eventLocation?: string;
}

export const NEWS_ITEMS: NewsItem[] = [];
