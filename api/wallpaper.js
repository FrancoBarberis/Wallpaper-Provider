
// api/wallpaper.js
export default async function handler(req, res) {
  // 1) Solo GET
  if (req.method && req.method.toUpperCase() !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // 2) Params
  const rawSearch = String(req.query?.search ?? 'famous landmarks').replace(/\+/g, ' ');
  const perPage = Number.parseInt(String(req.query?.per_page ?? '15'), 10);
  const page = Number.parseInt(String(req.query?.page ?? '1'), 10);

  // 3) Clamp
  const PER_PAGE_MIN = 1;
  const PER_PAGE_MAX = 80; // Pexels permite hasta 80
  const PAGE_MIN = 1;
  const safePerPage = Number.isFinite(perPage) ? Math.min(Math.max(perPage, PER_PAGE_MIN), PER_PAGE_MAX) : 15;
  const safePage = Number.isFinite(page) ? Math.max(page, PAGE_MIN) : 1;

  // 4) API key
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'API_KEY no configurada' });
  }

  // 5) URL correcta (usar & en lugar de &amp;)
  const upstream = `https://api.pexels.com/v1/search?query=${encodeURIComponent(rawSearch)}&per_page=${safePerPage}&page=${safePage}`;

  // 6) Timeout
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {

    console.log('Calling:', upstream);
    console.log('API_KEY length:', API_KEY?.length);

    const r = await fetch(upstream, {
      headers: {
        'Accept': 'application/json',
        'Authorization': API_KEY, // sin "Bearer"
      },
      signal: controller.signal,
      // cache: 'no-store' // descomenta si querés evitar cache local
    });

    clearTimeout(timeout);

    // 7) Status no OK → error claro
    if (!r.ok) {
      const text = await r.text().catch(() => '');
      const msg =
        r.status === 401 ? 'API key inválida o revocada.'
          : r.status === 403 ? 'Acceso denegado por Pexels.'
            : r.status === 429 ? 'Límite de peticiones alcanzado. Intenta más tarde.'
              : text || `Pexels API error: ${r.status}`;
      return res.status(r.status).json({ error: msg });
    }

    // 8) Content-Type JSON
    const ct = r.headers.get('content-type') ?? '';
    if (!ct.includes('application/json')) {
      const text = await r.text().catch(() => '');
      return res.status(502).json({ error: 'Upstream no devolvió JSON', preview: text.slice(0, 200) });
    }

    const json = await r.json();

    // 9) Cache del response al cliente
    res.setHeader('Cache-Control', 'private, max-age=0, no-cache');
    return res.status(200).json(json);
  } catch (error) {
    const msg = error?.name === 'AbortError'
      ? 'Timeout al consultar Pexels'
      : (error?.message ?? 'Error al obtener wallpaper');
    console.error('Error:', msg);
    return res.status(500).json({ error: msg });
  }
}
