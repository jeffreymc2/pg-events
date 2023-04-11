import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mswrgxsoijhmpqyepekf.supabase.co'; // Replace with your Supabase project URL
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zd3JneHNvaWpobXBxeWVwZWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTQwOTQyODAsImV4cCI6MTk2OTY3MDI4MH0.5tcv7-VyPiLWrwZ81bZ2k1aTI73Zk3CCEwALIfEbGvw'; // Replace with your Supabase anon public key

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
