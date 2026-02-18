
import { useEffect, useState } from "react";
import Search from "./components/Search";
import Layout from "./components/Layout";

function App() {
  const [fetchedImages, setFetchedImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("famous landmarks");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const PAGE_SIZE = 15;

  useEffect(() => {
    // ✅ Construcción de URL robusta (sin &amp;)
    const u = new URL("/api/wallpaper", window.location.origin);
    u.searchParams.set("search", searchQuery);
    u.searchParams.set("per_page", String(PAGE_SIZE));
    u.searchParams.set("page", String(currentPage));

    // Debug: VER la URL exacta que se va a pedir
    console.log("[client] Request URL:", u.toString()); // debe mostrar ...&per_page=...&page=... (SIN &amp;)

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const res = await fetch(u.toString());

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`HTTP ${res.status} - ${text || "Request failed"}`);
        }

        const ct = res.headers.get("content-type") ?? "";
        if (!ct.includes("application/json")) {
          const text = await res.text().catch(() => "");
          console.error("Respuesta no JSON:", ct, text.slice(0, 200));
          throw new Error("La API no devolvió JSON");
        }

        const data = await res.json();
        if (cancelled) return;

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
      } catch (err) {
        console.error("Error en fetch:", err);
        setErrorMsg(String(err?.message || err));
        setFetchedImages([]);
        setHasNextPage(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchQuery, currentPage]);

  const handleSearch = (query) => {
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
    <div className="relative flex flex-col bg-black w-screen min-h-screen text-white">
      {errorMsg && <div className="p-4 text-red-400">Error: {errorMsg}</div>}

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
