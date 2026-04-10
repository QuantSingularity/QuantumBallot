import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import theme from "src/theme";

interface NewsArticle {
  id: string;
  title: string;
  date: string;
  content: string;
  category?: string;
}

const MOCK_NEWS: NewsArticle[] = [
  {
    id: "1",
    title: "Presidential Debate Highlights",
    date: "April 15, 2025",
    content:
      "The presidential candidates engaged in a heated debate last night, discussing key issues including economic policies, healthcare reform, and foreign relations.",
    category: "Debate",
  },
  {
    id: "2",
    title: "Voter Registration Deadline Approaching",
    date: "April 10, 2025",
    content:
      "The deadline for voter registration is April 30, 2025. All eligible citizens are encouraged to register through the mobile app or visit their local election office.",
    category: "Registration",
  },
  {
    id: "3",
    title: "New Polling Locations Announced",
    date: "April 5, 2025",
    content:
      "The Election Commission has announced several new polling locations to accommodate the increased number of registered voters across all districts.",
    category: "Logistics",
  },
  {
    id: "4",
    title: "Blockchain Voting Security Verified",
    date: "April 1, 2025",
    content:
      "Independent auditors have confirmed the integrity of the QuantumBallot blockchain system, ensuring tamper-proof vote recording for all participants.",
    category: "Security",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Debate: "#8b5cf6",
  Registration: "#10b981",
  Logistics: "#f59e0b",
  Security: "#2196F3",
};

export function News() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadNews = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 400));
    setArticles(MOCK_NEWS);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadNews();
    setRefreshing(false);
  }, [loadNews]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading news…</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.primary}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Election News</Text>
        <Text style={styles.subtitle}>
          Stay updated with the latest election information
        </Text>
      </View>

      <View style={styles.articlesContainer}>
        {articles.map((article) => {
          const isExpanded = expandedId === article.id;
          const categoryColor =
            CATEGORY_COLORS[article.category ?? ""] ?? theme.colors.primary;

          return (
            <View key={article.id} style={styles.newsCard}>
              {article.category ? (
                <View
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: categoryColor + "20" },
                  ]}
                >
                  <Text style={[styles.categoryText, { color: categoryColor }]}>
                    {article.category}
                  </Text>
                </View>
              ) : null}
              <Text style={styles.newsTitle}>{article.title}</Text>
              <Text style={styles.newsDate}>{article.date}</Text>
              <Text
                style={styles.newsContent}
                numberOfLines={isExpanded ? undefined : 3}
              >
                {article.content}
              </Text>
              <TouchableOpacity
                style={styles.readMoreButton}
                onPress={() => setExpandedId(isExpanded ? null : article.id)}
              >
                <Text style={styles.readMoreText}>
                  {isExpanded ? "Show less" : "Read more"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f8",
  },
  loadingText: {
    marginTop: 10,
    color: theme.colors.textSecondary,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: theme.colors.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.85)",
    lineHeight: 20,
  },
  articlesContainer: {
    padding: 16,
    gap: 12,
  },
  newsCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  newsTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 4,
    lineHeight: 24,
  },
  newsDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 10,
  },
  newsContent: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  readMoreButton: {
    alignSelf: "flex-end",
  },
  readMoreText: {
    color: theme.colors.primary,
    fontWeight: "600",
    fontSize: 13,
  },
});
