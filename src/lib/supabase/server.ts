import { createClient } from "@supabase/supabase-js";

// Server-only client — uses service role key, NEVER expose to browser
// Import this only in API Route Handlers (route.ts) or Server Actions

export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required"
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
