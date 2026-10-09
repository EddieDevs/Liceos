import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ouysblhxqlidfxrjxhft.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91eXNibGh4cWxpZGZ4cmp4aGZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1NjI1OTUsImV4cCI6MjEwNzEzODU5NX0.XbmWVjFWz5Qd2hf2i-XIUuZF-7J9UoowuM5VNUHuS88';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Authentication Helpers
export async function signInWithEmail(email, password) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signUpWithEmail(email, password, metadata = {}) {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: metadata.fullName || 'Usuario',
        role: metadata.role || 'student',
        grade_level: metadata.gradeLevel || '4to Año - Sección A',
      },
    },
  });
}

export async function signInWithGoogle() {
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });
}

export async function signOutUser() {
  return await supabase.auth.signOut();
}
