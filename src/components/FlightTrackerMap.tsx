import React from 'react';
import { motion } from 'motion/react';
import { Play, Pause, RotateCcw, Plane, Milestone } from 'lucide-react';

interface FlightTrackerMapProps {
  flightNo: string;
  fromCode: string;
  toCode: string;
  departureTime: string;
  arrivalTime: string;
  distance: number;
  progress: number;
  isSimulating: boolean;
  onToggleSim: () => void;
  onResetSim: () => void;
}

export default function FlightTrackerMap({
  flightNo,
  fromCode,
  toCode,
  departureTime,
  arrivalTime,
  distance,
  progress,
  isSimulating,
  onToggleSim,
  onResetSim,
}: FlightTrackerMapProps) {
  const currentDistance = Math.floor((progress / 100) * distance);

  return (
    <section className="glass-card rounded-[24px] h-[480px] relative overflow-hidden group flex flex-col justify-between p-6">
      {/* Background Satellite Map image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          alt="Satellite Ocean View"
          className="w-full h-full object-cover opacity-35 mix-blend-luminosity brightness-75 transition-all duration-700 scale-102 group-hover:scale-105"
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop"
        />
        <div className="absolute inset-0 diagonal-grid opacity-15"></div>
        <div className="absolute inset-0 radar-sweep opacity-20"></div>
      </div>

      {/* Top row: Airport Codes Overlays */}
      <div className="relative z-10 flex justify-between items-start gap-4">
        <div className="glass-card p-3 rounded-xl border-primary-container/20">
          <div className="text-[10px] text-primary-container font-mono font-bold tracking-widest">DEPARTURE</div>
          <div className="text-xl font-bold font-sans text-primary">{fromCode}</div>
          <div className="text-xs text-on-surface-variant">{departureTime}</div>
        </div>

        <div className="text-center bg-surface/80 px-3 py-1.5 rounded-full border border-outline-variant/50 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
          <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-primary-container">
            {flightNo} Active Tracker
          </span>
        </div>

        <div className="glass-card p-3 rounded-xl border-primary-container/20 text-right">
          <div className="text-[10px] text-primary-container font-mono font-bold tracking-widest text-right">ARRIVAL</div>
          <div className="text-xl font-bold font-sans text-primary">{toCode}</div>
          <div className="text-xs text-on-surface-variant">{arrivalTime}</div>
        </div>
      </div>

      {/* Interactive Simulation Plane Path */}
      <div className="relative z-10 w-full px-12 py-6 flex items-center justify-center">
        <div className="relative w-full h-1 bg-secondary-container/30 border-b-2 border-dashed border-outline-variant/60">
          {/* Dotted path tracking segment completed */}
          <div
            className="absolute top-0 left-0 h-1 transition-all duration-300 ease-out border-b-2 border-primary-container"
            style={{ width: `${progress}%` }}
          />

          {/* Animating Plane Icon */}
          <motion.div
            className="absolute -top-3.5 origin-center cursor-pointer"
            style={{ left: `calc(${progress}% - 14px)` }}
            animate={{ scale: isSimulating ? [1, 1.1, 1] : 1 }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <div className="relative p-1 bg-surface border border-primary-container rounded-full shadow-[0_0_12px_#3dffa0] hover:bg-neutral-900 transition-colors">
              <Plane className="w-5 h-5 text-primary-container transform rotate-90" />
            </div>
            {/* Pulsating ripple beneath plane */}
            <span className="absolute -top-1 -left-1 w-8 h-8 rounded-full border border-primary-container/30 animate-ping -z-10 pointer-events-none"></span>
          </motion.div>
        </div>
      </div>

      {/* Bottom controls & Progress Bar summary */}
      <div className="relative z-10 w-full flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row justify-between items-center bg-surface-container-low/80 p-3 rounded-xl border border-secondary-container/30 gap-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-on-surface-variant font-mono uppercase tracking-widest font-semibold flex items-center gap-1">
              <Milestone className="w-3 h-3 text-primary-container" /> Trajectory Information
            </span>
            <div className="text-sm font-bold text-primary flex items-center gap-2">
              <span className="font-mono text-primary-container">{currentDistance.toLocaleString()}</span>
              <span className="text-xs text-on-surface-variant font-normal">of</span>
              <span className="font-mono">{distance.toLocaleString()} km</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary-container/10 border border-primary-container/30 text-primary-container font-mono">
                {Math.round(progress)}% Finished
              </span>
            </div>
          </div>

          {/* Action Simulation Controller */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleSim}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
                isSimulating
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30'
                  : 'bg-primary-container/20 text-primary-container border border-primary-container/43 hover:bg-primary-container/30'
              }`}
              title={isSimulating ? 'Pause Cruise Mode Simulation' : 'Engage Cruise Mode Simulation'}
            >
              {isSimulating ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" /> PAUSE
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" /> FLIGHT SIM
                </>
              )}
            </button>

            <button
              onClick={onResetSim}
              className="p-1.5 rounded-lg bg-surface-container-highest text-on-surface-variant hover:text-primary transition-all border border-outline-variant/30 active:scale-95"
              title="Reset Flight Status to Gate"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Outer progress line bar */}
        <div className="h-2 w-full bg-surface rounded-full overflow-hidden border border-outline-variant/20 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-primary-container/30 to-primary-container rounded-full transition-all duration-300 ease-out shadow-[0_0_8px_#3dffa0]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
  );
}
