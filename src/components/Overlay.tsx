import { stops } from '../data/stops';
import { useStore } from '../store';
import { clsx } from 'clsx';

export function Overlay() {
    // State to track which stop is active. 
    // In the future, this will be driven by the 3D scene (zustand or context).
    const activeStopIndex = useStore((state) => state.activeStopIndex);

    const activeStop = activeStopIndex !== null ? stops[activeStopIndex] : null;

    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8">
            {/* Header */}
            <header className="pointer-events-auto">
                <h1 className="text-white text-2xl font-bold tracking-wider">GIULIO VACCARI</h1>
                <p className="text-cyan-400 text-sm uppercase tracking-widest">Life in Lap Times</p>
            </header>

            {/* Main Panel */}
            <div className={clsx(
                "absolute top-1/2 right-0 -translate-y-1/2 w-full max-w-md p-8 transition-transform duration-500 ease-out pointer-events-auto",
                activeStop ? "translate-x-0" : "translate-x-full"
            )}>
                {activeStop && (
                    <div className="bg-black/80 backdrop-blur-md border-l-4 border-cyan-500 p-6 text-white shadow-2xl shadow-cyan-900/20">
                        <div className="flex items-baseline justify-between mb-2">
                            <h2 className="text-3xl font-bold italic">{activeStop.year}</h2>
                            <span className="text-xs text-gray-400 uppercase tracking-widest">Checkpoint</span>
                        </div>
                        <h3 className="text-xl font-bold text-cyan-300 mb-4">{activeStop.title}</h3>
                        <p className="text-gray-300 mb-6 leading-relaxed">{activeStop.short}</p>

                        <ul className="space-y-2 mb-6">
                            {activeStop.details.map((detail, i) => (
                                <li key={i} className="flex items-start text-sm text-gray-400">
                                    <span className="mr-2 text-cyan-500">›</span>
                                    {detail}
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-wrap gap-2">
                            {activeStop.tags.map(tag => (
                                <span key={tag} className="text-xs border border-gray-700 px-2 py-1 rounded text-gray-500 uppercase">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer / Controls hint */}
            <footer className="text-white/50 text-xs pointer-events-auto">
                <p>WASD to drive • Scroll to accelerate</p>
            </footer>
        </div>
    );
}
