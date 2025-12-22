
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
  const PER_PAGE_MIN = 1, PER_PAGE_MAX = 80, PAGE_MIN = 1;
  const safePerPage = Number.isFinite(perPage) ? Math.min(Math.max(perPage, PER_PAGE_MIN), PER_PAGE_MAX) : 15;
  const safePage = Number.isFinite(page) ? Math.max(page, PAGE_MIN) : 1;

  // 4) API key
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'API_KEY no configurada' });
  }

  // 5) Construcción robusta del upstream (SIN entidades HTML)
  const url = new URL('https://api.pexels.com/v1/search');
  url.searchParams.set('query', rawSearch);
  url.searchParams.set('per_page', String(safePerPage));
  url.searchParams.set('page', String(safePage));
  const upstream = url.toString();

  // 6) Timeout con AbortController
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    // 🔎 Logs de diagnóstico: mostrás la query real (no usa &amp;)
    console.log('[wallpaper] QueryString:', url.searchParams.toString()); // e.g. query=famous%20landmarks&per_page=15&page=1
    console.log('[wallpaper] Upstream:', upstream);
    console.log('[wallpaper] API_KEY length:', API_KEY?.length);

    const r = await fetch(upstream, {
      headers: {
        Accept: 'application/json',
        Authorization: API_KEY, // ✅ Pexels NO usa "Bearer"
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    // 7) Status no OK → mensaje claro
    if (!r.ok) {
      const text = await r.text().catch(() => '');
      const msg =
        r.status === 401 ? 'API key inválida o revocada.'
        : r.status === 403 ? 'Acceso denegado por Pexels.'
        : r.status === 429 ? 'Límite de peticiones alcanzado. Intenta más tarde.'
        : text || `Pexels API error: ${r.status}`;
      console.error('[wallpaper] Upstream non-OK:', r.status, r.statusText, text.slice(0, 200));
      return res.status(r.status).json({ error: msg });
    }

    // 8) Content-Type JSON esperado
    const ct = r.headers.get('content-type') ?? '';
    if (!ct.includes('application/json')) {
      const text = await r.text().catch(() => '');
      console.error('[wallpaper] Unexpected content-type:', ct);
      return res.status(502).json({ error: 'Upstream no devolvió JSON', preview: text.slice(0, 200) });
    }

    const json = await r.json();

    // 9) Cache al cliente
    res.setHeader('Cache-Control', 'private, max-age=0, no-cache');
    return res.status(200).json(json);
  } catch (error) {
    clearTimeout(timeout);
    // 🧪 Diagnóstico completo (Undici/Node fetch)
    console.error('[wallpaper] Upstream fetch error:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
      upstream,
    });
    const msg = error?.name === 'AbortError'
      ? 'Timeout al consultar Pexels'
      : (error?.message ?? 'Error al obtener wallpaper');
    return res.status(500).json({ error: msg });
  }
}
