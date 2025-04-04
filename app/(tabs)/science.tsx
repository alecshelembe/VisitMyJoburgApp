import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Dimensions, // Import Dimensions
} from "react-native";

interface ScienceArticle {
  id: number;
  title: string;
  image_url: string[];
  description: string;
  author: string;
  created_at: string;
  updated_at: string;
  verified: number;
  plate: number;
  status: string;
}

const { width } = Dimensions.get('window'); // Get screen width

const ScienceArticlesScreen: React.FC = () => {
  const [articles, setArticles] = useState<ScienceArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("https://visitmyjoburg.co.za/api/get-science-posts");
        if (!response.ok) {
          throw new Error(`Error ${response.status}: Failed to fetch articles`);
        }
        const data = await response.json();
        if (data && data.data && Array.isArray(data.data)) {
          const parsedData = data.data.map((article) => ({
            ...article,
            image_url: JSON.parse(article.image_url),
          }));
          setArticles(parsedData);
        } else {
          setError("Invalid data from API.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch articles.");
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const renderArticleCard = ({ item }: { item: ScienceArticle }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.author}>By: {item.author}</Text>
        <Text style={styles.date}>
          {new Date(item.created_at).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>

        {item.image_url && item.image_url.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageContainer}>
            {item.image_url.map((img, index) => (
              <Image
                key={index}
                source={{ uri: `https://visitmyjoburg.co.za/${img}` }}
                style={styles.fullImage} // Use fullImage style
                resizeMode="contain" // Ensure the entire image is visible
              />
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.noImagesText}>No images available.</Text>
        )}

        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{item.description.replace(/<[^>]*>/g, '')}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={articles}
        renderItem={renderArticleCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContainer: { padding: 16, marginTop: 25 },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8, color: "#333" },
  author: { fontSize: 14, color: "#777", marginBottom: 4 },
  date: { fontSize: 12, color: "#888", marginBottom: 12 },
  imageContainer: { marginBottom: 16, flexDirection: "row" },
  // Removed the fixed width and height for the individual image
  fullImage: {
    width: width * 0.9, // Adjust multiplier as needed for padding
    height: undefined, // Let height adjust based on aspect ratio
    aspectRatio: 4 / 3, // You might need to adjust this based on typical image ratios
    borderRadius: 8,
    marginRight: 12,
  },
  descriptionContainer: { marginBottom: 12 },
  description: { fontSize: 16, lineHeight: 24, color: "#555" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", fontSize: 18, textAlign: "center" },
  noImagesText: { fontStyle: "italic", color: "#aaa", marginTop: 12 },
});

export default ScienceArticlesScreen;