import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const GetInTouch: React.FC = () => {
  return (
    <section className="bg-white px-6 sm:px-10 lg:px-16 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 grid-cols-1 lg:grid-cols-2">
          {/* Left: Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg h-96 lg:h-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-[#12022A] to-[#2D1B4E]" />
            <div className="flex items-center justify-center w-full h-full">
              <div className="text-center">
                <h3 className="mb-4 font-bold text-white text-3xl">Ready to Connect?</h3>
                <p className="text-[#C9A84C] text-lg">We're here to help you move forward.</p>
              </div>
            </div>
          </div>

          {/* Right: Contact Info */}
          <div className="flex flex-col justify-center">
            <h2 className="mb-6 font-bold text-[#12022A] text-4xl md:text-5xl uppercase leading-tight">
              Get in Touch
            </h2>
            <p className="mb-12 text-[#12022A]/70 text-lg leading-relaxed">
              Whether you're an individual looking to grow, a business seeking support, or an organization wanting to partner with us — we're here to listen and help.
            </p>

            {/* Contact Info Cards */}
            <div className="space-y-6 mb-12">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <Phone className="text-[#C9A84C]" size={24} />
                </div>
                <div>
                  <p className="font-bold text-[#12022A]">Phone</p>
                  <p className="text-[#12022A]/70">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <Mail className="text-[#C9A84C]" size={24} />
                </div>
                <div>
                  <p className="font-bold text-[#12022A]">Email</p>
                  <p className="text-[#12022A]/70">info@emersonempire.org</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <MapPin className="text-[#C9A84C]" size={24} />
                </div>
                <div>
                  <p className="font-bold text-[#12022A]">Address</p>
                  <p className="text-[#12022A]/70">Columbus, OH, United States</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/contact"
                className="inline-flex items-center justify-center bg-[#12022A] hover:bg-[#1E0A4A] px-8 py-4 rounded-sm font-bold text-white text-sm uppercase tracking-[0.15em] transition-colors duration-200"
              >
                Send a Message
              </a>
              <a
                href="tel:+15551234567"
                className="inline-flex items-center justify-center border-2 border-[#12022A] hover:bg-[#12022A]/5 px-8 py-4 rounded-sm font-bold text-[#12022A] text-sm uppercase tracking-[0.15em] transition-colors duration-200"
              >
                Call Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInTouch;
