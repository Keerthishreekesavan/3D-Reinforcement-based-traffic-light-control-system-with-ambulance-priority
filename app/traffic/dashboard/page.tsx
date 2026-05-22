'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type LogEntry = {
  t: number;
  reward: number;
  collisions: number;
  waits: number;
  throughput: number;
  ambWait: number;
};

const axisStyle = {
  fill: '#94a3b8',
  fontSize: 12,
};

const tooltipStyle = {
  backgroundColor: 'rgba(15, 23, 42, 0.96)',
  border: '1px solid rgba(148, 163, 184, 0.2)',
  borderRadius: '16px',
  color: '#e2e8f0',
};

function formatTimeTick(value: number) {
  if (!Number.isFinite(value)) return '';
  return `${value.toFixed(1)}s`;
}

function formatNumber(value: number, digits = 1) {
  if (!Number.isFinite(value)) return '0';
  return value.toFixed(digits);
}

function DashboardPanel({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[28px] border border-white/10 bg-slate-900/72 p-5 shadow-[0_20px_80px_rgba(2,6,23,0.36)] backdrop-blur-xl ${className}`}
    >
      {children}
    </section>
  );
}

function MetricCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">{label}</div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="text-3xl font-semibold text-slate-50">{value}</div>
        <div className="h-10 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
      </div>
    </div>
  );
}

function ChartCard({
  title,
  description,
  data,
  dataKey,
  stroke,
  yLabel,
}: {
  title: string;
  description: string;
  data: LogEntry[];
  dataKey: keyof LogEntry;
  stroke: string;
  yLabel: string;
}) {
  return (
    <DashboardPanel className="p-4 sm:p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-50">{title}</h3>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>
      <div className="h-[230px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
            <CartesianGrid stroke="rgba(148, 163, 184, 0.18)" strokeDasharray="3 3" />
            <XAxis
              dataKey="t"
              tick={axisStyle}
              tickLine={false}
              axisLine={{ stroke: 'rgba(148, 163, 184, 0.25)' }}
              minTickGap={28}
              tickFormatter={(value) => formatTimeTick(Number(value))}
            />
            <YAxis
              tick={axisStyle}
              tickLine={false}
              axisLine={{ stroke: 'rgba(148, 163, 184, 0.25)' }}
              width={48}
              label={{
                value: yLabel,
                angle: -90,
                position: 'insideLeft',
                fill: '#94a3b8',
                style: { textAnchor: 'middle' },
              }}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ stroke: 'rgba(255,255,255,0.18)', strokeWidth: 1 }}
              labelStyle={{ color: '#cbd5e1', fontWeight: 600 }}
              formatter={(value: number) => [formatNumber(Number(value), 2), title]}
              labelFormatter={(label) => `Time: ${formatTimeTick(Number(label))}`}
            />
            <Line type="monotone" dataKey={dataKey} stroke={stroke} strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardPanel>
  );
}

export default function Dashboard() {
  const [logData, setLogData] = useState<LogEntry[]>([]);
  const [lastEntry, setLastEntry] = useState<LogEntry | null>(null);

  useEffect(() => {
    const fetchData = () => {
      try {
        const data = JSON.parse(localStorage.getItem('traffic-rl-log') || '[]') as LogEntry[];
        setLogData(data);
        setLastEntry(data[data.length - 1] ?? null);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const avgReward =
    logData.length > 0 ? logData.reduce((sum, entry) => sum + entry.reward, 0) / logData.length : 0;

  if (logData.length === 0) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center p-6">
        <DashboardPanel className="w-full max-w-2xl text-center">
          <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-200/70">
            RL Traffic Dashboard
          </div>
          <h1 className="mt-4 text-3xl font-semibold text-slate-50">No simulation logs yet</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300">
            Run the simulator for a little while and spawn a few cars or ambulances. The dashboard will start filling
            with readable live metrics and trend charts as soon as logs are written.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/traffic"
              className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Back to Simulator
            </Link>
          </div>
        </DashboardPanel>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-200/70">Analytics</div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-50">RL Traffic Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            A clearer view of traffic reward, waiting load, ambulance priority, and throughput trends from the live
            simulator.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-full border border-white/10 bg-slate-900/60 px-4 py-2 text-sm text-slate-300">
            {logData.length} entries
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('traffic-rl-log');
              setLogData([]);
              setLastEntry(null);
            }}
            className="inline-flex items-center justify-center rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
          >
            Clear Logs
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-8">
        <DashboardPanel>
          <h2 className="text-xl font-semibold text-slate-50">Environment spec</h2>
          <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-300">
            <p>
              <span className="font-semibold text-slate-100">State:</span> waiting counts per axis, ambulance presence,
              and evolving queue pressure.
            </p>
            <p>
              <span className="font-semibold text-slate-100">Action:</span> `0` keeps north-south green and `1` keeps
              east-west green, with a minimum green duration enforced.
            </p>
            <p>
              <span className="font-semibold text-slate-100">Reward:</span> positive reward for clearing traffic,
              stronger reward for ambulances, and penalties for excess waiting, collisions, near misses, and frequent
              switching.
            </p>
            <p>
              <span className="font-semibold text-slate-100">Dynamics:</span> two lanes per approach, safe spacing,
              lane changes for overtaking, and ambulance-first signal decisions.
            </p>
          </div>
        </DashboardPanel>

        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-slate-50">Live metrics</h2>
            <p className="mt-1 text-sm text-slate-400">Snapshot from the most recent logged simulation state.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <MetricCard label="Average reward" value={formatNumber(avgReward, 2)} accent="#38bdf8" />
            <MetricCard label="Throughput" value={String(lastEntry?.throughput ?? 0)} accent="#22c55e" />
            <MetricCard label="Collisions" value={String(lastEntry?.collisions ?? 0)} accent="#f43f5e" />
            <MetricCard label="Total wait" value={`${formatNumber(lastEntry?.waits ?? 0, 1)}s`} accent="#f59e0b" />
            <MetricCard label="Ambulance wait" value={String(lastEntry?.ambWait ?? 0)} accent="#a78bfa" />
          </div>
        </section>

        <ChartCard
          title="Reward over time"
          description="How the controller is being rewarded as traffic clears or congestion builds."
          data={logData}
          dataKey="reward"
          stroke="#8b5cf6"
          yLabel="Reward"
        />

        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-slate-50">More metrics</h2>
            <p className="mt-1 text-sm text-slate-400">Breakdowns of safety, congestion, and throughput over time.</p>
          </div>
          <div className="grid gap-6">
            <ChartCard
              title="Collisions over time"
              description="Collision count should stay flat or near zero in a healthy run."
              data={logData}
              dataKey="collisions"
              stroke="#f43f5e"
              yLabel="Collisions"
            />
            <ChartCard
              title="Total wait over time"
              description="Aggregate waiting load across vehicles. Lower is better."
              data={logData}
              dataKey="waits"
              stroke="#f59e0b"
              yLabel="Wait"
            />
            <ChartCard
              title="Throughput over time"
              description="Number of vehicles cleared as the simulation progresses."
              data={logData}
              dataKey="throughput"
              stroke="#10b981"
              yLabel="Cleared"
            />
          </div>
        </section>

        <DashboardPanel>
          <h2 className="text-lg font-semibold text-slate-50">Notes</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            The simulator maintains safe gaps, allows lane changes to pass slower traffic, and heavily penalizes
            overlap so vehicles separate quickly if a risky interaction occurs. This dashboard focuses on readability
            first: clearer cards, explicit contrast, and charts with simplified time labels.
          </p>
        </DashboardPanel>
      </div>
    </main>
  );
}
