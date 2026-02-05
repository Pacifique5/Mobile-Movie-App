import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  RefreshControl
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get('window');

interface AnalyticsData {
  totalViews: number;
  totalUsers: number;
  totalMovies: number;
  avgRating: number;
  topGenres: { name: string; count: number; percentage: number }[];
  recentActivity: { action: string; count: number; change: string }[];
  userGrowth: { period: string; users: number; growth: string }[];
}

export default function AnalyticsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViews: 125847,
    totalUsers: 1247,
    totalMovies: 856,
    avgRating: 4.2,
    topGenres: [
      { name: 'Action', count: 245, percentage: 28.6 },
      { name: 'Drama', count: 198, percentage: 23.1 },
      { name: 'Comedy', count: 156, percentage: 18.2 },
      { name: 'Thriller', count: 134, percentage: 15.7 },
      { name: 'Sci-Fi', count: 123, percentage: 14.4 }
    ],
    recentActivity: [
      { action: 'Movie Views', count: 2847, change: '+12.5%' },
      { action: 'New Registrations', count: 156, change: '+8.3%' },
      { action: 'Reviews Posted', count: 89, change: '+15.2%' },
      { action: 'Favorites Added', count: 234, change: '+6.7%' }
    ],
    userGrowth: [
      { period: 'This Week', users: 156, growth: '+12.5%' },
      { period: 'This Month', users: 678, growth: '+18.3%' },
      { period: 'This Quarter', users: 1847, growth: '+25.7%' }
    ]
  });

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setAnalytics(prev => ({
        ...prev,
        totalViews: prev.totalViews + Math.floor(Math.random() * 1000),
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 50)
      }));
      setRefreshing(false);
    }, 1000);
  };

  const periods = ['day', 'week', 'month', 'year'];

  return (
    <LinearGradient colors={['#1a1a1a', '#2d2d2d'] as const} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Analytics Dashboard</Text>
          <TouchableOpacity style={styles.exportButton}>
            <Ionicons name="download" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.periodButtonActive
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.periodButtonTextActive
                ]}>
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView 
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B6B" />
          }
        >
          {/* Key Metrics */}
          <View style={styles.metricsContainer}>
            <Text style={styles.sectionTitle}>Key Metrics</Text>
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <LinearGradient colors={['#FF6B6B', '#FF8E8E'] as const} style={styles.metricGradient}>
                  <Ionicons name="eye" size={24} color="#FFF" />
                  <Text style={styles.metricValue}>{analytics.totalViews.toLocaleString()}</Text>
                  <Text style={styles.metricLabel}>Total Views</Text>
                </LinearGradient>
              </View>
              
              <View style={styles.metricCard}>
                <LinearGradient colors={['#4ECDC4', '#44A08D'] as const} style={styles.metricGradient}>
                  <Ionicons name="people" size={24} color="#FFF" />
                  <Text style={styles.metricValue}>{analytics.totalUsers.toLocaleString()}</Text>
                  <Text style={styles.metricLabel}>Total Users</Text>
                </LinearGradient>
              </View>
              
              <View style={styles.metricCard}>
                <LinearGradient colors={['#A8E6CF', '#7FCDCD'] as const} style={styles.metricGradient}>
                  <Ionicons name="film" size={24} color="#FFF" />
                  <Text style={styles.metricValue}>{analytics.totalMovies.toLocaleString()}</Text>
                  <Text style={styles.metricLabel}>Total Movies</Text>
                </LinearGradient>
              </View>
              
              <View style={styles.metricCard}>
                <LinearGradient colors={['#FFD93D', '#FF6B6B'] as const} style={styles.metricGradient}>
                  <Ionicons name="star" size={24} color="#FFF" />
                  <Text style={styles.metricValue}>{analytics.avgRating}</Text>
                  <Text style={styles.metricLabel}>Avg Rating</Text>
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* Top Genres */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Genres</Text>
            <View style={styles.genresContainer}>
              {analytics.topGenres.map((genre, index) => (
                <View key={genre.name} style={styles.genreItem}>
                  <View style={styles.genreInfo}>
                    <Text style={styles.genreName}>{genre.name}</Text>
                    <Text style={styles.genreCount}>{genre.count} movies</Text>
                  </View>
                  <View style={styles.genreBar}>
                    <View 
                      style={[
                        styles.genreBarFill, 
                        { width: `${genre.percentage}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.genrePercentage}>{genre.percentage}%</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityContainer}>
              {analytics.recentActivity.map((activity, index) => (
                <View key={activity.action} style={styles.activityItem}>
                  <View style={styles.activityIcon}>
                    <Ionicons 
                      name={
                        activity.action.includes('Views') ? 'eye' :
                        activity.action.includes('Registration') ? 'person-add' :
                        activity.action.includes('Reviews') ? 'star' : 'heart'
                      } 
                      size={20} 
                      color="#FF6B6B" 
                    />
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityAction}>{activity.action}</Text>
                    <Text style={styles.activityCount}>{activity.count.toLocaleString()}</Text>
                  </View>
                  <View style={styles.activityChange}>
                    <Ionicons name="trending-up" size={16} color="#2ECC71" />
                    <Text style={styles.changeText}>{activity.change}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* User Growth */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>User Growth</Text>
            <View style={styles.growthContainer}>
              {analytics.userGrowth.map((growth, index) => (
                <View key={growth.period} style={styles.growthItem}>
                  <Text style={styles.growthPeriod}>{growth.period}</Text>
                  <Text style={styles.growthUsers}>{growth.users.toLocaleString()}</Text>
                  <View style={styles.growthChangeContainer}>
                    <Ionicons name="trending-up" size={14} color="#2ECC71" />
                    <Text style={styles.growthChange}>{growth.growth}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Performance Insights */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance Insights</Text>
            <View style={styles.insightsContainer}>
              <View style={styles.insightItem}>
                <Ionicons name="trending-up" size={24} color="#2ECC71" />
                <Text style={styles.insightText}>User engagement is up 15% this week</Text>
              </View>
              <View style={styles.insightItem}>
                <Ionicons name="star" size={24} color="#FFD700" />
                <Text style={styles.insightText}>Average rating improved by 0.3 points</Text>
              </View>
              <View style={styles.insightItem}>
                <Ionicons name="time" size={24} color="#FF6B6B" />
                <Text style={styles.insightText}>Peak usage time: 8-10 PM</Text>
              </View>
            </View>
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
  exportButton: {
    backgroundColor: '#FF6B6B',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  periodSelector: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  periodButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 10,
  },
  periodButtonActive: {
    backgroundColor: '#FF6B6B',
  },
  periodButtonText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: '#FFF',
  },
  scrollView: {
    flex: 1,
  },
  metricsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 15,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: (width - 50) / 2,
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  metricGradient: {
    padding: 20,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 10,
  },
  metricLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  genresContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
  },
  genreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  genreInfo: {
    width: 80,
  },
  genreName: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  genreCount: {
    color: '#888',
    fontSize: 12,
  },
  genreBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    marginHorizontal: 15,
    overflow: 'hidden',
  },
  genreBarFill: {
    height: '100%',
    backgroundColor: '#FF6B6B',
    borderRadius: 4,
  },
  genrePercentage: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    width: 40,
    textAlign: 'right',
  },
  activityContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityInfo: {
    flex: 1,
  },
  activityAction: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  activityCount: {
    color: '#888',
    fontSize: 12,
  },
  activityChange: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changeText: {
    color: '#2ECC71',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  growthContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  growthItem: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  growthPeriod: {
    color: '#888',
    fontSize: 12,
    marginBottom: 5,
  },
  growthUsers: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  growthChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  growthChange: {
    color: '#2ECC71',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  insightsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  insightText: {
    color: '#FFF',
    fontSize: 14,
    marginLeft: 15,
    flex: 1,
  },
});