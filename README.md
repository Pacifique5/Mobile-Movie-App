# CinemaMax - Complete Movie Streaming Platform

A full-stack movie streaming platform with web, mobile, and admin interfaces.

## 🎬 Project Structure

```
react-native-movie-app/
├── backend/              # Node.js/Express API with PostgreSQL
├── frontend/             # React Native mobile app (user)
├── admin/                # Next.js web admin panel
├── admin-mobile/         # React Native admin mobile app
└── web-frontend/         # Next.js web frontend (NEW!)
```

## 🚀 Features

### User Features
- Browse thousands of movies
- Search movies by title
- View detailed movie information
- Add movies to favorites
- User authentication (signup/login)
- Guest mode browsing
- Responsive web and mobile interfaces

### Admin Features
- Dashboard with analytics
- User management (CRUD operations)
- Movie management (add/edit/delete)
- Advanced analytics and charts
- Role-based access control (Super Admin/Moderator)
- Real-time statistics

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- PostgreSQL database
- JWT authentication
- CORS enabled
- RESTful API

### Web Frontend (NEW!)
- Next.js 14
- TypeScript
- Tailwind CSS
- React Hot Toast
- Heroicons

### Mobile Frontend
- React Native (Expo SDK 54)
- TypeScript
- Expo Router
- Native navigation

### Admin Web
- Next.js 14
- TypeScript
- Tailwind CSS
- Chart components
- Beautiful purple gradient UI

### Admin Mobile
- React Native (Expo SDK 54)
- Drawer navigation
- Touch-optimized interface

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (running on localhost:5432)
- npm or yarn

### 1. Backend Setup

```bash
cd backend
npm install

# Setup database
node src/scripts/setup-database.js

# Start backend server
npm start
# Runs on http://localhost:3000
```

### 2. Web Frontend Setup (NEW!)

```bash
cd web-frontend
npm install

# Start web frontend
npm run dev
# Runs on http://localhost:3002
```

### 3. Admin Web Setup

```bash
cd admin
npm install

# Start admin panel
npm run dev
# Runs on http://localhost:3001
```

### 4. Mobile Frontend Setup

```bash
cd frontend
npm install

# Start Expo
npx expo start
```

### 5. Admin Mobile Setup

```bash
cd admin-mobile
npm install

# Start Expo
npx expo start
```

## 🔐 Default Credentials

### Admin Panel
- **Super Admin**: admin / admin123
- **Moderator**: moderator / mod123

### User Account
Create a new account via signup or use guest mode

## 🌐 Access URLs

- **Backend API**: http://localhost:3000
- **Web Frontend**: http://localhost:3002
- **Admin Web**: http://localhost:3001
- **Mobile Apps**: Expo Go app (scan QR code)

## 📱 Features by Platform

### Web Frontend (http://localhost:3002)
✅ Beautiful landing page with hero section
✅ User authentication (login/signup)
✅ Guest mode browsing
✅ Movie browsing with grid layout
✅ Featured movie hero section
✅ Movie detail pages
✅ Search functionality
✅ Favorites management
✅ User profile page
✅ Responsive design
✅ Dark theme
✅ Toast notifications

### Admin Web (http://localhost:3001)
✅ Dashboard with real-time stats
✅ User management table
✅ Movie CRUD operations
✅ Analytics with charts
✅ Settings panel
✅ Profile dropdown
✅ CinemaMax branding
✅ Purple gradient sidebar

### Mobile Apps
✅ Native navigation
✅ Touch-optimized UI
✅ Offline support
✅ Push notifications ready
✅ Drawer menu (admin)
✅ Tab navigation (user)

## 🗄️ Database Schema

### Users Table
- id, username, email, password_hash
- first_name, last_name, role
- created_at, updated_at

### Movies Table
- id, title, overview, poster_path
- backdrop_path, release_date, vote_average
- genres, runtime, director, movie_cast

### Favorites Table
- id, user_id, movie_id, created_at

### Admin Users Table
- id, username, password_hash
- first_name, last_name, email, role
- created_at, updated_at

## 🔧 Configuration

### Backend (.env)
```
PORT=3000
DATABASE_URL=postgresql://postgres@localhost:5432/cinemamax
JWT_SECRET=your-secret-key
NETWORK_IP=10.12.74.198
```

### Web Frontend (.env)
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p
```

### Admin (.env)
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 🎨 Design Features

### Web Frontend
- Modern gradient backgrounds
- Smooth transitions and animations
- Hover effects on movie cards
- Responsive grid layouts
- Hero sections with backdrop images
- Clean navigation bar
- Profile dropdown menu

### Admin Panel
- Purple gradient sidebar
- White header with search
- Colored stat cards
- Interactive charts
- Modern card layouts
- Dropdown menus

## 📊 API Endpoints

### Authentication
- POST `/api/auth/signup` - Create account
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user

### Movies
- GET `/api/movies` - List all movies
- GET `/api/movies/:id` - Get movie details
- GET `/api/movies/search?query=` - Search movies

### Favorites
- GET `/api/favorites` - Get user favorites
- POST `/api/favorites` - Add to favorites
- DELETE `/api/favorites/:movieId` - Remove favorite

### Admin
- GET `/api/admin/stats` - Dashboard statistics
- GET `/api/admin/users` - List users
- PUT `/api/admin/users/:id` - Update user
- DELETE `/api/admin/users/:id` - Delete user
- GET `/api/admin/movies/stats` - Movies with stats
- POST `/api/admin/movies` - Add movie
- PUT `/api/admin/movies/:id` - Update movie
- DELETE `/api/admin/movies/:id` - Delete movie

## ✅ Error-Free Codebase

All components have been tested and verified:
- ✅ No TypeScript errors
- ✅ No linting errors
- ✅ No runtime errors
- ✅ All imports resolved
- ✅ Proper type definitions
- ✅ Clean diagnostics

## 🚀 Deployment

### Backend
- Deploy to Railway, Heroku, or any Node.js host
- Configure PostgreSQL database
- Set environment variables

### Web Frontend & Admin
- Deploy to Vercel, Netlify, or any Next.js host
- Configure environment variables
- Build command: `npm run build`
- Start command: `npm start`

### Mobile Apps
- Build with EAS Build
- Submit to App Store / Play Store
- Configure app.json for production

## 📝 License

© 2026 CinemaMax. All rights reserved.

## 🤝 Contributing

This is a complete, production-ready movie streaming platform with all features implemented and tested.

---

**Built with ❤️ using Next.js, React Native, Node.js, and PostgreSQL**
