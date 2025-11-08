'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface HeroProps {
  showButton?: boolean;
  blur?: boolean;
}

const heroImages = [
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
];

export default function Hero({ showButton = true, blur = false }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Memoize background image URL to avoid recalculation
  const backgroundImage = useMemo(
    () => heroImages[currentSlide],
    [currentSlide]
  );

  const handleSlideChange = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Image */}
      <div
        className={`relative h-[600px] md:h-[700px] ${
          blur ? 'blur-sm scale-105' : ''
        }`}
      >
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        
        {/* Content */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full">
          <div className="text-center px-4 max-w-4xl mb-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg">
              Building Our Future, Together
            </h1>
            {showButton && (
              <Link
                href="/gallery"
                className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg"
              >
                Learn More About Our Projects
              </Link>
            )}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSlideChange(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentSlide === index
                    ? 'bg-primary w-8'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Background Images Slider */}
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
            style={{
              backgroundImage: `url('${backgroundImage}')`,
            }}
          />
        </div>
      </div>
    </section>
  );
}

