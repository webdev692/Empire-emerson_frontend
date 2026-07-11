import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { AgencyAvif } from '../../assets';

const GetInTouch: React.FC = () => {
  return (
    <section className="bg-white px-6 sm:px-10 lg:px-16 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 grid-cols-1 lg:grid-cols-2">
          <div className="relative rounded-2xl overflow-hidden shadow-lg h-96 lg:h-auto bg-[#0A1128]">
            <div className="absolute inset-0 bg-[#0A1128] opacity-90" />
            <div className="relative flex items-center justify-center w-full h-full p-8">
              <img
                src={AgencyAvif}
                alt="The Emerson Agency logo"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <h2 className="mb-6 font-bold text-[#0A1128] text-4xl md:text-5xl uppercase leading-tight">
              Get in Touch
            </h2>
            <p className="mb-12 text-[#0A1128]/70 text-lg leading-relaxed">
              Whether you are an individual looking to grow, a business seeking support, or an organization interested in partnership, we are here to listen and help.
            </p>

            <div className="space-y-6 mb-12">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <Phone className="text-[#C9A84C]" size={24} />
                </div>
                <div>
                  <p className="font-bold text-[#0A1128]">Phone / WhatsApp</p>
                  <a className="text-[#0A1128]/70 hover:underline" href="tel:+18034794492">
                    +1 (803) 479-4492
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <Mail className="text-[#C9A84C]" size={24} />
                </div>
                <div>
                  <p className="font-bold text-[#0A1128]">Email</p>
                  <a className="text-[#0A1128]/70 hover:underline" href="mailto:sales@theemersonempire.info">
                    sales@theemersonempire.info
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <MapPin className="text-[#C9A84C]" size={24} />
                </div>
                <div>
                  <p className="font-bold text-[#0A1128]">Location</p>
                  <p className="text-[#0A1128]/70">Columbia, South Carolina, United States</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/contact"
                className="inline-flex items-center justify-center bg-[#0A1128] hover:bg-[#1b2547] px-8 py-4 rounded-sm font-bold text-white text-sm uppercase tracking-[0.15em] transition-colors duration-200"
              >
                Send a Message
              </a>
              <a
                href="tel:+18034794492"
                className="inline-flex items-center justify-center border-2 border-[#0A1128] hover:bg-[#0A1128]/5 px-8 py-4 rounded-sm font-bold text-[#0A1128] text-sm uppercase tracking-[0.15em] transition-colors duration-200"
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
