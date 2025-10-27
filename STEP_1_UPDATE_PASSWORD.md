# 🔐 STEP 1: Update Database Password

## 📋 Instructions:

### 1. Dapatkan Password dari Supabase:
1. Buka [supabase.com](https://supabase.com)
2. Login → Pilih project `bhbvemszjpmvhkubicky`
3. Settings → Database → Connection string
4. Copy password dari connection string

### 2. Update File `.env.local`:
Ganti baris ke-6:
```bash
# Dari ini:
DATABASE_URL=postgresql://postgres.bhbvemszjpmvhkubicky:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres

# Menjadi ini (ganti [ACTUAL-PASSWORD] dengan password yang benar):
DATABASE_URL=postgresql://postgres.bhbvemszjpmvhkubicky:[ACTUAL-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

### 3. Contoh Password Format:
Jika password Anda adalah `xyz123abc`, maka:
```bash
DATABASE_URL=postgresql://postgres.bhbvemszjpmvhkubicky:xyz123abc@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

### 4. Setelah Update:
- Simpan file `.env.local`
- Lanjut ke STEP 2

⚠️ **PENTING**: Password harus persis sama dengan yang ada di Supabase dashboard!