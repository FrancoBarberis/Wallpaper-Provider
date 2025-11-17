import { useState } from "react";
import Card from "./Card";

export default function Slider({ images, onImageClick }) {
  const visibleSlides = 4;
  const [start, setStart] = useState(0);
  const end = start + visibleSlides;
  const canNext = end < images.length;
  const canPrev = start > 0;
  const [currentIndex, setCurrentIndex] = useState(1);

  const goPrev = () => {
    if (canPrev) {
      setStart(start - 1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goNext = () => {
    if (canNext) {
      setStart(start + 1);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleImageClick = (img, index) => {
    setCurrentIndex(index + 1);
    onImageClick(img);
  };

  return (
    <div className="slider absolute bottom-5 right-15 bg-transparent">
      {/* Imágenes visibles */}
      <div className="carousel flex flex-row gap-3 transition-all duration-300 ease-in-out mb-3 w-max">
        {images.slice(start, end).map((img, idx) => (
          <div
            key={img.id}
            onClick={() => handleImageClick(img, start + idx)}
            className="cursor-pointer"
          >
            <Card image={img} />
          </div>
        ))}
      </div>
      {/* Botones e índice*/}
      <div className="carousel-info flex flex-row align-center justify-between">
        <div className="prev-next-buttons flex gap-5 ml-5">
          <button
            onClick={goPrev}
            disabled={!canPrev}
            className="prev-button cursor-pointer border rounded-full disabled:opacity-50 px-3 py-1"
          >
            ◀
          </button>
          <button
            onClick={goNext}
            disabled={!canNext}
            className="next-button cursor-pointer border rounded-full disabled:opacity-50 px-3 py-1"
          >
            ▶
          </button>
        </div>
        <div className="index-display font-bold flex place-items-center mr-5 text-white">
          {currentIndex} /15
        </div>
      </div>
    </div>
  );
}
