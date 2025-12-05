export type RuntimeConfig = {
  supabaseUrl: string | null;
  supabaseAnonKey: string | null;
  cloudinary: {
    cloudName: string | null;
    uploadPreset: string | null;
    baseFolder: string | null;
  };
};

const DEFAULT_CLOUDINARY_FOLDER = 'DiegoJoyero';

declare global {
  interface Window {
    __DJ_RUNTIME_CONFIG__?: RuntimeConfig;
  }
}

const ENDPOINT = '/.netlify/functions/runtime-config';
let runtimeConfigPromise: Promise<RuntimeConfig> | null = null;

const normalize = (value: string | null | undefined) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

const buildDevConfig = (): RuntimeConfig | null => {
  if (!import.meta.env.DEV) {
    return null;
  }

  const baseFolder = normalize(import.meta.env.VITE_CLOUDINARY_FOLDER) ?? DEFAULT_CLOUDINARY_FOLDER;
  return {
    supabaseUrl: normalize(import.meta.env.VITE_SUPABASE_URL),
    supabaseAnonKey: normalize(import.meta.env.VITE_SUPABASE_ANON_KEY),
    cloudinary: {
      cloudName: normalize(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME),
      uploadPreset: normalize(import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET),
      baseFolder,
    },
  };
};

async function fetchRuntimeConfig(): Promise<RuntimeConfig> {
  const response = await fetch(ENDPOINT, {
    headers: {
      'cache-control': 'no-store',
    },
  });

  if (!response.ok) {
    throw new Error('No se pudo obtener la configuración en tiempo de ejecución.');
  }

  const payload = (await response.json()) as RuntimeConfig;
  const normalizedFolder = normalize(payload.cloudinary?.baseFolder) ?? DEFAULT_CLOUDINARY_FOLDER;
  return {
    supabaseUrl: normalize(payload.supabaseUrl),
    supabaseAnonKey: normalize(payload.supabaseAnonKey),
    cloudinary: {
      cloudName: normalize(payload.cloudinary?.cloudName),
      uploadPreset: normalize(payload.cloudinary?.uploadPreset),
      baseFolder: normalizedFolder,
    },
  };
}

export async function loadRuntimeConfig(): Promise<RuntimeConfig> {
  if (typeof window !== 'undefined' && window.__DJ_RUNTIME_CONFIG__) {
    return window.__DJ_RUNTIME_CONFIG__;
  }

  if (import.meta.env.DEV) {
    const devConfig = buildDevConfig();
    if (devConfig) {
      if (typeof window !== 'undefined') {
        window.__DJ_RUNTIME_CONFIG__ = devConfig;
      }
      return devConfig;
    }
  }

  if (!runtimeConfigPromise) {
    runtimeConfigPromise = fetchRuntimeConfig().then((config) => {
      if (typeof window !== 'undefined') {
        window.__DJ_RUNTIME_CONFIG__ = config;
      }
      return config;
    });
  }

  return runtimeConfigPromise;
}
