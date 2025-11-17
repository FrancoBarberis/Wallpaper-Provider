import { useState,useContext } from "react"

export default function Card({image}) {
    if (!image || !image.src || !image.src.portrait) {
        console.log('Card: Invalid image data', image);
        return null;
    }
    
    console.log('Card: Rendering image', image.src.portrait);
    
    return(
        <div className="card flex items-center cursor-pointer justify-center  rounded-lg hover:scale-102 transition-all duration-300 ease-in-out overflow-hidden group">
            <img 
                className="object-cover h-[35vh] max-w-[140px]" 
                src={image.src.portrait} 
                alt={image.alt || 'Image'}
                onError={(e) => console.error('Error loading image:', e.target.src)}
                onLoad={() => console.log('Image loaded successfully:', image.src.portrait)}
            />
        </div>
    )
}