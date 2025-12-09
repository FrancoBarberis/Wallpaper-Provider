
import { useEffect, useState } from "react";
import Search from "./components/Search";
import Layout from "./components/Layout";

function App() {
  const [fetchedImages, setFetchedImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("famous landmarks"); // mejor sin '+'
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    // Normaliza la query y arma la URL con & (no &amp;)
    const q = encodeURIComponent(searchQuery);
    const url = `/api/wallpaper?search=${q}&per_page=15&page=${currentPage}`;

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(url);

        // 1) Validar status HTTP
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`HTTP ${res.status} - ${text || "Request failed"}`);
        }

        // 2) Validar Content-Type
        const ct = res.headers.get("content-type") ?? "";
        if (!ct.includes("application/json")) {
          const text = await res.text().catch(() => "");
          console.error("Respuesta no JSON:", ct, text.slice(0, 200));
          throw new Error("La API no devolvió JSON");
        }

        // 3) Parsear JSON
        const data = await res.json();
        if (cancelled) return;

        // 4) Validar estructura esperada
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
            location: photo.alt?.split(",")[0] || "Famous Place",
          }));
          setFetchedImages(formattedImages);

          // Pexels suele devolver total_results y next_page
          const pageSize = 15;
          const nextPageExists =
            (typeof data.total_results === "number" &&
              currentPage * pageSize < data.total_results) ||
            Boolean(data.next_page);
          setHasNextPage(nextPageExists);
        } else {
          console.error("Invalid API response:", data);
          setFetchedImages([]);
          setHasNextPage(false);
        }
      } catch (error) {
        console.error("Error:", error);
        setFetchedImages([]);
        setHasNextPage(false);
      }
    })();

    // cleanup por si el efecto se re-ejecuta
    return () => {
      cancelled = true;
    };
  }, [searchQuery, currentPage]);

  const handleSearch = (query) => {
    // Podés seguir usando '+' si querés, pero encodeURIComponent ya se encarga
    setSearchQuery(String(query).trim());
    setCurrentPage(1);
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
