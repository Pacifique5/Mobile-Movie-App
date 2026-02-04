import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";
import { LoadingScreen } from "../components/LoadingScreen";
import { useRouter, useSegments } from "expo-router";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user, isGuest, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Hide splash screen after auth is loaded
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(tabs)';
    
    // If no user and no guest mode, ensure we're on the landing page
    if (!user && !isGuest && inAuthGroup) {
      router.replace('/');
    }
  }, [user, isGuest, isLoading, segments]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/signup" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="movie/[id]" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}