const { Pool } = require('pg');
require('dotenv').config();

async function createDatabase() {
  // Connect to postgres database to create cinemamax database
  const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'postgres', // Connect to default postgres database
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 5432,
  });

  try {
    console.log('🚀 Creating CinemaMax database...');
    
    // Check if database exists
    const checkDb = await pool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      ['cinemamax']
    );

    if (checkDb.rows.length === 0) {
      // Create database
      await pool.query('CREATE DATABASE cinemamax');
      console.log('✅ Database "cinemamax" created successfully!');
    } else {
      console.log('ℹ️  Database "cinemamax" already exists');
    }

  } catch (error) {
    console.error('❌ Database creation failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run creation if called directly
if (require.main === module) {
  createDatabase().catch(console.error);
}

module.exports = createDatabase;