/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: "https://xubzmtcvgxvfwxalhioz.supabase.co";
  readonly VITE_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1YnptdGN2Z3h2Znd4YWxoaW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNDQ1OTIsImV4cCI6MjA3NTcyMDU5Mn0.nYRKlnZlA_tbIuSw0uj5UU2ut0-9M-5jRcPXxkJ5XuY"
;
  readonly VITE_AUTH_REDIRECT_URL?: "https://primeadviewdulite.vercel.app/dashboard";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}