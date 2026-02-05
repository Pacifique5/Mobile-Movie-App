const { query, closePool } = require('../config/database');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    console.log('🌱 Seeding CinemaMax database with sample data...');

    // Create sample users
    const userPassword = await bcrypt.hash('user123', 12);
    
    const sampleUsers = [
      ['john_doe', 'john@example.com', userPassword, 'John', 'Doe', 'user'],
      ['jane_smith', 'jane@example.com', userPassword, 'Jane', 'Smith', 'user'],
      ['mike_wilson', 'mike@example.com', userPassword, 'Mike', 'Wilson', 'user'],
      ['sarah_johnson', 'sarah@example.com', userPassword, 'Sarah', 'Johnson', 'user'],
      ['david_brown', 'david@example.com', userPassword, 'David', 'Brown', 'user']
    ];

    for (const user of sampleUsers) {
      await query(`
        INSERT INTO users (username, email, password_hash, first_name, last_name, role)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (username) DO NOTHING
      `, user);
    }

    // Create sample movies
    const sampleMovies = [
      [
        'The Dark Knight',
        'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        '2008-07-18',
        152,
        9.0,
        2500000,
        'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        'https://image.tmdb.org/t/p/w1280/hqkIcbrOHL86UncnHIsHVcVmzue.jpg',
        'Action, Crime, Drama, Thriller',
        'Christopher Nolan',
        'Christian Bale, Heath Ledger, Aaron Eckhart, Michael Caine, Maggie Gyllenhaal',
        'published'
      ],
      [
        'Inception',
        'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        '2010-07-16',
        148,
        8.8,
        2200000,
        'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
        'https://image.tmdb.org/t/p/w1280/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
        'Action, Science Fiction, Thriller',
        'Christopher Nolan',
        'Leonardo DiCaprio, Marion Cotillard, Tom Hardy, Elliot Page, Ken Watanabe',
        'published'
      ],
      [
        'Interstellar',
        'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
        '2014-11-07',
        169,
        8.6,
        1800000,
        'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        'https://image.tmdb.org/t/p/w1280/xu9zaAevzQ5nnrsXN6JcahLnG4i.jpg',
        'Adventure, Drama, Science Fiction',
        'Christopher Nolan',
        'Matthew McConaughey, Anne Hathaway, Jessica Chastain, Michael Caine',
        'published'
      ],
      [
        'The Matrix',
        'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
        '1999-03-31',
        136,
        8.7,
        1900000,
        'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
        'https://image.tmdb.org/t/p/w1280/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg',
        'Action, Science Fiction',
        'Lana Wachowski, Lilly Wachowski',
        'Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving',
        'published'
      ],
      [
        'Pulp Fiction',
        'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
        '1994-10-14',
        154,
        8.9,
        2000000,
        'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
        'https://image.tmdb.org/t/p/w1280/4cDFJr4HnXN5AdPw4AKrmLlMWdO.jpg',
        'Crime, Drama',
        'Quentin Tarantino',
        'John Travolta, Samuel L. Jackson, Uma Thurman, Bruce Willis',
        'published'
      ],
      [
        'The Godfather',
        'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
        '1972-03-24',
        175,
        9.2,
        1700000,
        'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
        'https://image.tmdb.org/t/p/w1280/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
        'Crime, Drama',
        'Francis Ford Coppola',
        'Marlon Brando, Al Pacino, James Caan, Robert Duvall',
        'published'
      ]
    ];

    for (const movie of sampleMovies) {
      await query(`
        INSERT INTO movies (title, overview, release_date, runtime, vote_average, vote_count, poster_path, backdrop_path, genres, director, movie_cast, status, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 1)
        ON CONFLICT DO NOTHING
      `, movie);
    }

    // Add some sample favorites and reviews
    const userIds = await query('SELECT id FROM users WHERE role = $1 LIMIT 5', ['user']);
    const movieIds = await query('SELECT id FROM movies LIMIT 6');

    if (userIds.rows.length > 0 && movieIds.rows.length > 0) {
      // Add favorites
      for (let i = 0; i < Math.min(userIds.rows.length, 3); i++) {
        for (let j = 0; j < Math.min(movieIds.rows.length, 3); j++) {
          await query(`
            INSERT INTO favorites (user_id, movie_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
          `, [userIds.rows[i].id, movieIds.rows[j].id]);
        }
      }

      // Add reviews
      const reviewComments = [
        'Amazing movie! Absolutely loved it.',
        'Great cinematography and acting.',
        'One of the best movies I\'ve ever seen.',
        'Incredible storyline and character development.',
        'A masterpiece of cinema.',
        'Highly recommended for everyone.'
      ];

      for (let i = 0; i < Math.min(userIds.rows.length, 4); i++) {
        for (let j = 0; j < Math.min(movieIds.rows.length, 4); j++) {
          const rating = Math.floor(Math.random() * 4) + 7; // Random rating between 7-10
          const comment = reviewComments[Math.floor(Math.random() * reviewComments.length)];
          
          await query(`
            INSERT INTO reviews (user_id, movie_id, rating, comment)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT DO NOTHING
          `, [userIds.rows[i].id, movieIds.rows[j].id, rating, comment]);
        }
      }
    }

    console.log('✅ Database seeded successfully!');
    console.log('📊 Sample data created:');
    console.log('   - 5 sample users');
    console.log('   - 6 popular movies');
    console.log('   - Sample favorites and reviews');
    console.log('');

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  } finally {
    await closePool();
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase().catch(console.error);
}

module.exports = seedDatabase;