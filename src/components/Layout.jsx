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

  const formatPhotographerName = (name) => {
    if (!name) return "";
    return name
      .toLowerCase()
      .split(" ")
      .map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  };

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
              className="description text-white text-2xl font-semibold text-wrap max-w-sm"
            >
              {selectedImage?.alt}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="photographer text-white text-lg z-10 mt-2"
            >
              Photo by: {formatPhotographerName(selectedImage?.photographer)}
            </motion.p>
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
