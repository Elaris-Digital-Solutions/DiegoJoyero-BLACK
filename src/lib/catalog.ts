import { getSupabaseClient, type Product as SupabaseProduct } from '@/lib/supabase';

export const LANDING_CATEGORIES = ['Anillos', 'Cadenas', 'Dijes'];

export async function fetchLandingProducts({ featuredOnly = false }: { featuredOnly?: boolean } = {}) {
  const client = await getSupabaseClient();
  if (!client) {
    throw new Error('Supabase no está configurado.');
  }

  let query = client
    .from('products')
    .select('*')
    .eq('status', 'active')
    .gt('stock', 0)
    .in('category', LANDING_CATEGORIES)
    .order('created_at', { ascending: false });

  if (featuredOnly) {
    query = query.eq('featured', true);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return (data ?? []) as SupabaseProduct[];
}
