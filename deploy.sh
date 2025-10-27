#!/bin/bash

# 🚀 Sikabuview Hotel Management System - Deployment Script
# Script untuk deploy ke Vercel

echo "🏨 Sikabuview Hotel Management System - Deployment to Vercel"
echo "=========================================================="

# Step 1: Build project
echo "📦 Step 1: Building project..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix errors before deploying."
    exit 1
fi
echo "✅ Build successful!"

# Step 2: Login ke Vercel (jika belum)
echo "🔐 Step 2: Checking Vercel login..."
npx vercel whoami
if [ $? -ne 0 ]; then
    echo "📝 Please login to Vercel:"
    echo "npx vercel login"
    echo "Setelah login, jalankan script ini lagi."
    exit 1
fi
echo "✅ Already logged in to Vercel!"

# Step 3: Deploy ke Vercel
echo "🚀 Step 3: Deploying to Vercel..."
npx vercel --prod

echo "🎉 Deployment completed!"
echo ""
echo "📋 Next Steps:"
echo "1. Buka Vercel dashboard untuk konfigurasi environment variables"
echo "2. Setup database production (Supabase/Railway/PlanetScale)"
echo "3. Test semua fitur di production"
echo ""
echo "📚 Documentation: Lihat DEPLOY_VERCEL.md untuk panduan lengkap"