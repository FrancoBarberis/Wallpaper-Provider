import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Slider from "./Slider";

export default function Layout({ images }) {
  const initialImage = useMemo(
    () => (images && images.length > 0 ? images[0] : null),
    [images]
  );
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (initialImage) {
      setSelectedImage(initialImage);
    }
  }, [initialImage]);


  return (
    <div className="layout relative w-full h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {selectedImage && (
          <motion.div
            key={selectedImage.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${selectedImage.src?.landscape})`,
              filter: "brightness(0.7)",
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
            className="imageTexts absolute top-1/3 left-15 z-10"
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
        <Slider images={images} onImageClick={setSelectedImage} />
      ) : (
        <div className="flex items-center justify-center h-full">
          <div>No images to display</div>
        </div>
      )}
    </div>
  );
}
