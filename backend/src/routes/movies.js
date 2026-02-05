const express = require('express');
const { tmdbAPI } = require('../config/tmdb');
const { query } = require('../config/database');
const router = express.Router();

// Get all movies from database
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const result = await query(`
      SELECT m.*, 
             COUNT(f.id) as favorite_count,
             AVG(r.rating) as average_rating,
             COUNT(r.id) as review_count
      FROM movies m
      LEFT JOIN favorites f ON m.id = f.movie_id
      LEFT JOIN reviews r ON m.id = r.movie_id
      WHERE m.status = 'published'
      GROUP BY m.id
      ORDER BY m.created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    const countResult = await query(
      'SELECT COUNT(*) FROM movies WHERE status = $1',
      ['published']
    );

    res.json({
      movies: result.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    });
  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

// Get popular movies (from TMDB or database)
router.get('/popular', async (req, res) => {
  try {
    const page = req.query.page || 1;
    
    // Try to get from TMDB first
    try {
      const data = await tmdbAPI.getPopularMovies(page);
      res.json(data);
    } catch (tmdbError) {
      // Fallback to database movies
      console.log('TMDB unavailable, using database movies');
      const result = await query(`
        SELECT m.*, 
               COUNT(f.id) as favorite_count,
               AVG(r.rating) as average_rating
        FROM movies m
        LEFT JOIN favorites f ON m.id = f.movie_id
        LEFT JOIN reviews r ON m.id = r.movie_id
        WHERE m.status = 'published'
        GROUP BY m.id
        ORDER BY favorite_count DESC, m.vote_average DESC
        LIMIT 20
      `);

      res.json({
        results: result.rows,
        page: 1,
        total_pages: 1,
        total_results: result.rows.length
      });
    }
  } catch (error) {
    console.error('Popular movies error:', error);
    res.status(500).json({ error: 'Failed to fetch popular movies' });
  }
});

// Get trending movies (from TMDB or database)
router.get('/trending', async (req, res) => {
  try {
    const timeWindow = req.query.time_window || 'week';
    
    // Try to get from TMDB first
    try {
      const data = await tmdbAPI.getTrendingMovies(timeWindow);
      res.json(data);
    } catch (tmdbError) {
      // Fallback to database movies
      console.log('TMDB unavailable, using database movies');
      const result = await query(`
        SELECT m.*, 
               COUNT(f.id) as favorite_count,
               AVG(r.rating) as average_rating
        FROM movies m
        LEFT JOIN favorites f ON m.id = f.movie_id
        LEFT JOIN reviews r ON m.id = r.movie_id
        WHERE m.status = 'published'
        GROUP BY m.id
        ORDER BY m.created_at DESC, favorite_count DESC
        LIMIT 20
      `);

      res.json({
        results: result.rows,
        page: 1,
        total_pages: 1,
        total_results: result.rows.length
      });
    }
  } catch (error) {
    console.error('Trending movies error:', error);
    res.status(500).json({ error: 'Failed to fetch trending movies' });
  }
});

// Get movie details
router.get('/:id', async (req, res) => {
  try {
    const movieId = req.params.id;
    
    // First try to get from database
    const dbResult = await query(`
      SELECT m.*, 
             COUNT(f.id) as favorite_count,
             AVG(r.rating) as average_rating,
             COUNT(r.id) as review_count
      FROM movies m
      LEFT JOIN favorites f ON m.id = f.movie_id
      LEFT JOIN reviews r ON m.id = r.movie_id
      WHERE m.id = $1
      GROUP BY m.id
    `, [movieId]);

    if (dbResult.rows.length > 0) {
      // Get reviews for this movie
      const reviewsResult = await query(`
        SELECT r.*, u.username, u.first_name, u.last_name
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.movie_id = $1
        ORDER BY r.created_at DESC
        LIMIT 10
      `, [movieId]);

      const movie = dbResult.rows[0];
      movie.reviews = reviewsResult.rows;
      
      res.json(movie);
    } else {
      // Try to get from TMDB
      try {
        const data = await tmdbAPI.getMovieDetails(movieId);
        res.json(data);
      } catch (tmdbError) {
        res.status(404).json({ error: 'Movie not found' });
      }
    }
  } catch (error) {
    console.error('Movie details error:', error);
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
});

// Search movies
router.get('/search/:query', async (req, res) => {
  try {
    const searchQuery = req.params.query;
    const page = req.query.page || 1;
    
    // Search in database first
    const dbResult = await query(`
      SELECT m.*, 
             COUNT(f.id) as favorite_count,
             AVG(r.rating) as average_rating
      FROM movies m
      LEFT JOIN favorites f ON m.id = f.movie_id
      LEFT JOIN reviews r ON m.id = r.movie_id
      WHERE m.status = 'published' 
        AND (m.title ILIKE $1 OR m.overview ILIKE $1 OR m.genres ILIKE $1)
      GROUP BY m.id
      ORDER BY m.title
    `, [`%${searchQuery}%`]);

    if (dbResult.rows.length > 0) {
      res.json({
        results: dbResult.rows,
        page: 1,
        total_pages: 1,
        total_results: dbResult.rows.length
      });
    } else {
      // Try TMDB search
      try {
        const data = await tmdbAPI.searchMovies(searchQuery, page);
        res.json(data);
      } catch (tmdbError) {
        res.json({
          results: [],
          page: 1,
          total_pages: 0,
          total_results: 0
        });
      }
    }
  } catch (error) {
    console.error('Search movies error:', error);
    res.status(500).json({ error: 'Failed to search movies' });
  }
});

// Get genres
router.get('/genres/list', async (req, res) => {
  try {
    // Try to get from TMDB first
    try {
      const data = await tmdbAPI.getGenres();
      res.json(data);
    } catch (tmdbError) {
      // Fallback to hardcoded genres
      res.json({
        genres: [
          { id: 28, name: "Action" },
          { id: 12, name: "Adventure" },
          { id: 16, name: "Animation" },
          { id: 35, name: "Comedy" },
          { id: 80, name: "Crime" },
          { id: 99, name: "Documentary" },
          { id: 18, name: "Drama" },
          { id: 10751, name: "Family" },
          { id: 14, name: "Fantasy" },
          { id: 36, name: "History" },
          { id: 27, name: "Horror" },
          { id: 10402, name: "Music" },
          { id: 9648, name: "Mystery" },
          { id: 10749, name: "Romance" },
          { id: 878, name: "Science Fiction" },
          { id: 10770, name: "TV Movie" },
          { id: 53, name: "Thriller" },
          { id: 10752, name: "War" },
          { id: 37, name: "Western" }
        ]
      });
    }
  } catch (error) {
    console.error('Genres error:', error);
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
});

// Get movies by genre
router.get('/genre/:genreId', async (req, res) => {
  try {
    const genreId = req.params.genreId;
    const page = req.query.page || 1;
    
    // Try to get from TMDB first
    try {
      const data = await tmdbAPI.getMoviesByGenre(genreId, page);
      res.json(data);
    } catch (tmdbError) {
      // Fallback to database search by genre name
      const genreNames = {
        28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
        80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
        14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
        9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
        10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
      };
      
      const genreName = genreNames[genreId];
      if (genreName) {
        const result = await query(`
          SELECT m.*, 
                 COUNT(f.id) as favorite_count,
                 AVG(r.rating) as average_rating
          FROM movies m
          LEFT JOIN favorites f ON m.id = f.movie_id
          LEFT JOIN reviews r ON m.id = r.movie_id
          WHERE m.status = 'published' AND m.genres ILIKE $1
          GROUP BY m.id
          ORDER BY m.vote_average DESC
          LIMIT 20
        `, [`%${genreName}%`]);

        res.json({
          results: result.rows,
          page: 1,
          total_pages: 1,
          total_results: result.rows.length
        });
      } else {
        res.json({
          results: [],
          page: 1,
          total_pages: 0,
          total_results: 0
        });
      }
    }
  } catch (error) {
    console.error('Movies by genre error:', error);
    res.status(500).json({ error: 'Failed to fetch movies by genre' });
  }
});

module.exports = router;