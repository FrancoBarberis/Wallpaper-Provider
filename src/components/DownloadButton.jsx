import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DownloadButton({ selectedImage }) {
    const [showModal, setShowModal] = useState(false);

    const handleDownload = async (format, url) => {
        if (!selectedImage || !url) return;
        
        try {
            // Fetch the image and create a blob
            const response = await fetch(url);
            const blob = await response.blob();
            
            // Create a download link
            const link = document.createElement('a');
            const objectUrl = URL.createObjectURL(blob);
            link.href = objectUrl;
            link.download = `pexels-${selectedImage.id}-${format}-by-${selectedImage.photographer}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(objectUrl);
            
            setShowModal(false);
        } catch (error) {
            console.error('Error downloading image:', error);
        }
    };

    const formats = [
        { 
            name: 'Portrait', 
            url: selectedImage?.src?.portrait,
            ratio: 'aspect-[2/3]',
            label: '2:3'
        },
        { 
            name: 'Landscape', 
            url: selectedImage?.src?.landscape,
            ratio: 'aspect-[4/3]',
            label: '4:3'
        },
        { 
            name: 'Square', 
            url: selectedImage?.src?.large,
            ratio: 'aspect-square',
            label: '1:1'
        }
    ];

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="bg-black bg-opacity-30 backdrop-blur-md text-white p-3 rounded-full hover:bg-opacity-40 transition-all cursor-pointer focus:outline-none"
            >
                <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                </svg>
            </button>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="bg-gray-900 bg-opacity-90 backdrop-blur-md rounded-2xl p-8 max-w-2xl w-full mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                        <h2 className="text-white text-2xl font-bold mb-6 uppercase tracking-wider">
                            Select Format
                        </h2>
                        
                        <div className="grid grid-cols-3 gap-6 mb-6">
                            {formats.map((format) => (
                                <button
                                    key={format.name}
                                    onClick={() => handleDownload(format.name.toLowerCase(), format.url)}
                                    className="flex flex-col items-center gap-3 p-4 bg-black bg-opacity-40 rounded-xl hover:bg-opacity-60 transition-all cursor-pointer focus:outline-none group"
                                >
                                    <div className={`w-full ${format.ratio} bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg border-2 border-gray-500 group-hover:border-white transition-all`} />
                                    <div className="text-white font-semibold uppercase tracking-wide">
                                        {format.name}
                                    </div>
                                    <div className="text-gray-400 text-sm">
                                        {format.label}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowModal(false)}
                            className="w-full bg-gray-700 bg-opacity-50 text-white py-3 rounded-lg hover:bg-opacity-70 hover:bg-gray-600 transition-all font-semibold uppercase tracking-wider focus:outline-none cursor-pointer"
                        >
                            Cancel
                        </button>
                    </motion.div>
                </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
