import type { ReactNode } from 'react';
import { IS_DEVELOPMENT_MOCK_MODE } from '../lib/runtimeFlags';

interface DevelopmentFixtureGateProps {
  children: ReactNode;
  feature: string;
}

/**
 * Prevents prototype records and actions from being presented as live data.
 * The gated UI is available only for an explicitly enabled local/dev demo.
 */
const DevelopmentFixtureGate = ({ children, feature }: DevelopmentFixtureGateProps) => {
  if (IS_DEVELOPMENT_MOCK_MODE) {
    return <>{children}</>;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0D0118] p-6 text-white">
      <section
        aria-labelledby="fixture-unavailable-title"
        className="w-full max-w-xl rounded-2xl border border-[#4B1E91] bg-[#1E0A4A] p-8 text-center"
        role="status"
      >
        <h1 id="fixture-unavailable-title" className="text-2xl font-bold">
          {feature} unavailable
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#F5F0E8]">
          Live data is not connected for this area. Prototype records and actions are hidden outside an explicitly enabled development demo.
        </p>
      </section>
    </main>
  );
};

export default DevelopmentFixtureGate;
