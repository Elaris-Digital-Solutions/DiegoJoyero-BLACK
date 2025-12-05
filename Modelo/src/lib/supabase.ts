import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { loadRuntimeConfig } from './runtimeConfig';

let supabaseClientPromise: Promise<SupabaseClient | null> | null = null;

async function bootstrapSupabase(): Promise<SupabaseClient | null> {
  const config = await loadRuntimeConfig();
  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    if (import.meta.env.DEV) {
      console.warn('Supabase no está configurado. Define las variables de entorno para cargar el catálogo.');
    }
    return null;
  }

  return createClient(config.supabaseUrl, config.supabaseAnonKey);
}

export async function getSupabaseClient(): Promise<SupabaseClient | null> {
  if (!supabaseClientPromise) {
    supabaseClientPromise = bootstrapSupabase();
  }
  return supabaseClientPromise;
}

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  material: 'gold' | 'silver';
  category: string;
  image_url: string;
  image_public_id: string | null;
  stock: number;
  featured: boolean;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
};

export type ProductInsert = {
  name: string;
  description: string;
  price: number;
  material: 'gold' | 'silver';
  category: string;
  image_url: string;
  image_public_id?: string | null;
  stock: number;
  featured?: boolean;
  status?: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
};

export type ProductUpdate = Partial<ProductInsert> & {
  id: string;
};
