# 🎬 CinemaMax - Complete Movie Discovery Platform

A modern, full-stack movie discovery platform with mobile app, backend API, and admin dashboard.

## ✨ What's Included

### 📱 Mobile App (React Native + Expo)
- **Movie Discovery**: Browse trending, popular, and top-rated movies
- **Advanced Search**: Find movies by title, genre, or year
- **User Authentication**: Secure signup/login with guest mode
- **Personal Features**: Favorites, profile management, dark mode
- **Optimized Performance**: Smart image loading, caching, smooth UX

### 🔧 Backend API (Node.js + Express + Supabase)
- **RESTful API**: Complete movie and user management
- **Real-time Database**: Supabase PostgreSQL integration
- **Authentication**: JWT-based secure user auth
- **TMDB Integration**: Live movie data from The Movie Database
- **Admin Endpoints**: Management APIs for admin panel

### 👨‍💼 Admin Panel (Next.js + Tailwind CSS)
- **Dashboard**: System overview with real-time analytics
- **User Management**: View, edit, and manage all users
- **Movie Management**: Add, edit, and remove movies from TMDB
- **Analytics**: User growth, popular content, engagement metrics
- **System Settings**: Configure app behavior and security

## 🚀 Quick Start (3 Terminals)

### Terminal 1: Backend API
```bash
cd backend
npm install
npm start
# ✅ API running on http://localhost:3000
```

### Terminal 2: Admin Panel
```bash
cd admin
npm install
npm run dev
# ✅ Admin panel on http://localhost:3001
```

### Terminal 3: Mobile App
```bash
cd frontend
npm install
npm start
# ✅ Scan QR code or press 'w' for web
```

## 🎯 Live Demo URLs

- **Backend API**: http://localhost:3000/health
- **Admin Dashboard**: http://localhost:3001/dashboard
- **Mobile App**: Expo QR code or web version

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   Admin Panel   │    │   Backend API   │
│  React Native   │◄──►│    Next.js      │◄──►│   Node.js       │
│   Port: 8081    │    │   Port: 3001    │    │   Port: 3000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Supabase DB   │
                    │  PostgreSQL +   │
                    │  Real-time API  │
                    └─────────────────┘
```

## 🎬 Features Overview

### 📱 Mobile App Features
- **Browse Movies**: Trending, popular, top-rated sections
- **Movie Details**: Full info, cast, trailers, ratings
- **Search & Filter**: Advanced movie discovery
- **User Accounts**: Registration, login, profile management
- **Guest Mode**: Browse without account creation
- **Favorites System**: Save and manage favorite movies
- **Dark Mode**: Toggle between light/dark themes
- **Responsive Design**: Works on all screen sizes

### 👨‍💼 Admin Panel Features
- **Real-time Dashboard**: System stats and user activity
- **User Management**: Complete user administration
- **Movie Database**: Add movies from TMDB, manage content
- **Analytics Dashboard**: Growth metrics, popular content
- **System Settings**: App configuration and security
- **Activity Monitoring**: Track user actions and system events

### 🔧 Backend Features
- **RESTful API**: Complete CRUD operations
- **Authentication**: Secure JWT-based auth system
- **Database Integration**: Supabase real-time database
- **TMDB Integration**: Live movie data and images
- **Admin APIs**: Management endpoints for admin panel
- **Security**: CORS, rate limiting, input validation

## 🗄️ Database Schema

### Core Tables
- **profiles**: User accounts and preferences
- **movie_cache**: Cached movie data from TMDB
- **user_favorites**: User's favorite movies
- **user_reviews**: Movie ratings and reviews
- **user_watchlist**: Movies to watch later
- **watch_history**: Viewing history tracking

## 🔒 Security Features

- **Row Level Security (RLS)**: Database-level access control
- **JWT Authentication**: Secure token-based auth
- **Admin Access Control**: Separate admin authentication
- **Input Validation**: Sanitized API inputs
- **CORS Configuration**: Secure cross-origin requests
- **Environment Variables**: Secure credential management

## 📊 Performance Optimizations

- **Image Optimization**: Smart loading and caching
- **Database Indexing**: Optimized query performance
- **API Caching**: Response caching for better speed
- **Bundle Optimization**: Minimized app size
- **Lazy Loading**: On-demand content loading

## 🚀 Deployment Options

### Free Tier (Perfect for MVP)
- **Database**: Supabase (50K MAU, 500MB)
- **Backend**: Railway (500 hours/month)
- **Admin Panel**: Vercel (100GB bandwidth)
- **Mobile App**: Expo (unlimited dev builds)
- **Total Cost**: $0/month

### Production Scale
- **Database**: Supabase Pro ($25/month)
- **Backend**: Railway Pro ($20/month)
- **Admin Panel**: Vercel Pro ($20/month)
- **Mobile App**: EAS Build ($29/month)
- **Total Cost**: ~$95/month

## 📱 Mobile App Deployment

### Android
```bash
cd frontend
npx expo build:android
npx expo upload:android
```

### iOS
```bash
cd frontend
npx expo build:ios
npx expo upload:ios
```

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI
- Git

### Environment Setup
1. Clone repository
2. Install dependencies in all folders
3. Configure environment variables
4. Start all services

### Project Structure
```
cinemamax/
├── frontend/          # React Native mobile app
├── backend/           # Node.js API server
├── admin/             # Next.js admin panel
├── START_GUIDE.md     # Complete startup guide
├── DEPLOYMENT_GUIDE.md # Production deployment
└── README.md          # This file
```

## 📚 Documentation

- **[START_GUIDE.md](START_GUIDE.md)**: Complete startup instructions
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**: Production deployment
- **[PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md)**: Pre-launch checklist
- **[frontend/README.md](frontend/README.md)**: Mobile app documentation
- **[backend/README.md](backend/README.md)**: API documentation
- **[admin/README.md](admin/README.md)**: Admin panel documentation

## 🎯 Use Cases

### For Developers
- **Learning Project**: Full-stack development with modern technologies
- **Portfolio Piece**: Showcase React Native, Node.js, and database skills
- **Startup MVP**: Ready-to-deploy movie discovery platform

### For Businesses
- **Movie Platform**: Launch your own movie discovery service
- **Content Management**: Manage movie databases and user engagement
- **Analytics Platform**: Track user behavior and content popularity

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check individual README files
- **Issues**: Create GitHub issue
- **Discussions**: Use GitHub Discussions

## 🎉 Ready to Launch!

Your complete movie discovery platform includes:
- ✅ **Mobile app** for iOS and Android
- ✅ **Backend API** with real-time database
- ✅ **Admin panel** for complete management
- ✅ **Production-ready** deployment configs
- ✅ **Comprehensive documentation**

**Start building the next great movie platform!** 🎬🚀

---

Built with ❤️ using React Native, Node.js, Supabase, and Next.js