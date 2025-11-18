import { useState } from "react"

export default function Card({image}) {
    const [isLoading, setIsLoading] = useState(true);
    
    if (!image || !image.src || !image.src.portrait) {
        return null;
    }
    
    return(
        <div
            className="card relative w-[100px] sm:w-[120px] lg:w-[140px] h-[100px] sm:h-[120px] lg:h-[35vh] flex items-center brightness-75 cursor-pointer justify-center rounded-lg hover:brightness-100 hover:scale-[1.02] transition-all duration-300 ease-in-out overflow-hidden group bg-gray-800"
            style={{boxShadow: '5px 10px 8px rgba(0, 0, 0, 0.3)'}}
            tabIndex={-1}
        >
            {/* Spinner de carga */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-300">
                    <div className="w-8 h-8 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
                </div>
            )}
            
            <img 
                className={`object-cover h-full w-full pointer-events-none select-none ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                src={window.innerWidth < 1024 ? image.src.large : image.src.portrait}
                alt={image.alt || 'Image'}
                draggable="false"
                onLoad={() => setIsLoading(false)}
            />
        </div>
    )
}