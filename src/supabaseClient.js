import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cwaqixpczheaoyidqddj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3YXFpeHBjemhlYW95aWRxZGRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNzc0NTMsImV4cCI6MjA2NjY1MzQ1M30.fZHVsX6ViTDRjGbKPTkgy6ayaY0RXexhFAjvq712IY4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)