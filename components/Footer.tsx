import Link from 'next/link';
import { Instagram, Twitter, Facebook, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-xl font-bold mb-4">Rajaram Society</h3>
            <p className="mb-4">
              Building communities and shaping the future through quality construction
              and sustainable development.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" aria-label="Go to home page" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/updates" aria-label="View project updates" className="hover:text-primary transition-colors">
                  Updates
                </Link>
              </li>
              <li>
                <Link href="/gallery" aria-label="View project gallery" className="hover:text-primary transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" aria-label="Contact us" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" aria-label="View privacy policy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-400 text-sm block mb-0.5">Email:</span>
                  <a
                    href="mailto:info@rajaramsociety.com"
                    className="text-gray-300 hover:text-primary transition-colors"
                  >
                    info@rajaramsociety.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-400 text-sm block mb-0.5">Phone:</span>
                  <a
                    href="tel:+91-XXXXX-XXXXX"
                    className="text-gray-300 hover:text-primary transition-colors"
                  >
                    +91-XXXXX-XXXXX
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-400 text-sm block mb-0.5">Address:</span>
                  <span className="text-gray-300">
                    Rajaram Society, Mumbai
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p>&copy; {new Date().getFullYear()} Rajaram Society. All rights reserved.</p>
            </div>
            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/rajaramsociety"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://www.twitter.com/rajaramsociety"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://www.facebook.com/rajaramsociety"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://www.linkedin.com/company/rajaramsociety"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

