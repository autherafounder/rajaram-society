'use client';

import { useState, useMemo, useCallback } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Mail, Calendar, Tag } from 'lucide-react';

const newsArticles = [
  {
    id: 1,
    title: 'Phase 2 Construction Ahead of Schedule',
    summary:
      'Exciting news! Phase 2 of our redevelopment project is progressing ahead of schedule. We are pleased to announce significant milestones achieved...',
    date: 'March 15, 2024',
    category: 'Construction',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    title: 'New Local Businesses Open Commercial Tower',
    summary:
      'We are thrilled to welcome several new businesses to our commercial tower. This marks an important milestone in creating a vibrant community space...',
    date: 'March 10, 2024',
    category: 'Community',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    title: 'Community Workshop on Sustainable Living',
    summary:
      'Join us for an informative workshop on sustainable living practices. Learn how our new buildings incorporate eco-friendly features...',
    date: 'March 5, 2024',
    category: 'Events',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 4,
    title: 'Infrastructure Upgrades Complete',
    summary:
      'All infrastructure upgrades for Phase 1 have been successfully completed. Residents can now enjoy improved amenities and facilities...',
    date: 'February 28, 2024',
    category: 'Infrastructure',
    image: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 5,
    title: 'Groundbreaking Ceremony for Phase 3',
    summary:
      'We celebrated the official groundbreaking ceremony for Phase 3 of our redevelopment project. This marks the beginning of an exciting new phase...',
    date: 'February 20, 2024',
    category: 'Construction',
    image: 'https://images.unsplash.com/photo-1567443023421-de300200c4c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 6,
    title: 'RERA Approval Received',
    summary:
      'We are pleased to announce that we have received official RERA approval for all phases of our redevelopment project...',
    date: 'February 15, 2024',
    category: 'Updates',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
];

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Memoize filtered articles to avoid recalculation on every render
  const filteredArticles = useMemo(() => {
    if (!searchTerm.trim()) return newsArticles;
    
    const lowerSearch = searchTerm.toLowerCase();
    return newsArticles.filter(
      (article: { title: string; summary: string }) =>
        article.title.toLowerCase().includes(lowerSearch) ||
        article.summary.toLowerCase().includes(lowerSearch)
    );
  }, [searchTerm]);

  const handleNewsletterSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubscribing) return;
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      alert('Please enter a valid email address');
      return;
    }
    
    setIsSubscribing(true);
    
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      if (!response.ok) {
        throw new Error('Subscription failed');
      }

      // Newsletter subscription successful
      setNewsletterEmail('');
      alert('Thank you! You have been subscribed to our newsletter.');
    } catch (error) {
      alert('An error occurred. Please try again later.');
    } finally {
      setIsSubscribing(false);
    }
  }, [newsletterEmail, isSubscribing]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Hero />

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {/* Main Content */}
              <div className="lg:col-span-3">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
                  Latest News & Announcements
                </h2>

                {/* News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredArticles.map((article) => (
                    <article
                      key={article.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="relative h-48 w-full">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{article.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Tag className="w-4 h-4" />
                            <span>{article.category}</span>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {article.summary}
                        </p>
                        <Link
                          href={`/news/${article.id}`}
                          className="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors"
                        >
                          Read More
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-2 mt-8">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Search */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Search</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search articles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Newsletter Subscription */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Newsletter Subscription
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Stay updated with our latest news and announcements.
                  </p>
                  <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        placeholder="your.email@example.com"
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubscribing}
                      className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                      {isSubscribing ? 'Subscribing...' : 'Subscribe to Newsletter'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

