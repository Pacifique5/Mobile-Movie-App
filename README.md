# 🎬 CinemaMax - Movie Discovery App

A modern React Native movie discovery app with real-time database integration, user authentication, and personalized features.

## ✨ Features

### 🎯 Core Features
- **Movie Discovery**: Browse trending, popular, and top-rated movies
- **Search & Filter**: Find movies by title, genre, or year
- **Movie Details**: Comprehensive movie information with trailers and cast
- **User Authentication**: Secure signup/login with Supabase
- **Guest Mode**: Browse movies without creating an account
- **Favorites System**: Save and manage your favorite movies
- **Dark Mode**: Toggle between light and dark themes
- **Profile Management**: Edit profile, view watch history

### 🚀 Technical Features
- **Real-time Database**: Supabase PostgreSQL integration
- **Optimized Images**: Smart image loading and caching
- **Responsive Design**: Works on all screen sizes
- **Production Ready**: Docker support, CI/CD ready
- **Secure**: Row-level security, input validation
- **Scalable**: Microservices architecture

## 🏗️ Architecture

```
CinemaMax/
├── frontend/          # React Native App (Expo)
│   ├── (tabs)/       # Tab navigation screens
│   ├── auth/         # Authentication screens
│   ├── components/   # Reusable components
│   ├── contexts/     # React contexts
│   └── movie/        # Movie detail screens
├── backend/          # Node.js API Server
│   ├── src/routes/   # API endpoints
│   ├── src/config/   # Database configs
│   └── supabase/     # Database migrations
└── DEPLOYMENT_GUIDE.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Expo CLI (`npm install -g @expo/cli`)
- Supabase account (free tier available)

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd cinemamax

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

### 2. Setup Database
1. Create a [Supabase](https://supabase.com) project
2. Run the migration in `backend/supabase/migrations/001_initial_schema.sql`
3. Get your project URL and anon key from Settings → API

### 3. Configure Environment
```bash
# frontend/.env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_TMDB_API_KEY=your-tmdb-key

# backend/.env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
TMDB_API_KEY=your-tmdb-key
```

### 4. Start Development
```bash
# Terminal 1: Start backend
cd backend && npm run dev

# Terminal 2: Start frontend
cd frontend && npm start
```

## 📱 Demo Mode

The app includes a demo mode for development and testing:
- Works without Supabase configuration
- Uses local storage for favorites
- Demo user: `demo@cinemamax.com` / `password`
- Perfect for development and showcasing

## 🚀 Deployment

### Quick Deploy (15 minutes)
1. **Database**: Deploy to Supabase (free tier)
2. **Backend**: Deploy to Railway or Vercel (free tier)
3. **Frontend**: Build with Expo and deploy to app stores

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

### Deployment Options
- **Free Tier**: Supabase + Railway/Vercel (perfect for MVP)
- **Production**: Supabase Pro + Railway Pro (~$50/month)
- **Enterprise**: Custom cloud deployment

## 🛠️ Development

### Available Scripts

#### Frontend
```bash
npm start          # Start Expo development server
npm run android    # Run on Android device/emulator
npm run ios        # Run on iOS device/simulator
npm run web        # Run in web browser
```

#### Backend
```bash
npm run dev        # Start with nodemon (development)
npm start          # Start production server
npm run deploy     # Deploy to Railway/Vercel
```

### Project Structure
```
frontend/
├── (tabs)/           # Main app screens
│   ├── index.tsx     # Home/Browse movies
│   ├── search.tsx    # Search functionality
│   └── profile.tsx   # User profile
├── auth/             # Authentication
│   ├── login.tsx     # Login screen
│   └── signup.tsx    # Registration screen
├── components/       # Reusable components
├── contexts/         # React contexts
└── movie/[id].tsx    # Movie detail screen

backend/
├── src/
│   ├── routes/       # API endpoints
│   │   ├── auth.js   # Authentication
│   │   ├── movies.js # Movie operations
│   │   └── users.js  # User management
│   └── config/       # Database configs
└── supabase/         # Database schema
```

## 🔒 Security

- **Authentication**: Supabase Auth with JWT tokens
- **Database**: Row Level Security (RLS) enabled
- **API**: Input validation and rate limiting
- **Environment**: Secure environment variable handling
- **HTTPS**: Enforced in production

## 📊 Performance

- **Image Optimization**: Smart loading and caching
- **Bundle Size**: Optimized with tree shaking
- **Database**: Indexed queries and connection pooling
- **Caching**: API response caching
- **Loading States**: Smooth user experience

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Issues**: Create a GitHub issue
- **Discussions**: Use GitHub Discussions for questions

## 🎯 Roadmap

- [ ] **Social Features**: User reviews and ratings
- [ ] **Watchlist**: Save movies to watch later
- [ ] **Notifications**: New movie alerts
- [ ] **Offline Mode**: Download for offline viewing
- [ ] **TV Shows**: Expand beyond movies
- [ ] **Recommendations**: AI-powered suggestions

---

**Ready to discover your next favorite movie?** 🍿

Built with ❤️ using React Native, Expo, Supabase, and Node.js