import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  Switch
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const { user, logout } = useAdminAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoBackup, setAutoBackup] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/login');
          }
        }
      ]
    );
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Password change functionality would be implemented here.');
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing functionality would be implemented here.');
  };

  const handleBackupData = () => {
    Alert.alert('Backup Data', 'Data backup has been initiated successfully!');
  };

  const handleViewLogs = () => {
    Alert.alert('System Logs', 'System logs functionality would be implemented here.');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#FF6B6B';
      case 'moderator': return '#4ECDC4';
      default: return '#95A5A6';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return 'shield-checkmark';
      case 'moderator': return 'shield-half';
      default: return 'shield';
    }
  };

  return (
    <LinearGradient colors={['#1a1a1a', '#2d2d2d'] as const} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <LinearGradient colors={['#FF6B6B', '#FF8E8E'] as const} style={styles.avatar}>
                <Text style={styles.avatarText}>{user?.username?.charAt(0).toUpperCase()}</Text>
              </LinearGradient>
            </View>
            <Text style={styles.username}>{user?.username}</Text>
            <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user?.role || 'user') }]}>
              <Ionicons name={getRoleIcon(user?.role || 'user') as any} size={16} color="#FFF" />
              <Text style={styles.roleText}>{user?.role?.toUpperCase()}</Text>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>156</Text>
              <Text style={styles.statLabel}>Actions Today</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>2.4k</Text>
              <Text style={styles.statLabel}>Total Actions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>98%</Text>
              <Text style={styles.statLabel}>Uptime</Text>
            </View>
          </View>

          {/* Account Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Settings</Text>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#3498DB' }]}>
                  <Ionicons name="person" size={20} color="#FFF" />
                </View>
                <Text style={styles.menuItemText}>Edit Profile</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleChangePassword}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#E74C3C' }]}>
                  <Ionicons name="lock-closed" size={20} color="#FFF" />
                </View>
                <Text style={styles.menuItemText}>Change Password</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* App Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App Settings</Text>
            
            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#9B59B6' }]}>
                  <Ionicons name="notifications" size={20} color="#FFF" />
                </View>
                <Text style={styles.menuItemText}>Push Notifications</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#333', true: '#FF6B6B' }}
                thumbColor={notifications ? '#FFF' : '#666'}
              />
            </View>

            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#2C3E50' }]}>
                  <Ionicons name="moon" size={20} color="#FFF" />
                </View>
                <Text style={styles.menuItemText}>Dark Mode</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#333', true: '#FF6B6B' }}
                thumbColor={darkMode ? '#FFF' : '#666'}
              />
            </View>

            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#27AE60' }]}>
                  <Ionicons name="cloud-upload" size={20} color="#FFF" />
                </View>
                <Text style={styles.menuItemText}>Auto Backup</Text>
              </View>
              <Switch
                value={autoBackup}
                onValueChange={setAutoBackup}
                trackColor={{ false: '#333', true: '#FF6B6B' }}
                thumbColor={autoBackup ? '#FFF' : '#666'}
              />
            </View>
          </View>

          {/* System */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>System</Text>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleBackupData}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#F39C12' }]}>
                  <Ionicons name="download" size={20} color="#FFF" />
                </View>
                <Text style={styles.menuItemText}>Backup Data</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleViewLogs}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#8E44AD' }]}>
                  <Ionicons name="document-text" size={20} color="#FFF" />
                </View>
                <Text style={styles.menuItemText}>View System Logs</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Danger Zone */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Danger Zone</Text>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#E74C3C' }]}>
                  <Ionicons name="log-out" size={20} color="#FFF" />
                </View>
                <Text style={[styles.menuItemText, { color: '#E74C3C' }]}>Logout</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#E74C3C" />
            </TouchableOpacity>
          </View>

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text style={styles.appInfoText}>CinemaMax Admin v1.0.0</Text>
            <Text style={styles.appInfoText}>© 2024 CinemaMax. All rights reserved.</Text>
          </View>
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
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#333',
    marginHorizontal: 20,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuItemText: {
    fontSize: 16,
    color: '#FFF',
    flex: 1,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  appInfoText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
});