// src/pages/Contact.jsx
import { useState } from 'react';
import { BASE_URL } from '../utils/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    try {
      const response = await fetch(`${BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setStatus({ loading: false, success: true, error: null });
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Optional: auto hide success message after 5s
      setTimeout(() => {
        setStatus((prev) => ({ ...prev, success: false }));
      }, 5000);
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        error: err.message || 'Failed to send message',
      });
    }
  };

  return (
    <div className="bg-gray-50 flex items-center justify-center py-16 md:py-24 container mx-auto px-8">
      <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Left - Info / Decoration */}
          <div className="bg-gradient-to-br from-[#f9c821]/10 to-[#f9c821]/5 p-10 md:p-12 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Let's Connect
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Have a question or want to collaborate?  
              Drop us a message and we'll get back to you as soon as possible.
            </p>

            <div className="space-y-6 text-gray-700">
              <div>
                <div className="font-medium">Email</div>
                <div className="text-[#f9c821] hover:underline cursor-pointer">
                  info@clubpro.com
                </div>
              </div>
              
            </div>
          </div>

          {/* Right - Form */}
          <div className="p-10 md:p-12">
            <h3 className="text-2xl font-semibold text-gray-800 mb-8">
              Send us a message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#f9c821] focus:ring-2 focus:ring-[#f9c821]/30 outline-none transition-all"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#f9c821] focus:ring-2 focus:ring-[#f9c821]/30 outline-none transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#f9c821] focus:ring-2 focus:ring-[#f9c821]/30 outline-none transition-all"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#f9c821] focus:ring-2 focus:ring-[#f9c821]/30 outline-none transition-all resize-none"
                  placeholder="Tell us more..."
                />
              </div>

              <button
                type="submit"
                disabled={status.loading}
                className={`
                  w-full py-3.5 px-6 rounded-lg font-medium text-white
                  transition-all duration-300
                  ${status.loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[#f9c821] hover:bg-[#f8b800] active:scale-[0.98] shadow-md hover:shadow-lg'}
                `}
              >
                {status.loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Message'
                )}
              </button>

              {/* Status messages */}
              {status.success && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-center">
                  Thank you! Your message has been sent successfully.
                </div>
              )}

              {status.error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center">
                  {status.error}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}