import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
    // Initialize with the actual media query result if on client-side
    const [matches, setMatches] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia(query).matches;
        }
        return false;
    });

    useEffect(() => {
        // Check if window is defined (client-side)
        if (typeof window === 'undefined') {
            return;
        }

        const media = window.matchMedia(query);

        // Set initial value (in case it changed since mount)
        setMatches(media.matches);

        // Create event listener
        const listener = (e: MediaQueryListEvent) => setMatches(e.matches);

        // Add listener
        media.addEventListener('change', listener);

        // Cleanup
        return () => media.removeEventListener('change', listener);
    }, [query]);

    return matches;
}
