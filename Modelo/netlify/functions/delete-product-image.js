const crypto = require('crypto');

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

exports.handler = async (event) => {
  const method = event.httpMethod || 'GET';
  if (method !== 'POST') {
    return {
      statusCode: 405,
      headers: { Allow: 'POST' },
      body: JSON.stringify({ error: 'Solo se admite POST' }),
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'JSON inválido' }),
    };
  }

  const publicId = sanitize(payload.publicId);
  if (!publicId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'publicId es obligatorio' }),
    };
  }

  const cloudName = sanitize(resolveEnv('CLOUDINARY_CLOUD_NAME'));
  const apiKey = sanitize(resolveEnv('CLOUDINARY_API_KEY'));
  const apiSecret = sanitize(resolveEnv('CLOUDINARY_API_SECRET'));

  if (!cloudName || !apiKey || !apiSecret) {
    console.error('Cloudinary API no está configurada');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Cloudinary no está configurado correctamente' }),
    };
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signaturePayload = `invalidate=true&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(signaturePayload).digest('hex');

  const params = new URLSearchParams({
    public_id: publicId,
    invalidate: 'true',
    timestamp: String(timestamp),
    api_key: apiKey,
    signature,
  });

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;

  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      body: params,
    });
  } catch (error) {
    console.error('Error al contactar Cloudinary', error);
    return {
      statusCode: 502,
      body: JSON.stringify({ error: 'No se pudo contactar Cloudinary' }),
    };
  }

  let result;
  try {
    result = await response.json();
  } catch (error) {
    console.error('Respuesta inválida de Cloudinary', error);
    return {
      statusCode: 502,
      body: JSON.stringify({ error: 'Cloudinary respondió con un formato inesperado' }),
    };
  }

  if (!response.ok) {
    console.error('Cloudinary devolvió error', result);
    return {
      statusCode: response.status,
      body: JSON.stringify({ error: result?.error?.message ?? 'No se pudo eliminar la imagen' }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ result: result?.result ?? 'ok' }),
  };
};
