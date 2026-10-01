import React, { useState } from 'react';
import { PawPrint } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackIcon?: React.ReactNode;
  fallbackText?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'Image',
  className = '',
  fallbackIcon,
  fallbackText,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
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
      src={src}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      loading="lazy"
      {...props}
    />
  );
};
