import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

// Same sample data for search
const SAMPLE_MOVIES = [
  {
    id: 1,
    title: "The Dark Knight",
    year: "2008",
    rating: "9.0",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
  },
  {
    id: 2,
    title: "Inception",
    year: "2010", 
    rating: "8.8",
    poster: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg"
  },
  {
    id: 3,
    title: "Interstellar",
    year: "2014",
    rating: "8.6", 
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
  },
  {
    id: 4,
    title: "The Matrix",
    year: "1999",
    rating: "8.7",
    poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg"
  },
  {
    id: 5,
    title: "Pulp Fiction", 
    year: "1994",
    rating: "8.9",
    poster: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg"
  },
  {
    id: 6,
    title: "Fight Club",
    year: "1999", 
    rating: "8.8",
    poster: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg"
  }
];

const MovieCard = ({ movie }: { movie: any }) => (
  <TouchableOpacity style={styles.movieCard}>
    <Image source={{ uri: movie.poster }} style={styles.poster} />
    <View style={styles.movieInfo}>
      <Text style={styles.movieTitle} numberOfLines={1}>{movie.title}</Text>
      <Text style={styles.movieYear}>{movie.year}</Text>
      <Text style={styles.movieRating}>⭐ {movie.rating}</Text>
    </View>
  </TouchableOpacity>
);

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMovies, setFilteredMovies] = useState(SAMPLE_MOVIES);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setFilteredMovies(SAMPLE_MOVIES);
    } else {
      const filtered = SAMPLE_MOVIES.filter(movie =>
        movie.title.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔍 Search Movies</Text>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#ccc" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for movies..."
            placeholderTextColor="#ccc"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      <FlatList
        data={filteredMovies}
        renderItem={({ item }) => <MovieCard movie={item} />}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No movies found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 20,
  },
  movieCard: {
    flexDirection: 'row',
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 15,
  },
  movieInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  movieYear: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 5,
  },
  movieRating: {
    fontSize: 14,
    color: '#ffd700',
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#ccc',
  },
});