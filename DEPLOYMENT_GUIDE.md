# 🚀 Sikabuview Hotel Management System - Vercel Deployment Guide

## 📋 Prerequisites
- ✅ Project sudah berhasil build lokal
- ✅ Akun Vercel (daftar gratis di [vercel.com](https://vercel.com))
- ✅ Akun GitHub/GitLab/Bitbucket
- ✅ Database production (Supabase recommended)

## 🛠️ Step 1: Prepare Project for Deployment

### 1.1 Build Verification
```bash
# Build project (sudah berhasil ✓)
npm run build

# Run linting
npm run lint
```

### 1.2 Push to Repository
```bash
# Cek status git
git status

# Jika ada changes, commit dulu
git add .
git commit -m "Ready for Vercel deployment - Indonesian localization complete"

# Push ke GitHub
git push origin main
```

## 🌐 Step 2: Deploy to Vercel

### Option A: Via Web Dashboard (Recommended)
1. **Buka [vercel.com](https://vercel.com)**
2. **Login dengan GitHub**
3. **Klik "New Project"**
4. **Pilih repository Sikabuview**
5. **Configuration Settings:**
   - Framework Preset: Next.js
   - Root Directory: .
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
6. **Klik "Deploy"**

### Option B: Via CLI
```bash
# Install Vercel CLI (jika belum)
npm i -g vercel

# Login ke Vercel
vercel login

# Deploy dari root directory
vercel

# Follow prompts:
# ? Link to existing project? No
# ? Project name? sikabuview-hotel-management
# ? Directory? .
# ? Override settings? No

# Deploy ke production
vercel --prod
```

## ⚙️ Step 3: Configure Environment Variables

### 3.1 Required Environment Variables
Di Vercel Dashboard → Settings → Environment Variables:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth Configuration
NEXTAUTH_SECRET="your-32-character-secret-here"
NEXTAUTH_URL="https://your-domain.vercel.app"

# Optional: ZAI SDK (jika digunakan)
ZAI_API_KEY="your-zai-api-key"
```

### 3.2 Generate NextAuth Secret
```bash
# Generate secure secret
openssl rand -base64 32

# Atau dengan Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🗄️ Step 4: Setup Production Database

### Option 1: Supabase (Recommended - Free)
1. **Sign up di [supabase.com](https://supabase.com)**
2. **Create new project**
3. **Get connection string:**
   - Go to Settings → Database
   - Copy "Connection string"
   - Format: `postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres`

### Option 2: Railway
1. **Sign up di [railway.app](https://railway.app)**
2. **Add PostgreSQL service**
3. **Copy DATABASE_URL dari dashboard**

### Option 3: PlanetScale
1. **Sign up di [planetscale.com](https://planetscale.com)**
2. **Create database**
3. **Get connection string**

## 🔄 Step 5: Database Migration

### 5.1 Update Schema Production
```bash
# Install Prisma CLI
npm install -g prisma

# Set DATABASE_URL ke production
export DATABASE_URL="your-production-database-url"

# Generate Prisma Client
npx prisma generate

# Push schema ke production
npx prisma db push

# Seed data (optional)
npx tsx prisma/seed.ts
```

### 5.2 Verify Database Connection
```bash
# Test database connection
curl https://your-domain.vercel.app/api/test-db
```

## 🧪 Step 6: Testing Production

### 6.1 Health Check
```bash
# Test API endpoints
curl https://your-domain.vercel.app/api/health
curl https://your-domain.vercel.app/api/rooms
curl https://your-domain.vercel.app/api/room-types
```

### 6.2 Manual Testing Checklist
- [ ] Homepage loads correctly
- [ ] Navigation menu works (Indonesian language)
- [ ] Room search functionality
- [ ] Booking system
- [ ] Housekeeping management
- [ ] Maintenance tasks
- [ ] Financial records
- [ ] Configuration settings

## 📊 Step 7: Monitor & Optimize

### 7.1 Vercel Analytics
1. Go to **Analytics** tab di dashboard
2. Monitor performance metrics
3. Track user behavior

### 7.2 Performance Optimization
```bash
# Check bundle size
npx @next/bundle-analyzer

# Monitor API response times
curl -w "@curl-format.txt" https://your-domain.vercel.app/api/health
```

## 🚨 Troubleshooting

### Common Issues & Solutions

#### Build Errors
```bash
# Check build logs di Vercel dashboard
# Common fixes:
npm install
npm run build
npm run lint
```

#### Database Connection Issues
```bash
# Verify DATABASE_URL format
# Test connection locally:
DATABASE_URL="production-url" npm run dev

# Check Prisma schema
npx prisma db pull
npx prisma generate
```

#### Environment Variable Issues
```bash
# Verify variables di Vercel dashboard
# Redeploy setelah perubahan:
vercel --prod
```

#### API Route Issues
```bash
# Test individual endpoints:
curl -X GET https://your-domain.vercel.app/api/health
curl -X POST https://your-domain.vercel.app/api/rooms/search \
  -H "Content-Type: application/json" \
  -d '{"checkIn":"2024-01-01","checkOut":"2024-01-02","guests":1}'
```

## 💰 Cost Estimation

### Vercel (Hobby Plan - Free)
- **Bandwidth**: 100GB/bulan
- **Function invocations**: 100K/bulan
- **Build time**: 6000 menit/bulan
- **Custom domains**: Unlimited

### Database (Supabase Free)
- **Storage**: 500MB
- **Bandwidth**: 2GB/bulan
- **Connections**: 60 connections

### **Total Cost: $0/bulan** (untuk small hotel)

## 🎯 Best Practices for Sikabuview

### 1. Performance
- ✅ Next.js 15 dengan App Router
- ✅ Image optimization dengan Next.js Image
- ✅ Static generation untuk halaman statis
- ✅ API caching

### 2. Security
- ✅ HTTPS (auto di Vercel)
- ✅ Environment variables terenkripsi
- ✅ NextAuth.js untuk authentication
- ✅ Prisma untuk database security

### 3. SEO & Accessibility
- ✅ Meta tags optimized
- ✅ Semantic HTML
- ✅ Responsive design
- ✅ Indonesian language support

## 📞 Support Resources

### Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)

### Community Support
- Vercel Discord
- Next.js GitHub Discussions
- Stack Overflow

## ✅ Deployment Checklist

- [ ] Project berhasil build lokal ✓
- [ ] Code di-push ke GitHub
- [ ] Akun Vercel dibuat
- [ ] Project di-deploy ke Vercel
- [ ] Database production disetup
- [ ] Environment variables dikonfigurasi
- [ ] Database migration berhasil
- [ ] Semua fitur berfungsi di production
- [ ] Custom domain di-setup (jika perlu)
- [ ] Monitoring di-konfigurasi
- [ ] Backup plan disiapkan

---

## 🎉 Selamat! 

Sikabuview Hotel Management System Anda sekarang live di Vercel! 

### 🌟 Your Live Application Features:
- 🏨 Complete hotel management system
- 🇮🇩 Full Indonesian language support
- 📱 Responsive mobile-friendly design
- 🔧 Room, booking, and maintenance management
- 💰 Financial tracking and reporting
- 🎨 Modern UI dengan shadcn/ui components

### 📈 Next Steps:
1. Monitor performance di Vercel dashboard
2. Setup custom domain (opsional)
3. Configure backup database
4. Add analytics tracking
5. Scale resources saat hotel berkembang

**Happy Managing! 🚀**