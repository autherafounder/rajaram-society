'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Building2, Users, FileText, MapPin, Calendar, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800">
              Welcome to Society Name
            </h1>
          </div>
        </section>

        {/* About Us Content */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <div className="mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                  <Building2 className="w-8 h-8 text-primary" />
                  About Us
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  Society Name is a registered cooperative housing society established under the provisions of the Maharashtra Co-operative Societies Act, 1960. The society&apos;s registration number is <strong>registration no.</strong>, and its registered office is located at: <strong>society address</strong>.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  The society occupies a plot of land measuring approximately <strong>plot area</strong>, as per the approved old building sanction plan, and conveyance deed. Originally established in 1972, society name consists of a single standalone building of G+4 storeys, with 16 residential units and no commercial units. The property is conveniently located with an adjoining road of 15 meters.
                </p>
              </div>

              {/* Redevelopment Project Section */}
              <div className="mb-12 bg-gray-50 p-8 rounded-lg border-l-4 border-primary">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                  <Award className="w-8 h-8 text-primary" />
                  Redevelopment Project
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  Society Name is currently planning a major redevelopment project aimed at improving the facilities and infrastructure of the society. The redevelopment plans have been fully aligned with the guidelines set forth in Section 79(A) of the Maharashtra Co-operative Societies Act, 1960, ensuring full compliance with all statutory requirements.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  The society has invested significant effort and resources to meet all regulatory obligations and has appointed <strong>M/s Patel Architects and Associates</strong> as the Project Management Consultant. The developer for this project is yet to be finalized.
                </p>
              </div>

              {/* Management Committee Section */}
              <div className="mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                  <Users className="w-8 h-8 text-primary" />
                  Management Committee (2022–2027)
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  The Management Committee for the term 2022–2027 is as follows:
                </p>
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <ul className="space-y-4 text-lg text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="font-semibold text-primary min-w-[100px]">Chairman:</span>
                      <span>Chairman Name – Chairman</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="font-semibold text-primary min-w-[100px]">Secretary:</span>
                      <span>Secretary Name – Secretary</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="font-semibold text-primary min-w-[100px]">Treasurer:</span>
                      <span>Treasurer Name – Treasurer</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="font-semibold text-primary min-w-[100px]">Member:</span>
                      <span>Members Name – Member</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="font-semibold text-primary min-w-[100px]">Member:</span>
                      <span>Members Name – Member</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="font-semibold text-primary min-w-[100px]">Member:</span>
                      <span>Members Name – Member</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Key Personnel Section */}
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-primary" />
                    Developer
                  </h3>
                  <p className="text-lg text-gray-700">To be Decided</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                    <Award className="w-6 h-6 text-primary" />
                    Redevelopment Consultant
                  </h3>
                  <p className="text-lg text-gray-700">Society Plus</p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center mt-12">
                <a
                  href="/contact"
                  className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg"
                >
                  Know More
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

