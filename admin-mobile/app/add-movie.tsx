import { useState, useRef, useEffect } from 'react'
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Animated,
  Easing
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'

export default function AddMovie() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current
  const [movie, setMovie] = useState({
    title: '',
    overview: '',
    release_date: '',
    runtime: '',
    vote_average: '',
    poster_path: '',
    backdrop_path: '',
    genres: '',
    director: '',
    cast: ''
  })

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const handleSave = async () => {
    if (!movie.title || !movie.overview) {
      Alert.alert('Validation Error', 'Please fill in the required fields (Title and Overview)', [
        { text: 'OK', style: 'default' }
      ])
      return
    }

    setLoading(true)
    
    // Simulate API call with realistic delay
    setTimeout(() => {
      Alert.alert(
        'Success! 🎉', 
        `"${movie.title}" has been added to the database successfully!`,
        [{ 
          text: 'Great!', 
          onPress: () => router.back(),
          style: 'default'
        }]
      )
      setLoading(false)
    }, 2000)
  }

  const handleCancel = () => {
    Alert.alert(
      'Cancel Adding Movie?',
      'Are you sure you want to cancel? All changes will be lost.',
      [
        { text: 'Continue Editing', style: 'cancel' },
        { text: 'Yes, Cancel', style: 'destructive', onPress: () => router.back() }
      ]
    )
  }

  const getCompletionPercentage = () => {
    const fields = Object.values(movie)
    const filledFields = fields.filter(field => field.trim() !== '').length
    return Math.round((filledFields / fields.length) * 100)
  }

  return (
    <LinearGradient colors={['#1a1a1a', '#2d2d2d']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Enhanced Header */}
        <Animated.View style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
              <View style={styles.backButtonContainer}>
                <Ionicons name="arrow-back" size={24} color="#FFF" />
              </View>
            </TouchableOpacity>
            
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Add New Movie</Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${getCompletionPercentage()}%` }]} />
                </View>
                <Text style={styles.progressText}>{getCompletionPercentage()}% Complete</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              onPress={handleSave}
              disabled={loading}
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            >
              <LinearGradient 
                colors={loading ? ['#666', '#555'] : ['#FF6B6B', '#FF8E8E']} 
                style={styles.saveButtonGradient}
              >
                {loading ? (
                  <Animated.View style={{ transform: [{ rotate: '360deg' }] }}>
                    <Ionicons name="sync" size={16} color="#FFF" />
                  </Animated.View>
                ) : (
                  <Ionicons name="checkmark" size={16} color="#FFF" />
                )}
                <Text style={styles.saveButtonText}>
                  {loading ? 'Saving...' : 'Save'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <Animated.View style={[
            styles.scrollContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              {/* Basic Information */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="information-circle" size={20} color="#FF6B6B" />
                  <Text style={styles.sectionTitle}>Basic Information</Text>
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    Movie Title <Text style={styles.required}>*</Text>
                  </Text>
                  <View style={[styles.inputContainer, movie.title && styles.inputContainerFilled]}>
                    <TextInput
                      value={movie.title}
                      onChangeText={(text) => setMovie({...movie, title: text})}
                      placeholder="Enter movie title"
                      placeholderTextColor="#666"
                      style={styles.textInput}
                    />
                    {movie.title && <Ionicons name="checkmark-circle" size={20} color="#2ECC71" />}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    Overview <Text style={styles.required}>*</Text>
                  </Text>
                  <View style={[styles.inputContainer, styles.textAreaContainer, movie.overview && styles.inputContainerFilled]}>
                    <TextInput
                      value={movie.overview}
                      onChangeText={(text) => setMovie({...movie, overview: text})}
                      placeholder="Enter movie description and plot summary"
                      placeholderTextColor="#666"
                      multiline
                      numberOfLines={4}
                      style={[styles.textInput, styles.textArea]}
                      textAlignVertical="top"
                    />
                  </View>
                  <Text style={styles.characterCount}>{movie.overview.length}/500 characters</Text>
                </View>

                <View style={styles.row}>
                  <View style={styles.halfWidth}>
                    <Text style={styles.inputLabel}>Release Date</Text>
                    <View style={[styles.inputContainer, movie.release_date && styles.inputContainerFilled]}>
                      <Ionicons name="calendar" size={16} color="#666" style={styles.inputIcon} />
                      <TextInput
                        value={movie.release_date}
                        onChangeText={(text) => setMovie({...movie, release_date: text})}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor="#666"
                        style={[styles.textInput, styles.textInputWithIcon]}
                      />
                    </View>
                  </View>
                  <View style={styles.halfWidth}>
                    <Text style={styles.inputLabel}>Runtime (minutes)</Text>
                    <View style={[styles.inputContainer, movie.runtime && styles.inputContainerFilled]}>
                      <Ionicons name="time" size={16} color="#666" style={styles.inputIcon} />
                      <TextInput
                        value={movie.runtime}
                        onChangeText={(text) => setMovie({...movie, runtime: text})}
                        placeholder="120"
                        placeholderTextColor="#666"
                        keyboardType="numeric"
                        style={[styles.textInput, styles.textInputWithIcon]}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Rating (0-10)</Text>
                  <View style={[styles.inputContainer, movie.vote_average && styles.inputContainerFilled]}>
                    <Ionicons name="star" size={16} color="#666" style={styles.inputIcon} />
                    <TextInput
                      value={movie.vote_average}
                      onChangeText={(text) => setMovie({...movie, vote_average: text})}
                      placeholder="8.5"
                      placeholderTextColor="#666"
                      keyboardType="decimal-pad"
                      style={[styles.textInput, styles.textInputWithIcon]}
                    />
                  </View>
                </View>
              </View>

              {/* Media Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="images" size={20} color="#4ECDC4" />
                  <Text style={styles.sectionTitle}>Media & Images</Text>
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Poster URL</Text>
                  <View style={[styles.inputContainer, movie.poster_path && styles.inputContainerFilled]}>
                    <Ionicons name="image" size={16} color="#666" style={styles.inputIcon} />
                    <TextInput
                      value={movie.poster_path}
                      onChangeText={(text) => setMovie({...movie, poster_path: text})}
                      placeholder="https://image.tmdb.org/t/p/w500/..."
                      placeholderTextColor="#666"
                      style={[styles.textInput, styles.textInputWithIcon]}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Backdrop URL</Text>
                  <View style={[styles.inputContainer, movie.backdrop_path && styles.inputContainerFilled]}>
                    <Ionicons name="image" size={16} color="#666" style={styles.inputIcon} />
                    <TextInput
                      value={movie.backdrop_path}
                      onChangeText={(text) => setMovie({...movie, backdrop_path: text})}
                      placeholder="https://image.tmdb.org/t/p/w1280/..."
                      placeholderTextColor="#666"
                      style={[styles.textInput, styles.textInputWithIcon]}
                    />
                  </View>
                </View>
              </View>

              {/* Additional Details */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="library" size={20} color="#A8E6CF" />
                  <Text style={styles.sectionTitle}>Additional Details</Text>
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Genres</Text>
                  <View style={[styles.inputContainer, movie.genres && styles.inputContainerFilled]}>
                    <Ionicons name="pricetags" size={16} color="#666" style={styles.inputIcon} />
                    <TextInput
                      value={movie.genres}
                      onChangeText={(text) => setMovie({...movie, genres: text})}
                      placeholder="Action, Drama, Thriller"
                      placeholderTextColor="#666"
                      style={[styles.textInput, styles.textInputWithIcon]}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Director</Text>
                  <View style={[styles.inputContainer, movie.director && styles.inputContainerFilled]}>
                    <Ionicons name="person" size={16} color="#666" style={styles.inputIcon} />
                    <TextInput
                      value={movie.director}
                      onChangeText={(text) => setMovie({...movie, director: text})}
                      placeholder="Christopher Nolan"
                      placeholderTextColor="#666"
                      style={[styles.textInput, styles.textInputWithIcon]}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Main Cast</Text>
                  <View style={[styles.inputContainer, styles.textAreaContainer, movie.cast && styles.inputContainerFilled]}>
                    <TextInput
                      value={movie.cast}
                      onChangeText={(text) => setMovie({...movie, cast: text})}
                      placeholder="Leonardo DiCaprio, Marion Cotillard, Tom Hardy"
                      placeholderTextColor="#666"
                      multiline
                      numberOfLines={3}
                      style={[styles.textInput, styles.textAreaSmall]}
                      textAlignVertical="top"
                    />
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  onPress={handleCancel}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={handleSave}
                  disabled={loading}
                  style={[styles.addButton, loading && styles.addButtonDisabled]}
                >
                  <LinearGradient 
                    colors={loading ? ['#666', '#555'] : ['#FF6B6B', '#FF8E8E']} 
                    style={styles.addButtonGradient}
                  >
                    <Text style={styles.addButtonText}>
                      {loading ? 'Adding Movie...' : 'Add Movie'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  backButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 8,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: 120,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B6B',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    color: '#888',
    marginTop: 4,
  },
  saveButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginLeft: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFF',
    marginBottom: 8,
  },
  required: {
    color: '#FF6B6B',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  inputContainerFilled: {
    borderColor: '#FF6B6B',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  textAreaContainer: {
    alignItems: 'flex-start',
    paddingVertical: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFF',
  },
  textInputWithIcon: {
    marginLeft: 0,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  textAreaSmall: {
    height: 60,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  halfWidth: {
    width: '48%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 16,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cancelButtonText: {
    textAlign: 'center',
    color: '#FFF',
    fontWeight: '500',
    fontSize: 16,
  },
  addButton: {
    flex: 1,
    borderRadius: 12,
    marginLeft: 10,
    overflow: 'hidden',
  },
  addButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
})