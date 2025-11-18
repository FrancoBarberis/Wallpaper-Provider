import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('API de Wallpapers funcionando');
});

// Ruta actualizada para usar la API de Pexels con paginación
app.get('/api/wallpaper', async (req, res) => {
    try {
        const search = req.query.search || "famous+landmarks";
        const perPage = req.query.per_page || 15;
        const page = req.query.page || 1;
        
        const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(search)}&per_page=${perPage}&page=${page}`, {
            headers: {
                'Authorization': process.env.API_KEY
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener wallpapers' });
    }
});

app.listen(PORT, () => {
    console.log(`✅ API corriendo en http://localhost:${PORT}`);
});