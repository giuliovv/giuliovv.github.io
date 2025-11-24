import { stops } from '../data/stops';
import { useStore } from '../store';
import { clsx } from 'clsx';
import { useState, useEffect } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';

export function Overlay() {
    // State to track which stop is active. 
    // In the future, this will be driven by the 3D scene (zustand or context).
    const activeStopIndex = useStore((state) => state.activeStopIndex);
    const activeStop = activeStopIndex !== null ? stops[activeStopIndex] : null;

    const isDesktop = useMediaQuery('(min-width: 768px)');
    const [isExpanded, setIsExpanded] = useState(true);

    // Update expanded state when active stop changes or screen size changes
    useEffect(() => {
        if (activeStop) {
            // On desktop, always expand. On mobile, start collapsed or expanded?
            // User said "fill all the space", so let's default to collapsed on mobile
            // to let them see the track, or expanded but easy to close.
            // Let's try defaulting to false on mobile to be safe and non-intrusive.
            setIsExpanded(isDesktop);
        }
    }, [activeStop, isDesktop]);

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        // If dragged down significantly (positive y) or with velocity
        if (info.offset.y > 100 || info.velocity.y > 500) {
            setIsExpanded(false);
        }
    };

    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-8">
            {/* Header */}
            <header className="pointer-events-auto">
                <h1 className="text-white text-xl md:text-2xl font-bold tracking-wider">GIULIO VACCARI</h1>
                <p className="text-cyan-400 text-xs md:text-sm uppercase tracking-widest">Life in Lap Times</p>
            </header>

            {/* Main Panel */}
            <div className={clsx(
                "absolute transition-all duration-500 ease-out pointer-events-auto",
                // Desktop positioning
                "md:top-1/2 md:right-0 md:-translate-y-1/2 md:w-full md:max-w-md md:p-8",
                // Mobile positioning (bottom sheet style or centered)
                "bottom-0 left-0 right-0 p-4 md:bottom-auto md:left-auto",
                activeStop ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-x-full md:translate-y-[-50%]"
            )}>
                <AnimatePresence>
                    {activeStop && (
                        <div className="flex flex-col items-end">
                            {/* Mobile Toggle Button */}
                            {!isDesktop && !isExpanded && (
                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    onClick={() => setIsExpanded(true)}
                                    className="mb-2 bg-black/80 backdrop-blur-md border border-cyan-500 text-cyan-500 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg"
                                >
                                    Show Details
                                </motion.button>
                            )}

                            {/* Card Content */}
                            {(isDesktop || isExpanded) && (
                                <motion.div
                                    initial={!isDesktop ? { y: "100%" } : { opacity: 0, x: 50 }}
                                    animate={!isDesktop ? { y: 0 } : { opacity: 1, x: 0 }}
                                    exit={!isDesktop ? { y: "100%" } : { opacity: 0, x: 50 }}
                                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                    drag={!isDesktop ? "y" : false}
                                    dragConstraints={{ top: 0 }}
                                    dragElastic={{ top: 0, bottom: 0.5 }}
                                    onDragEnd={handleDragEnd}
                                    className={clsx(
                                        "bg-black/80 backdrop-blur-md border-l-4 border-cyan-500 p-6 text-white shadow-2xl shadow-cyan-900/20 w-full",
                                        !isDesktop && "touch-none" // Prevent browser scrolling while dragging
                                    )}
                                >
                                    {/* Mobile Drag Handle */}
                                    {!isDesktop && (
                                        <div className="w-full flex justify-center mb-4 -mt-2">
                                            <div className="w-12 h-1.5 bg-gray-600 rounded-full opacity-50" />
                                        </div>
                                    )}

                                    <div className="flex items-baseline justify-between mb-2">
                                        <h2 className="text-2xl md:text-3xl font-bold italic">{activeStop.year}</h2>
                                        <span className="text-[10px] md:text-xs text-gray-400 uppercase tracking-widest">Checkpoint</span>
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-cyan-300 mb-4">{activeStop.title}</h3>
                                    <p className="text-sm md:text-base text-gray-300 mb-6 leading-relaxed">{activeStop.short}</p>

                                    <ul className="space-y-2 mb-6">
                                        {activeStop.details.map((detail, i) => (
                                            <li key={i} className="flex items-start text-xs md:text-sm text-gray-400">
                                                <span className="mr-2 text-cyan-500">›</span>
                                                {detail}
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="flex flex-wrap gap-2">
                                        {activeStop.tags.map(tag => (
                                            <span key={tag} className="text-[10px] md:text-xs border border-gray-700 px-2 py-1 rounded text-gray-500 uppercase">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer / Controls hint */}
            <footer className="text-white/50 text-xs pointer-events-auto hidden md:block">
                <p>WASD to drive • Scroll to accelerate</p>
            </footer>
        </div>
    );
}
