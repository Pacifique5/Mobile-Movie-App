# 🚀 CinemaMax - Complete Startup Guide

## 📋 Project Overview

CinemaMax is a complete movie discovery platform with:
- **📱 Mobile App**: React Native frontend for iOS/Android
- **🔧 Backend API**: Node.js/Express server with Supabase
- **👨‍💼 Admin Panel**: Next.js dashboard for management

## 🎯 How to Start Everything

### 🔧 Prerequisites
```bash
# Install Node.js 18+ and npm
node --version  # Should be 18+
npm --version   # Should be 8+

# Install global dependencies
npm install -g @expo/cli
npm install -g nodemon
```

### 📦 Install Dependencies

#### 1. Backend Dependencies
```bash
cd backend
npm install
```

#### 2. Frontend Dependencies  
```bash
cd frontend
npm install
```

#### 3. Admin Panel Dependencies
```bash
cd admin
npm install
```

## 🚀 Starting the Complete System

### Method 1: Start All Services (Recommended)

#### Terminal 1: Backend API Server
```bash
cd backend
npm start
# ✅ Backend running on http://localhost:3000
# ✅ API endpoints: http://localhost:3000/api
# ✅ Health check: http://localhost:3000/health
```

#### Terminal 2: Admin Panel
```bash
cd admin
npm run dev
# ✅ Admin panel running on http://localhost:3001
# ✅ Dashboard: http://localhost:3001/dashboard
```

#### Terminal 3: Mobile App
```bash
cd frontend
npm start
# ✅ Expo dev server starts
# ✅ Scan QR code with Expo Go app
# ✅ Or press 'w' for web version
```

### Method 2: Development Mode (Auto-restart)

#### Terminal 1: Backend (Development)
```bash
cd backend
npm run dev
# ✅ Backend with nodemon (auto-restart on changes)
```

#### Terminal 2: Admin Panel (Development)
```bash
cd admin
npm run dev
# ✅ Next.js dev server (hot reload)
```

#### Terminal 3: Mobile App
```bash
cd frontend
npm start
# ✅ Expo development server
```

## 🔍 Verify Everything is Working

### 1. Test Backend API
```bash
# Health check
curl http://localhost:3000/health

# API info
curl http://localhost:3000/api

# Expected response:
# {
#   "status": "OK",
#   "message": "CinemaMax Backend is running!"
# }
```

### 2. Test Admin Panel
- Open http://localhost:3001
- Should see admin dashboard
- Navigate through Users, Movies, Analytics

### 3. Test Mobile App
- Scan QR code with Expo Go
- Or press 'w' for web version
- Should see movie browsing interface

## 🎬 Using the Complete System

### 📱 Mobile App Features
- **Browse Movies**: Trending, popular, top-rated
- **Search**: Find movies by title
- **Movie Details**: Full information, trailers, cast
- **User Auth**: Sign up, login, guest mode
- **Favorites**: Save favorite movies
- **Profile**: Edit profile, dark mode, settings

### 👨‍💼 Admin Panel Features
- **Dashboard**: System overview and statistics
- **User Management**: View, edit, delete users
- **Movie Management**: Add, edit, remove movies
- **Analytics**: User growth, popular content
- **Settings**: System configuration

### 🔧 Backend API Features
- **Authentication**: JWT-based user auth
- **Movie Data**: TMDB integration
- **User Management**: Profiles, favorites, reviews
- **Admin Endpoints**: Management APIs
- **Real-time**: Supabase integration

## 🗄️ Database Setup (Optional)

### Using Demo Mode (Default)
- No setup required
- Uses local storage for data
- Perfect for development and testing

### Using Real Supabase (Production)
1. **Create Supabase project** at supabase.com
2. **Run database migration**:
   ```sql
   -- Copy content from backend/supabase/migrations/001_initial_schema.sql
   -- Run in Supabase SQL Editor
   ```
3. **Update environment variables**:
   ```bash
   # frontend/.env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   
   # backend/.env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   
   # admin/.env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

## 🔒 Admin Panel Access

### Default Demo Access
- No authentication required in demo mode
- All admin features available

### Production Security
1. **Set admin key** in backend/.env:
   ```env
   ADMIN_KEY=your-secure-admin-key
   ```
2. **Include header** in admin requests:
   ```
   X-Admin-Key: your-secure-admin-key
   ```

## 🎯 Quick Testing Checklist

### ✅ Backend Tests
- [ ] Health endpoint responds
- [ ] API info endpoint works
- [ ] CORS headers present
- [ ] Admin endpoints accessible

### ✅ Frontend Tests  
- [ ] App loads without errors
- [ ] Movie browsing works
- [ ] Search functionality
- [ ] Authentication flow
- [ ] Guest mode works

### ✅ Admin Panel Tests
- [ ] Dashboard loads
- [ ] User management works
- [ ] Movie management works
- [ ] Analytics display
- [ ] Settings accessible

## 🚨 Troubleshooting

### Backend Issues
```bash
# Check if backend is running
curl http://localhost:3000/health

# Check logs
cd backend && npm start

# Common fixes:
npm install          # Install dependencies
rm -rf node_modules  # Clear cache
npm install          # Reinstall
```

### Frontend Issues
```bash
# Clear Expo cache
cd frontend
npx expo start --clear

# Reset Metro cache
npx expo start --reset-cache

# Common fixes:
npm install                    # Install dependencies
rm -rf node_modules .expo     # Clear cache
npm install                   # Reinstall
```

### Admin Panel Issues
```bash
# Check Next.js build
cd admin
npm run build

# Clear Next.js cache
rm -rf .next

# Common fixes:
npm install          # Install dependencies
rm -rf node_modules  # Clear cache
npm install          # Reinstall
```

### Port Conflicts
```bash
# Check what's using ports
netstat -an | grep :3000  # Backend
netstat -an | grep :3001  # Admin
netstat -an | grep :8081  # Frontend

# Kill processes if needed
pkill -f "node.*3000"
pkill -f "node.*3001"
```

## 📊 System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   Admin Panel   │    │   Backend API   │
│  (Frontend)     │    │   (Next.js)     │    │  (Node.js)      │
│  Port: 8081     │    │  Port: 3001     │    │  Port: 3000     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Supabase DB   │
                    │  (PostgreSQL)   │
                    └─────────────────┘
```

## 🎉 Success! Your Movie App is Running

When everything is working, you should have:

### 🔧 Backend API (Port 3000)
- ✅ Health check: http://localhost:3000/health
- ✅ API endpoints: http://localhost:3000/api/*
- ✅ Admin endpoints: http://localhost:3000/api/admin/*

### 📱 Mobile App (Port 8081)
- ✅ Expo development server
- ✅ QR code for mobile testing
- ✅ Web version available

### 👨‍💼 Admin Panel (Port 3001)
- ✅ Dashboard: http://localhost:3001/dashboard
- ✅ User management: http://localhost:3001/users
- ✅ Movie management: http://localhost:3001/movies

## 🚀 Next Steps

1. **Test all features** using the mobile app
2. **Add some movies** using the admin panel
3. **Create user accounts** and test authentication
4. **Explore analytics** in the admin dashboard
5. **Configure production** environment when ready

**Your complete movie discovery platform is now running!** 🎬🍿

Need help? Check the individual README files in each folder for detailed documentation.