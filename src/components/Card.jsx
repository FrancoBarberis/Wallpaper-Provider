import { useState,useContext } from "react"

export default function Card({image}) {
    if (!image || !image.src || !image.src.portrait) {
        return null;
    }
    
    return(
        <div className="card w-[140px] flex items-center brightness-75 cursor-pointer justify-center rounded-lg hover:brightness-100 hover:scale-102 transition-all duration-300 ease-in-out overflow-hidden group" style={{boxShadow: '5px 10px 8px rgba(0, 0, 0, 0.3)'}}>
            <img 
                className="object-cover h-[35vh] w-full" 
                src={image.src.portrait} 
                alt={image.alt || 'Image'}
            />
        </div>
    )
}