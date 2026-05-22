"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ThreeScene } from "./three-scene"
import { useTrafficSim } from "./use-traffic-sim"
import { ErrorBoundary } from "./ErrorBoundary"
import Link from "next/link"

type Dir = "N" | "S" | "E" | "W"

export default function TrafficSimApp() {
  const sim = useTrafficSim()
  const [ambDir, setAmbDir] = useState<Dir>("N")
  const [showHudDetails, setShowHudDetails] = useState(false)
  const phaseLabel = sim.state.phase === 0 ? "NS GREEN" : "EW GREEN"

  const anyAmbulanceWaiting = useMemo(
    () =>
      sim.state.queues.N.some((v) => v.type === "ambulance" && v.waiting) ||
      sim.state.queues.S.some((v) => v.type === "ambulance" && v.waiting) ||
      sim.state.queues.E.some((v) => v.type === "ambulance" && v.waiting) ||
      sim.state.queues.W.some((v) => v.type === "ambulance" && v.waiting),
    [sim.state.queues],
  )

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* 3D Scene */}
      <div className="flex-1 w-full min-h-0">
        <ErrorBoundary>
          <ThreeScene state={sim.state} />
        </ErrorBoundary>
      </div>

      {/* Overlay HUD */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-6">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <div className="pointer-events-auto max-w-xl rounded-[24px] border border-white/12 bg-slate-950/44 p-3.5 text-white shadow-[0_18px_60px_rgba(2,6,23,0.34)] backdrop-blur-lg">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-100/75">
                Adaptive Junction Control
                <span className="rounded-full border border-cyan-300/25 bg-cyan-400/10 px-2 py-0.5 tracking-[0.18em] text-cyan-100">
                  Live
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-white/15 bg-white/8 text-[11px] uppercase tracking-[0.18em] text-white hover:bg-white/14 hover:text-white"
                onClick={() => setShowHudDetails((value) => !value)}
              >
                {showHudDetails ? "Hide stats" : "Show stats"}
              </Button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <div
                className={cn(
                  "inline-flex rounded-full px-4 py-2 text-sm font-semibold tracking-[0.2em]",
                  sim.state.phase === 0
                    ? "bg-emerald-400/15 text-emerald-100 ring-1 ring-emerald-300/25"
                    : "bg-cyan-400/15 text-cyan-100 ring-1 ring-cyan-300/25",
                )}
                title="0 = NS green, 1 = EW green"
              >
                {phaseLabel}
              </div>
              <CompactStat label="Timer" value={`${sim.state.phaseTime.toFixed(1)}s`} />
              <CompactStat label="Epsilon" value={sim.state.epsilon.toFixed(2)} />
              <CompactStat label="Cleared" value={sim.state.clearedCount} />
            </div>

            {showHudDetails && (
              <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
                <MetricPill label="Reward" value={sim.state.cumulativeReward.toFixed(2)} tone="cyan" />
                <MetricPill label="Cleared" value={sim.state.clearedCount} tone="emerald" />
                <MetricPill label="Waiting" value={sim.state.totalWaiting.toFixed(1)} tone="amber" />
                <MetricPill label="Collisions" value={sim.state.collisions} tone="rose" />
              </div>
            )}
          </div>

          {anyAmbulanceWaiting && (
            <div className="pointer-events-auto self-start rounded-full border border-rose-200/85 bg-rose-600/88 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.24em] text-white shadow-[0_14px_44px_rgba(225,29,72,0.5)] ring-2 ring-rose-300/45 backdrop-blur-md animate-pulse">
              Leave way for ambulance
            </div>
          )}
        </div>

        <div className="self-center w-full max-w-6xl">
          <div className="w-full xl:min-w-0">
            <div className="pointer-events-auto rounded-[30px] border border-white/12 bg-slate-950/54 p-3 text-white shadow-[0_24px_80px_rgba(15,23,42,0.38)] backdrop-blur-xl">
              <div className="flex flex-wrap items-center gap-3 xl:flex-nowrap xl:justify-between xl:gap-0">
                <Button
                  variant={sim.state.running ? "secondary" : "default"}
                  className="rounded-full border-0 bg-cyan-400 text-slate-950 shadow-[0_10px_30px_rgba(34,211,238,0.35)] hover:bg-cyan-300 xl:shrink-0"
                  onClick={sim.toggleRun}
                >
                  {sim.state.running ? "Pause" : "Start"}
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-white/20 bg-white/8 text-white hover:bg-white/14 hover:text-white xl:shrink-0"
                  onClick={sim.stepOnce}
                >
                  Step
                </Button>
                <Button
                  variant="destructive"
                  className="rounded-full bg-rose-500/90 text-white hover:bg-rose-400 xl:shrink-0"
                  onClick={sim.reset}
                >
                  Reset
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-white/20 bg-white/8 text-white hover:bg-white/14 hover:text-white xl:shrink-0"
                  onClick={() => sim.spawnRandomCar()}
                >
                  Spawn Car
                </Button>
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 xl:shrink-0">
                  Emergency entry
                </div>
                <select
                  className="rounded-full border border-white/20 bg-white/8 px-4 py-2 text-sm text-white outline-none transition focus:border-cyan-300/55 focus:bg-white/12 xl:shrink-0"
                  style={{ colorScheme: "dark" }}
                  value={ambDir}
                  onChange={(e) => setAmbDir(e.target.value as Dir)}
                >
                  <option value="N" className="bg-slate-900 text-slate-50">
                    North
                  </option>
                  <option value="S" className="bg-slate-900 text-slate-50">
                    South
                  </option>
                  <option value="E" className="bg-slate-900 text-slate-50">
                    East
                  </option>
                  <option value="W" className="bg-slate-900 text-slate-50">
                    West
                  </option>
                </select>
                <Button
                  variant="default"
                  className="rounded-full bg-white text-slate-950 shadow-[0_10px_26px_rgba(255,255,255,0.18)] hover:bg-slate-100 xl:shrink-0"
                  onClick={() => sim.spawnAmbulance(ambDir)}
                >
                  Spawn Ambulance
                </Button>
                <Link
                  href="/traffic/dashboard"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/8 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/14 xl:shrink-0"
                >
                  Open Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CompactStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-full border border-white/10 bg-white/8 px-3 py-2">
      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{label}</div>
      <div className="mt-0.5 text-sm font-semibold text-white">{value}</div>
    </div>
  )
}

function MetricPill({
  label,
  value,
  tone,
}: {
  label: string
  value: string | number
  tone: "cyan" | "emerald" | "amber" | "rose"
}) {
  const toneClass = {
    cyan: "border-cyan-300/20 bg-cyan-400/10 text-cyan-50",
    emerald: "border-emerald-300/20 bg-emerald-400/10 text-emerald-50",
    amber: "border-amber-300/20 bg-amber-400/10 text-amber-50",
    rose: "border-rose-300/20 bg-rose-400/10 text-rose-50",
  }[tone]

  return (
    <div className={cn("rounded-2xl border px-3 py-2.5", toneClass)}>
      <div className="text-[11px] uppercase tracking-[0.22em] opacity-70">{label}</div>
      <div className="mt-1 text-base font-semibold">{value}</div>
    </div>
  )
}
