# 🚀 COMPLETE STEP-BY-STEP DEPLOYMENT GUIDE
## Sikabuview Hotel Management System ke Vercel dengan Supabase

---

## 📋 **PREREQUISITES**
- ✅ Akun Supabase (project `bhbvemszjpmvhkubicky`)
- ✅ Akun Vercel
- ✅ Akun GitHub
- ✅ Node.js & npm terinstall

---

## 🔐 **STEP 1: Setup Database Password**

### 1.1 Dapatkan Password Supabase:
1. Buka [supabase.com](https://supabase.com) → Login
2. Pilih project: `bhbvemszjpmvhkubicky`
3. Klik **Settings** → **Database**
4. Scroll ke **Connection string** → **URI**
5. Copy password dari string seperti ini:
   ```
   postgresql://postgres.bhbvemszjpmvhkubicky:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```

### 1.2 Update File `.env.local`:
Buka file `/home/z/my-project/.env.local` dan update baris 6:

```bash
# DARI:
DATABASE_URL=postgresql://postgres.bhbvemszjpmvhkubicky:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres

# MENJADI (ganti [PASSWORD_ANDA] dengan password asli):
DATABASE_URL=postgresql://postgres.bhbvemszjpmvhkubicky:[PASSWORD_ANDA]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

### 1.3 Contoh Real:
Jika password Anda `xyz123abc`, maka:
```bash
DATABASE_URL=postgresql://postgres.bhbvemszjpmvhkubicky:xyz123abc@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

**⚠️ PENTING: Password harus persis sama, tanpa bracket []!**

---

## 🗄️ **STEP 2: Setup Database Schema**

### 2.1 Generate Prisma Client:
```bash
cd /home/z/my-project
npm run db:generate
```

### 2.2 Push Schema ke Supabase:
```bash
npm run db:push
```

### 2.3 Expected Success Output:
```
Environment variables loaded from .env.local
✅ Your database is now in sync with your Prisma schema.
```

### 2.4 Verify Tables:
Buka Supabase Dashboard → **Table Editor**, seharusnya ada 13 tables:
- `users`
- `room_types` 
- `rooms`
- `bookings`
- `payments`
- `additional_charges`
- `booking_charges`
- `financial_records`
- `staff`
- `maintenance_categories`
- `maintenance_tasks`
- `housekeeping_tasks`
- `housekeeping_assignments`

---

## 🧪 **STEP 3: Test Database Connection**

### 3.1 Start Development Server:
```bash
npm run dev
```

### 3.2 Test API Endpoint:
Buka browser atau curl:
```bash
curl http://localhost:3000/api/test-db
```

### 3.3 Expected Success Response:
```json
{
  "success": true,
  "message": "Database connections successful",
  "prisma": {
    "connected": true,
    "roomTypesCount": 0,
    "roomTypes": []
  },
  "supabase": {
    "success": true
  }
}
```

### 3.4 If Error:
- Check password di `.env.local`
- Verify Supabase project status
- Restart development server

---

## 🚀 **STEP 4: Deploy ke Vercel**

### 4.1 Push Code ke GitHub:
```bash
git add .
git commit -m "Ready for Vercel deployment with Supabase"
git push origin master
```

### 4.2 Deploy via Vercel Web:
1. Buka [vercel.com](https://vercel.com)
2. Login dengan GitHub
3. Klik **"New Project"**
4. Pilih repository: `hotel-management`
5. Klik **"Deploy"**

### 4.3 Wait for Deployment:
- Vercel akan otomatis build dan deploy
- Proses sekitar 2-3 menit
- Anda akan dapat URL seperti: `https://hotel-management-xyz.vercel.app`

---

## ⚙️ **STEP 5: Configure Environment Variables di Vercel**

### 5.1 Buka Vercel Dashboard:
1. Setelah deploy, klik project Anda
2. Klik **Settings** → **Environment Variables**

### 5.2 Tambahkan Variables:

#### **Variable 1: Supabase URL**
```
NEXT_PUBLIC_SUPABASE_URL
https://bhbvemszjpmvhkubicky.supabase.co
```

#### **Variable 2: Supabase Anon Key**
```
NEXT_PUBLIC_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoYnZlbXN6anBtdmhrdWJpY2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0ODkwMTMsImV4cCI6MjA3NzA2NTAxM30.ec16iQVsd_kCBASvf54zVN2D6-lKH1n2V70--vPnW7A
```

#### **Variable 3: Database URL**
```
DATABASE_URL
postgresql://postgres.bhbvemszjpmvhkubicky:[PASSWORD_ANDA]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

#### **Variable 4: NextAuth Secret**
```
NEXTAUTH_SECRET
sikabuview-hotel-management-production-secret-key-2024
```

#### **Variable 5: NextAuth URL**
```
NEXTAUTH_URL
https://your-domain.vercel.app
```

### 5.3 Redeploy:
Setelah menambah variables, Vercel akan otomatis redeploy.

---

## 🧪 **STEP 6: Test Production Deployment**

### 6.1 Test Health Endpoint:
```bash
curl https://your-domain.vercel.app/api/health
```

### 6.2 Test Database Connection:
```bash
curl https://your-domain.vercel.app/api/test-db
```

### 6.3 Test Main Application:
Buka browser: `https://your-domain.vercel.app`

### 6.4 Verify Features:
- ✅ Homepage loads dengan Bahasa Indonesia
- ✅ Navigation menu berfungsi
- ✅ Room search (jika ada data)
- ✅ API endpoints berfungsi

---

## 🎯 **STEP 7: Seed Initial Data (Optional)**

### 7.1 Add Sample Room Types:
Buka Supabase Dashboard → **Table Editor** → `room_types` → **Insert row**:

```sql
INSERT INTO room_types (id, name, description, price, capacity, amenities) VALUES
('rt001', 'Superior Room', 'Kamar superior dengan view kota', 750000, 2, '["AC", "TV", "WiFi", "Mini Bar"]'),
('rt002', 'Deluxe Room', 'Kamar deluxe dengan view kolam', 950000, 2, '["AC", "TV", "WiFi", "Mini Bar", "Bathtub"]'),
('rt003', 'Suite Room', 'Suite premium dengan living room', 1500000, 4, '["AC", "TV", "WiFi", "Mini Bar", "Bathtub", "Living Room"]');
```

### 7.2 Add Sample Rooms:
```sql
INSERT INTO rooms (id, roomNumber, roomTypeId, floor, status) VALUES
('r001', '101', 'rt001', 1, 'available'),
('r002', '102', 'rt001', 1, 'available'),
('r003', '201', 'rt002', 2, 'available');
```

---

## 🔧 **TROUBLESHOOTING**

### Common Issues & Solutions:

#### **Error 1: Database Connection Failed**
**Symptoms**: `Error validating datasource`
**Solution**: 
- Check DATABASE_URL format
- Verify password benar
- Test dengan Supabase SQL Editor

#### **Error 2: Build Failed**
**Symptoms**: Build error di Vercel
**Solution**:
- Check environment variables
- Verify semua dependencies terinstall
- Lihat build logs di Vercel

#### **Error 3: API 500 Error**
**Symptoms**: API endpoints return 500
**Solution**:
- Test `/api/test-db` endpoint
- Check database connection
- Verify Prisma schema

#### **Error 4: Static Assets 404**
**Symptoms**: CSS/JS files not found
**Solution**:
- Redeploy ke Vercel
- Clear browser cache
- Check build logs

---

## 📊 **SUCCESS METRICS**

### ✅ Deployment Success Indicators:
- [ ] Homepage loads tanpa error
- [ ] Bahasa Indonesia tampil sempurna
- [ ] Database connection successful
- [ ] API endpoints return 200
- [ ] No console errors
- [ ] Mobile responsive

### 📈 Expected Performance:
- **Load Time**: < 3 seconds
- **API Response**: < 500ms
- **Mobile Score**: > 90
- **SEO Score**: > 85

---

## 🎉 **CONGRATULATIONS!**

Jika semua steps selesai, Anda sekarang memiliki:

✅ **Hotel Management System** yang fully functional  
✅ **Bahasa Indonesia** interface  
✅ **Supabase Database** yang powerful  
✅ **Vercel Hosting** yang scalable  
✅ **Production Ready** application  

### 🌐 Your Live Application:
**URL**: `https://your-domain.vercel.app`  
**Database**: Supabase PostgreSQL  
**Framework**: Next.js 15 + TypeScript  
**UI**: Tailwind CSS + shadcn/ui  

### 📞 Support:
- **Documentation**: Lihat file `.md` di project
- **Supabase Dashboard**: [supabase.com](https://supabase.com)
- **Vercel Dashboard**: [vercel.com](https://vercel.com)

---

**🏨 Selamat! Hotel Management System Anda sekarang live! 🎉**