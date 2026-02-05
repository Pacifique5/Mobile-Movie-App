import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'moderator' | 'admin';
  status: 'active' | 'suspended';
  joinDate: string;
  lastActive: string;
}

export default function UsersScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      username: 'john_doe',
      email: 'john@example.com',
      role: 'user',
      status: 'active',
      joinDate: '2024-01-15',
      lastActive: '2 hours ago'
    },
    {
      id: '2',
      username: 'jane_smith',
      email: 'jane@example.com',
      role: 'moderator',
      status: 'active',
      joinDate: '2024-01-10',
      lastActive: '1 day ago'
    },
    {
      id: '3',
      username: 'mike_wilson',
      email: 'mike@example.com',
      role: 'user',
      status: 'suspended',
      joinDate: '2024-01-20',
      lastActive: '3 days ago'
    }
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleUserAction = (userId: string, action: string) => {
    Alert.alert(
      'Confirm Action',
      `Are you sure you want to ${action} this user?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            Alert.alert('Success', `User ${action} successfully!`);
          }
        }
      ]
    );
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#FF6B6B';
      case 'moderator': return '#4ECDC4';
      default: return '#95A5A6';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? '#2ECC71' : '#E74C3C';
  };

  return (
    <LinearGradient colors={['#1a1a1a', '#2d2d2d'] as const} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>User Management</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="person-add" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#888" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search users..."
              placeholderTextColor="#888"
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{users.length}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{users.filter(u => u.status === 'active').length}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{users.filter(u => u.status === 'suspended').length}</Text>
            <Text style={styles.statLabel}>Suspended</Text>
          </View>
        </View>

        {/* Users List */}
        <ScrollView 
          style={styles.usersList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B6B" />
          }
        >
          {filteredUsers.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <View style={styles.userInfo}>
                <View style={styles.userHeader}>
                  <View style={styles.userAvatar}>
                    <Text style={styles.userAvatarText}>
                      {user.username.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.userDetails}>
                    <Text style={styles.userName}>{user.username}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                  </View>
                  <View style={styles.userBadges}>
                    <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user.role) }]}>
                      <Text style={styles.badgeText}>{user.role}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(user.status) }]}>
                      <Text style={styles.badgeText}>{user.status}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.userMeta}>
                  <Text style={styles.metaText}>Joined: {user.joinDate}</Text>
                  <Text style={styles.metaText}>Last active: {user.lastActive}</Text>
                </View>
              </View>

              <View style={styles.userActions}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => handleUserAction(user.id, 'edit')}
                >
                  <Ionicons name="create" size={16} color="#FFF" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, user.status === 'active' ? styles.suspendButton : styles.activateButton]}
                  onPress={() => handleUserAction(user.id, user.status === 'active' ? 'suspend' : 'activate')}
                >
                  <Ionicons 
                    name={user.status === 'active' ? 'ban' : 'checkmark-circle'} 
                    size={16} 
                    color="#FFF" 
                  />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleUserAction(user.id, 'delete')}
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
  usersList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  userCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  userEmail: {
    color: '#888',
    fontSize: 14,
    marginTop: 2,
  },
  userBadges: {
    alignItems: 'flex-end',
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
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
  userMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    color: '#666',
    fontSize: 12,
  },
  userActions: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#3498DB',
  },
  suspendButton: {
    backgroundColor: '#E67E22',
  },
  activateButton: {
    backgroundColor: '#2ECC71',
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
  },
});