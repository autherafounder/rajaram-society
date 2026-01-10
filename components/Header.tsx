'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import { Home, Clock, Camera, Contact, User, Menu, X, FileText, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Memoize Supabase client to prevent recreating on every render
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}
    >
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/20 shadow-md">
            <Image
              src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
              alt="Jai Jawan CHS Logo"
              fill
              sizes="48px"
              className="object-cover"
              priority
            />
          </div>
          <span className="text-xl font-bold text-gray-800 hidden sm:block">Jai Jawan CHS</span>
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

          <Link
            href="/contact"
            aria-label="Contact us"
            className="flex flex-col items-center gap-1 text-gray-800 hover:text-primary transition-colors"
          >
            <Contact className="w-5 h-5" aria-hidden="true" />
            <span className="text-sm font-medium">Contact</span>
          </Link>

          {/* Only show Documents link when logged in */}
          {isLoggedIn && (
            <Link
              href="/documents"
              aria-label="Access documents"
              className="flex flex-col items-center gap-1 text-gray-800 hover:text-primary transition-colors"
            >
              <FileText className="w-5 h-5" aria-hidden="true" />
              <span className="text-sm font-medium">Documents</span>
            </Link>
          )}
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

        {/* Login/Logout Button */}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            aria-label="Logout from your account"
            className="flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <span className="hidden sm:inline font-medium">Logout</span>
            <LogOut className="w-5 h-5" aria-hidden="true" />
          </button>
        ) : (
          <Link
            href="/login"
            aria-label="Login to your account"
            className="flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <span className="hidden sm:inline font-medium">Login</span>
            <User className="w-5 h-5" aria-hidden="true" />
          </Link>
        )}
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

            {/* Only show Documents link when logged in */}
            {isLoggedIn && (
              <Link
                href="/documents"
                aria-label="Access documents"
                className="flex items-center gap-3 text-gray-800 hover:text-primary py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FileText className="w-5 h-5" aria-hidden="true" />
                <span>Documents</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
