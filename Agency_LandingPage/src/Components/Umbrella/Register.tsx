import React from 'react';
import { useSearchParams } from 'react-router-dom';

// Replace this with your actual Google Form share URL when ready.
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?usp=sharing';

const Register: React.FC = () => {
  const [searchParams] = useSearchParams();
  const service = searchParams.get('service') || '';

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-[#12022A] mb-4">Service registration</h1>
        <p className="text-gray-700 mb-6">Please complete the short registration form to express interest in the selected service. If you have a Google Form link, replace the placeholder URL in <code>Register.tsx</code>.</p>

        <div className="mb-6">
          <p className="text-sm text-gray-600">Selected service:</p>
          <div className="mt-2 font-semibold text-[#12022A]">{service || '— pick a service from the Services page'}</div>
        </div>

        <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
          <div style={{ aspectRatio: '4/3' }}>
            <iframe
              title="Google Form"
              src={GOOGLE_FORM_URL}
              className="w-full h-full border-0"
            />
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-4">Note: The iframe currently points to a placeholder Google Form URL. Create a Google Form, copy its "Send" → "Embed" link or full form URL, and paste it into `GOOGLE_FORM_URL` inside <code>src/Components/Umbrella/Register.tsx</code>. The Register buttons already pass the selected service as a query parameter.</p>
      </div>
    </main>
  );
};

export default Register;
