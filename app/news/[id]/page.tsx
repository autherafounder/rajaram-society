'use client';

import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Tag, ArrowLeft } from 'lucide-react';

const newsArticles = [
  {
    id: 1,
    title: 'Phase 2 Construction Ahead of Schedule',
    summary:
      'Exciting news! Phase 2 of our redevelopment project is progressing ahead of schedule. We are pleased to announce significant milestones achieved...',
    content: `Exciting news! Phase 2 of our redevelopment project is progressing ahead of schedule. We are pleased to announce significant milestones achieved in the construction process.

Our team has been working tirelessly to ensure that all structural work meets the highest standards of quality and safety. The foundation work has been completed successfully, and the superstructure is now taking shape.

Key achievements include:
• Completion of foundation and basement work
• Structural framework erected to the planned level
• Electrical and plumbing rough-in work initiated
• Quality inspections passed at all stages

We remain committed to delivering a world-class residential and commercial complex for all our stakeholders. The project timeline is being closely monitored to ensure timely delivery.`,
    date: 'March 15, 2024',
    category: 'Construction',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    title: 'New Local Businesses Open Commercial Tower',
    summary:
      'We are thrilled to welcome several new businesses to our commercial tower. This marks an important milestone in creating a vibrant community space...',
    content: `We are thrilled to welcome several new businesses to our commercial tower. This marks an important milestone in creating a vibrant community space that serves the needs of our residents and the surrounding neighborhood.

The commercial tower has been designed to accommodate a diverse range of businesses, from retail shops to professional offices. We have carefully selected tenants that complement our community vision.

New businesses include:
• Grocery and daily essentials store
• Medical clinic and pharmacy
• Professional office spaces
• Café and food court options

This development reflects our commitment to creating a self-sustaining community where residents have easy access to essential services and amenities right at their doorstep.`,
    date: 'March 10, 2024',
    category: 'Community',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    title: 'Community Workshop on Sustainable Living',
    summary:
      'Join us for an informative workshop on sustainable living practices. Learn how our new buildings incorporate eco-friendly features...',
    content: `Join us for an informative workshop on sustainable living practices. Learn how our new buildings incorporate eco-friendly features and what you can do to contribute to a greener future.

The workshop will cover:
• Rainwater harvesting systems installed in the new building
• Solar energy integration plans
• Waste management and recycling programs
• Green building materials used in construction
• Energy-efficient appliances and systems

Our redevelopment project has been designed with sustainability at its core. From energy-efficient building designs to water conservation systems, we are committed to reducing our environmental footprint.

All residents and stakeholders are welcome to attend. Refreshments will be provided.`,
    date: 'March 5, 2024',
    category: 'Events',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 4,
    title: 'Infrastructure Upgrades Complete',
    summary:
      'All infrastructure upgrades for Phase 1 have been successfully completed. Residents can now enjoy improved amenities and facilities...',
    content: `All infrastructure upgrades for Phase 1 have been successfully completed. Residents can now enjoy improved amenities and facilities that have been designed to modern standards.

Completed upgrades include:
• New water supply system with 24/7 availability
• Upgraded electrical infrastructure with power backup
• Modern sewage treatment plant
• Landscaped common areas and gardens
• Children's play area and senior citizen corner
• CCTV surveillance and security systems

These improvements represent our commitment to providing a comfortable and safe living environment for all our residents. We continue to work on additional enhancements as part of the ongoing redevelopment project.`,
    date: 'February 28, 2024',
    category: 'Infrastructure',
    image: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 5,
    title: 'Groundbreaking Ceremony for Phase 3',
    summary:
      'We celebrated the official groundbreaking ceremony for Phase 3 of our redevelopment project. This marks the beginning of an exciting new phase...',
    content: `We celebrated the official groundbreaking ceremony for Phase 3 of our redevelopment project. This marks the beginning of an exciting new phase in our society's transformation journey.

The ceremony was attended by:
• Society management committee members
• Project Management Consultant representatives
• Local government officials
• Resident representatives

Phase 3 will include additional residential units, enhanced common amenities, and improved commercial spaces. The architectural plans have been carefully crafted to maximize space utilization while ensuring ample natural light and ventilation.

We are grateful for the continued support and patience of all our residents throughout this transformative journey. Together, we are building a better future for our community.`,
    date: 'February 20, 2024',
    category: 'Construction',
    image: 'https://images.unsplash.com/photo-1567443023421-de300200c4c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 6,
    title: 'RERA Approval Received',
    summary:
      'We are pleased to announce that we have received official RERA approval for all phases of our redevelopment project...',
    content: `We are pleased to announce that we have received official RERA (Real Estate Regulatory Authority) approval for all phases of our redevelopment project. This is a significant milestone that demonstrates our commitment to transparency and regulatory compliance.

RERA registration ensures:
• Full transparency in project timelines and deliverables
• Protection of buyer and resident interests
• Regular progress reporting to regulatory authorities
• Adherence to approved building plans and specifications
• Financial accountability through escrow accounts

Our RERA registration number and details are available on the Maharashtra RERA website. Residents and stakeholders can track the project progress through the official RERA portal.

This approval reinforces our dedication to following all legal and regulatory requirements while delivering a world-class redevelopment project for our community.`,
    date: 'February 15, 2024',
    category: 'Updates',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  },
];

export default function NewsArticlePage() {
  const params = useParams();
  const articleId = parseInt(params.id as string);

  const article = useMemo(
    () => newsArticles.find((a) => a.id === articleId),
    [articleId]
  );

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-8">
              The news article you are looking for does not exist or has been removed.
            </p>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to News
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to News
          </Link>

          {/* Article */}
          <article className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Hero Image */}
            <div className="relative h-64 md:h-96 w-full">
              <Image
                src={article.image}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover"
                priority
              />
            </div>

            {/* Content */}
            <div className="p-8 md:p-12">
              {/* Meta */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{article.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium">
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                {article.title}
              </h1>

              {/* Body */}
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                {article.content}
              </div>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
