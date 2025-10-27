# 🚀 Solusi Error Database di Vercel

## 🔍 **Analisa Error:**
- API returns 500 (Internal Server Error)
- `W.reduce is not a function` = API mengembalikan error, bukan array
- Penyebab: Database SQLite tidak bekerja di Vercel production

## 🛠️ **Solusi: Setup Database Production**

### **Opsi 1: Supabase (Recommended - Gratis)**

#### 1. Buat Database Supabase
1. Buka [supabase.com](https://supabase.com)
2. Sign up dengan GitHub
3. Click **"New Project"**
4. Pilih organization
5. Create project:
   - **Project Name**: `hotel-management`
   - **Database Password**: Buat password yang kuat
   - **Region**: Pilih terdekat (Singapore/East Asia)
6. Tunggu 2-3 menit

#### 2. Get Connection String
1. Di dashboard Supabase → Settings → Database
2. Copy **Connection string**:
```
postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres
```

#### 3. Update Environment Variables di Vercel
1. Buka Vercel project → Settings → Environment Variables
2. Tambahkan:
```
DATABASE_URL = postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres
NEXTAUTH_SECRET = your-secret-key-here
NEXTAUTH_URL = https://hotel-management-six-rho.vercel.app
```

#### 4. Generate NextAuth Secret
```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### 5. Redeploy
1. Di Vercel dashboard → Deployments
2. Click **"Redeploy"** atau push commit baru

### **Opsi 2: Railway (Mudah)**

#### 1. Buat Project Railway
1. Buka [railway.app](https://railway.app)
2. Login dengan GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Pilih `hotel-management` repository
5. Add PostgreSQL service:
   - Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
6. Railway akan otomatis setup DATABASE_URL

### **Opsi 3: PlanetScale (MySQL)**

#### 1. Buat Database PlanetScale
1. Buka [planetscale.com](https://planetscale.com)
2. Sign up dan buat database
3. Get connection string
4. Update Prisma schema untuk MySQL

## 🔄 **Update Prisma Schema untuk Production**

```bash
# Install Supabase client jika perlu
npm install @supabase/supabase-js

# Update Prisma schema
# Ganti provider sqlite -> postgresql
```

## 🧪 **Testing Database Connection**

Setelah setup database:

```bash
# Test API endpoints
curl https://hotel-management-six-rho.vercel.app/api/health
curl https://hotel-management-six-rho.vercel.app/api/room-types
curl https://hotel-management-six-rho.vercel.app/api/bookings/calendar
```

## 📋 **Checklist Fix:**

- [ ] Buat database production (Supabase/Railway)
- [ ] Copy connection string
- [ ] Update environment variables di Vercel
- [ ] Generate NEXTAUTH_SECRET
- [ ] Redeploy project
- [ ] Test semua API endpoints
- [ ] Verify frontend berfungsi

## 🚀 **Setelah Fix:**

1. **Database production** akan otomatis terisi
2. **Semua API endpoints** akan berfungsi
3. **Frontend** akan menampilkan data dengan benar
4. **Error 500** akan hilang

---

**Pilih opsi database yang Anda suka, saya akan bantu setup!** 🎯