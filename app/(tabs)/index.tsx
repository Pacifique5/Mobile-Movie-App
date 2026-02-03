import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

const { width } = Dimensions.get('window');

// Enhanced movie data with more details
const FEATURED_MOVIES = [
  {
    id: 1,
    title: "Avatar: The Way of Water",
    year: "2022",
    rating: "7.6",
    genre: "Sci-Fi",
    poster: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg",
    duration: "192 min",
    description: "Set more than a decade after the events of the first film..."
  },
  {
    id: 2,
    title: "Top Gun: Maverick",
    year: "2022", 
    rating: "8.3",
    genre: "Action",
    poster: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/odJ4hx6g6vBt4lBWKFD1tI8WS4x.jpg",
    duration: "130 min",
    description: "After thirty years, Maverick is still pushing the envelope..."
  },
  {
    id: 3,
    title: "Black Panther: Wakanda Forever",
    year: "2022",
    rating: "6.7",
    genre: "Action",
    poster: "https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/yYrvN5WFeGYjJnRzhY0QXuo4Isw.jpg",
    duration: "161 min",
    description: "Queen Ramonda, Shuri, M'Baku, Okoye and the Dora Milaje..."
  }
];

const TRENDING_MOVIES = [
  {
    id: 4,
    title: "The Batman",
    year: "2022",
    rating: "7.8",
    poster: "https://image.tmdb.org/t/p/w500/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg"
  },
  {
    id: 5,
    title: "Spider-Man: No Way Home",
    year: "2021",
    rating: "8.2",
    poster: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg"
  },
  {
    id: 6,
    title: "Dune",
    year: "2021",
    rating: "8.0",
    poster: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg"
  },
  {
    id: 7,
    title: "No Time to Die",
    year: "2021",
    rating: "7.3",
    poster: "https://image.tmdb.org/t/p/w500/iUgygt3fscRoKWCV1d0C7FbM9TP.jpg"
  }
];

const FeaturedMovieCard = ({ movie, index }: { movie: any, index: number }) => {
  const router = useRouter();
  
  return (
    <TouchableOpacity 
      style={[styles.featuredCard, { marginLeft: index === 0 ? 20 : 0 }]}
      onPress={() => router.push(`/movie/${movie.id}`)}
    >
      <Image source={{ uri: movie.backdrop }} style={styles.featuredImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.featuredGradient}
      >
        <View style={styles.featuredContent}>
          <Text style={styles.featuredTitle}>{movie.title}</Text>
          <View style={styles.featuredMeta}>
            <Text style={styles.featuredYear}>{movie.year}</Text>
            <Text style={styles.featuredDot}>•</Text>
            <Text style={styles.featuredGenre}>{movie.genre}</Text>
            <Text style={styles.featuredDot}>•</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text style={styles.featuredRating}>{movie.rating}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.playButton}>
            <Ionicons name="play" size={16} color="#FFFFFF" />
            <Text style={styles.playButtonText}>Watch Trailer</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const TrendingMovieCard = ({ movie }: { movie: any }) => {
  const router = useRouter();
  
  return (
    <TouchableOpacity 
      style={styles.trendingCard}
      onPress={() => router.push(`/movie/${movie.id}`)}
    >
      <Image source={{ uri: movie.poster }} style={styles.trendingImage} />
      <View style={styles.trendingContent}>
        <Text style={styles.trendingTitle} numberOfLines={2}>{movie.title}</Text>
        <Text style={styles.trendingYear}>{movie.year}</Text>
        <View style={styles.trendingRating}>
          <Ionicons name="star" size={12} color="#FFD700" />
          <Text style={styles.trendingRatingText}>{movie.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');
  
  const categories = ['All', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi'];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Hello, Movie Lover! 👋</Text>
            <Text style={styles.subtitle}>What do you want to watch today?</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle" size={32} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={() => router.push('/(tabs)/search')}
        >
          <Ionicons name="search" size={20} color="#CCCCCC" />
          <Text style={styles.searchText}>Search movies...</Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Featured Movies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Movies</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={FEATURED_MOVIES}
            renderItem={({ item, index }) => <FeaturedMovieCard movie={item} index={index} />}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.featuredList}
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  activeCategory === category && styles.activeCategoryButton
                ]}
                onPress={() => setActiveCategory(category)}
              >
                <Text style={[
                  styles.categoryText,
                  activeCategory === category && styles.activeCategoryText
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Trending Movies */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Now</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={TRENDING_MOVIES}
            renderItem={({ item }) => <TrendingMovieCard movie={item} />}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.trendingList}
          />
        </View>

        {/* Continue Watching */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Continue Watching</Text>
          <View style={styles.continueWatchingCard}>
            <Image 
              source={{ uri: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg" }}
              style={styles.continueWatchingImage}
            />
            <View style={styles.continueWatchingContent}>
              <Text style={styles.continueWatchingTitle}>Top Gun: Maverick</Text>
              <Text style={styles.continueWatchingProgress}>45 min left</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '65%' }]} />
              </View>
            </View>
            <TouchableOpacity style={styles.continuePlayButton}>
              <Ionicons name="play" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
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
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 4,
  },
  profileButton: {
    padding: 4,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 12,
  },
  searchText: {
    color: '#CCCCCC',
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  seeAllText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '600',
  },
  featuredList: {
    paddingRight: 20,
  },
  featuredCard: {
    width: width * 0.8,
    height: 200,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
  },
  featuredContent: {
    padding: 16,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featuredYear: {
    color: '#CCCCCC',
    fontSize: 12,
  },
  featuredDot: {
    color: '#CCCCCC',
    marginHorizontal: 6,
  },
  featuredGenre: {
    color: '#CCCCCC',
    fontSize: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featuredRating: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginRight: 12,
  },
  activeCategoryButton: {
    backgroundColor: '#FF6B6B',
  },
  categoryText: {
    color: '#CCCCCC',
    fontSize: 14,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  trendingList: {
    paddingHorizontal: 20,
  },
  trendingCard: {
    width: 120,
    marginRight: 16,
  },
  trendingImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 8,
  },
  trendingContent: {
    gap: 4,
  },
  trendingTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  trendingYear: {
    color: '#CCCCCC',
    fontSize: 12,
  },
  trendingRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendingRatingText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
  },
  continueWatchingCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  continueWatchingImage: {
    width: 60,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  continueWatchingContent: {
    flex: 1,
  },
  continueWatchingTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  continueWatchingProgress: {
    color: '#CCCCCC',
    fontSize: 12,
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B6B',
    borderRadius: 2,
  },
  continuePlayButton: {
    backgroundColor: '#FF6B6B',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});