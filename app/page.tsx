import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';



export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <Hero />

        {/* Society Information Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-gray-800">
              Welcome to Jai Jawan Co-Operative Housing Society
            </h1>

            {/* About Us */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                About Us
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Jai Jawan Co-Operative Housing Society is a registered cooperative housing society established under the provisions of the Maharashtra Co-operative Societies Act, 1960. The society&apos;s registration number is <strong>TNA/HSG/1077/81</strong>, and its registered office is located at: <strong>Plot No. 01, Sector 17, Vashi, Navi Mumbai – 400703</strong>.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                The society occupies a plot of land measuring approximately <strong>1850 sq.m.</strong>, as per the approved old building sanction plan, and conveyance deed. Originally established in 1981, Jai Jawan Co-Operative Housing Society consists of a single standalone building of G+4 storeys, with 70 residential units and 45 commercial units. The property is conveniently located with an adjoining road of 19+30 meters.
              </p>
            </div>

            {/* Redevelopment Project */}
            <div className="mb-12 bg-gray-50 p-8 rounded-lg border-l-4 border-primary">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                Redevelopment Project
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Jai Jawan Co-Operative Housing Society is currently planning a major redevelopment project aimed at improving the facilities and infrastructure of the society. The redevelopment plans have been fully aligned with the guidelines set forth in Section 79(A) of the Maharashtra Co-operative Societies Act, 1960, ensuring full compliance with all statutory requirements.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                The society has invested significant effort and resources to meet all regulatory obligations and has appointed <strong>M/s Patel Architects and Associates</strong> as the Project Management Consultant. The developer for this project is yet to be finalized.
              </p>
            </div>

            {/* Management Committee */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                Management Committee
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                The Management Committee is as follows:
              </p>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <ul className="space-y-4 text-lg text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="font-semibold text-primary min-w-[100px]">Chairman:</span>
                    <span>Mr. Anandraj Periaswamy</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-semibold text-primary min-w-[100px]">Secretary:</span>
                    <span>Mr. Bhushan Ravindra Deshpande</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-semibold text-primary min-w-[100px]">Treasurer:</span>
                    <span>Mr. Manohar Narayan Kadam</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Key Personnel */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  Developer
                </h3>
                <p className="text-lg text-gray-700">To be Decided</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  Redevelopment Consultant
                </h3>
                <p className="text-lg text-gray-700">Patel Architects and Associates</p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <a
                href="/contact"
                className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg"
              >
                Know More
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

