// Simple test to identify the issue
try {
  console.log('Loading express...');
  const express = require('express');
  
  console.log('Loading cors...');
  const cors = require('cors');
  
  console.log('Loading dotenv...');
  require('dotenv').config();
  
  console.log('Creating app...');
  const app = express();
  
  console.log('Loading routes...');
  const authRoutes = require('./src/routes/auth');
  const moviesRoutes = require('./src/routes/movies');
  const usersRoutes = require('./src/routes/users');
  const adminRoutes = require('./src/routes/admin');
  
  console.log('All modules loaded successfully!');
  
  app.use(cors());
  app.use(express.json());
  
  app.use('/api/auth', authRoutes);
  app.use('/api/movies', moviesRoutes);
  app.use('/api/users', usersRoutes);
  app.use('/api/admin', adminRoutes);
  
  app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
  });
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
  
} catch (error) {
  console.error('❌ Error starting server:', error);
  process.exit(1);
}