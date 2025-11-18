import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Slider from "./Slider";
import Search from "./Search";
import DownloadButton from "./DownloadButton";

export default function Layout({ images, onSearch, currentPage, hasNextPage, onNextPage, onPrevPage }) {
  const initialImage = useMemo(
    () => (images && images.length > 0 ? images[0] : null),
    [images]
  );
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (initialImage) {
      setSelectedImage(initialImage);
    }
  }, [initialImage]);

  // Precargar imagen cuando se selecciona
  useEffect(() => {
    if (selectedImage?.src?.landscape) {
      setImageLoaded(false);
      const img = new Image();
      img.src = selectedImage.src.landscape;
      img.onload = () => setImageLoaded(true);
    }
  }, [selectedImage]);

  const handleImageClick = (img) => {
    setSelectedImage(img);
  };


  return (
    <div className="layout relative w-full h-screen overflow-hidden select-none">
      {/* Download button */}
      <div className="absolute top-8 left-8 z-20">
        <DownloadButton selectedImage={selectedImage} />
      </div>

      {/* Search bar */}
      <div className="absolute top-8 right-8 z-20">
        <Search onSearch={onSearch} />
      </div>

      <AnimatePresence mode="wait">
        {selectedImage && (
          <motion.div
            key={selectedImage.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url(${selectedImage.src?.landscape})`,
              filter: "brightness(0.7)",
              backgroundPosition: "center 35%",
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {selectedImage && (
          <motion.div
            key={selectedImage.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.6 }}
            className="imageTexts absolute top-1/3 left-15 z-10 "
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="description text-white text-3xl font-bold text-wrap max-w-lg uppercase tracking-wide"
              style={{
                textShadow: '3px 3px 8px rgba(0, 0, 0, 0.9), 0 0 20px rgba(0, 0, 0, 0.7)',
                letterSpacing: '0.05em'
              }}
            >
              {selectedImage?.alt}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="photographer text-white text-xl z-10 mt-3 font-semibold uppercase tracking-wider max-w-lg"
              style={{
                textShadow: '2px 2px 6px rgba(0, 0, 0, 0.9), 0 0 15px rgba(0, 0, 0, 0.6)'
              }}
            >
              PHOTO BY: {selectedImage?.photographer}
            </motion.p>

            {selectedImage?.location && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="location text-white text-lg z-10 mt-2 font-medium uppercase tracking-wide max-w-lg"
                style={{
                  textShadow: '2px 2px 6px rgba(0, 0, 0, 0.9), 0 0 15px rgba(0, 0, 0, 0.6)'
                }}
              >
                {selectedImage.location}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {images && images.length > 0 ? (
        <>
          <Slider key={images[0]?.id} images={images} onImageClick={handleImageClick} />
          
          {/* Controles de paginación */}
          <div className="absolute bottom-5 left-8 z-20 flex items-center gap-3">
            <button
              onClick={onPrevPage}
              disabled={currentPage === 1}
              className="bg-black bg-opacity-30 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-40 transition-all focus:outline-none backdrop-blur-md disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="Previous page"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div 
              className="font-extrabold text-white text-lg uppercase tracking-tight px-4 py-1 bg-black bg-opacity-30 rounded-full backdrop-blur-md cursor-default"
              style={{ 
                textShadow: '3px 3px 8px rgba(0, 0, 0, 0.9), 0 0 20px rgba(0, 0, 0, 0.7)'
              }}
            >
              Page {currentPage}
            </div>
            
            <button
              onClick={onNextPage}
              disabled={!hasNextPage}
              className="bg-black bg-opacity-30 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-40 transition-all focus:outline-none backdrop-blur-md disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="Next page"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div>No images to display</div>
        </div>
      )}
    </div>
  );
}
