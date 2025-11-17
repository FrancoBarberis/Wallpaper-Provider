import { useState } from "react";
import Card from "./Card";

export default function Slider({ images, onImageClick }) {
  const visibleSlides = 4;
  const cardWidth = 140;
  const gap = 12;
  const [start, setStart] = useState(0);
  const maxStart = Math.max(0, images.length - visibleSlides);
  const canNext = start < maxStart;
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

  const containerWidth = (cardWidth * visibleSlides) + (gap * (visibleSlides - 1));
  const slideDistance = cardWidth + gap;

  return (
    <div className="slider absolute bottom-5 right-15 bg-transparent">
      {/* Imágenes visibles */}
      <div className="carousel-container overflow-hidden mb-3" style={{ width: `${containerWidth}px` }}>
        <div 
          className="carousel flex flex-row gap-3 transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${start * slideDistance}px)` }}
        >
          {images.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => handleImageClick(img, idx)}
              className="cursor-pointer shrink-0"
            >
              <Card image={img} />
            </div>
          ))}
        </div>
      </div>
      {/* Botones e índice*/}
      <div className="carousel-info flex flex-row align-center justify-between">
        <div className="prev-next-buttons flex gap-5 ml-5">
          <button
            onClick={goPrev}
            disabled={!canPrev}
            className="prev-button cursor-pointer border-2 border-white rounded-full disabled:opacity-30 w-10 h-10 flex items-center justify-center hover:bg-white hover:bg-opacity-10 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="10" y1="3" x2="6" y2="8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="6" y1="8" x2="10" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <button
            onClick={goNext}
            disabled={!canNext}
            className="next-button cursor-pointer border-2 border-white rounded-full disabled:opacity-30 w-10 h-10 flex items-center justify-center hover:bg-white hover:bg-opacity-10 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="6" y1="3" x2="10" y2="8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="10" y1="8" x2="6" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="index-display font-bold flex place-items-center mr-5 text-white">
          {currentIndex} /{images.length}
        </div>
      </div>
    </div>
  );
}
