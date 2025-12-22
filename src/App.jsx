
import { useEffect, useState } from "react";
import Search from "./components/Search";
import Layout from "./components/Layout";

function App() {
  const [fetchedImages, setFetchedImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("famous landmarks"); // mejor sin '+'
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const PAGE_SIZE = 15;

  useEffect(() => {
    // Construcción segura de la query (evita '&amp;')
    const params = new URLSearchParams({
      search: searchQuery,           // URLSearchParams se encarga del encoding
      per_page: String(PAGE_SIZE),
      page: String(currentPage),
    });

    const url = `/api/wallpaper?${params.toString()}`;

    // Control de cancelación para evitar setState tras un re-render
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(url);

        // Validación de status HTTP
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`HTTP ${res.status} - ${text || "Request failed"}`);
        }

        // Validación de Content-Type
        const ct = res.headers.get("content-type") ?? "";
        if (!ct.includes("application/json")) {
          const text = await res.text().catch(() => "");
          console.error("Respuesta no JSON:", ct, text.slice(0, 200));
          throw new Error("La API no devolvió JSON");
        }

        // Parseo
        const data = await res.json();
        if (cancelled) return;

        // Estructura esperada de Pexels: data.photos (array)
        if (data.photos && Array.isArray(data.photos)) {
          const formattedImages = data.photos.map((photo) => ({
            id: photo.id,
            src: {
              portrait: photo.src?.portrait,
              landscape: photo.src?.landscape,
              large: photo.src?.large2x,
            },
            alt: photo.alt || "Famous landmark",
            photographer: photo.photographer,
            // Pexels a veces pone "City, Country" en alt; tomo solo antes de la coma
            location: photo.alt?.split(",")[0] || "Famous Place",
          }));

          setFetchedImages(formattedImages);

          // Calcular si hay siguiente página
          const nextPageExists =
            (typeof data.total_results === "number" &&
              currentPage * PAGE_SIZE < data.total_results) ||
            Boolean(data.next_page);

          setHasNextPage(nextPageExists);
        } else {
          console.error("Invalid API response:", data);
          setFetchedImages([]);
          setHasNextPage(false);
        }
      } catch (error) {
        // Importante: mostrar el error que devuelve la serverless para debug
        console.error("Error:", error);
        setFetchedImages([]);
        setHasNextPage(false);
      }
    })();

    // Cleanup del efecto
    return () => {
      cancelled = true;
    };
  }, [searchQuery, currentPage]);

  // Handlers de búsqueda y paginación
  const handleSearch = (query) => {
    // encodeURIComponent no es necesario; URLSearchParams lo hace
    setSearchQuery(String(query).trim());
    setCurrentPage(1); // reset paginación al buscar
  };

  const handleNextPage = () => {
    if (hasNextPage) setCurrentPage((p) => p + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((p) => Math.max(1, p - 1));
  };

  return (
    <div className="relative flex flex-col bg-black w-screen min-h-screen">
      <Layout
        images={fetchedImages}
        onSearch={handleSearch}
        currentPage={currentPage}
        hasNextPage={hasNextPage}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
      />
    </div>
  );
}

export default App;
