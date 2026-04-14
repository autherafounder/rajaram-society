'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MapPin, User, Mail, Phone, Clock, MessageSquare } from 'lucide-react';
import Toast, { useToast } from '@/components/Toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    inquiry: '',
    messageType: 'suggestion',
    message: '',
    website: '', // Honeypot field
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { showToast, ToastContainer } = useToast();

  // Client-side validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (formData.phone) {
      const digitsOnly = formData.phone.replace(/\D/g, '');
      if (digitsOnly.length < 10 || !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          showToast('Too many submissions. Please try again later.', 'error');
        } else if (data.details) {
          setErrors(data.details);
          showToast('Please fix the errors in the form.', 'error');
        } else {
          showToast(data.error || 'Submission failed. Please try again.', 'error');
        }
        return;
      }

      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        inquiry: '',
        messageType: 'suggestion',
        message: '',
        website: '',
      });
      setErrors({});

      showToast(
        data.ticketId
          ? `Thank you! Your ticket ID is ${data.ticketId}`
          : 'Thank you! Your message has been submitted successfully.',
        'success'
      );
    } catch (error) {
      showToast('An error occurred. Please try again later.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ToastContainer />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Left: Contact Information */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Contact Information</h2>

              <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                {/* Location */}
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Location</h3>
                    <p className="text-gray-600">
                      Jai Jawan Co-Operative Housing Society<br />
                      Plot No. 01, Sector 17, Vashi,<br />
                      Navi Mumbai – 400703
                    </p>
                  </div>
                </div>

                {/* Society/Admin Contact */}
                <div className="flex items-start gap-4">
                  <User className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Society / Admin Contact</h3>
                    <a
                      href="mailto:redevjaijawanchs@gmail.com"
                      className="text-primary hover:underline"
                    >
                      redevjaijawanchs@gmail.com
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Email Address</h3>
                    <a
                      href="mailto:redevjaijawanchs@gmail.com"
                      className="text-gray-600 hover:text-primary"
                    >
                      redevjaijawanchs@gmail.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Contact Number</h3>
                    <p className="text-gray-600">
                      Mobile: +91 97696 49449
                    </p>
                  </div>
                </div>

                {/* Office Timing */}
                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Office Timing</h3>
                    <p className="text-gray-600">
                      Monday - Saturday: 10:00 AM - 6:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              {/* Google Maps Embed */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Get Directions</h3>
                <div className="w-full h-64 rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1905.0699917208397!2d72.9979326!3d19.0698837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c14bca257565%3A0x4005d3cb16227686!2sJai%20Jawan%20Chs!5e1!3m2!1sen!2sin!4v1768051610947!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>

            {/* Right: Inquiry Form */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Get in Touch</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot — hidden from real users, bots will fill it */}
                <div className="absolute opacity-0 pointer-events-none h-0 overflow-hidden" aria-hidden="true" tabIndex={-1}>
                  <label htmlFor="website">Website</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    autoComplete="off"
                    tabIndex={-1}
                  />
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.name ? 'border-red-400' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.phone ? 'border-red-400' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.email ? 'border-red-400' : 'border-gray-300'
                      }`}
                      required
                    />
                  </div>
                  {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                </div>

                {/* Work Inquiry */}
                <div>
                  <label htmlFor="inquiry" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Work Inquiry
                  </label>
                  <select
                    id="inquiry"
                    name="inquiry"
                    value={formData.inquiry}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select an option</option>
                    <option value="status-update">Status Update</option>
                    <option value="approval">Approval Request</option>
                    <option value="grievance">Grievance</option>
                    <option value="general">General Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Message Type Toggle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message Type
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="messageType"
                        value="suggestion"
                        checked={formData.messageType === 'suggestion'}
                        onChange={handleChange}
                        className="mr-2 accent-primary"
                      />
                      <span>Suggestion</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="messageType"
                        value="inquiry"
                        checked={formData.messageType === 'inquiry'}
                        onChange={handleChange}
                        className="mr-2 accent-primary"
                      />
                      <span>Inquiry</span>
                    </label>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Query or Grievance details *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Please provide details about your query or grievance (at least 10 characters)..."
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.message ? 'border-red-400' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.message && <p className="text-sm text-red-600 mt-1">{errors.message}</p>}
                  <p className="text-xs text-gray-400 mt-1">
                    {formData.message.length}/2000 characters
                  </p>
                </div>

                {/* Error Message */}
                {errors.submit && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{errors.submit}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
