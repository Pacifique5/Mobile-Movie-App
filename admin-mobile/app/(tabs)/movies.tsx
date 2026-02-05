import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  RefreshControl
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

interface Movie {
  id: string;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  poster_path: string;
  genre: string;
  status: 'published' | 'draft';
}

export default function MoviesScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([
    {
      id: '1',
      title: 'The Dark Knight',
      overview: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham...',
      release_date: '2008-07-18',
      vote_average: 9.0,
      poster_path: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      genre: 'Action, Crime, Drama',
      status: 'published'
    },
    {
      id: '2',
      title: 'Inception',
      overview: 'A thief who steals corporate secrets through the use of dream-sharing technology...',
      release_date: '2010-07-16',
      vote_average: 8.8,
      poster_path: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
      genre: 'Action, Sci-Fi, Thriller',
      status: 'published'
    },
    {
      id: '3',
      title: 'Interstellar',
      overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure...',
      release_date: '2014-11-07',
      vote_average: 8.6,
      poster_path: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      genre: 'Adventure, Drama, Sci-Fi',
      status: 'draft'
    }
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleMovieAction = (movieId: string, action: string) => {
    Alert.alert(
      'Confirm Action',
      `Are you sure you want to ${action} this movie?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            Alert.alert('Success', `Movie ${action} successfully!`);
          }
        }
      ]
    );
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    return status === 'published' ? '#2ECC71' : '#F39C12';
  };

  return (
    <LinearGradient colors={['#1a1a1a', '#2d2d2d'] as const} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Movie Management</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/add-movie')}
          >
            <Ionicons name="add" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#888" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search movies..."
              placeholderTextColor="#888"
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{movies.length}</Text>
            <Text style={styles.statLabel}>Total Movies</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{movies.filter(m => m.status === 'published').length}</Text>
            <Text style={styles.statLabel}>Published</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{movies.filter(m => m.status === 'draft').length}</Text>
            <Text style={styles.statLabel}>Drafts</Text>
          </View>
        </View>

        {/* Movies List */}
        <ScrollView 
          style={styles.moviesList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B6B" />
          }
        >
          {filteredMovies.map((movie) => (
            <View key={movie.id} style={styles.movieCard}>
              <Image 
                source={{ uri: movie.poster_path }} 
                style={styles.moviePoster}
                defaultSource={{ uri: 'https://via.placeholder.com/80x120/333/fff?text=No+Image' }}
              />
              
              <View style={styles.movieInfo}>
                <View style={styles.movieHeader}>
                  <Text style={styles.movieTitle} numberOfLines={1}>{movie.title}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(movie.status) }]}>
                    <Text style={styles.badgeText}>{movie.status}</Text>
                  </View>
                </View>
                
                <Text style={styles.movieGenre}>{movie.genre}</Text>
                <Text style={styles.movieOverview} numberOfLines={2}>{movie.overview}</Text>
                
                <View style={styles.movieMeta}>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={styles.rating}>{movie.vote_average}</Text>
                  </View>
                  <Text style={styles.releaseDate}>{movie.release_date}</Text>
                </View>
              </View>

              <View style={styles.movieActions}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => handleMovieAction(movie.id, 'edit')}
                >
                  <Ionicons name="create" size={16} color="#FFF" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, movie.status === 'published' ? styles.unpublishButton : styles.publishButton]}
                  onPress={() => handleMovieAction(movie.id, movie.status === 'published' ? 'unpublish' : 'publish')}
                >
                  <Ionicons 
                    name={movie.status === 'published' ? 'eye-off' : 'eye'} 
                    size={16} 
                    color="#FFF" 
                  />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleMovieAction(movie.id, 'delete')}
                >
                  <Ionicons name="trash" size={16} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  addButton: {
    backgroundColor: '#FF6B6B',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: '#FFF',
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  moviesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  movieCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
  },
  moviePoster: {
    width: 60,
    height: 90,
    borderRadius: 8,
    marginRight: 15,
  },
  movieInfo: {
    flex: 1,
  },
  movieHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  movieTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  movieGenre: {
    color: '#FF6B6B',
    fontSize: 12,
    marginBottom: 5,
  },
  movieOverview: {
    color: '#888',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 10,
  },
  movieMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: '#FFD700',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
  releaseDate: {
    color: '#666',
    fontSize: 12,
  },
  movieActions: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: '#3498DB',
  },
  publishButton: {
    backgroundColor: '#2ECC71',
  },
  unpublishButton: {
    backgroundColor: '#E67E22',
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
  },
});