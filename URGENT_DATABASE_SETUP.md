# 🚨 SEGERA: Setup Database Production

## 🔍 **Current Status:**
- ✅ Server OK (health API works)
- ❌ Database Connection FAILED (APIs return 500)
- ❌ Environment Variables belum disetup

## 🛠️ **SOLUSI IMMEDIATE (5 menit):**

### **Step 1: Buat Database Supabase**
1. **Buka**: https://supabase.com
2. **Sign up** dengan GitHub
3. **Click "New Project"**
4. **Isi form**:
   - Organization: Pilih existing
   - Project Name: `hotel-management`
   - Database Password: `Hotel123!@#` (copy ini)
   - Region: `Southeast Asia (Singapore)`
5. **Click "Create new project"**
6. **Tunggu 2-3 menit**

### **Step 2: Copy Connection String**
1. **Dashboard** → Settings → Database
2. **Scroll ke "Connection string"**
3. **Copy URI**:
   ```
   postgresql://postgres:Hotel123!@#@db.********.supabase.co:5432/postgres
   ```

### **Step 3: Setup Vercel Environment**
1. **Buka**: https://vercel.com/capungaero/hotel-management
2. **Settings** → Environment Variables
3. **Add variables**:

   **Variable 1:**
   - Name: `DATABASE_URL`
   Value: `[paste connection string dari Supabase]`
   - Environments: Production, Preview, Development

   **Variable 2:**
   - Name: `NEXTAUTH_SECRET`
   - Value: `/F56DPRB7bGt7rhJhhIYIXEq4X0h1Mu1+gIpFMzO2ns=`
   - Environments: Production, Preview, Development

   **Variable 3:**
   - Name: `NEXTAUTH_URL`
   - Value: `https://hotel-management-six-rho.vercel.app`
   - Environments: Production, Preview, Development

4. **Click "Save"**

### **Step 4: Redeploy**
1. **Deployments** tab
2. **Click "Redeploy"** (top right)
3. **Tunggu 2-3 menit**

### **Step 5: Test Again**
```bash
curl https://hotel-management-six-rho.vercel.app/api/room-types
curl https://hotel-management-six-rho.vercel.app/api/bookings/calendar?month=10&year=2025
```

---

## 🎯 **Expected Result:**
- ✅ Room types returns array `[]` atau data
- ✅ Calendar returns array dengan dates
- ✅ Website berfungsi normal

---

## 🆘 **If Still Error:**
1. **Check Vercel Function Logs**
   - Vercel dashboard → Functions tab
   - Lihat error logs

2. **Alternative: Railway**
   - Buka railway.app
   - Connect GitHub
   - Auto-setup database

---

## ⏱️ **Time Estimate:**
- Supabase setup: 3 menit
- Vercel variables: 2 menit
- Redeploy: 2 menit
- **Total: 7 menit**

**KERJAKAN SEKARANG! Website akan berfungsi setelah ini.** 🚀