import { createClient } from "@supabase/supabase-js";
import type { Order } from "@/types/order";

// Browser client — uses anon key, safe to expose
// Only instantiated once (singleton pattern for React)

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _client: ReturnType<typeof createClient<{ public: { Tables: { orders: { Row: Order } } } }>> | null = null;

export function getSupabaseBrowserClient() {
  if (!_client) {
    _client = createClient(url, key);
  }
  return _client;
}
