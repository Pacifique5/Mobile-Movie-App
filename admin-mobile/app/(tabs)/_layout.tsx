import { Stack } from "expo-router";

export default function TabsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="users" />
      <Stack.Screen name="movies" />
      <Stack.Screen name="analytics" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}