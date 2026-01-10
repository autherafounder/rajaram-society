'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { X } from 'lucide-react';

const galleryCategories = {
  old: {
    title: 'Old Building Photos',
    images: [
      '/images/old-building/nightimageofjaijawanchs2.jpeg',
      '/images/old-building/nightimageofjaijawanchs3.jpeg',
      '/images/old-building/daylightimageofjaijawanchs.jpeg',
      '/images/old-building/daylightiamgeofjaijawanchs2.jpeg',
      '/images/old-building/nightimageofjaijawanchs.jpeg',
    ],
  },
  new: {
    title: 'New Building Photos',
    images: [],
  },
  current: {
    title: 'Current Status Photos',
    images: [],
  },
};

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof galleryCategories>('old');

  const openLightbox = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            {/* Category Tabs */}
            <div className="flex justify-center gap-4 mb-8">
              {(Object.keys(galleryCategories) as Array<keyof typeof galleryCategories>).map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${selectedCategory === key
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  {galleryCategories[key].title}
                </button>
              ))}
            </div>

            {/* Gallery Grid */}
            {galleryCategories[selectedCategory].images.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryCategories[selectedCategory].images.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => openLightbox(image)}
                    className="relative h-64 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300 group"
                  >
                    <Image
                      src={image}
                      alt={`${galleryCategories[selectedCategory].title} ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-inner p-12 text-center border-2 border-dashed border-gray-200">
                <div className="max-w-md mx-auto">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Coming Soon</h3>
                  <p className="text-gray-600">
                    We are currently documenting the {galleryCategories[selectedCategory].title.toLowerCase()}.
                    Please check back later for updates.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative max-w-7xl max-h-full">
            <Image
              src={selectedImage}
              alt="Lightbox view"
              width={1200}
              height={800}
              className="object-contain max-h-[90vh] rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}

