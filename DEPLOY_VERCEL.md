# 🚀 Tutorial Deploy Hotel Management System ke Vercel

## 📋 Prasyarat
- Akun Vercel (gratis)
- GitHub/GitLab/Bitbucket account
- Project sudah di-push ke repository

## 🔧 Langkah 1 - Persiapan Project

### 1.1 Build Project Lokal
```bash
# Build project untuk memastikan tidak ada error
npm run build

# Jika build berhasil, lanjut ke langkah berikutnya
```

### 1.2 Push ke Repository
```bash
# Init git jika belum
git init
git add .
git commit -m "Initial commit: Hotel Management System"

# Push ke GitHub
git branch -M main
git remote add origin https://github.com/username/hotel-management.git
git push -u origin main
```

## 🌐 Langkah 2 - Deploy ke Vercel

### 2.1 Via Web Vercel (Recommended)
1. Buka [vercel.com](https://vercel.com)
2. Login dengan GitHub
3. Klik **"New Project"**
4. Pilih repository hotel-management
5. Klik **"Deploy"**

### 2.2 Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login ke Vercel
vercel login

# Deploy dari root directory project
vercel

# Follow instruksi:
# - Link ke existing project? N
# - Project name? hotel-management
# - Directory? . (current directory)
# - Override settings? N
```

## ⚙️ Langkah 3 - Konfigurasi Environment Variables

### 3.1 Setting di Dashboard Vercel
1. Buka project dashboard di Vercel
2. Go to **Settings → Environment Variables**
3. Tambahkan variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="https://your-domain.vercel.app"

# ZAI SDK (jika digunakan)
ZAI_API_KEY="your-zai-api-key"
```

### 3.2 Generate NextAuth Secret
```bash
# Generate random secret
openssl rand -base64 32

# Atau menggunakan Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🗄️ Langkah 4 - Setup Database Production

### 4.1 Opsi Database (Recommended)
1. **Supabase** (Gratis untuk mulai)
   - Sign up di [supabase.com](https://supabase.com)
   - Create new project
   - Copy connection string

2. **Railway** (Mudah digunakan)
   - Sign up di [railway.app](https://railway.app)
   - Add PostgreSQL service
   - Copy database URL

3. **PlanetScale** (MySQL-based)
   - Sign up di [planetscale.com](https://planetscale.com)
   - Create database
   - Copy connection string

### 4.2 Update Schema untuk Production
```bash
# Install Prisma CLI jika belum
npm install -g prisma

# Generate Prisma Client
npx prisma generate

# Push schema ke database production
npx prisma db push
```

## 🔄 Langkah 5 - Automate Deployment

### 5.1 Setup Automatic Deployments
1. Di Vercel dashboard:
   - Go to **Settings → Git**
   - Enable **"Automatic Deployments"**
   - Pilih branch **main**

### 5.2 Custom Domain (Optional)
1. Go to **Settings → Domains**
2. Add custom domain
3. Update DNS records

## 🧪 Langkah 6 - Testing Production

### 6.1 Health Check
```bash
# Test API health endpoint
curl https://your-domain.vercel.app/api/health

# Expected response:
# {"status":"ok","timestamp":"2024-01-01T00:00:00.000Z"}
```

### 6.2 Manual Testing
1. Buka `https://your-domain.vercel.app`
2. Test semua fitur:
   - Dashboard loading
   - Room management
   - Booking system
   - Financial records

## 📊 Langkah 7 - Monitoring

### 7.1 Vercel Analytics
1. Go to **Analytics** tab
2. Monitor:
   - Page views
   - Performance
   - Error rates

### 7.2 Logs Monitoring
```bash
# View deployment logs
vercel logs

# View real-time logs
vercel logs --follow
```

## 🚨 Troubleshooting

### Common Issues & Solutions

#### 1. Build Errors
```bash
# Check build logs di Vercel dashboard
# Fix common issues:
npm run build
npm run lint
```

#### 2. Database Connection
```bash
# Verify DATABASE_URL format
# Test connection locally:
DATABASE_URL="your-production-url" npm run dev
```

#### 3. Environment Variables
```bash
# Verify all variables ada di Vercel
# Restart deployment setelah update
vercel --prod
```

#### 4. API Errors
```bash
# Check API routes:
curl https://your-domain.vercel.app/api/health
curl https://your-domain.vercel.app/api/rooms
```

## 💰 Biaya Estimasi

### Vercel (Hobby Plan - Gratis)
- **Bandwidth**: 100GB/bulan
- **Function invocations**: 100K/bulan
- **Build time**: 6000 menit/bulan
- **Custom domains**: Unlimited

### Database (Supabase Free)
- **Storage**: 500MB
- **Bandwidth**: 2GB/bulan
- **Connections**: 60 connections

### Total Biaya: **$0/bulan** (untuk small hotel)

## 🎯 Best Practices

### 1. Performance
```bash
# Optimize images
next-optimized-images

# Enable caching
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true
  }
}
```

### 2. Security
```bash
# Use HTTPS (auto di Vercel)
# Secure environment variables
# Regular updates
npm audit fix
```

### 3. Backup
```bash
# Regular database backups
# Git version control
# Vercel preview deployments
```

## 📞 Support

### Resources:
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)

### Community:
- Vercel Discord
- Next.js GitHub Discussions
- Stack Overflow

---

## ✅ Checklist Deployment

- [ ] Project berhasil build lokal
- [ ] Code di-push ke GitHub
- [ ] Akun Vercel dibuat
- [ ] Project di-deploy ke Vercel
- [ ] Database production disetup
- [ ] Environment variables dikonfigurasi
- [ ] Semua fitur berfungsi di production
- [ ] Custom domain di-setup (jika perlu)
- [ ] Monitoring di-konfigurasi
- [ ] Backup plan disiapkan

Selamat! Hotel Management System Anda sekarang live di Vercel! 🎉