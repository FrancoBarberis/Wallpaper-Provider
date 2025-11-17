import { useState, useEffect, useMemo } from "react"
import Slider from "./Slider"

export default function Layout({ images }) {
    const initialImage = useMemo(() => images && images.length > 0 ? images[0] : null, [images]);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        if (initialImage) {
            setSelectedImage(initialImage);
        }
    }, [initialImage]);

    return (
        <div className="layout relative w-full h-screen">
            {selectedImage && (
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ 
                        backgroundImage: `url(${selectedImage.src?.landscape})`,
                        filter: 'brightness(0.7)'
                    }}
                />
            )}
            <div className="imageTexts absolute top-1/3 left-15 z-10">
                <p className="description text-white text-2xl font-semibold text-wrap max-w-sm">{selectedImage?.alt}</p>
            </div>
            
                <p className="photographer text-white text-lg absolute bottom-2 left-5">Photo by: {selectedImage?.photographer}</p>
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