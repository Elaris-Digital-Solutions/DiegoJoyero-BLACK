import { loadRuntimeConfig } from './runtimeConfig';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const DEFAULT_CLOUDINARY_FOLDER = 'DiegoJoyero';

type CloudinaryUploadConfig = {
  cloudName: string;
  uploadPreset: string;
  baseFolder?: string | null;
};

let uploadConfigPromise: Promise<CloudinaryUploadConfig | null> | null = null;

async function getUploadConfig(): Promise<CloudinaryUploadConfig | null> {
  if (!uploadConfigPromise) {
    uploadConfigPromise = loadRuntimeConfig().then((config) => {
      const cloudName = config.cloudinary.cloudName;
      const uploadPreset = config.cloudinary.uploadPreset;
      if (!cloudName || !uploadPreset) {
        return null;
      }
      return {
        cloudName,
        uploadPreset,
        baseFolder: config.cloudinary.baseFolder,
      };
    });
  }
  return uploadConfigPromise;
}

const toSlug = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

const randomChunk = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10);

export const productImageConstraints = {
  maxSizeBytes: MAX_FILE_SIZE_BYTES,
  allowedMimeTypes: ALLOWED_MIME_TYPES,
};

export async function uploadProductImage(file: File, material: 'gold' | 'silver') {
  const config = await getUploadConfig();
  if (!config) {
    throw new Error('Cloudinary no está configurado. Define CLOUDINARY_CLOUD_NAME y CLOUDINARY_UPLOAD_PRESET.');
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error('Formato no permitido. Usa JPG, PNG, WebP o AVIF.');
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('La imagen supera los 5 MB permitidos.');
  }

  const extension = (file.name.split('.').pop() ?? 'jpg').toLowerCase();
  const baseName = file.name.replace(/\.[^/.]+$/, '') || 'producto';
  const slug = toSlug(baseName) || 'pieza';
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
  const configuredBase = config.baseFolder?.trim();
  const baseFolder = configuredBase && configuredBase.length > 0 ? configuredBase : DEFAULT_CLOUDINARY_FOLDER;
  const folderSegments: string[] = [];
  if (baseFolder) {
    folderSegments.push(baseFolder.replace(/\\/g, '/').replace(/(^\/+|\/+$)/g, ''));
  }
  folderSegments.push(material === 'gold' ? 'oro' : 'plata');
  const folder = folderSegments.join('/');
  const publicId = `${stamp}-${randomChunk()}-${slug}`;
  const expectedId = folder ? `${folder}/${publicId}` : publicId;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', config.uploadPreset);
  formData.append('public_id', publicId);
  formData.append('context', `alt=${baseName}`);
  formData.append('tags', ['diego-joyero', material].join(','));
  if (folder) {
    formData.append('folder', folder);
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`;
  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });
  } catch (networkError) {
    console.error('Error al conectar con Cloudinary', networkError);
    throw new Error('No se pudo contactar a Cloudinary. Verifica tu conexión.');
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error('Cloudinary respondió con un formato inesperado.');
  }

  type CloudinaryErrorPayload = { error?: { message?: string } };
  type CloudinarySuccessPayload = { secure_url?: string; url?: string; public_id?: string };
  const data = payload as CloudinarySuccessPayload & CloudinaryErrorPayload;

  if (!response.ok) {
    const message = data.error?.message ?? `Cloudinary devolvió ${response.status}.`;
    throw new Error(message);
  }

  const publicUrl = data.secure_url ?? data.url;
  if (!publicUrl) {
    throw new Error('Cloudinary no devolvió la URL de la imagen.');
  }

  return {
    publicUrl,
    publicId: data.public_id ?? expectedId,
    format: extension,
  };
}

const stripQuery = (value: string) => value.split('?')[0]?.split('#')[0] ?? '';

export function extractPublicIdFromUrl(imageUrl: string): string | null {
  if (!imageUrl) {
    return null;
  }

  const marker = '/upload/';
  const markerIndex = imageUrl.indexOf(marker);
  if (markerIndex === -1) {
    return null;
  }

  const afterUpload = stripQuery(imageUrl.slice(markerIndex + marker.length));
  if (!afterUpload) {
    return null;
  }

  const segments = afterUpload.split('/').filter(Boolean);
  // Drop transformation segments (contain commas) before the version/folder portion.
  while (segments.length && segments[0].includes(',')) {
    segments.shift();
  }

  if (segments[0]?.startsWith('v') && /^v\d+$/i.test(segments[0])) {
    segments.shift();
  }

  if (segments.length === 0) {
    return null;
  }

  const filename = segments.pop()!;
  const withoutExtension = filename.replace(/\.[^/.]+$/, '');
  const folder = segments.join('/');
  return folder ? `${folder}/${withoutExtension}` : withoutExtension;
}

export async function deleteProductImage(publicId: string) {
  if (!publicId) {
    return;
  }

  try {
    const response = await fetch('/.netlify/functions/delete-product-image', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      const detail = await response.json().catch(() => ({ error: 'No se pudo eliminar la imagen.' }));
      console.error('Cloudinary rechazó el borrado', detail);
    }
  } catch (error) {
    console.error('No se pudo solicitar el borrado de la imagen en Cloudinary', error);
  }
}
