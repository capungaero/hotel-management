import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ 
    status: "ok",
    message: "Sikabuview API is running!",
    environment: process.env.NODE_ENV,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set',
    databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
    nextAuthSecret: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set',
    nextAuthUrl: process.env.NEXTAUTH_URL || 'Not set',
    timestamp: new Date().toISOString(),
    language: "Indonesian (Bahasa Indonesia)"
  });
}