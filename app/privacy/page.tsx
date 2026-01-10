import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600">
              Last updated: {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {/* Privacy Policy Content */}
          <div className="bg-white rounded-lg shadow-md p-8 md:p-12 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                Jai Jawan CHS (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting
                your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard
                your information when you visit our website and use our services.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Personal Information</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We may collect personal information that you voluntarily provide to us when you:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-2 text-gray-700 ml-4">
                    <li>Register for an account on our website</li>
                    <li>Submit forms for document access requests</li>
                    <li>Contact us through our contact forms</li>
                    <li>Subscribe to our newsletter</li>
                    <li>Submit job applications</li>
                    <li>Participate in surveys or feedback forms</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    This information may include: name, email address, phone number, flat/unit number,
                    and any other information you choose to provide.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Automatically Collected Information</h3>
                  <p className="text-gray-700 leading-relaxed">
                    When you visit our website, we may automatically collect certain information about
                    your device, including:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-2 text-gray-700 ml-4">
                    <li>IP address</li>
                    <li>Browser type and version</li>
                    <li>Operating system</li>
                    <li>Pages visited and time spent on pages</li>
                    <li>Referring website addresses</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>To provide, maintain, and improve our services</li>
                <li>To process your requests and transactions</li>
                <li>To communicate with you about our services, updates, and promotions</li>
                <li>To verify your identity for document access requests</li>
                <li>To send you newsletters and marketing communications (with your consent)</li>
                <li>To respond to your inquiries and provide customer support</li>
                <li>To comply with legal obligations and protect our rights</li>
                <li>To analyze website usage and improve user experience</li>
              </ul>
            </section>

            {/* Information Sharing and Disclosure */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Information Sharing and Disclosure</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may
                share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>
                  <strong>Service Providers:</strong> We may share information with third-party
                  service providers who assist us in operating our website and conducting our business
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose information when required by
                  law or to protect our rights and the safety of our users
                </li>
                <li>
                  <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale
                  of assets, your information may be transferred
                </li>
                <li>
                  <strong>With Your Consent:</strong> We may share your information with your
                  explicit consent
                </li>
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Data Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect
                your personal information against unauthorized access, alteration, disclosure, or
                destruction. However, no method of transmission over the Internet or electronic
                storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>
                  <strong>Access:</strong> You can request access to the personal information we hold about you
                </li>
                <li>
                  <strong>Correction:</strong> You can request correction of inaccurate or incomplete information
                </li>
                <li>
                  <strong>Deletion:</strong> You can request deletion of your personal information, subject to legal obligations
                </li>
                <li>
                  <strong>Opt-out:</strong> You can opt-out of marketing communications at any time
                </li>
                <li>
                  <strong>Data Portability:</strong> You can request a copy of your data in a structured format
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                To exercise these rights, please contact us using the contact information provided below.
              </p>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Cookies and Tracking Technologies</h2>
              <p className="text-gray-700 leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our website
                and hold certain information. You can instruct your browser to refuse all cookies
                or to indicate when a cookie is being sent. However, if you do not accept cookies,
                you may not be able to use some portions of our website.
              </p>
            </section>

            {/* Third-Party Links */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Third-Party Links</h2>
              <p className="text-gray-700 leading-relaxed">
                Our website may contain links to third-party websites. We are not responsible for
                the privacy practices or content of these external sites. We encourage you to read
                the privacy policies of any third-party sites you visit.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Children&apos;s Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Our services are not intended for individuals under the age of 18. We do not
                knowingly collect personal information from children. If you believe we have
                collected information from a child, please contact us immediately.
              </p>
            </section>

            {/* Changes to Privacy Policy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Changes to This Privacy Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any
                changes by posting the new Privacy Policy on this page and updating the &quot;Last
                updated&quot; date. You are advised to review this Privacy Policy periodically
                for any changes.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-1">Email:</p>
                    <a
                      href="mailto:privacy@jaijawanchs.com"
                      className="text-gray-700 hover:text-primary transition-colors"
                    >
                      privacy@jaijawanchs.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-1">Phone:</p>
                    <a
                      href="tel:+91-XXXXX-XXXXX"
                      className="text-gray-700 hover:text-primary transition-colors"
                    >
                      +91-XXXXX-XXXXX
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-1">Address:</p>
                    <p className="text-gray-700">
                      Jai Jawan CHS Office, Mumbai, Maharashtra, India
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

