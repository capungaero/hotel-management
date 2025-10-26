# 🚨 DATABASE CONNECTION TROUBLESHOOTING

## 🔍 **Current Issue:**
Database connection string format tidak valid. Error menunjukkan:
```
Can't reach database server at `postgres.bhbvemszjpmvhkubicky:5432`
```

## 🛠️ **Solution: Get Correct Connection String**

### **Step 1: Buka Supabase Dashboard**
1. Buka https://supabase.com
2. Login → Pilih project `hotel-management`
3. Settings → Database

### **Step 2: Copy Connection String yang BENAR**
Di section "Connection string", copy yang **URI**:

**Format yang BENAR:**
```
postgresql://postgres.xxxx:password@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
```

**BUKAN:**
```
postgresql://postgres.bhbvemszjpmvhkubicky:password@...
```

### **Step 3: Update Vercel Environment**
1. Buka Vercel project → Settings → Environment Variables
2. Edit `DATABASE_URL` dengan connection string yang BENAR
3. Save → Redeploy

### **Step 4: Test Connection**
```bash
curl https://hotel-management-six-rho.vercel.app/api/test-db
```

---

## 🎯 **Expected Connection String Format:**

**Dari Supabase, seharusnya seperti ini:**
```
postgresql://postgres.xxxx:[PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
```

**Perhatikan:**
- `postgres.xxxx` (bukan `postgres.bhbvemszjpmvhkubicky`)
- Password tanpa encoding
- Port 5432

---

## 🚀 **Action Required:**

**Saya butuh connection string yang BENAR dari Supabase dashboard!**

**Silakan copy dari Supabase → Settings → Database → Connection string → URI**

**Paste di sini untuk saya update di Vercel!** 🔗