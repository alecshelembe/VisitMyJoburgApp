import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Linking, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface SocialPost {
  id: number;
  fee: string;
  description: string;
  images: string[]; // This will be strings, but we'll parse them
  email: string;
  status: string;
  comments: { id: number; author: string; content: string; created_at: string; }[] | null; // Correct type
  place_name: string;
  created_at: string;
  video_link: string | null; // Can be null
}

const SocialPostCard: React.FC = () => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("https://visitmyjoburg.co.za/api/get-social-posts");
        if (!response.ok) {
          throw new Error(`Error ${response.status}: Failed to fetch posts`);
        }
        const data = await response.json();
        if (data && data.data && Array.isArray(data.data)) {
          // Parse images string into array
          const parsedData = data.data.map(post => ({
            ...post,
            images: JSON.parse(post.images),
          }));
          setPosts(parsedData);
        } else {
          setError("Invalid data from API.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch posts.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const renderPostCard = ({ item }: { item: SocialPost }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.place_name}</Text>
        <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
        <Text style={styles.fee}>Fee: ${item.fee}</Text>
        <Text style={styles.description}>{item.description}</Text>

        {item.images && item.images.length > 0 ? (
          <ScrollView horizontal style={styles.imageContainer}>
            {item.images.map((img, index) => (
            <Image key={index} source={{ uri: `https://visitmyjoburg.co.za/${img}` }} style={styles.image} />
        ))}
          </ScrollView>
        ) : (
          <Text style={styles.noImagesText}>No images available.</Text>
        )}

        <TouchableOpacity onPress={() => Linking.openURL(`mailto:${item.email}`)} style={styles.actionButton}>
          <FontAwesome name="envelope" size={20} color="white" />
          <Text style={styles.actionButtonText}>Email</Text>
        </TouchableOpacity>

        <Text style={styles.status}>Status: {item.status}</Text>

        {item.comments && item.comments.length > 0 && (
          <View style={styles.commentsContainer}>
            <Text style={styles.commentsTitle}>Comments:</Text>
            {item.comments.map((comment, index) => (
              <Text key={index} style={styles.commentText}>
                {comment.author}: {comment.content}
              </Text>
            ))}
          </View>
        )}

        {item.video_link && (
          <TouchableOpacity onPress={() => Linking.openURL(item.video_link)} style={styles.videoButton}>
            <FontAwesome name="youtube" size={20} color="red" />
            <Text style={styles.videoButtonText}>Watch Video</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
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
    <FlatList
      data={posts}
      renderItem={renderPostCard}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: { padding: 10 },
  card: { backgroundColor: "#fff", padding: 15, marginBottom: 20, borderRadius: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 3 }, shadowRadius: 6, elevation: 5 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  date: { fontSize: 12, color: "#888", marginBottom: 10 },
  fee: { fontSize: 14, marginBottom: 10 },
  description: { fontSize: 16, color: "#444", marginBottom: 10 },
  imageContainer: { marginBottom: 10, flexDirection: 'row' },
  image: { width: 100, height: 100, borderRadius: 10, marginRight: 10 },
  actionButton: { backgroundColor: "#007BFF", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, flexDirection: "row", alignItems: "center", alignSelf: 'flex-start', marginTop: 10 },
  actionButtonText: { color: "white", marginLeft: 5 },
  status: { fontSize: 14, color: "#888", marginBottom: 10 },
  commentsContainer: { marginTop: 10 },
  commentsTitle: { fontWeight: "bold", marginBottom: 5 },
  commentText: { fontSize: 14, color: "#444" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", height: "100%" },
  errorText: { color: "red", fontSize: 18, textAlign: "center" },
  noImagesText: { fontStyle: "italic", color: "#aaa", marginTop: 10 },
  videoButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: 'flex-start',
    marginTop: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  videoButtonText: {
    color: "red",
    marginLeft: 5,
  },
});

export default SocialPostCard;