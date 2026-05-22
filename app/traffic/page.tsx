import ClientTrafficSim from '@/components/traffic/ClientTrafficSim';  // This imports the wrapper

export default function TrafficPage() {
  return (
    <div className="flex flex-col h-screen">
      {/* Static content (server-rendered) */}
      <div className="px-4 pb-3 pt-4 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-50">
          3D RL-based traffic signal simulation prioritizing ambulances
        </h1>
        <p className="mt-2 text-base font-medium tracking-[0.08em] text-cyan-200/80">
          Keerthishree Kesavan
        </p>
      </div>
      
      {/* Client-side sim via wrapper - takes remaining space */}
      <div className="flex-1 w-full min-h-0">
        <ClientTrafficSim />
      </div>
    </div>
  );
}
