import { useEffect, useState } from "react";
import Search from "./components/Search";
import Layout from "./components/Layout";

function App() {
  const [fetchedImages, setFetchedImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("famous+landmarks");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  

  //FETCH A RUTA RELATIVA PARA EVITAR CONFLICTO DE HTTP VS HTTPS
  useEffect(() => {
    fetch(
      `/api/wallpaper?search=${searchQuery}&per_page=15&page=${currentPage}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.photos && Array.isArray(data.photos)) {
          const formattedImages = data.photos.map(photo => ({
            id: photo.id,
            src: {
              portrait: photo.src.portrait,
              landscape: photo.src.landscape,
              large: photo.src.large2x
            },
            alt: photo.alt || "Famous landmark",
            photographer: photo.photographer,
            location: photo.alt?.split(',')[0] || "Famous Place"
          }));
          setFetchedImages(formattedImages);
          setHasNextPage(data.total_results > (currentPage * 15));
        } else {
          console.error("Invalid API response:", data);
        }
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  }, [searchQuery, currentPage]);

  const handleSearch = (query) => {
    setSearchQuery(query.replace(/\s+/g, '+'));
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
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
