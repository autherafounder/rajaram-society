'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      
      // Redirect to home or dashboard after successful login
      // window.location.href = '/dashboard';
    } catch (error) {
      // Handle error without exposing sensitive details
      setPassword('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="relative">
        <Hero blur={true} showButton={false} />
        
        {/* Login Card Overlay */}
        <div className="absolute inset-0 flex items-center justify-center min-h-screen py-8">
          <div className="bg-white rounded-lg shadow-2xl p-6 md:p-8 w-full max-w-md mx-4 z-20 overflow-y-auto max-h-[90vh]">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary/20 shadow-md">
                <Image
                  src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Rajaram Society Logo"
                  fill
                  sizes="64px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
              Sign In to Your Account
            </h2>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                  Remember Me
                </label>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {isSubmitting ? 'Logging in...' : 'LOGIN'}
              </button>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-gray-600 mt-4">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-primary hover:underline font-semibold">
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

