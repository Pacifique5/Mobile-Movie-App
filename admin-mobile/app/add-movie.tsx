import React, { useState } from 'react'
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

export default function AddMovie() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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

  const handleSave = async () => {
    if (!movie.title || !movie.overview) {
      Alert.alert('Error', 'Please fill in the required fields (Title and Overview)')
      return
    }

    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      Alert.alert(
        'Success', 
        'Movie added successfully!',
        [{ text: 'OK', onPress: () => router.back() }]
      )
      setLoading(false)
    }, 1500)
  }

  const handleCancel = () => {
    Alert.alert(
      'Cancel',
      'Are you sure you want to cancel? All changes will be lost.',
      [
        { text: 'Continue Editing', style: 'cancel' },
        { text: 'Cancel', style: 'destructive', onPress: () => router.back() }
      ]
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Movie</Text>
          <TouchableOpacity 
            onPress={handleSave}
            disabled={loading}
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          >
            <Text style={[styles.saveButtonText, loading && styles.saveButtonTextDisabled]}>
              {loading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView}>
          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Title *</Text>
              <TextInput
                value={movie.title}
                onChangeText={(text) => setMovie({...movie, title: text})}
                placeholder="Enter movie title"
                style={styles.textInput}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Overview *</Text>
              <TextInput
                value={movie.overview}
                onChangeText={(text) => setMovie({...movie, overview: text})}
                placeholder="Enter movie description"
                multiline
                numberOfLines={4}
                style={[styles.textInput, styles.textArea]}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={styles.inputLabel}>Release Date</Text>
                <TextInput
                  value={movie.release_date}
                  onChangeText={(text) => setMovie({...movie, release_date: text})}
                  placeholder="YYYY-MM-DD"
                  style={styles.textInput}
                />
              </View>
              <View style={styles.halfWidth}>
                <Text style={styles.inputLabel}>Runtime (min)</Text>
                <TextInput
                  value={movie.runtime}
                  onChangeText={(text) => setMovie({...movie, runtime: text})}
                  placeholder="120"
                  keyboardType="numeric"
                  style={styles.textInput}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Rating (0-10)</Text>
              <TextInput
                value={movie.vote_average}
                onChangeText={(text) => setMovie({...movie, vote_average: text})}
                placeholder="8.5"
                keyboardType="decimal-pad"
                style={styles.textInput}
              />
            </View>
          </View>

          {/* Media */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Media</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Poster URL</Text>
              <TextInput
                value={movie.poster_path}
                onChangeText={(text) => setMovie({...movie, poster_path: text})}
                placeholder="https://image.tmdb.org/t/p/w500/..."
                style={styles.textInput}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Backdrop URL</Text>
              <TextInput
                value={movie.backdrop_path}
                onChangeText={(text) => setMovie({...movie, backdrop_path: text})}
                placeholder="https://image.tmdb.org/t/p/w1280/..."
                style={styles.textInput}
              />
            </View>
          </View>

          {/* Additional Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Genres</Text>
              <TextInput
                value={movie.genres}
                onChangeText={(text) => setMovie({...movie, genres: text})}
                placeholder="Action, Drama, Thriller"
                style={styles.textInput}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Director</Text>
              <TextInput
                value={movie.director}
                onChangeText={(text) => setMovie({...movie, director: text})}
                placeholder="Christopher Nolan"
                style={styles.textInput}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Main Cast</Text>
              <TextInput
                value={movie.cast}
                onChangeText={(text) => setMovie({...movie, cast: text})}
                placeholder="Leonardo DiCaprio, Marion Cotillard, Tom Hardy"
                multiline
                numberOfLines={3}
                style={[styles.textInput, styles.textAreaSmall]}
                textAlignVertical="top"
              />
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
              <Text style={[styles.addButtonText, loading && styles.addButtonTextDisabled]}>
                {loading ? 'Adding Movie...' : 'Add Movie'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  saveButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  saveButtonTextDisabled: {
    color: '#6B7280',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 96,
  },
  textAreaSmall: {
    height: 80,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfWidth: {
    width: '48%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 12,
    marginRight: 8,
  },
  cancelButtonText: {
    textAlign: 'center',
    color: '#374151',
    fontWeight: '500',
  },
  addButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    marginLeft: 8,
  },
  addButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  addButtonText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: '500',
  },
  addButtonTextDisabled: {
    color: '#6B7280',
  },
})