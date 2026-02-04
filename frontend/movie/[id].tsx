import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { OptimizedImage } from "../components/OptimizedImage";

const { width, height } = Dimensions.get('window');

// Mock movie details data
const MOVIE_DETAILS = {
  1: {
    title: "Avatar: The Way of Water",
    year: "2022",
    rating: "7.6",
    duration: "192 min",
    genre: ["Sci-Fi", "Adventure", "Action"],
    director: "James Cameron",
    cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],
    poster: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg",
    description: "Set more than a decade after the events of the first film, Avatar: The Way of Water begins to tell the story of the Sully family (Jake, Neytiri, and their kids), the trouble that follows them, the lengths they go to keep each other safe, the battles they fight to stay alive, and the tragedies they endure.",
    trailerUrl: "https://www.youtube.com/watch?v=d9MyW72ELq0",
    downloadSizes: ["720p (1.2GB)", "1080p (2.8GB)", "4K (8.5GB)"]
  },
  // Add more movie details as needed
};

export default function MovieDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user, isGuest, addToFavorites, removeFromFavorites, getFavorites } = useAuth();
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Get movie details (fallback to first movie if not found)
  const movieId = Array.isArray(id) ? id[0] : id;
  const numericId = parseInt(movieId || '1', 10);
  const movie = MOVIE_DETAILS[numericId as keyof typeof MOVIE_DETAILS] || MOVIE_DETAILS[1];

  useEffect(() => {
    if (user) {
      checkIfFavorite();
    }
  }, [user, movieId]);

  const checkIfFavorite = async () => {
    const favorites = await getFavorites();
    setIsFavorite(favorites.includes(movieId || '1'));
  };

  const handleToggleFavorite = async () => {
    if (isGuest) {
      Alert.alert(
        "Sign In Required",
        "Please sign in to add movies to your favorites",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Sign In", onPress: () => router.push('/auth/login') }
        ]
      );
      return;
    }

    const result = isFavorite 
      ? await removeFromFavorites(movieId || '1')
      : await addToFavorites(movieId || '1');

    if (result.success) {
      setIsFavorite(!isFavorite);
      Alert.alert(
        isFavorite ? "Removed" : "Added", 
        isFavorite ? "Movie removed from favorites" : "Movie added to favorites"
      );
    } else {
      Alert.alert("Error", result.error || "Failed to update favorites");
    }
  };

  const handleWatchTrailer = () => {
    Alert.alert(
      "Watch Trailer",
      "Opening trailer player...",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Watch", onPress: () => {
          // TODO: Implement trailer playback
          Alert.alert("Coming Soon", "Trailer playback will be implemented in a future update");
        }}
      ]
    );
  };

  const handleDownload = (quality: string) => {
    Alert.alert(
      "Download Movie",
      `Download ${movie.title} in ${quality}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Download", onPress: () => {
          // TODO: Implement movie download
          Alert.alert("Coming Soon", `Movie download in ${quality} quality will be implemented in a future update`);
        }}
      ]
    );
  };

  const handleShare = () => {
    Alert.alert("Share", "Sharing movie...");
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <OptimizedImage source={{ uri: movie.backdrop }} style={styles.backdropImage} />
          <LinearGradient
            colors={['transparent', 'rgba(15,15,35,0.8)', 'rgba(15,15,35,1)']}
            style={styles.heroGradient}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.headerActions}>
                <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
                  <Ionicons name="share-outline" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleToggleFavorite} 
                  style={styles.headerButton}
                >
                  <Ionicons 
                    name={isFavorite ? "heart" : "heart-outline"} 
                    size={24} 
                    color={isFavorite ? "#FF6B6B" : "#FFFFFF"} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Movie Info */}
            <View style={styles.movieInfo}>
              <Text style={styles.movieTitle}>{movie.title}</Text>
              <View style={styles.movieMeta}>
                <Text style={styles.movieYear}>{movie.year}</Text>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.movieDuration}>{movie.duration}</Text>
                <Text style={styles.metaDot}>•</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.movieRating}>{movie.rating}</Text>
                </View>
              </View>
              <View style={styles.genreContainer}>
                {movie.genre.map((g, index) => (
                  <View key={index} style={styles.genreTag}>
                    <Text style={styles.genreText}>{g}</Text>
                  </View>
                ))}
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleWatchTrailer}>
            <Ionicons name="play" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Watch Trailer</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => setIsWatchlisted(!isWatchlisted)}
          >
            <Ionicons 
              name={isWatchlisted ? "bookmark" : "bookmark-outline"} 
              size={20} 
              color="#FF6B6B" 
            />
            <Text style={styles.secondaryButtonText}>
              {isWatchlisted ? "Watchlisted" : "Watchlist"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Synopsis</Text>
          <Text style={styles.description}>{movie.description}</Text>
        </View>

        {/* Cast & Crew */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cast & Crew</Text>
          <View style={styles.castInfo}>
            <View style={styles.castItem}>
              <Text style={styles.castLabel}>Director</Text>
              <Text style={styles.castValue}>{movie.director}</Text>
            </View>
            <View style={styles.castItem}>
              <Text style={styles.castLabel}>Starring</Text>
              <Text style={styles.castValue}>{movie.cast.join(", ")}</Text>
            </View>
          </View>
        </View>

        {/* Download Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Download Options</Text>
          <View style={styles.downloadContainer}>
            {movie.downloadSizes.map((size, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.downloadOption}
                onPress={() => handleDownload(size)}
              >
                <View style={styles.downloadInfo}>
                  <Ionicons name="download-outline" size={20} color="#FF6B6B" />
                  <Text style={styles.downloadText}>{size}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Similar Movies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>You Might Also Like</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[1, 2, 3, 4].map((item) => (
              <TouchableOpacity key={item} style={styles.similarMovieCard}>
                <Image 
                  source={{ uri: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg" }}
                  style={styles.similarMovieImage}
                />
                <Text style={styles.similarMovieTitle}>Movie Title</Text>
                <Text style={styles.similarMovieYear}>2022</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  heroContainer: {
    height: height * 0.6,
    position: 'relative',
  },
  backdropImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20,
  },
  movieInfo: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  movieTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  movieMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  movieYear: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  metaDot: {
    color: '#CCCCCC',
    marginHorizontal: 8,
  },
  movieDuration: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  movieRating: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreTag: {
    backgroundColor: 'rgba(255,107,107,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  genreText: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    borderRadius: 25,
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,107,107,0.1)',
    paddingVertical: 16,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    gap: 8,
  },
  secondaryButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  description: {
    color: '#CCCCCC',
    fontSize: 16,
    lineHeight: 24,
  },
  castInfo: {
    gap: 12,
  },
  castItem: {
    gap: 4,
  },
  castLabel: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '600',
  },
  castValue: {
    color: '#CCCCCC',
    fontSize: 16,
  },
  downloadContainer: {
    gap: 12,
  },
  downloadOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 12,
  },
  downloadInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  downloadText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  similarMovieCard: {
    width: 120,
    marginRight: 16,
  },
  similarMovieImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 8,
  },
  similarMovieTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  similarMovieYear: {
    color: '#CCCCCC',
    fontSize: 12,
  },
});