import { createContext, useCallback, useContext, useMemo, useRef } from 'react';

type CacheContextValue = {
    getCachedUrl: (src: string) => string | undefined;
    getOrCreateInflight: (src: string, factory: () => Promise<string>) => Promise<string>;
    setResolvedUrl: (src: string, url: string) => void;
};

const RenderImageCacheContext = createContext<CacheContextValue | null>(null);

export function RenderImageCacheProvider({ children }: { children: React.ReactNode }) {
    const resolvedUrlsRef = useRef<Map<string, string>>(new Map());
    const inflightRef = useRef<Map<string, Promise<string>>>(new Map());

    const getCachedUrl = useCallback((src: string) => resolvedUrlsRef.current.get(src), []);

    const setResolvedUrl = useCallback((src: string, url: string) => {
        resolvedUrlsRef.current.set(src, url);
    }, []);

    const getOrCreateInflight = useCallback((src: string, factory: () => Promise<string>) => {
        const existing = inflightRef.current.get(src);
        if (existing) {
            return existing;
        }
        const promise = factory()
            .then((url) => {
                resolvedUrlsRef.current.set(src, url);
                inflightRef.current.delete(src);
                return url;
            })
            .catch((error) => {
                inflightRef.current.delete(src);
                throw error;
            });
        inflightRef.current.set(src, promise);
        return promise;
    }, []);

    const value = useMemo(
        () => ({
            getCachedUrl,
            getOrCreateInflight,
            setResolvedUrl,
        }),
        [getCachedUrl, getOrCreateInflight, setResolvedUrl],
    );

    return <RenderImageCacheContext.Provider value={value}>{children}</RenderImageCacheContext.Provider>;
}

export function useRenderImageCache() {
    const context = useContext(RenderImageCacheContext);
    if (!context) {
        throw new Error('useRenderImageCache must be used within RenderImageCacheProvider');
    }
    return context;
}
