const { query, closePool } = require('../config/database');
const bcrypt = require('bcryptjs');

async function setupDatabase() {
  try {
    console.log('🚀 Setting up CinemaMax database...');

    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create movies table
    await query(`
      CREATE TABLE IF NOT EXISTS movies (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        overview TEXT,
        release_date DATE,
        runtime INTEGER,
        vote_average DECIMAL(3,1),
        vote_count INTEGER DEFAULT 0,
        poster_path VARCHAR(500),
        backdrop_path VARCHAR(500),
        genres TEXT,
        director VARCHAR(100),
        movie_cast TEXT,
        status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER REFERENCES users(id)
      )
    `);

    // Create favorites table
    await query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, movie_id)
      )
    `);

    // Create reviews table
    await query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 10),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, movie_id)
      )
    `);

    // Create admin_sessions table for admin authentication
    await query(`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_movies_title ON movies(title)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_movies_release_date ON movies(release_date)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_reviews_movie_id ON reviews(movie_id)`);

    // Create admin users
    console.log('👤 Creating admin users...');
    
    const adminPassword = await bcrypt.hash('admin123', 12);
    const moderatorPassword = await bcrypt.hash('mod123', 12);

    // Insert admin user
    await query(`
      INSERT INTO users (username, email, password_hash, first_name, last_name, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (username) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        role = EXCLUDED.role
    `, ['admin', 'admin@cinemamax.com', adminPassword, 'Admin', 'User', 'admin']);

    // Insert moderator user
    await query(`
      INSERT INTO users (username, email, password_hash, first_name, last_name, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (username) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        role = EXCLUDED.role
    `, ['moderator', 'moderator@cinemamax.com', moderatorPassword, 'Moderator', 'User', 'moderator']);

    console.log('✅ Database setup completed successfully!');
    console.log('');
    console.log('🔑 Admin Credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('');
    console.log('🔑 Moderator Credentials:');
    console.log('   Username: moderator');
    console.log('   Password: mod123');
    console.log('');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  } finally {
    await closePool();
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase().catch(console.error);
}

module.exports = setupDatabase;