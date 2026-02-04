const express = require('express');
const { supabase } = require('../config/supabase');
const router = express.Router();

// Middleware to check admin access (simplified for demo)
const requireAdmin = (req, res, next) => {
  // In production, implement proper admin authentication
  // For now, we'll use a simple header check
  const adminKey = req.headers['x-admin-key'];
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Get system statistics
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const [
      { count: totalUsers },
      { count: totalMovies },
      { count: totalFavorites },
      { count: totalReviews },
      { count: newUsersToday },
      { count: newUsersThisWeek },
      { count: newUsersThisMonth }
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('movie_cache').select('*', { count: 'exact', head: true }),
      supabase.from('user_favorites').select('*', { count: 'exact', head: true }),
      supabase.from('user_reviews').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true })
        .gte('created_at', new Date().toISOString().split('T')[0]),
      supabase.from('profiles').select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      supabase.from('profiles').select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    ]);

    res.json({
      total_users: totalUsers || 0,
      active_users: totalUsers || 0, // TODO: Implement active user tracking
      total_movies: totalMovies || 0,
      total_favorites: totalFavorites || 0,
      total_reviews: totalReviews || 0,
      new_users_today: newUsersToday || 0,
      new_users_this_week: newUsersThisWeek || 0,
      new_users_this_month: newUsersThisMonth || 0
    });
  } catch (error) {
    console.error('Error fetching system stats:', error);
    res.status(500).json({ error: 'Failed to fetch system statistics' });
  }
});

// Get all users with pagination
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    let query = supabase
      .from('profiles')
      .select(`
        *,
        user_favorites(count),
        user_reviews(count)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    const users = data?.map(user => ({
      ...user,
      total_favorites: user.user_favorites?.[0]?.count || 0,
      total_reviews: user.user_reviews?.[0]?.count || 0
    })) || [];

    res.json({
      users,
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user
router.put('/users/:userId', requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    // Remove fields that shouldn't be updated via admin
    delete updates.id;
    delete updates.email;
    delete updates.created_at;

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user
router.delete('/users/:userId', requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    // Delete user data in order (due to foreign key constraints)
    await supabase.from('user_reviews').delete().eq('user_id', userId);
    await supabase.from('user_favorites').delete().eq('user_id', userId);
    await supabase.from('user_watchlist').delete().eq('user_id', userId);
    await supabase.from('watch_history').delete().eq('user_id', userId);
    
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Get movie statistics
router.get('/movies/stats', requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('movie_cache')
      .select(`
        *,
        user_favorites(count),
        user_reviews(count, rating)
      `, { count: 'exact' })
      .order('cached_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const movies = data?.map(movie => ({
      ...movie,
      total_favorites: movie.user_favorites?.[0]?.count || 0,
      total_reviews: movie.user_reviews?.length || 0,
      average_rating: movie.user_reviews?.length > 0 
        ? movie.user_reviews.reduce((sum, review) => sum + review.rating, 0) / movie.user_reviews.length
        : 0
    })) || [];

    res.json({
      movies,
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    });
  } catch (error) {
    console.error('Error fetching movie stats:', error);
    res.status(500).json({ error: 'Failed to fetch movie statistics' });
  }
});

// Add movie to database
router.post('/movies', requireAdmin, async (req, res) => {
  try {
    const movieData = {
      ...req.body,
      cached_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('movie_cache')
      .insert(movieData)
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Error adding movie:', error);
    res.status(500).json({ error: 'Failed to add movie' });
  }
});

// Update movie
router.put('/movies/:movieId', requireAdmin, async (req, res) => {
  try {
    const { movieId } = req.params;
    const updates = {
      ...req.body,
      updated_at: new Date().toISOString()
    };

    // Remove fields that shouldn't be updated
    delete updates.id;
    delete updates.cached_at;

    const { data, error } = await supabase
      .from('movie_cache')
      .update(updates)
      .eq('id', movieId)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({ error: 'Failed to update movie' });
  }
});

// Delete movie
router.delete('/movies/:movieId', requireAdmin, async (req, res) => {
  try {
    const { movieId } = req.params;

    // Delete related data first
    await supabase.from('user_reviews').delete().eq('movie_id', movieId);
    await supabase.from('user_favorites').delete().eq('movie_id', movieId);
    await supabase.from('user_watchlist').delete().eq('movie_id', movieId);
    await supabase.from('watch_history').delete().eq('movie_id', movieId);
    
    const { error } = await supabase
      .from('movie_cache')
      .delete()
      .eq('id', movieId);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({ error: 'Failed to delete movie' });
  }
});

// Get recent user activity
router.get('/activity', requireAdmin, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;

    // Get recent user signups
    const { data: recentUsers } = await supabase
      .from('profiles')
      .select('id, name, email, created_at')
      .order('created_at', { ascending: false })
      .limit(Math.floor(limit / 2));

    // Get recent favorites
    const { data: recentFavorites } = await supabase
      .from('user_favorites')
      .select(`
        *,
        profiles(name, email),
        movie_cache(title)
      `)
      .order('created_at', { ascending: false })
      .limit(Math.floor(limit / 2));

    const activities = [];

    // Add user signups
    recentUsers?.forEach(user => {
      activities.push({
        id: `signup-${user.id}`,
        user_id: user.id,
        user_name: user.name,
        user_email: user.email,
        activity_type: 'signup',
        created_at: user.created_at
      });
    });

    // Add favorites
    recentFavorites?.forEach(fav => {
      activities.push({
        id: `favorite-${fav.id}`,
        user_id: fav.user_id,
        user_name: fav.profiles?.name || 'Unknown',
        user_email: fav.profiles?.email || 'Unknown',
        activity_type: 'favorite',
        movie_id: fav.movie_id,
        movie_title: fav.movie_cache?.title || 'Unknown Movie',
        created_at: fav.created_at
      });
    });

    // Sort by date
    activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    res.json(activities.slice(0, limit));
  } catch (error) {
    console.error('Error fetching user activity:', error);
    res.status(500).json({ error: 'Failed to fetch user activity' });
  }
});

// System health check
router.get('/health', requireAdmin, async (req, res) => {
  try {
    // Test database connection
    const { error: dbError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbError ? 'error' : 'healthy',
        api: 'healthy'
      }
    };

    if (dbError) {
      health.status = 'degraded';
      health.services.database_error = dbError.message;
    }

    res.json(health);
  } catch (error) {
    console.error('Error checking system health:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

module.exports = router;