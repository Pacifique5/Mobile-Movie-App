const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { query } = require('../config/database');
const router = express.Router();

// Middleware to check admin access
const requireAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if admin session exists and is valid
      const sessionResult = await query(
        'SELECT * FROM admin_sessions WHERE token = $1 AND expires_at > NOW()',
        [token]
      );

      if (sessionResult.rows.length === 0) {
        return res.status(403).json({ error: 'Invalid or expired admin session' });
      }

      // Get user data
      const userResult = await query(
        'SELECT * FROM users WHERE id = $1 AND role IN ($2, $3) AND is_active = true',
        [decoded.id, 'admin', 'moderator']
      );

      if (userResult.rows.length === 0) {
        return res.status(403).json({ error: 'Admin access required' });
      }

      req.admin = userResult.rows[0];
      next();
    } catch (jwtError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get system statistics
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const [
      totalUsersResult,
      totalMoviesResult,
      totalFavoritesResult,
      totalReviewsResult,
      newUsersTodayResult,
      newUsersWeekResult,
      newUsersMonthResult
    ] = await Promise.all([
      query('SELECT COUNT(*) FROM users WHERE role = $1', ['user']),
      query('SELECT COUNT(*) FROM movies WHERE status = $1', ['published']),
      query('SELECT COUNT(*) FROM favorites'),
      query('SELECT COUNT(*) FROM reviews'),
      query('SELECT COUNT(*) FROM users WHERE role = $1 AND created_at >= CURRENT_DATE', ['user']),
      query('SELECT COUNT(*) FROM users WHERE role = $1 AND created_at >= CURRENT_DATE - INTERVAL \'7 days\'', ['user']),
      query('SELECT COUNT(*) FROM users WHERE role = $1 AND created_at >= CURRENT_DATE - INTERVAL \'30 days\'', ['user'])
    ]);

    res.json({
      total_users: parseInt(totalUsersResult.rows[0].count),
      active_users: parseInt(totalUsersResult.rows[0].count), // TODO: Implement active user tracking
      total_movies: parseInt(totalMoviesResult.rows[0].count),
      total_favorites: parseInt(totalFavoritesResult.rows[0].count),
      total_reviews: parseInt(totalReviewsResult.rows[0].count),
      new_users_today: parseInt(newUsersTodayResult.rows[0].count),
      new_users_this_week: parseInt(newUsersWeekResult.rows[0].count),
      new_users_this_month: parseInt(newUsersMonthResult.rows[0].count)
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

    let whereClause = 'WHERE role = $1';
    let params = ['user'];
    let paramCount = 2;

    if (search) {
      whereClause += ` AND (first_name ILIKE $${paramCount} OR last_name ILIKE $${paramCount} OR email ILIKE $${paramCount} OR username ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    const usersResult = await query(`
      SELECT u.*, 
             COUNT(DISTINCT f.id) as total_favorites,
             COUNT(DISTINCT r.id) as total_reviews
      FROM users u
      LEFT JOIN favorites f ON u.id = f.user_id
      LEFT JOIN reviews r ON u.id = r.user_id
      ${whereClause}
      GROUP BY u.id
      ORDER BY u.created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `, [...params, limit, offset]);

    const countResult = await query(`
      SELECT COUNT(*) FROM users ${whereClause}
    `, params.slice(0, -2)); // Remove limit and offset params

    const users = usersResult.rows.map(user => ({
      ...user,
      total_favorites: parseInt(user.total_favorites),
      total_reviews: parseInt(user.total_reviews)
    }));

    res.json({
      users,
      total: parseInt(countResult.rows[0].count),
      page,
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
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
    const { first_name, last_name, email, is_active, role } = req.body;

    // Only super admin can change roles
    if (role && req.admin.role !== 'admin') {
      return res.status(403).json({ error: 'Only super admin can change user roles' });
    }

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (first_name !== undefined) {
      updates.push(`first_name = $${paramCount++}`);
      values.push(first_name);
    }
    if (last_name !== undefined) {
      updates.push(`last_name = $${paramCount++}`);
      values.push(last_name);
    }
    if (email !== undefined) {
      updates.push(`email = $${paramCount++}`);
      values.push(email);
    }
    if (is_active !== undefined) {
      updates.push(`is_active = $${paramCount++}`);
      values.push(is_active);
    }
    if (role !== undefined && req.admin.role === 'admin') {
      updates.push(`role = $${paramCount++}`);
      values.push(role);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updates.push(`updated_at = $${paramCount++}`);
    values.push(new Date());
    values.push(userId);

    const result = await query(`
      UPDATE users 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, username, email, first_name, last_name, role, is_active, created_at, updated_at
    `, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    if (error.code === '23505') { // Unique constraint violation
      res.status(400).json({ error: 'Email or username already exists' });
    } else {
      res.status(500).json({ error: 'Failed to update user' });
    }
  }
});

// Delete user
router.delete('/users/:userId', requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    // Delete user data in order (due to foreign key constraints)
    await query('DELETE FROM reviews WHERE user_id = $1', [userId]);
    await query('DELETE FROM favorites WHERE user_id = $1', [userId]);
    await query('DELETE FROM admin_sessions WHERE user_id = $1', [userId]);
    
    const result = await query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, message: 'User deleted successfully' });
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

    const moviesResult = await query(`
      SELECT m.*, 
             COUNT(DISTINCT f.id) as total_favorites,
             COUNT(DISTINCT r.id) as total_reviews,
             AVG(r.rating) as average_rating
      FROM movies m
      LEFT JOIN favorites f ON m.id = f.movie_id
      LEFT JOIN reviews r ON m.id = r.movie_id
      GROUP BY m.id
      ORDER BY m.created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    const countResult = await query('SELECT COUNT(*) FROM movies');

    const movies = moviesResult.rows.map(movie => ({
      ...movie,
      total_favorites: parseInt(movie.total_favorites),
      total_reviews: parseInt(movie.total_reviews),
      average_rating: movie.average_rating ? parseFloat(movie.average_rating).toFixed(1) : 0
    }));

    res.json({
      movies,
      total: parseInt(countResult.rows[0].count),
      page,
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    });
  } catch (error) {
    console.error('Error fetching movie stats:', error);
    res.status(500).json({ error: 'Failed to fetch movie statistics' });
  }
});

// Add movie to database
router.post('/movies', requireAdmin, async (req, res) => {
  try {
    const {
      title, overview, release_date, runtime, vote_average, vote_count,
      poster_path, backdrop_path, genres, director, movie_cast, status = 'published'
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = await query(`
      INSERT INTO movies (
        title, overview, release_date, runtime, vote_average, vote_count,
        poster_path, backdrop_path, genres, director, movie_cast, status, created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `, [
      title, overview, release_date, runtime, vote_average || 0, vote_count || 0,
      poster_path, backdrop_path, genres, director, movie_cast, status, req.admin.id
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding movie:', error);
    res.status(500).json({ error: 'Failed to add movie' });
  }
});

// Update movie
router.put('/movies/:movieId', requireAdmin, async (req, res) => {
  try {
    const { movieId } = req.params;
    const {
      title, overview, release_date, runtime, vote_average, vote_count,
      poster_path, backdrop_path, genres, director, movie_cast, status
    } = req.body;

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      values.push(title);
    }
    if (overview !== undefined) {
      updates.push(`overview = $${paramCount++}`);
      values.push(overview);
    }
    if (release_date !== undefined) {
      updates.push(`release_date = $${paramCount++}`);
      values.push(release_date);
    }
    if (runtime !== undefined) {
      updates.push(`runtime = $${paramCount++}`);
      values.push(runtime);
    }
    if (vote_average !== undefined) {
      updates.push(`vote_average = $${paramCount++}`);
      values.push(vote_average);
    }
    if (vote_count !== undefined) {
      updates.push(`vote_count = $${paramCount++}`);
      values.push(vote_count);
    }
    if (poster_path !== undefined) {
      updates.push(`poster_path = $${paramCount++}`);
      values.push(poster_path);
    }
    if (backdrop_path !== undefined) {
      updates.push(`backdrop_path = $${paramCount++}`);
      values.push(backdrop_path);
    }
    if (genres !== undefined) {
      updates.push(`genres = $${paramCount++}`);
      values.push(genres);
    }
    if (director !== undefined) {
      updates.push(`director = $${paramCount++}`);
      values.push(director);
    }
    if (movie_cast !== undefined) {
      updates.push(`movie_cast = $${paramCount++}`);
      values.push(movie_cast);
    }
    if (status !== undefined) {
      updates.push(`status = $${paramCount++}`);
      values.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updates.push(`updated_at = $${paramCount++}`);
    values.push(new Date());
    values.push(movieId);

    const result = await query(`
      UPDATE movies 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json(result.rows[0]);
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
    await query('DELETE FROM reviews WHERE movie_id = $1', [movieId]);
    await query('DELETE FROM favorites WHERE movie_id = $1', [movieId]);
    
    const result = await query('DELETE FROM movies WHERE id = $1 RETURNING *', [movieId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json({ success: true, message: 'Movie deleted successfully' });
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
    const recentUsersResult = await query(`
      SELECT id, username, first_name, last_name, email, created_at
      FROM users 
      WHERE role = 'user'
      ORDER BY created_at DESC 
      LIMIT $1
    `, [Math.floor(limit / 2)]);

    // Get recent favorites
    const recentFavoritesResult = await query(`
      SELECT f.*, u.username, u.first_name, u.last_name, u.email, m.title
      FROM favorites f
      JOIN users u ON f.user_id = u.id
      LEFT JOIN movies m ON f.movie_id = m.id
      ORDER BY f.created_at DESC 
      LIMIT $1
    `, [Math.floor(limit / 2)]);

    const activities = [];

    // Add user signups
    recentUsersResult.rows.forEach(user => {
      activities.push({
        id: `signup-${user.id}`,
        user_id: user.id,
        user_name: `${user.first_name} ${user.last_name}`.trim(),
        user_email: user.email,
        activity_type: 'signup',
        created_at: user.created_at
      });
    });

    // Add favorites
    recentFavoritesResult.rows.forEach(fav => {
      activities.push({
        id: `favorite-${fav.id}`,
        user_id: fav.user_id,
        user_name: `${fav.first_name} ${fav.last_name}`.trim(),
        user_email: fav.email,
        activity_type: 'favorite',
        movie_id: fav.movie_id,
        movie_title: fav.title || 'Unknown Movie',
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
    const dbTest = await query('SELECT 1 as test');

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbTest.rows.length > 0 ? 'healthy' : 'error',
        api: 'healthy'
      }
    };

    res.json(health);
  } catch (error) {
    console.error('Error checking system health:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      services: {
        database: 'error',
        api: 'degraded'
      },
      error: error.message
    });
  }
});

module.exports = router;