const express = require('express');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const router = express.Router();

// Middleware to verify user
const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user data
      const result = await query(
        'SELECT id, username, email, first_name, last_name, role, is_active FROM users WHERE id = $1',
        [decoded.id]
      );

      if (result.rows.length === 0 || !result.rows[0].is_active) {
        return res.status(401).json({ error: 'Invalid token or inactive user' });
      }

      req.user = result.rows[0];
      next();
    } catch (jwtError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user profile
router.get('/profile', verifyUser, async (req, res) => {
  try {
    res.json({
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      role: req.user.role
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', verifyUser, async (req, res) => {
  try {
    const { first_name, last_name, email } = req.body;
    
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (first_name) {
      updates.push(`first_name = $${paramCount++}`);
      values.push(first_name);
    }
    if (last_name) {
      updates.push(`last_name = $${paramCount++}`);
      values.push(last_name);
    }
    if (email) {
      updates.push(`email = $${paramCount++}`);
      values.push(email);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updates.push(`updated_at = $${paramCount++}`);
    values.push(new Date());
    values.push(req.user.id);

    const result = await query(`
      UPDATE users 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, username, email, first_name, last_name, role, updated_at
    `, values);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update profile error:', error);
    if (error.code === '23505') { // Unique constraint violation
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Get user favorites
router.get('/favorites', verifyUser, async (req, res) => {
  try {
    const result = await query(`
      SELECT f.movie_id, f.created_at, m.title, m.poster_path, m.vote_average
      FROM favorites f
      LEFT JOIN movies m ON f.movie_id = m.id
      WHERE f.user_id = $1
      ORDER BY f.created_at DESC
    `, [req.user.id]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add to favorites
router.post('/favorites/:movieId', verifyUser, async (req, res) => {
  try {
    const movieId = parseInt(req.params.movieId);

    const result = await query(`
      INSERT INTO favorites (user_id, movie_id)
      VALUES ($1, $2)
      RETURNING *
    `, [req.user.id, movieId]);

    res.json({ message: 'Added to favorites', data: result.rows[0] });
  } catch (error) {
    console.error('Add favorite error:', error);
    if (error.code === '23505') { // Unique constraint violation
      res.status(400).json({ error: 'Movie already in favorites' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Remove from favorites
router.delete('/favorites/:movieId', verifyUser, async (req, res) => {
  try {
    const movieId = parseInt(req.params.movieId);

    await query(`
      DELETE FROM favorites 
      WHERE user_id = $1 AND movie_id = $2
    `, [req.user.id, movieId]);

    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user reviews
router.get('/reviews', verifyUser, async (req, res) => {
  try {
    const result = await query(`
      SELECT r.*, m.title, m.poster_path
      FROM reviews r
      LEFT JOIN movies m ON r.movie_id = m.id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
    `, [req.user.id]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add review
router.post('/reviews/:movieId', verifyUser, async (req, res) => {
  try {
    const movieId = parseInt(req.params.movieId);
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 10) {
      return res.status(400).json({ error: 'Rating must be between 1 and 10' });
    }

    const result = await query(`
      INSERT INTO reviews (user_id, movie_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [req.user.id, movieId, rating, comment]);

    res.json({ message: 'Review added', data: result.rows[0] });
  } catch (error) {
    console.error('Add review error:', error);
    if (error.code === '23505') { // Unique constraint violation
      res.status(400).json({ error: 'You have already reviewed this movie' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Update review
router.put('/reviews/:movieId', verifyUser, async (req, res) => {
  try {
    const movieId = parseInt(req.params.movieId);
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 10) {
      return res.status(400).json({ error: 'Rating must be between 1 and 10' });
    }

    const result = await query(`
      UPDATE reviews 
      SET rating = $1, comment = $2, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $3 AND movie_id = $4
      RETURNING *
    `, [rating, comment, req.user.id, movieId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({ message: 'Review updated', data: result.rows[0] });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete review
router.delete('/reviews/:movieId', verifyUser, async (req, res) => {
  try {
    const movieId = parseInt(req.params.movieId);

    const result = await query(`
      DELETE FROM reviews 
      WHERE user_id = $1 AND movie_id = $2
      RETURNING *
    `, [req.user.id, movieId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({ message: 'Review deleted' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;