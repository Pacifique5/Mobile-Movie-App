const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const router = express.Router();

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name, username } = req.body;

    console.log('Signup request received:', {
      email,
      username,
      name,
      hasPassword: !!password
    });

    if (!email || !password || !name || !username) {
      console.log('Validation failed - missing fields:', {
        hasEmail: !!email,
        hasPassword: !!password,
        hasName: !!name,
        hasUsername: !!username
      });
      return res.status(400).json({ error: 'Email, password, name, and username are required' });
    }

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      console.log('User already exists');
      return res.status(400).json({ error: 'User with this email or username already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 12);

    // Split name into first and last name
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    console.log('Creating user:', { username, email, firstName, lastName });

    // Create user
    const result = await query(`
      INSERT INTO users (username, email, password_hash, first_name, last_name, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, username, email, first_name, last_name, role, profile_image, created_at
    `, [username, email, passwordHash, firstName, lastName, 'user']);

    const user = result.rows[0];
    const token = generateToken(user);

    console.log('User created successfully:', user.id);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        profile_image: user.profile_image,
        created_at: user.created_at
      },
      token
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sign in
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email or username
    const result = await query(
      'SELECT * FROM users WHERE email = $1 OR username = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check if user is active
    if (!user.is_active) {
      return res.status(400).json({ error: 'Account is deactivated' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Signed in successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        profile_image: user.profile_image,
        created_at: user.created_at
      },
      token
    });

  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin login (for admin panels)
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find admin user
    const result = await query(
      'SELECT * FROM users WHERE username = $1 AND role IN ($2, $3)',
      [username, 'admin', 'moderator']
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid admin credentials' });
    }

    const user = result.rows[0];

    // Check if user is active
    if (!user.is_active) {
      return res.status(400).json({ error: 'Admin account is deactivated' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid admin credentials' });
    }

    const token = generateToken(user);

    // Create admin session
    await query(`
      INSERT INTO admin_sessions (user_id, token, expires_at)
      VALUES ($1, $2, $3)
      ON CONFLICT (token) DO UPDATE SET expires_at = EXCLUDED.expires_at
    `, [user.id, token, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]);

    res.json({
      message: 'Admin login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      },
      token
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sign out
router.post('/signout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      // Remove admin session if exists
      await query('DELETE FROM admin_sessions WHERE token = $1', [token]);
    }

    res.json({ message: 'Signed out successfully' });

  } catch (error) {
    console.error('Signout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
router.get('/user', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get fresh user data
      const result = await query(
        'SELECT id, username, email, first_name, last_name, role, is_active, profile_image, created_at FROM users WHERE id = $1',
        [decoded.id]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'User not found' });
      }

      const user = result.rows[0];

      if (!user.is_active) {
        return res.status(401).json({ error: 'Account is deactivated' });
      }

      res.json({ user });

    } catch (jwtError) {
      return res.status(401).json({ error: 'Invalid token' });
    }

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify admin token
router.get('/admin/verify', async (req, res) => {
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
        return res.status(401).json({ error: 'Invalid or expired admin session' });
      }

      // Get user data
      const userResult = await query(
        'SELECT id, username, email, first_name, last_name, role FROM users WHERE id = $1 AND role IN ($2, $3)',
        [decoded.id, 'admin', 'moderator']
      );

      if (userResult.rows.length === 0) {
        return res.status(401).json({ error: 'Admin user not found' });
      }

      res.json({ user: userResult.rows[0] });

    } catch (jwtError) {
      return res.status(401).json({ error: 'Invalid token' });
    }

  } catch (error) {
    console.error('Admin verify error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;