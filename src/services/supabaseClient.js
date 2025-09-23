// File: src/services/supabaseClient.js

import { createClient } from '@supabase/supabase-js'

// IMPORTANT: Replace with your project's URL and Anon Key
const supabaseUrl = 'https://lzmfeerpwuixagjogzrj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6bWZlZXJwd3VpeGFnam9nenJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMTY3NTgsImV4cCI6MjA3Mjc5Mjc1OH0.0mv1aBL-HOl3DqrlN6nLSg5NUOZ3XYfBQG3Mi3Qr0So'

// Find these in your Supabase project settings under "API"
// It is recommended to use environment variables for these in a real project

export const supabase = createClient(supabaseUrl, supabaseAnonKey)