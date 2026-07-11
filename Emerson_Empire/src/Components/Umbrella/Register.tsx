import React from 'react';
import { useSearchParams } from 'react-router-dom';

const GOOGLE_FORM_URL = import.meta.env.VITE_GOOGLE_REGISTER_FORM_URL as string | undefined;

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
            {GOOGLE_FORM_URL ? (
              <iframe
                title="Google Form"
                src={GOOGLE_FORM_URL}
                className="w-full h-full border-0"
              />
            ) : (
              <div className="flex items-center justify-center p-10 text-center text-sm text-slate-600">
                The registration form is not configured yet. Please contact us at{' '}
                <a href="mailto:webdev@theemersonempire.info" className="text-[#C9A84C] hover:underline">webdev@theemersonempire.info</a>{' '}
                for access information.
              </div>
            )}
          </div>
        </div>

        {!GOOGLE_FORM_URL && (
          <p className="text-xs text-gray-500 mt-4">
            No form is available because the registration form URL has not been configured in the environment. Set <code>VITE_GOOGLE_REGISTER_FORM_URL</code> in your deployment settings, or contact the site owner for next steps.
          </p>
        )}
      </div>
    </main>
  );
};

export default Register;
