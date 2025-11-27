export default async function handler(req, res) {
  const { search = "famous+landmarks", per_page = 15, page = 1 } = req.query;
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'API_KEY no configurada' });
  }

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(search)}&per_page=${per_page}&page=${page}`,
      {
        headers: {
          Authorization: API_KEY
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message || 'Error al obtener wallpaper' });
  }
}