'use client';

import dynamic from 'next/dynamic';

const TrafficSimApp = dynamic(() => import('./traffic-sim-app'), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white">Loading simulator...</div>,
});

export default function ClientTrafficSim() {
  return (
    <div className="w-full h-full">
      <TrafficSimApp />
    </div>
  );
}