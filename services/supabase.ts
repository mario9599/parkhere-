import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://mporscxurxpcroxubuan.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wb3JzY3h1cnhwY3JveHVidWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NTMwNTEsImV4cCI6MjA4OTQyOTA1MX0.VOKG0QFkXdxYjyZj0pD8D5G3VxgZ-6fn2tH7JGcSylE";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
console.log("supabase client:", supabase);
