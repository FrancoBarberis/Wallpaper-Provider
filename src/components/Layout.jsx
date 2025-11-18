import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Slider from "./Slider";
import Search from "./Search";
import DownloadButton from "./DownloadButton";
import HideUIButton from "./HideUIButton";

export default function Layout({ images, onSearch, currentPage, hasNextPage, onNextPage, onPrevPage }) {
  const initialImage = useMemo(
    () => (images && images.length > 0 ? images[0] : null),
    [images]
  );
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isUIHidden, setIsUIHidden] = useState(false);
  const [sliderProgress, setSliderProgress] = useState(0);
  const [isProgressPaused, setIsProgressPaused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (initialImage) {
      setSelectedImage(initialImage);
    }
  }, [initialImage]);

  // Pausar progreso cuando se oculta UI o se abre modal
  useEffect(() => {
    setIsProgressPaused(isUIHidden || isModalOpen);
  }, [isUIHidden, isModalOpen]);

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
      {/* Barra de progreso superior - arriba de todo - siempre visible para evitar glitches */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-700 bg-opacity-20 z-30">
        <div 
          className="h-full bg-white transition-all duration-100 ease-linear"
          style={{ 
            width: `${sliderProgress}%`,
            opacity: isUIHidden ? 0 : 0.6
          }}
        />
      </div>
      
      {/* Download button - always visible */}
      <div className="download absolute top-4 sm:top-8 left-2 sm:left-4 lg:left-8 z-40">
        <DownloadButton selectedImage={selectedImage} onModalOpenChange={setIsModalOpen} />
      </div>

      {/* Hide/Show UI button - separated from download */}
      <div className="hide-show absolute top-4 sm:top-8 sm:left-16 lg:left-20 z-40">
        <HideUIButton isHidden={isUIHidden} onToggle={() => setIsUIHidden(!isUIHidden)} />
      </div>

      {/* Search bar */}
      <AnimatePresence>
        {!isUIHidden && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-4 sm:top-8 right-2 sm:right-4 lg:right-8 z-40"
          >
            <Search onSearch={onSearch} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {selectedImage && (
          <motion.div
            key={selectedImage.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 bg-no-repeat"
            style={{
              backgroundImage: `url(${selectedImage.src?.portrait})`,
              filter: "brightness(0.7)",
              backgroundPosition: "center top",
              backgroundSize: "cover",
            }}
          >
            {/* Imagen para desktop y tablet (landscape) */}
            <div 
              className="hidden md:block absolute inset-0"
              style={{
                backgroundImage: `url(${selectedImage.src?.landscape})`,
                backgroundPosition: "center top",
                backgroundSize: "cover",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {selectedImage && !isUIHidden && (
          <motion.div
            key={selectedImage.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.6 }}
            className="imageTexts absolute top-1/4 lg:top-1/3 left-2 sm:left-4 lg:left-15 z-10 px-2 sm:px-4 lg:px-0"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="description text-white text-lg sm:text-xl lg:text-3xl font-bold text-wrap max-w-[280px] sm:max-w-xs lg:max-w-lg uppercase tracking-wide"
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
              className="photographer text-white text-sm sm:text-base lg:text-xl z-10 mt-2 lg:mt-3 font-semibold uppercase tracking-wider max-w-[280px] sm:max-w-xs lg:max-w-lg"
              style={{
                textShadow: '2px 2px 6px rgba(0, 0, 0, 0.9), 0 0 15px rgba(0, 0, 0, 0.6)'
              }}
            >
              PHOTO BY: {selectedImage?.photographer}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {images && images.length > 0 && !isUIHidden && (
          <motion.div
            key={images[0]?.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Controles de paginación - arriba del slider en mobile/tablet, abajo en desktop */}
            <div className="absolute bottom-52 sm:bottom-60 lg:bottom-5 left-1/2 lg:left-4 transform -translate-x-1/2 lg:translate-x-0 z-40 flex items-center gap-2 sm:gap-3">
            <button
              onClick={onPrevPage}
              disabled={currentPage === 1}
              className="bg-black bg-opacity-30 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-opacity-40 transition-all focus:outline-none backdrop-blur-md disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="Previous page"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div 
              className="font-extrabold text-white text-base sm:text-lg uppercase tracking-tight px-3 sm:px-4 py-1 bg-black bg-opacity-30 rounded-full backdrop-blur-md cursor-default"
              style={{ 
                textShadow: '3px 3px 8px rgba(0, 0, 0, 0.9), 0 0 20px rgba(0, 0, 0, 0.7)'
              }}
            >
              Page {currentPage}
            </div>
            
            <button
              onClick={onNextPage}
              disabled={!hasNextPage}
              className="bg-black bg-opacity-30 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-opacity-40 transition-all focus:outline-none backdrop-blur-md disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="Next page"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
            
            <Slider images={images} onImageClick={handleImageClick} onProgressChange={setSliderProgress} isPaused={isProgressPaused} />
          </motion.div>
        )}
      </AnimatePresence>

      {images && images.length > 0 && isUIHidden && (
        <div className="flex items-center justify-center h-full">
          {/* Espacio vacío cuando UI está oculta */}
        </div>
      )}

      {(!images || images.length === 0) && (
        <div className="flex items-center justify-center h-full">
          <div>No images to display</div>
        </div>
      )}
    </div>
  );
}
