export function getSupabaseUrl() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL;
  if (url) {
    return url;
  }

  return 'https://nrsmpjrtagtrieujwhya.supabase.co';
}

export function getSupabasePublicKey() {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (key) {
    return key;
  }

  return 'sb_publishable_VvKqNyO36xE5Kbzg32zFiw_6ROLkVWJ';
}
