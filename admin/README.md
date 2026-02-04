# 🎬 CinemaMax Admin Panel

A comprehensive admin dashboard for managing your CinemaMax movie app.

## ✨ Features

### 📊 Dashboard & Analytics
- **System Overview**: Real-time statistics and metrics
- **User Growth**: Track user registration and engagement
- **Movie Analytics**: Popular movies, genres, and ratings
- **Activity Feed**: Recent user actions and system events

### 👥 User Management
- **User Directory**: View and search all users
- **User Profiles**: Edit user information and settings
- **User Activity**: Track user behavior and preferences
- **Bulk Actions**: Manage multiple users efficiently

### 🎬 Movie Management
- **Movie Database**: View all movies in your system
- **Add Movies**: Search and add movies from TMDB
- **Edit Movies**: Update movie information and metadata
- **Movie Analytics**: Track favorites, reviews, and popularity

### ⚙️ System Administration
- **Settings**: Configure app behavior and limits
- **Security**: Manage access controls and permissions
- **Monitoring**: System health and performance metrics
- **Maintenance**: Database management and backups

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- CinemaMax backend running
- Supabase database configured

### Installation
```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Configure your environment variables
# Edit .env with your actual values

# Start development server
npm run dev
```

The admin panel will be available at `http://localhost:3001`

## 🔧 Configuration

### Environment Variables
```env
# Supabase (same as main app)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Admin Security
ADMIN_KEY=your-secure-admin-key
NEXTAUTH_SECRET=your-nextauth-secret
```

### Admin Access
The admin panel uses a simple API key authentication. In production:
1. Set a strong `ADMIN_KEY` in your environment
2. Include `X-Admin-Key` header in API requests
3. Consider implementing proper admin user authentication

## 📱 Usage

### Starting Both Frontend and Backend

#### Terminal 1: Backend API
```bash
cd backend
npm install
npm start
# Backend runs on http://localhost:3000
```

#### Terminal 2: Admin Panel
```bash
cd admin
npm install
npm run dev
# Admin panel runs on http://localhost:3001
```

#### Terminal 3: Mobile App (Optional)
```bash
cd frontend
npm install
npm start
# Mobile app for testing
```

### Admin Panel Features

#### Dashboard
- View system statistics and metrics
- Monitor user growth and engagement
- Track popular movies and genres
- See recent user activity

#### User Management
- Search and filter users
- Edit user profiles and settings
- View user favorites and reviews
- Manage user permissions

#### Movie Management
- Browse movie database
- Add new movies from TMDB
- Edit movie information
- View movie analytics

#### Settings
- Configure app behavior
- Set user limits and restrictions
- Manage security settings
- System maintenance tools

## 🔒 Security

### Admin Authentication
- API key-based authentication
- Service role access to Supabase
- Secure environment variable handling
- HTTPS enforced in production

### Data Protection
- Row-level security in database
- Input validation and sanitization
- Rate limiting on admin endpoints
- Audit logging for admin actions

## 🚀 Deployment

### Production Setup
1. **Build the admin panel**:
   ```bash
   npm run build
   npm start
   ```

2. **Configure environment**:
   - Set production Supabase credentials
   - Use strong admin keys
   - Enable HTTPS

3. **Deploy options**:
   - **Vercel**: `vercel --prod`
   - **Netlify**: Connect GitHub repo
   - **Docker**: Use provided Dockerfile
   - **VPS**: PM2 or systemd service

### Security Checklist
- [ ] Strong admin authentication keys
- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] Admin access logged
- [ ] Regular security updates

## 📊 API Endpoints

### Admin API Routes
```
GET    /api/admin/stats          # System statistics
GET    /api/admin/users          # User list with pagination
PUT    /api/admin/users/:id      # Update user
DELETE /api/admin/users/:id      # Delete user
GET    /api/admin/movies/stats   # Movie statistics
POST   /api/admin/movies         # Add movie
PUT    /api/admin/movies/:id     # Update movie
DELETE /api/admin/movies/:id     # Delete movie
GET    /api/admin/activity       # Recent activity
GET    /api/admin/health         # System health
```

### Authentication
All admin endpoints require the `X-Admin-Key` header:
```bash
curl -H "X-Admin-Key: your-admin-key" \
     http://localhost:3000/api/admin/stats
```

## 🛠️ Development

### Project Structure
```
admin/
├── components/          # Reusable UI components
├── lib/                # Utilities and API clients
├── pages/              # Next.js pages
│   ├── dashboard.tsx   # Main dashboard
│   ├── users.tsx       # User management
│   ├── movies.tsx      # Movie management
│   ├── analytics.tsx   # Analytics dashboard
│   └── settings.tsx    # System settings
├── styles/             # CSS and styling
└── public/             # Static assets
```

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
npm run export   # Export static files
```

### Adding New Features
1. Create new page in `pages/`
2. Add navigation link in `components/Layout.tsx`
3. Implement API endpoints in backend
4. Add proper authentication checks
5. Update documentation

## 🎯 Roadmap

- [ ] **Advanced Analytics**: More detailed charts and metrics
- [ ] **User Roles**: Different admin permission levels
- [ ] **Bulk Operations**: Mass user/movie management
- [ ] **Export Features**: Data export and reporting
- [ ] **Real-time Updates**: WebSocket integration
- [ ] **Mobile Admin**: Responsive mobile interface

## 🆘 Troubleshooting

### Common Issues

#### "Admin access required"
- Check `X-Admin-Key` header is set
- Verify `ADMIN_KEY` in backend environment
- Ensure admin routes are properly configured

#### "Database connection failed"
- Verify Supabase credentials
- Check service role key permissions
- Ensure database is accessible

#### "CORS errors"
- Update CORS settings in backend
- Check admin panel URL is whitelisted
- Verify API endpoint URLs

### Getting Help
- Check backend logs for errors
- Verify environment variables
- Test API endpoints directly
- Review Supabase dashboard

## 📄 License

This admin panel is part of the CinemaMax project and follows the same MIT license.

---

**Ready to manage your movie app like a pro!** 🎬👨‍💼