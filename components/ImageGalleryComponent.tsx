import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, ActivityIndicator, StyleSheet } from "react-native";

const ImageGallery: React.FC = () => {
  const [images, setImages] = useState<string[]>([]); // Store image URLs
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch images from the API on component mount
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("https://visitmyjoburg.co.za/api/images");
        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }
        const result = await response.json();
        setImages(result.images); // Store images from API response
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading images...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Image Gallery</Text>
      {images.length === 0 ? (
        <Text>No images found.</Text>
      ) : (
        images.map((imageUrl, index) => (
          <Image key={index} source={{ uri: imageUrl }} style={styles.image} />
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 10,
    borderRadius: 8,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
});

export default ImageGallery;
