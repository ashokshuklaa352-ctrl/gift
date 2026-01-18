
// Initialize Supabase Client
// Note: It is safe to expose the ANON key on the client side.
const SUPABASE_URL = 'https://jjzxymymnlsyosnuvcqn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqenh5bXltbmxzeW9zbnV2Y3FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0OTE4ODMsImV4cCI6MjA4NDA2Nzg4M30.GdN6khTg38AOEQR9iA4QQlWTSHY6a249OiAXfLo4EZg';

// Check if supabase global exists (loaded via CDN)
if (typeof supabase !== 'undefined') {
    window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
    console.error('Supabase SDK not loaded. Make sure to include the CDN script before this file.');
}
