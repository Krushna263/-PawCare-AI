import React, { useState, useEffect } from 'react';
import { PawPrint } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  fallbackIcon?: React.ReactNode;
  fallbackText?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  fallbackSrc,
  alt = 'Image',
  className = '',
  fallbackIcon,
  fallbackText,
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(() => {
    if (!src) return fallbackSrc;
    // Normalize any accidental `/src/assets/` to public `/assets/` or fallback
    if (src.startsWith('/src/assets/')) {
      return src.replace('/src/assets/', '/assets/');
    }
    return src;
  });
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) {
      setCurrentSrc(fallbackSrc);
      setHasError(!fallbackSrc);
    } else if (src.startsWith('/src/assets/')) {
      setCurrentSrc(src.replace('/src/assets/', '/assets/'));
      setHasError(false);
    } else {
      setCurrentSrc(src);
      setHasError(false);
    }
  }, [src, fallbackSrc]);

  const handleError = () => {
    // If primary src failed and we have a fallbackSrc, try fallbackSrc first!
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setHasError(true);
    }
  };

  if (hasError || !currentSrc) {
    return (
      <div 
        className={`flex flex-col items-center justify-center bg-stone-100 text-stone-500 overflow-hidden select-none ${className}`}
        aria-label={alt}
      >
        <div className="flex items-center justify-center p-3 text-stone-400">
          {fallbackIcon || <PawPrint className="w-8 h-8 opacity-60 stroke-[1.5]" />}
        </div>
        {fallbackText && (
          <span className="text-xs font-medium text-stone-600 px-2 text-center truncate max-w-full">
            {fallbackText}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={handleError}
      loading="lazy"
      {...props}
    />
  );
};

