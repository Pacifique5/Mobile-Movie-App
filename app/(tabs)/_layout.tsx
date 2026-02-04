import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function TabIcon({ focused, name, title }: { focused: boolean; name: any; title: string }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 8 }}>
      <Ionicons 
        name={name} 
        size={24} 
        color={focused ? '#FF6B6B' : '#666666'} 
      />
      <Text style={{ 
        color: focused ? '#FF6B6B' : '#666666', 
        fontSize: 10,
        marginTop: 4,
        fontWeight: focused ? '600' : '400'
      }}>
        {title}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#1a1a2e",
          borderTopColor: "#333333",
          borderTopWidth: 1,
          height: 85,
          paddingBottom: 20,
          paddingTop: 5,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name="home" title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name="search" title="Search" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name="person" title="Profile" />
          ),
        }}
      />
    </Tabs>
  );
}