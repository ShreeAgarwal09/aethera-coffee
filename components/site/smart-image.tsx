'use client';

import { useState, useEffect } from 'react';

type SmartImageProps = {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  onLoad?: () => void;
};

export function SmartImage({
  src,
  alt,
  className = '',
  containerClassName = '',
  priority = false,
  fill = false,
  onLoad,
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {!loaded && (
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-card via-accent to-card bg-[length:200%_100%]" />
      )}
      <img
        src={error ? '/images/hero/hero-main.jpg' : src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => {
          setLoaded(true);
          onLoad?.();
        }}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
        className={`${className} ${loaded ? 'loaded' : ''} transition-all duration-700`}
        style={fill ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } : undefined}
      />
    </div>
  );
}
