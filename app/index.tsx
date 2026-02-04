import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";

const { width, height } = Dimensions.get('window');

export default function LandingScreen() {
  const router = useRouter();
  const { continueAsGuest } = useAuth();

  const handleContinueAsGuest = async () => {
    await continueAsGuest();
    router.replace('/(tabs)');
  };

  return (
    <ImageBackground
      source={{ uri: 'https://image.tmdb.org/t/p/original/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg' }}
      style={styles.container}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.95)']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Ionicons name="film" size={60} color="#FF6B6B" />
            <Text style={styles.logoText}>CinemaMax</Text>
            <Text style={styles.tagline}>Your Ultimate Movie Experience</Text>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <View style={styles.featureIcon}>
                <Ionicons name="play-circle" size={28} color="#FF6B6B" />
              </View>
              <Text style={styles.featureText}>Watch Trailers</Text>
            </View>
            <View style={styles.feature}>
              <View style={styles.featureIcon}>
                <Ionicons name="search" size={28} color="#FF6B6B" />
              </View>
              <Text style={styles.featureText}>Discover Movies</Text>
            </View>
            <View style={styles.feature}>
              <View style={styles.featureIcon}>
                <Ionicons name="star" size={28} color="#FF6B6B" />
              </View>
              <Text style={styles.featureText}>Rate & Review</Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => router.push('/auth/signup')}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => router.push('/auth/login')}
            >
              <Text style={styles.secondaryButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Skip option */}
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={handleContinueAsGuest}
          >
            <Text style={styles.skipText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 16,
    color: '#CCCCCC',
    marginTop: 8,
    textAlign: 'center',
  },
  featuresContainer: {
    alignItems: 'center',
    gap: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 8,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,107,107,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    marginTop: 20,
  },
  skipText: {
    color: '#CCCCCC',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});