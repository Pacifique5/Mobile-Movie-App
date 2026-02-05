import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Alert,
  Animated,
  Easing
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get('window');

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: readonly [string, string, ...string[]];
  change?: string;
  onPress?: () => void;
}

function StatCard({ title, value, icon, color, change, onPress }: StatCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation for cards with changes
    if (change) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [change, pulseAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[
      styles.statCard, 
      { 
        transform: [
          { scale: scaleAnim },
          { scale: change ? pulseAnim : 1 }
        ] 
      }
    ]}>
      <TouchableOpacity 
        onPress={onPress} 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={styles.statCardTouchable}
      >
        <LinearGradient colors={color} style={styles.statGradient}>
          <View style={styles.statHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name={icon as any} size={24} color="#FFF" />
            </View>
            {change && (
              <View style={styles.changeContainer}>
                <Ionicons name="trending-up" size={12} color="#4ADE80" />
                <Text style={styles.changeText}>{change}</Text>
              </View>
            )}
          </View>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
          <View style={styles.cardGlow} />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function AdminDashboard() {
  const { user, hasPermission } = useAdminAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    totalUsers: 1247,
    totalMovies: 856,
    totalFavorites: 3421,
    totalReviews: 892,
    newUsersToday: 23,
    newUsersThisWeek: 156,
    activeUsers: 89,
    serverUptime: '99.9%',
    responseTime: 245,
    serverLoad: 23,
    databaseHealth: 98.5
  });

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
    ]).start();

    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timeInterval);
  }, [fadeAnim, slideAnim]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call with realistic delay
    setTimeout(() => {
      setStats(prev => ({
        ...prev,
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 10),
        newUsersToday: Math.floor(Math.random() * 50),
        activeUsers: Math.floor(Math.random() * 100),
        responseTime: 200 + Math.floor(Math.random() * 100),
        serverLoad: 15 + Math.floor(Math.random() * 20),
        databaseHealth: 95 + Math.random() * 5
      }));
      setRefreshing(false);
    }, 1500);
  };

  const handleQuickAction = (action: string, route?: string) => {
    if (route) {
      router.push(route as any);
    } else {
      Alert.alert('Quick Action', `${action} functionality would be implemented here.`, [
        { text: 'OK', style: 'default' }
      ]);
    }
  };

  const handleStatCardPress = (type: string) => {
    switch (type) {
      case 'users':
        if (hasPermission('users.read')) {
          router.push('/(tabs)/users');
        } else {
          Alert.alert('Access Denied', 'You do not have permission to view users.', [
            { text: 'OK', style: 'default' }
          ]);
        }
        break;
      case 'movies':
        if (hasPermission('movies.read')) {
          router.push('/(tabs)/movies');
        } else {
          Alert.alert('Access Denied', 'You do not have permission to view movies.', [
            { text: 'OK', style: 'default' }
          ]);
        }
        break;
      case 'analytics':
        if (hasPermission('analytics.read')) {
          router.push('/(tabs)/analytics');
        } else {
          Alert.alert('Access Denied', 'You do not have permission to view analytics.', [
            { text: 'OK', style: 'default' }
          ]);
        }
        break;
      default:
        Alert.alert('Info', `Viewing ${type} details...`, [
          { text: 'OK', style: 'default' }
        ]);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return '🌅 Good Morning';
    if (hour < 17) return '☀️ Good Afternoon';
    return '🌙 Good Evening';
  };

  return (
    <LinearGradient colors={['#1a1a1a', '#2d2d2d'] as const} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[
          styles.animatedContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <ScrollView 
            style={styles.scrollView}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B6B" />
            }
            showsVerticalScrollIndicator={false}
          >
            {/* Enhanced Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.greetingText}>{getGreeting()}</Text>
                <Text style={styles.nameText}>{user?.username}</Text>
                <View style={styles.roleContainer}>
                  <View style={[styles.roleDot, { backgroundColor: user?.role === 'admin' ? '#FF6B6B' : '#4ECDC4' }]} />
                  <Text style={styles.roleText}>{user?.role?.toUpperCase()} DASHBOARD</Text>
                </View>
                <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
              </View>
              <TouchableOpacity 
                style={styles.avatarContainer}
                onPress={() => router.push('/(tabs)/profile')}
              >
                <LinearGradient colors={['#FF6B6B', '#FF8E8E'] as const} style={styles.avatar}>
                  <Text style={styles.avatarText}>{user?.username?.charAt(0).toUpperCase()}</Text>
                </LinearGradient>
                <View style={styles.statusIndicator} />
                <View style={styles.avatarGlow} />
              </TouchableOpacity>
            </View>

            {/* Enhanced System Status */}
            <View style={styles.systemStatus}>
              <View style={styles.statusHeader}>
                <Ionicons name="server" size={16} color="#2ECC71" />
                <Text style={styles.statusHeaderText}>System Status</Text>
              </View>
              <View style={styles.statusGrid}>
                <View style={styles.statusItem}>
                  <View style={[styles.statusDot, { backgroundColor: '#2ECC71' }]} />
                  <Text style={styles.statusText}>Online</Text>
                </View>
                <View style={styles.statusItem}>
                  <Ionicons name="time" size={14} color="#888" />
                  <Text style={styles.statusText}>{stats.serverUptime}</Text>
                </View>
                <View style={styles.statusItem}>
                  <Ionicons name="people" size={14} color="#888" />
                  <Text style={styles.statusText}>{stats.activeUsers} active</Text>
                </View>
              </View>
            </View>

            {/* Enhanced Stats Grid */}
            <View style={styles.statsContainer}>
              <Text style={styles.sectionTitle}>📊 Overview</Text>
              <View style={styles.statsRow}>
                <StatCard
                  title="Total Users"
                  value={stats.totalUsers.toLocaleString()}
                  icon="people"
                  color={['#667eea', '#764ba2'] as const}
                  change="+12%"
                  onPress={() => handleStatCardPress('users')}
                />
                <StatCard
                  title="Total Movies"
                  value={stats.totalMovies.toLocaleString()}
                  icon="film"
                  color={['#f093fb', '#f5576c'] as const}
                  onPress={() => handleStatCardPress('movies')}
                />
              </View>
              <View style={styles.statsRow}>
                <StatCard
                  title="Favorites"
                  value={stats.totalFavorites.toLocaleString()}
                  icon="heart"
                  color={['#4facfe', '#00f2fe'] as const}
                  change="+8%"
                  onPress={() => handleStatCardPress('favorites')}
                />
                <StatCard
                  title="Reviews"
                  value={stats.totalReviews.toLocaleString()}
                  icon="star"
                  color={['#43e97b', '#38f9d7'] as const}
                  onPress={() => handleStatCardPress('reviews')}
                />
              </View>
            </View>

            {/* Enhanced Growth Metrics */}
            <View style={styles.growthContainer}>
              <Text style={styles.sectionTitle}>📈 Growth Metrics</Text>
              <View style={styles.growthStats}>
                <View style={styles.growthItem}>
                  <View style={styles.growthIconContainer}>
                    <Ionicons name="trending-up" size={20} color="#2ECC71" />
                  </View>
                  <Text style={styles.growthValue}>{stats.newUsersToday}</Text>
                  <Text style={styles.growthLabel}>New Users Today</Text>
                  <View style={styles.growthTrend}>
                    <Ionicons name="arrow-up" size={12} color="#2ECC71" />
                    <Text style={styles.trendText}>+15%</Text>
                  </View>
                </View>
                <View style={styles.growthDivider} />
                <View style={styles.growthItem}>
                  <View style={styles.growthIconContainer}>
                    <Ionicons name="calendar" size={20} color="#3B82F6" />
                  </View>
                  <Text style={styles.growthValue}>{stats.newUsersThisWeek}</Text>
                  <Text style={styles.growthLabel}>New Users This Week</Text>
                  <View style={styles.growthTrend}>
                    <Ionicons name="arrow-up" size={12} color="#2ECC71" />
                    <Text style={styles.trendText}>+8%</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Enhanced Quick Actions */}
            <View style={styles.actionsContainer}>
              <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
              <View style={styles.actionsGrid}>
                <TouchableOpacity 
                  style={[styles.actionItem, styles.primaryAction]}
                  onPress={() => handleQuickAction('Add Movie', '/add-movie')}
                >
                  <LinearGradient colors={['#FF6B6B', '#FF8E8E'] as const} style={styles.actionGradient}>
                    <Ionicons name="add-circle" size={28} color="#FFF" />
                    <Text style={styles.actionText}>Add Movie</Text>
                    <Text style={styles.actionSubtext}>Quick add new content</Text>
                  </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionItem}
                  onPress={() => handleQuickAction('View Users', '/(tabs)/users')}
                >
                  <View style={[styles.actionIcon, { backgroundColor: '#667eea' }]}>
                    <Ionicons name="people" size={24} color="#FFF" />
                  </View>
                  <Text style={styles.actionText}>Manage Users</Text>
                  <Text style={styles.actionSubtext}>User control</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionItem}
                  onPress={() => handleQuickAction('Analytics', '/(tabs)/analytics')}
                >
                  <View style={[styles.actionIcon, { backgroundColor: '#43e97b' }]}>
                    <Ionicons name="bar-chart" size={24} color="#FFF" />
                  </View>
                  <Text style={styles.actionText}>View Analytics</Text>
                  <Text style={styles.actionSubtext}>Insights & reports</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionItem}
                  onPress={() => handleQuickAction('System Settings')}
                >
                  <View style={[styles.actionIcon, { backgroundColor: '#f093fb' }]}>
                    <Ionicons name="settings" size={24} color="#FFF" />
                  </View>
                  <Text style={styles.actionText}>Settings</Text>
                  <Text style={styles.actionSubtext}>Configure system</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Enhanced Performance Overview */}
            <View style={styles.performanceContainer}>
              <Text style={styles.sectionTitle}>⚡ System Performance</Text>
              <View style={styles.performanceGrid}>
                <View style={styles.performanceItem}>
                  <View style={[styles.performanceIcon, { backgroundColor: 'rgba(255, 107, 107, 0.2)' }]}>
                    <Ionicons name="speedometer" size={20} color="#FF6B6B" />
                  </View>
                  <Text style={styles.performanceLabel}>Response Time</Text>
                  <Text style={styles.performanceValue}>{stats.responseTime}ms</Text>
                  <Text style={[styles.performanceStatus, { color: stats.responseTime < 300 ? '#2ECC71' : '#F39C12' }]}>
                    {stats.responseTime < 300 ? 'Excellent' : 'Good'}
                  </Text>
                  <View style={[styles.performanceBar, { width: `${Math.min(100, (500 - stats.responseTime) / 5)}%` }]} />
                </View>
                
                <View style={styles.performanceItem}>
                  <View style={[styles.performanceIcon, { backgroundColor: 'rgba(67, 233, 123, 0.2)' }]}>
                    <Ionicons name="server" size={20} color="#43e97b" />
                  </View>
                  <Text style={styles.performanceLabel}>Server Load</Text>
                  <Text style={styles.performanceValue}>{stats.serverLoad}%</Text>
                  <Text style={[styles.performanceStatus, { color: stats.serverLoad < 50 ? '#2ECC71' : '#F39C12' }]}>
                    {stats.serverLoad < 50 ? 'Low' : 'Medium'}
                  </Text>
                  <View style={[styles.performanceBar, { width: `${100 - stats.serverLoad}%` }]} />
                </View>
                
                <View style={styles.performanceItem}>
                  <View style={[styles.performanceIcon, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
                    <Ionicons name="disc" size={20} color="#3B82F6" />
                  </View>
                  <Text style={styles.performanceLabel}>Database</Text>
                  <Text style={styles.performanceValue}>{stats.databaseHealth.toFixed(1)}%</Text>
                  <Text style={[styles.performanceStatus, { color: stats.databaseHealth > 95 ? '#2ECC71' : '#F39C12' }]}>
                    {stats.databaseHealth > 95 ? 'Healthy' : 'Warning'}
                  </Text>
                  <View style={[styles.performanceBar, { width: `${stats.databaseHealth}%` }]} />
                </View>
              </View>
            </View>

            {/* Enhanced Recent Activity */}
            <View style={styles.activityContainer}>
              <View style={styles.activityHeader}>
                <Text style={styles.sectionTitle}>🕒 Recent Activity</Text>
                <TouchableOpacity onPress={() => handleQuickAction('View All Logs')}>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.activityList}>
                {[
                  { action: 'New user registered: john_doe', time: '2 min ago', icon: 'person-add', color: '#667eea', priority: 'high' },
                  { action: 'Movie "Inception" was updated', time: '15 min ago', icon: 'film', color: '#f093fb', priority: 'medium' },
                  { action: 'User reported inappropriate content', time: '1 hour ago', icon: 'flag', color: '#EF4444', priority: 'high' },
                  { action: 'System backup completed successfully', time: '2 hours ago', icon: 'cloud-done', color: '#43e97b', priority: 'low' },
                  { action: 'New review posted for "The Dark Knight"', time: '3 hours ago', icon: 'star', color: '#4facfe', priority: 'low' },
                ].map((item, index) => (
                  <TouchableOpacity key={index} style={styles.activityItem} activeOpacity={0.7}>
                    <View style={[styles.activityIcon, { backgroundColor: `${item.color}20` }]}>
                      <Ionicons name={item.icon as any} size={16} color={item.color} />
                    </View>
                    <View style={styles.activityContent}>
                      <Text style={styles.activityAction}>{item.action}</Text>
                      <View style={styles.activityMeta}>
                        <Text style={styles.activityTime}>{item.time}</Text>
                        <View style={[styles.priorityBadge, { backgroundColor: 
                          item.priority === 'high' ? '#EF4444' : 
                          item.priority === 'medium' ? '#F39C12' : '#2ECC71' 
                        }]}>
                          <Text style={styles.priorityText}>{item.priority}</Text>
                        </View>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#666" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </Animated.View>
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
  animatedContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 25,
  },
  headerLeft: {
    flex: 1,
  },
  greetingText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 6,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  roleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  roleText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  avatarContainer: {
    position: 'relative',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#2ECC71',
    borderWidth: 2,
    borderColor: '#1a1a1a',
  },
  avatarGlow: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 32.5,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  systemStatus: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    marginLeft: 8,
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 4,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    width: (width - 50) / 2,
    borderRadius: 18,
    overflow: 'hidden',
  },
  statCardTouchable: {
    flex: 1,
  },
  statGradient: {
    padding: 20,
    height: 130,
    justifyContent: 'space-between',
    position: 'relative',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 222, 128, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changeText: {
    fontSize: 10,
    color: '#4ADE80',
    marginLeft: 2,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF',
  },
  statTitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  cardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 18,
  },
  growthContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 15,
  },
  growthStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  growthItem: {
    flex: 1,
    alignItems: 'center',
  },
  growthIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  growthValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  growthLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    textAlign: 'center',
  },
  growthTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  trendText: {
    fontSize: 10,
    color: '#2ECC71',
    marginLeft: 2,
    fontWeight: '600',
  },
  growthDivider: {
    width: 1,
    height: 80,
    backgroundColor: '#333',
    marginHorizontal: 20,
  },
  actionsContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionItem: {
    width: (width - 60) / 2,
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  primaryAction: {
    width: width - 40,
    marginBottom: 15,
  },
  actionGradient: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 16,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  actionText: {
    fontSize: 14,
    color: '#FFF',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 4,
  },
  actionSubtext: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  activityContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  viewAllText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '600',
  },
  activityList: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    fontSize: 14,
    color: '#FFF',
    marginBottom: 4,
    fontWeight: '500',
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activityTime: {
    fontSize: 12,
    color: '#888',
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    color: '#FFF',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  performanceContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  performanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  performanceItem: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  performanceIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  performanceLabel: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
    marginBottom: 6,
  },
  performanceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  performanceStatus: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  performanceBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 3,
    backgroundColor: '#2ECC71',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
});