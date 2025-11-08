import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';

// Dynamically import heavy components to reduce initial bundle size
const ProjectsCarousel = dynamic(() => import('@/components/ProjectsCarousel'), {
  ssr: true,
});

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <Hero />
        <ProjectsCarousel />
        
        {/* Informational Text Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
              About Our Mission
            </h2>
            <p className="text-lg text-gray-600 text-center leading-relaxed">
              We are committed to building sustainable communities through innovative
              construction and real estate development. Our mission is to create
              living spaces that blend modern architecture with environmental
              consciousness, ensuring a better future for generations to come.
            </p>
            <p className="text-lg text-gray-600 text-center leading-relaxed mt-6">
              With years of experience in the construction industry, we pride
              ourselves on transparency, quality craftsmanship, and customer
              satisfaction. Every project we undertake is a step toward building
              our future together.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

