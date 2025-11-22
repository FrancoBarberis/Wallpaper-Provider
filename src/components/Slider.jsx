import { useState, useRef, useEffect } from "react";
import Card from "./Card";

export default function Slider({ images, onImageClick, onProgressChange, isPaused }) {
  const visibleSlides = window.innerWidth < 768 ? 3 : 4;
  const cardWidth = window.innerWidth < 768 ? 120 : 140;
  const gap = 12;
  const [start, setStart] = useState(0);
  const maxStart = Math.max(0, images.length - visibleSlides);
  const canNext = start < maxStart;
  const canPrev = start > 0;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const isChangingImageRef = useRef(false);
  
  // Resetear el start cuando cambian las imágenes (nueva página)
  useEffect(() => {
    setStart(0);
    setCurrentImageIndex(0);
    setProgress(0);
    progressRef.current = 0;
    // Ya no llamamos a onImageClick aquí
  }, [images]);
    // Llamar a onImageClick solo cuando cambia el índice actual
    useEffect(() => {
      if (images && images.length > 0 && typeof onImageClick === 'function') {
        onImageClick(images[currentImageIndex]);
      }
    }, [currentImageIndex, images, onImageClick]);
  
  // Sincronizar progressRef cuando cambia isPaused
  useEffect(() => {
    // Sincronizar el ref con el estado actual cuando se reanuda
    progressRef.current = progress;
  }, [isPaused, progress]);
  
  // Auto-scroll con barra de progreso
  useEffect(() => {
    if (isPaused) {
      // Si está pausado, no iniciar el timer pero mantener el progreso actual
      return;
    }
    
    const autoScrollInterval = 5000; // 5 segundos
    const updateInterval = 50; // actualizar cada 50ms
    const increment = (updateInterval / autoScrollInterval) * 100;
    
    const progressTimer = setInterval(() => {
      // Evitar ejecutar si ya estamos cambiando imagen
      if (isChangingImageRef.current) {
        return;
      }
      
      progressRef.current += increment;
      
      if (progressRef.current >= 100) {
        // Marcar que estamos cambiando imagen
        isChangingImageRef.current = true;
        
        setCurrentImageIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % images.length;
          
          // Si volvimos al inicio (índice 0), resetear el slider
          if (nextIndex === 0) {
            setStart(0);
          } else {
            // Calcular si necesita avanzar el slider
            setStart(currentStart => {
              const shouldScroll = nextIndex >= currentStart + visibleSlides;
              if (shouldScroll && currentStart < maxStart) {
                return currentStart + 1;
              }
              return currentStart;
            });
          }
          
          // Cambiar la imagen seleccionada
          if (images[nextIndex]) {
            onImageClick(images[nextIndex]);
          }
          
          return nextIndex;
        });
        
        // Resetear progreso después de cambiar imagen
        progressRef.current = 0;
        setProgress(0);
        if (onProgressChange) {
          onProgressChange(0);
        }
        
        // Desmarcar después de un pequeño delay
        setTimeout(() => {
          isChangingImageRef.current = false;
        }, 100);
      } else {
        setProgress(progressRef.current);
        if (onProgressChange) {
          onProgressChange(progressRef.current);
        }
      }
    }, updateInterval);
    
    return () => {
      clearInterval(progressTimer);
    };
  }, [isPaused, visibleSlides, maxStart, images, onImageClick, onProgressChange]);
  
  // Estados para drag
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  const carouselRef = useRef(null);
  const dragThreshold = 5; // Píxeles mínimos para considerar como drag

  const containerWidth = (cardWidth * visibleSlides) + (gap * (visibleSlides - 1));
  const slideDistance = cardWidth + gap;

  const goPrev = () => {
    if (canPrev) {
      setStart(start - 1);
    }
  };

  const goNext = () => {
    if (canNext) {
      setStart(start + 1);
    }
  };

  const handleImageClick = (img, index) => {
    if (!hasMoved) {
      setCurrentImageIndex(index);
      // Resetear progreso cuando el usuario selecciona manualmente una imagen
      progressRef.current = 0;
      setProgress(0);
      if (onProgressChange) {
        onProgressChange(0);
      }
      onImageClick(img);
    }
  };

  // Funciones de drag
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(start * slideDistance);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const x = e.pageX - carouselRef.current.offsetLeft;
    const distance = Math.abs(x - startX);
    
    // Solo marcar como drag si se movió más del umbral
    if (distance > dragThreshold) {
      setHasMoved(true);
      e.preventDefault();
      const walk = (startX - x);
      const newScroll = scrollLeft + walk;
      const newStart = Math.round(newScroll / slideDistance);
      setStart(Math.max(0, Math.min(maxStart, newStart)));
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      // Reset hasMoved después de un pequeño delay para permitir el click
      setTimeout(() => setHasMoved(false), 10);
    }
  };

  // Funciones de touch
  const handleTouchStart = (e) => {
    e.stopPropagation();
    const touch = e.touches[0];
    setIsDragging(true);
    setHasMoved(false);
    setStartX(touch.clientX - carouselRef.current.offsetLeft);
    setScrollLeft(start * slideDistance);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    e.stopPropagation();
    const touch = e.touches[0];
    const x = touch.clientX - carouselRef.current.offsetLeft;
    const distance = Math.abs(x - startX);
    
    if (distance > dragThreshold) {
      setHasMoved(true);
      e.preventDefault();
      const walk = (startX - x);
      const newScroll = scrollLeft + walk;
      const newStart = Math.round(newScroll / slideDistance);
      setStart(Math.max(0, Math.min(maxStart, newStart)));
    }
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      setTimeout(() => setHasMoved(false), 10);
    }
  };

  // Agregar listeners globales para mouse up/move
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, start, startX, scrollLeft, hasMoved]);

  // Agregar listener para wheel en el contenedor
  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    const wheelHandler = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        e.stopPropagation();
        
        const scrollAmount = e.deltaX;
        const newScroll = (start * slideDistance) + scrollAmount;
        const newStart = Math.round(newScroll / slideDistance);
        const clampedStart = Math.max(0, Math.min(maxStart, newStart));
        
        if (clampedStart !== start) {
          setStart(clampedStart);
        }
      }
    };

    container.addEventListener('wheel', wheelHandler, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', wheelHandler);
    };
  }, [start, slideDistance, maxStart]);

  return (
    <div className="slider absolute bottom-5 left-1/2 md:left-auto md:right-15 transform -translate-x-1/2 md:translate-x-0 bg-transparent">
      {/* Barra de progreso de auto-scroll */}
      <div className="w-full h-1 bg-gray-700 bg-opacity-30 rounded-full mb-2 overflow-hidden">
        <div 
          className="h-full bg-white bg-opacity-70 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Imágenes visibles */}
      <div 
        ref={carouselRef}
        className="carousel-container overflow-hidden mb-3 cursor-grab active:cursor-grabbing select-none"
        style={{ width: `${containerWidth}px`, touchAction: 'none' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div 
          className="carousel flex flex-row gap-3 transition-transform duration-500 ease-in-out"
          style={{ 
            transform: `translateX(-${start * slideDistance}px)`,
            pointerEvents: hasMoved ? 'none' : 'auto'
          }}
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
            className="prev-button cursor-pointer bg-black bg-opacity-30 rounded-full disabled:opacity-30 w-10 h-10 flex items-center justify-center hover:bg-opacity-40 transition-all focus:outline-none backdrop-blur-md"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="10" y1="3" x2="6" y2="8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="6" y1="8" x2="10" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <button
            onClick={goNext}
            disabled={!canNext}
            className="next-button cursor-pointer bg-black bg-opacity-30 rounded-full disabled:opacity-30 w-10 h-10 flex items-center justify-center hover:bg-opacity-40 transition-all focus:outline-none backdrop-blur-md"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="6" y1="3" x2="10" y2="8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="10" y1="8" x2="6" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div 
          className="index-display font-extrabold flex place-items-center mr-5 text-white text-2xl uppercase tracking-tight" 
          style={{ 
            letterSpacing: '0.05em', 
            lineHeight: '1.2',
            textShadow: '3px 3px 8px rgba(0, 0, 0, 0.9), 0 0 20px rgba(0, 0, 0, 0.7)'
          }}
        >
          {currentImageIndex + 1}/{images.length}
        </div>
      </div>
    </div>
  );
}
