'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { Home, Clock, Camera, MoreVertical, Contact, User, ChevronDown, Menu, X, FileText } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };

    if (isMoreOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMoreOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
        isScrolled ? 'shadow-md' : 'shadow-sm'
      }`}
    >
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/20 shadow-md">
            <Image
              src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
              alt="Rajaram Society Logo"
              fill
              sizes="48px"
              className="object-cover"
              priority
            />
          </div>
          <span className="text-xl font-bold text-gray-800 hidden sm:block">Rajaram Society</span>
        </Link>

        {/* Navigation Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            aria-label="Go to home page"
            className="flex flex-col items-center gap-1 text-gray-800 hover:text-primary transition-colors"
          >
            <Home className="w-5 h-5" aria-hidden="true" />
            <span className="text-sm font-medium">Home</span>
            <span className="w-full h-0.5 bg-primary"></span>
          </Link>

          <Link
            href="/updates"
            aria-label="View project updates"
            className="flex flex-col items-center gap-1 text-gray-800 hover:text-primary transition-colors"
          >
            <Clock className="w-5 h-5" aria-hidden="true" />
            <span className="text-sm font-medium">Updates</span>
          </Link>

          <Link
            href="/gallery"
            aria-label="View project gallery"
            className="flex flex-col items-center gap-1 text-gray-800 hover:text-primary transition-colors"
          >
            <Camera className="w-5 h-5" aria-hidden="true" />
            <span className="text-sm font-medium">Gallery</span>
          </Link>

          {/* More Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              aria-label="Toggle more menu"
              aria-expanded={isMoreOpen}
              className="flex flex-col items-center gap-1 text-gray-800 hover:text-primary transition-colors"
            >
              <MoreVertical className="w-5 h-5" aria-hidden="true" />
              <span className="text-sm font-medium flex items-center gap-1">
                More
                <ChevronDown className={`w-3 h-3 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </span>
            </button>

            {isMoreOpen && (
              <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg py-2 min-w-[200px] z-50">
                <Link
                  href="/about"
                  aria-label="Learn about us"
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                  onClick={() => setIsMoreOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  href="/services"
                  aria-label="View our services"
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                  onClick={() => setIsMoreOpen(false)}
                >
                  Services
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/contact"
            aria-label="Contact us"
            className="flex flex-col items-center gap-1 text-gray-800 hover:text-primary transition-colors"
          >
            <Contact className="w-5 h-5" aria-hidden="true" />
            <span className="text-sm font-medium">Contact</span>
          </Link>

          <Link
            href="/documents"
            aria-label="Access documents"
            className="flex flex-col items-center gap-1 text-gray-800 hover:text-primary transition-colors"
          >
            <FileText className="w-5 h-5" aria-hidden="true" />
            <span className="text-sm font-medium">Documents</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          className="md:hidden text-gray-800"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
        </button>

        {/* Login Button */}
        <Link
          href="/login"
          aria-label="Login to your account"
          className="flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <span className="hidden sm:inline font-medium">Login</span>
          <User className="w-5 h-5" aria-hidden="true" />
        </Link>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-4 space-y-2">
            <Link
              href="/"
              aria-label="Go to home page"
              className="flex items-center gap-3 text-gray-800 hover:text-primary py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home className="w-5 h-5" aria-hidden="true" />
              <span>Home</span>
            </Link>
            <Link
              href="/updates"
              aria-label="View project updates"
              className="flex items-center gap-3 text-gray-800 hover:text-primary py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Clock className="w-5 h-5" aria-hidden="true" />
              <span>Updates</span>
            </Link>
            <Link
              href="/gallery"
              aria-label="View project gallery"
              className="flex items-center gap-3 text-gray-800 hover:text-primary py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Camera className="w-5 h-5" aria-hidden="true" />
              <span>Gallery</span>
            </Link>
            <Link
              href="/contact"
              aria-label="Contact us"
              className="flex items-center gap-3 text-gray-800 hover:text-primary py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Contact className="w-5 h-5" aria-hidden="true" />
              <span>Contact</span>
            </Link>
            <Link
              href="/documents"
              aria-label="Access documents"
              className="flex items-center gap-3 text-gray-800 hover:text-primary py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FileText className="w-5 h-5" aria-hidden="true" />
              <span>Documents</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

