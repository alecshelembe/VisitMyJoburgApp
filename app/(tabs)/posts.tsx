import React, { useState, useEffect } from "react";
import { WebView } from "react-native-webview";
import { View, Text, Image, StyleSheet, FlatList, ScrollView } from "react-native";

interface SocialPost {
  id: number;
  fee: string;
  description: string;
  images: string[];
  email: string;
  status: string;
  comments: { id: number; author: string; content: string; created_at: string; }[] | null;
  place_name: string;
  created_at: string;
  video_link: string | null;
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

  const getYouTubeVideoId = (url: string | null): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const renderPostCard = ({ item }: { item: SocialPost }) => {
    const videoId = getYouTubeVideoId(item.video_link);
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.place_name}</Text>
        <Text style={styles.date}>
        {new Date(item.created_at).toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })}
        </Text>
        <Text style={styles.fee}>Fee: R {item.fee}</Text>
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

        {videoId && (
          <View style={styles.videoContainer}>
            <WebView
              style={styles.webView}
              javaScriptEnabled={true}
              source={{ uri: `https://www.youtube.com/embed/${videoId}` }}
            />
          </View>
        )}

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
  card: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 8,
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  date: { fontSize: 13, color: "#888", marginBottom: 12 },
  fee: { fontSize: 15, marginBottom: 12 },
  description: { fontSize: 16, color: "#444", marginBottom: 15 },
  imageContainer: { marginBottom: 15, flexDirection: 'row' },
  image: { width: 150, height: 150, borderRadius: 12, marginRight: 15 },
  commentsContainer: { marginTop: 15 },
  commentsTitle: { fontWeight: "bold", marginBottom: 8 },
  commentText: { fontSize: 15, color: "#444" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", height: "100%" },
  errorText: { color: "red", fontSize: 18, textAlign: "center" },
  noImagesText: { fontStyle: "italic", color: "#aaa", marginTop: 12 },
  videoContainer: {
    width: '100%',
    height: 250,
    marginTop: 15,
  },
  webView: {
    flex: 1,
  },
});

export default SocialPostCard;