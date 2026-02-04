import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, Modal, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isGuest, logout, updateUser, toggleDarkMode } = useAuth();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');

  // Component definitions
  const ProfileStat = ({ icon, label, value, color }: any) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color="#FFFFFF" />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const MenuOption = ({ icon, title, subtitle, onPress, showArrow = true }: any) => (
    <TouchableOpacity style={styles.menuOption} onPress={onPress}>
      <View style={styles.menuOptionLeft}>
        <View style={styles.menuIcon}>
          <Ionicons name={icon} size={20} color="#FF6B6B" />
        </View>
        <View>
          <Text style={styles.menuTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showArrow && <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />}
    </TouchableOpacity>
  );

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      isGuest ? "Return to welcome screen?" : "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: isGuest ? "Yes" : "Logout", 
          style: "destructive", 
          onPress: async () => {
            await logout();
            router.replace("/");
          }
        }
      ]
    );
  };

  const handleSaveProfile = async () => {
    if (user && editName.trim()) {
      await updateUser({ 
        name: editName.trim(),
        email: editEmail.trim() 
      });
      setEditModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully!');
    }
  };

  const handleToggleDarkMode = async () => {
    if (user) {
      await toggleDarkMode();
      Alert.alert('Success', `Dark mode ${user.darkMode ? 'disabled' : 'enabled'}!`);
    }
  };

  // Guest user display
  if (isGuest) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Guest Profile</Text>
            <TouchableOpacity style={styles.settingsButton}>
              <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.guestSection}>
            <View style={styles.guestIconContainer}>
              <Ionicons name="person-outline" size={60} color="#FF6B6B" />
            </View>
            <Text style={styles.guestTitle}>Browsing as Guest</Text>
            <Text style={styles.guestSubtitle}>Sign up to unlock premium features like favorites, watchlists, and personalized recommendations!</Text>
            
            <View style={styles.guestButtonContainer}>
              <TouchableOpacity 
                style={styles.signUpButton}
                onPress={() => router.push('/auth/signup')}
              >
                <Ionicons name="person-add" size={20} color="#FFFFFF" />
                <Text style={styles.signUpButtonText}>Create Account</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.signInButton}
                onPress={() => router.push('/auth/login')}
              >
                <Ionicons name="log-in" size={20} color="#FF6B6B" />
                <Text style={styles.signInButtonText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Limited Guest Features */}
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Available Features</Text>
            <View style={styles.menuGroup}>
              <MenuOption
                icon="search-outline"
                title="Browse Movies"
                subtitle="Discover new films and trending content"
                onPress={() => router.push('/(tabs)/search')}
              />
              <MenuOption
                icon="play-circle-outline"
                title="Watch Trailers"
                subtitle="Preview movies before watching"
                onPress={() => router.push('/(tabs)')}
              />
              <MenuOption
                icon="information-circle-outline"
                title="Movie Details"
                subtitle="View ratings, cast, and reviews"
                onPress={() => router.push('/(tabs)')}
              />
            </View>
            
            <View style={styles.premiumFeatures}>
              <Text style={styles.premiumTitle}>🔒 Premium Features</Text>
              <Text style={styles.premiumSubtitle}>Sign up to unlock:</Text>
              <View style={styles.premiumList}>
                <Text style={styles.premiumItem}>• Save favorites and watchlists</Text>
                <Text style={styles.premiumItem}>• Personalized recommendations</Text>
                <Text style={styles.premiumItem}>• Watch history tracking</Text>
                <Text style={styles.premiumItem}>• Custom profile settings</Text>
              </View>
            </View>
          </View>

          <View style={styles.logoutSection}>
            <TouchableOpacity style={styles.guestLogoutButton} onPress={handleLogout}>
              <Ionicons name="arrow-back-outline" size={20} color="#FFFFFF" />
              <Text style={styles.guestLogoutText}>Back to Welcome</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Authenticated user display
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View style={styles.userSection}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user?.avatar }} style={styles.avatar} />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <Text style={styles.memberSince}>Member since {user?.memberSince}</Text>
          
          <TouchableOpacity 
            style={styles.editProfileButton}
            onPress={() => setEditModalVisible(true)}
          >
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <ProfileStat 
            icon="play-circle" 
            label="Watched" 
            value={user?.watchedMovies || 0} 
            color="#4CAF50"
          />
          <ProfileStat 
            icon="heart" 
            label="Favorites" 
            value={user?.favorites?.length || 0} 
            color="#FF6B6B"
          />
          <ProfileStat 
            icon="download" 
            label="Downloads" 
            value={user?.downloads?.length || 0} 
            color="#2196F3"
          />
        </View>

        {/* Menu Options */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Library</Text>
          <View style={styles.menuGroup}>
            <MenuOption
              icon="heart-outline"
              title="My Favorites"
              subtitle={`${user?.favorites?.length || 0} movies`}
              onPress={() => Alert.alert("Favorites", "Your favorite movies will be displayed here")}
            />
            <MenuOption
              icon="bookmark-outline"
              title="Watchlist"
              subtitle="Movies to watch later"
              onPress={() => Alert.alert("Watchlist", "Your watchlist will be displayed here")}
            />
            <MenuOption
              icon="download-outline"
              title="Downloads"
              subtitle={`${user?.downloads?.length || 0} movies`}
              onPress={() => Alert.alert("Downloads", "Your downloaded movies will be displayed here")}
            />
            <MenuOption
              icon="time-outline"
              title="Watch History"
              subtitle="Recently watched"
              onPress={() => Alert.alert("History", "Your watch history will be displayed here")}
            />
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.menuGroup}>
            <MenuOption
              icon="notifications-outline"
              title="Notifications"
              subtitle="Push notifications settings"
              onPress={() => Alert.alert("Notifications", "Notification settings will be available here")}
            />
            <MenuOption
              icon="language-outline"
              title="Language"
              subtitle="English"
              onPress={() => Alert.alert("Language", "Language settings will be available here")}
            />
            <MenuOption
              icon="moon-outline"
              title="Dark Mode"
              subtitle={user?.darkMode ? "Enabled" : "Disabled"}
              onPress={handleToggleDarkMode}
            />
            <MenuOption
              icon="shield-checkmark-outline"
              title="Privacy"
              subtitle="Privacy settings"
              onPress={() => Alert.alert("Privacy", "Privacy settings will be available here")}
            />
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.menuGroup}>
            <MenuOption
              icon="help-circle-outline"
              title="Help Center"
              subtitle="Get help and support"
              onPress={() => Alert.alert("Help", "Help center will be available here")}
            />
            <MenuOption
              icon="chatbubble-outline"
              title="Contact Us"
              subtitle="Send us a message"
              onPress={() => Alert.alert("Contact", "Contact form will be available here")}
            />
            <MenuOption
              icon="star-outline"
              title="Rate App"
              subtitle="Rate CinemaMax"
              onPress={() => Alert.alert("Rate App", "Thank you for using CinemaMax!")}
            />
            <MenuOption
              icon="information-circle-outline"
              title="About"
              subtitle="Version 1.0.0"
              onPress={() => Alert.alert("About", "CinemaMax v1.0.0\nYour ultimate movie experience")}
            />
          </View>
        </View>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalForm}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Enter your name"
                  placeholderTextColor="#666"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editEmail}
                  onChangeText={setEditEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#666"
                  keyboardType="email-address"
                />
              </View>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  settingsButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  userSection: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FF6B6B',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF6B6B',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0f0f23',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 20,
  },
  editProfileButton: {
    backgroundColor: 'rgba(255,107,107,0.1)',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  editProfileText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '600',
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#CCCCCC',
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  menuGroup: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  menuOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,107,107,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#CCCCCC',
  },
  logoutSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,107,107,0.1)',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    gap: 8,
  },
  logoutText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Guest mode styles
  guestSection: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  guestIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,107,107,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  guestTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  guestSubtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  guestButtonContainer: {
    width: '100%',
    gap: 12,
  },
  signUpButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    elevation: 4,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signInButton: {
    borderWidth: 2,
    borderColor: '#FF6B6B',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,107,107,0.1)',
  },
  signInButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Guest logout button
  guestLogoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    gap: 8,
  },
  guestLogoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Premium features section
  premiumFeatures: {
    backgroundColor: 'rgba(255,107,107,0.05)',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.2)',
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 8,
  },
  premiumSubtitle: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 12,
  },
  premiumList: {
    gap: 6,
  },
  premiumItem: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalForm: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#666666',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#CCCCCC',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});