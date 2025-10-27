# 🗄️ STEP 2: Push Schema to Supabase

## 📋 Instructions:

### 1. Generate Prisma Client:
```bash
npm run db:generate
```

### 2. Push Schema ke Supabase:
```bash
npm run db:push
```

### 3. Expected Output:
```
Environment variables loaded from .env.local
Prisma schema loaded from prisma/schema.prisma
✅ Your database is now in sync with your Prisma schema.
```

### 4. Verify Tables Created:
Setelah push, seharusnya ada 13 tables:
- users
- room_types
- rooms
- bookings
- payments
- additional_charges
- booking_charges
- financial_records
- staff
- maintenance_categories
- maintenance_tasks
- housekeeping_tasks
- housekeeping_assignments

### 5. Jika Error:
- Check DATABASE_URL format
- Pastikan password benar
- Verify Supabase project status

### 6. Lanjut ke STEP 3 setelah berhasil!