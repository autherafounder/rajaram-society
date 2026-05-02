'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, Lock, ChevronUp } from 'lucide-react';
import { sanitizeInput, validateEmail } from '@/utils/validation';

export default function DocumentsPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    flatUnit: '',
    email: '',
    password: '',
    documents: [] as string[],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Validate form
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.flatUnit.trim()) {
      newErrors.flatUnit = 'Flat/Unit number is required';
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.documents.length === 0) {
      newErrors.documents = 'Please select at least one document';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/documents/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Request failed');
      }

      const data = await response.json();
      alert(`Your document access request has been submitted. Request ID: ${data.requestId}`);
      
      // Reset form
      setFormData({
        fullName: '',
        flatUnit: '',
        email: '',
        password: '',
        documents: [],
      });
      setErrors({});
    } catch (error) {
      setErrors({ submit: 'An error occurred. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDocumentToggle = useCallback((document: string) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.includes(document)
        ? prev.documents.filter((d) => d !== document)
        : [...prev.documents, document],
    }));
    
    // Clear error when user selects a document
    setErrors((prev) => {
      if (prev.documents) {
        const newErrors = { ...prev };
        delete newErrors.documents;
        return newErrors;
      }
      return prev;
    });
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitized = name === 'password' ? value : sanitizeInput(value);
    
    setFormData((prev) => ({
      ...prev,
      [name]: sanitized,
    }));
    
    // Clear error when user starts typing
    setErrors((prev) => {
      if (prev[name]) {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      }
      return prev;
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Title & Instructions */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Secure Document Access Request
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                To access confidential society-related documents, please fill below. 
                For security purposes, each application will be manually reviewed and access will 
                be securely registered to your address within 72 business working hours.
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Request Access</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Two-Column Layout for First Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Flat/Unit Number */}
                  <div>
                    <label
                      htmlFor="flatUnit"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Flat/Unit Number
                    </label>
                    <input
                      type="text"
                      id="flatUnit"
                      name="flatUnit"
                      value={formData.flatUnit}
                      onChange={handleChange}
                      placeholder="e.g., A-101, B-205"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Two-Column Layout for Second Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email Address */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Create Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Create Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                      minLength={8}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum 8 characters
                    </p>
                  </div>
                </div>

                {/* Document Selection */}
                <div>
                  <button
                    type="button"
                    aria-label="Document selection section"
                    className="flex items-center justify-between w-full text-left mb-4"
                  >
                    <label className="block text-sm font-medium text-gray-700">
                      Select Document(s) to Request
                    </label>
                    <ChevronUp className="w-5 h-5 text-gray-400" aria-hidden="true" />
                  </button>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.documents.includes('development-agreement')}
                        onChange={() => handleDocumentToggle('development-agreement')}
                        className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <div>
                        <span className="font-medium text-gray-800">
                          Development Agreement
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.documents.includes('rera-certificate')}
                        onChange={() => handleDocumentToggle('rera-certificate')}
                        className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <div>
                        <span className="font-medium text-gray-800">
                          RERA Certificate
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.documents.includes('public-documents')}
                        onChange={() => handleDocumentToggle('public-documents')}
                        className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <div>
                        <span className="font-medium text-gray-800">
                          View Public Documents (Downloadable)
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Error Messages */}
                {errors.submit && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{errors.submit}</p>
                  </div>
                )}
                {errors.fullName && (
                  <p className="text-sm text-red-600">{errors.fullName}</p>
                )}
                {errors.flatUnit && (
                  <p className="text-sm text-red-600">{errors.flatUnit}</p>
                )}
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
                {errors.documents && (
                  <p className="text-sm text-red-600">{errors.documents}</p>
                )}

                {/* Submit Button - Bottom Right */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-label={isSubmitting ? 'Submitting document access request' : 'Submit document access request'}
                    className="bg-primary hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-lg transition-colors"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

