import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side usage with service role key (if needed in the future)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database helper functions
export const createSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('room_types').select('count').single()
    if (error) {
      console.error('Supabase connection error:', error)
      return { success: false, error: error.message }
    }
    return { success: true, data }
  } catch (err) {
    console.error('Supabase test error:', err)
    return { success: false, error: 'Connection failed' }
  }
}