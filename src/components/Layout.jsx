import { useState } from "react"
import Slider from "./Slider"

export default function Layout({ images }) {
    const [selectedImage, setSelectedImage] = useState(null);

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