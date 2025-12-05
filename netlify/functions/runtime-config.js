const DEFAULT_CLOUDINARY_FOLDER = 'DiegoJoyero';

const sanitize = (value) => {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim();
};

const resolveEnv = (key) => {
  if (process.env[key]) {
    return process.env[key];
  }
  const viteKey = `VITE_${key}`;
  return process.env[viteKey] ?? '';
};

exports.handler = async () => {
  const folder = sanitize(resolveEnv('CLOUDINARY_FOLDER')) || DEFAULT_CLOUDINARY_FOLDER;
  const payload = {
    supabaseUrl: sanitize(resolveEnv('SUPABASE_URL')),
    supabaseAnonKey: sanitize(resolveEnv('SUPABASE_ANON_KEY')),
    cloudinary: {
      cloudName: sanitize(resolveEnv('CLOUDINARY_CLOUD_NAME')),
      uploadPreset: sanitize(resolveEnv('CLOUDINARY_UPLOAD_PRESET')),
      baseFolder: folder,
    },
  };

  return {
    statusCode: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
    body: JSON.stringify(payload),
  };
};
