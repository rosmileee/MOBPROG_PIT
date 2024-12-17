// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://afvwtdlnmpdpxhxjlcbh.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmdnd0ZGxubXBkcHhoeGpsY2JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3NTc1NjUsImV4cCI6MjA0NTMzMzU2NX0.yK4YYkXE6WI5u07z8Il6Vzch5zYXL7ZyPaRwsYE-csE'; 
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
