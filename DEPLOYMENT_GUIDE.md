# 🚀 CinemaMax - Complete Deployment Guide

## 📋 Project Structure

```
cinemamax/
├── frontend/          # React Native App
│   ├── (tabs)/       # Tab navigation screens
│   ├── auth/         # Authentication screens
│   ├── components/   # Reusable components
│   ├── contexts/     # React contexts
│   ├── lib/          # Utilities and configs
│   └── movie/        # Movie detail screens
├── backend/          # Node.js API Server
│   ├── src/
│   │   ├── config/   # Database and API configs
│   │   └── routes/   # API endpoints
│   ├── supabase/     # Database migrations
│   └── Dockerfile    # Container config
└── DEPLOYMENT_GUIDE.md
```

## 🎯 Deployment Options

### Option 1: Supabase + Railway (Recommended)
- **Frontend**: Direct Supabase connection
- **Backend**: Railway hosting (optional)
- **Database**: Supabase PostgreSQL
- **Cost**: FREE tier available

### Option 2: Supabase + Vercel
- **Frontend**: Expo + Supabase
- **Backend**: Vercel serverless
- **Database**: Supabase PostgreSQL
- **Cost**: FREE tier available

### Option 3: Full Cloud (AWS/GCP)
- **Frontend**: Expo + EAS
- **Backend**: Container hosting
- **Database**: Managed PostgreSQL
- **Cost**: $20-50/month

## 🚀 Quick Deploy (15 minutes)

### Step 1: Setup Supabase (5 minutes)

1. **Create account** at [supabase.com](https://supabase.com)
2. **Create new project**:
   - Name: `cinemamax`
   - Database password: Generate strong password
   - Region: Choose closest to users
3. **Run database migration**:
   - Go to SQL Editor
   - Copy content from `backend/supabase/migrations/001_initial_schema.sql`
   - Click "Run"
4. **Get credentials**:
   - Settings → API
   - Copy Project URL and anon key

### Step 2: Deploy Backend (5 minutes)

#### Option A: Railway (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
cd backend
railway login
railway init
railway up
```

#### Option B: Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd backend
vercel --prod
```

#### Option C: Docker (Any platform)
```bash
cd backend
docker build -t cinemamax-backend .
docker run -p 3000:3000 cinemamax-backend
```

### Step 3: Configure Frontend (5 minutes)

1. **Update environment variables**:
```bash
# frontend/.env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_API_URL=https://your-backend.railway.app/api
EXPO_PUBLIC_TMDB_API_KEY=your-tmdb-key
```

2. **Test locally**:
```bash
cd frontend
npm start
```

3. **Build for production**:
```bash
npx expo build:android
npx expo build:ios
```

## 🔧 Environment Variables

### Frontend (.env)
```env
# Supabase (Required)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Backend API (Optional - for custom endpoints)
EXPO_PUBLIC_API_URL=https://your-backend.railway.app/api

# TMDB API (Required for movie data)
EXPO_PUBLIC_TMDB_API_KEY=your-tmdb-api-key
EXPO_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
```

### Backend (.env)
```env
# Server
PORT=3000
NODE_ENV=production

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key

# TMDB API
TMDB_API_KEY=your-tmdb-api-key
TMDB_BASE_URL=https://api.themoviedb.org/3

# Security
JWT_SECRET=your-super-secret-jwt-key
ALLOWED_ORIGINS=https://your-frontend-domain.com,exp://192.168.1.100:8081
```

## 📱 Mobile App Deployment

### Android (Google Play)
```bash
# Build APK
npx expo build:android --type apk

# Build AAB (recommended)
npx expo build:android --type app-bundle

# Submit to Play Store
npx expo upload:android
```

### iOS (App Store)
```bash
# Build IPA
npx expo build:ios

# Submit to App Store
npx expo upload:ios
```

## 💰 Cost Breakdown

### Free Tier (Perfect for MVP)
- **Supabase**: 50,000 MAU, 500MB DB
- **Railway**: 500 hours/month
- **Vercel**: 100GB bandwidth
- **Expo**: Unlimited development builds
- **Total**: $0/month

### Production Scale
- **Supabase Pro**: $25/month
- **Railway Pro**: $20/month
- **EAS Build**: $29/month
- **App Store**: $99/year (iOS)
- **Play Store**: $25 one-time (Android)
- **Total**: ~$75/month + store fees

## 🔒 Security Checklist

### Database Security
- [ ] Row Level Security (RLS) enabled
- [ ] Proper user policies configured
- [ ] Service role key secured
- [ ] Database backups enabled

### API Security
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive data
- [ ] HTTPS enforced in production

### App Security
- [ ] Environment variables secured
- [ ] No hardcoded secrets
- [ ] Proper authentication flow
- [ ] Session management configured
- [ ] Deep linking secured

## 🚀 Performance Optimization

### Frontend
- [ ] Image optimization enabled
- [ ] Bundle size optimized
- [ ] Lazy loading implemented
- [ ] Caching strategies in place
- [ ] Error boundaries added

### Backend
- [ ] Database queries optimized
- [ ] Response caching implemented
- [ ] Compression enabled
- [ ] Health checks configured
- [ ] Monitoring setup

### Database
- [ ] Proper indexes created
- [ ] Query performance monitored
- [ ] Connection pooling configured
- [ ] Backup strategy implemented

## 📊 Monitoring & Analytics

### Application Monitoring
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **Expo Analytics**: Usage metrics

### Infrastructure Monitoring
- **Railway Metrics**: Server performance
- **Supabase Dashboard**: Database metrics
- **Vercel Analytics**: Function performance

## 🆘 Troubleshooting

### Common Issues

#### "Supabase not configured"
- Check environment variables are set
- Verify Supabase URL and keys are correct
- Ensure .env file is in correct location

#### "CORS errors"
- Update ALLOWED_ORIGINS in backend
- Check frontend URL is whitelisted
- Verify API endpoints are correct

#### "Database connection failed"
- Check Supabase project is active
- Verify service role key permissions
- Run database migration if needed

#### "Build failures"
- Clear node_modules and reinstall
- Check all dependencies are compatible
- Verify environment variables in build

### Getting Help
- **Supabase Discord**: Database issues
- **Railway Discord**: Deployment issues
- **Expo Discord**: Mobile app issues
- **GitHub Issues**: Code-specific problems

## 🎯 Production Checklist

### Pre-Launch
- [ ] All environment variables configured
- [ ] Database migration completed
- [ ] API endpoints tested
- [ ] Authentication flow verified
- [ ] Error handling implemented
- [ ] Performance optimized
- [ ] Security measures in place
- [ ] Monitoring configured

### Launch Day
- [ ] Final builds created
- [ ] App store submissions completed
- [ ] DNS configured (if custom domain)
- [ ] Monitoring alerts active
- [ ] Backup procedures verified
- [ ] Team access configured

### Post-Launch
- [ ] User feedback collection setup
- [ ] Analytics tracking active
- [ ] Performance monitoring ongoing
- [ ] Regular backups scheduled
- [ ] Update procedures documented
- [ ] Scaling plan prepared

## 🎬 Your App is Production-Ready!

With this setup, you have:
- ✅ **Scalable backend** that can handle thousands of users
- ✅ **Real-time database** with automatic backups
- ✅ **Secure authentication** with proper user management
- ✅ **Mobile-ready frontend** for iOS and Android
- ✅ **Production monitoring** and error tracking
- ✅ **Cost-effective hosting** starting from free tier

**Ready to launch your movie app to the world!** 🚀🎬