# 🗄️ Supabase Database Setup for Sikabuview

## 📋 Configuration Details

### 🔑 Supabase Credentials
- **URL**: `https://bhbvemszjpmvhkubicky.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoYnZlbXN6anBtdmhrdWJpY2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0ODkwMTMsImV4cCI6MjA3NzA2NTAxM30.ec16iQVsd_kCBASvf54zVN2D6-lKH1n2V70--vPnW7A`

### 🏗️ Database Structure
Project menggunakan **PostgreSQL** dengan schema lengkap untuk hotel management:

#### 📊 Tables:
- `users` - User management
- `room_types` - Tipe kamar (Superior, Deluxe, Suite, etc)
- `rooms` - Data kamar individual
- `bookings` - Reservasi tamu
- `payments` - Pembayaran
- `additional_charges` - Biaya tambahan
- `financial_records` - Laporan keuangan
- `staff` - Data karyawan
- `maintenance_categories` - Kategori maintenance
- `maintenance_tasks` - Tugas maintenance
- `housekeeping_tasks` - Template tugas housekeeping
- `housekeeping_assignments` - Penugasan harian

## ⚙️ Environment Variables

### 📁 Files Created:
- `.env.local` - Development environment
- `.env.production` - Production environment

### 🔧 Required Variables:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://bhbvemszjpmvhkubicky.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoYnZlbXN6anBtdmhrdWJpY2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0ODkwMTMsImV4cCI6MjA3NzA2NTAxM30.ec16iQVsd_kCBASvf54zVN2D6-lKH1n2V70--vPnW7A

# Database Connection (update dengan password yang benar)
DATABASE_URL=postgresql://postgres.bhbvemszjpmvhkubicky:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres

# NextAuth
NEXTAUTH_SECRET=sikabuview-hotel-management-production-secret-key-2024
NEXTAUTH_URL=https://your-domain.vercel.app
```

## 🚀 Setup Instructions

### 1. Database Migration
```bash
# Generate Prisma Client
npm run db:generate

# Push schema ke Supabase
npm run db:push

# Seed data (optional)
npm run db:seed
```

### 2. Test Connection
```bash
# Test database connection
curl http://localhost:3000/api/test-db

# Expected response:
{
  "success": true,
  "message": "Database connections successful",
  "prisma": {
    "connected": true,
    "roomTypesCount": 0,
    "roomTypes": []
  },
  "supabase": {
    "success": true,
    "data": {...}
  }
}
```

## 🔐 Security Configuration

### Supabase RLS (Row Level Security)
Pastikan RLS di-enable untuk tabel-tabel sensitif:

```sql
-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;

-- Example policy
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (auth.uid()::text = guest_email);
```

### API Keys Management
- **Anon Key**: Digunakan di client-side (sudah di-set)
- **Service Role Key**: Untuk server-side operations (simpan aman)

## 📱 Vercel Deployment

### Environment Variables di Vercel:
1. Buka Vercel Dashboard → Project → Settings → Environment Variables
2. Tambahkan variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://bhbvemszjpmvhkubicky.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoYnZlbXN6anBtdmhrdWJpY2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0ODkwMTMsImV4cCI6MjA3NzA2NTAxM30.ec16iQVsd_kCBASvf54zVN2D6-lKH1n2V70--vPnW7A
DATABASE_URL=postgresql://postgres.bhbvemszjpmvhkubicky:[ACTUAL-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
NEXTAUTH_SECRET=sikabuview-hotel-management-production-secret-key-2024
NEXTAUTH_URL=https://your-domain.vercel.app
```

## 🧪 Testing & Troubleshooting

### Test Database Connection:
```bash
# Development
curl http://localhost:3000/api/test-db

# Production
curl https://your-domain.vercel.app/api/test-db
```

### Common Issues:

#### 1. Connection Failed
```bash
# Check DATABASE_URL format
# Pastikan password sudah benar
# Test connection dengan Supabase SQL Editor
```

#### 2. Schema Not Found
```bash
# Run schema migration
npm run db:push

# Check table existence
npm run db:generate
```

#### 3. Permission Issues
```bash
# Check RLS policies
# Verify API key permissions
# Test dengan service role key
```

## 📊 Performance Optimization

### Database Indexes
```sql
-- Add indexes untuk performance
CREATE INDEX idx_bookings_dates ON bookings(check_in_date, check_out_date);
CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_maintenance_tasks_status ON maintenance_tasks(status, due_date);
```

### Connection Pooling
Supabase sudah menyediakan connection pooling:
- **Pooler**: `aws-0-ap-southeast-1.pooler.supabase.com:6543`
- **Direct**: `aws-0-ap-southeast-1.pooler.supabase.com:5432`

## 🔄 Backup & Recovery

### Supabase Auto-Backup:
- **Daily backups** otomatis
- **Point-in-time recovery** (7 days)
- **Manual backup** bisa dilakukan

### Export Data:
```sql
-- Export semua data
pg_dump --data-only --inserts your_database > backup.sql
```

## 📈 Monitoring

### Supabase Dashboard:
- Real-time metrics
- Query performance
- Storage usage
- API usage

### Custom Monitoring:
```javascript
// Monitor connection health
const { testSupabaseConnection } = require('./src/lib/supabase')
setInterval(testSupabaseConnection, 60000) // Every minute
```

---

## ✅ Setup Checklist

- [ ] Supabase project created
- [ ] Environment variables configured
- [ ] Database schema pushed
- [ ] Prisma client generated
- [ ] Connection tested
- [ ] RLS policies configured
- [ ] Vercel environment set
- [ ] Production deployment tested
- [ ] Backup plan configured

**🎉 Supabase database siap digunakan untuk Sikabuview Hotel Management!**