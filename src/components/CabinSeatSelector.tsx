import React, { useState } from 'react';

// Using dummy Seat type here if it's imported from types
import { Seat } from '../types';

interface CabinSeatSelectorProps {
  flightId: string;
  onSeatSelect: (seats: string[]) => void;
}

export default function CabinSeatSelector({ flightId, onSeatSelect }: CabinSeatSelectorProps) {
  const [cabin, setCabin] = useState<'FIRST' | 'BUSINESS' | 'ECONOMY'>('BUSINESS');
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  // Generate mock seats 5 rows
  const rows = ['1', '2', '3', '4', '5'];
  const columns = ['C', 'D', 'E'];

  const toggleSeat = (seatId: string) => {
    setSelectedSeat(prev => prev === seatId ? null : seatId);
    onSeatSelect(selectedSeat === seatId ? [] : [seatId]);
  };

  return (
    <div className="w-full bg-[#0a1a0f] border border-[#00ff88]/20 rounded-[24px] p-6 shadow-2xl relative font-mono text-white flex flex-col items-center">
      {/* Decorative Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none rounded-[24px]" style={{ backgroundImage: 'radial-gradient(#00ff88 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
      
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* HEADER */}
        <div className="w-full flex justify-between items-start mb-6">
          <div className="flex flex-col">
            <h2 className="text-[18px] font-bold text-white tracking-widest uppercase">SELECT SEATS</h2>
            <span className="text-[12px] text-[#00ff88] tracking-widest">DOCK: {cabin} CABIN</span>
          </div>
          <div className="flex items-center gap-2 bg-[#00ff88]/10 px-3 py-1.5 rounded-full border border-[#00ff88]/20">
            <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-[pulse_1.5s_ease-in-out_infinite]"></div>
            <span className="text-[10px] text-[#00ff88] font-bold tracking-widest">LIVE CABIN</span>
          </div>
        </div>

        {/* CABIN TOGGLE */}
        <div className="w-full flex mb-8 border border-[#00ff88]/30 rounded-lg overflow-hidden bg-[#0a1a0f]">
          {['FIRST', 'BUSINESS', 'ECONOMY'].map((cb) => (
            <button
              key={cb}
              onClick={() => setCabin(cb as any)}
              className={`flex-1 py-3 text-[12px] font-bold tracking-wider transition-colors outline-none
                ${cabin === cb ? 'bg-[#00ff88] text-[#0a1a0f]' : 'bg-transparent text-[#00ff88]/70 hover:bg-[#00ff88]/10'}
              `}
            >
              {cb}
            </button>
          ))}
        </div>

        {/* SVG SILHOUETTE + SEATS */}
        <div className="relative w-full flex justify-center mb-6">
          <div className="relative w-[300px] h-[360px] flex flex-col items-center justify-center p-4">
            {/* Plane SVG Shape Background */}
            <div className="absolute inset-0 pointer-events-none text-[#00ff88]/20" style={{ zIndex: 0 }}>
              <svg className="w-full h-full drop-shadow-[0_0_20px_rgba(0,255,136,0.1)]" preserveAspectRatio="none" viewBox="0 0 300 360">
                 {/* Fill background inside fuselage for aesthetic */}
                 <path d="M 150 0 C 70 0, 10 60, 10 120 L 10 360 L 290 360 L 290 120 C 290 60, 230 0, 150 0 Z" fill="#ffffff" fillOpacity="0.02" />
                 
                 {/* Cockpit curve */}
                 <path d="M 150 0 C 70 0, 10 60, 10 120" fill="none" stroke="currentColor" strokeWidth="4" />
                 <path d="M 150 0 C 230 0, 290 60, 290 120" fill="none" stroke="currentColor" strokeWidth="4" />
                 
                 {/* Fuselage straight lines */}
                 <line x1="10" y1="120" x2="10" y2="360" stroke="currentColor" strokeWidth="4" />
                 <line x1="290" y1="120" x2="290" y2="360" stroke="currentColor" strokeWidth="4" />
                 
                 {/* Cross line at top of cockpit */}
                 <path d="M 80 40 Q 150 20 220 40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
              </svg>
              
              <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                 <span className="text-[10px] text-[#00ff88]/50 font-bold tracking-[0.3em] uppercase">COCKPIT</span>
              </div>
            </div>

            {/* Seat grid content */}
            <div className="relative z-10 mt-16 w-full flex flex-col gap-4 px-[60px]">
              {rows.map(row => (
                <div key={row} className="flex justify-between items-center w-full">
                  {/* Left group - Col C */}
                  <div className="flex">
                    {(() => {
                      const id = row + columns[0]; // C
                      const isOccupied = id === '2C' || id === '4C';
                      const isSelected = selectedSeat === id;
                      return (
                        <button
                          disabled={isOccupied}
                          onClick={() => toggleSeat(id)}
                          className={`w-[28px] h-[28px] rounded flex items-center justify-center text-[10px] font-bold transition-all outline-none
                            ${isOccupied ? 'bg-white/10 text-white/30 border border-white/5 cursor-not-allowed' : 
                              isSelected ? 'bg-[#00ff88] text-[#0a1a0f] shadow-[0_0_10px_#00ff88] outline outline-2 outline-[#00ff88] outline-offset-1 z-10' : 
                              'border border-[#00ff88]/50 text-[#00ff88] hover:bg-[#00ff88]/20 hover:border-[#00ff88]'}
                          `}
                        >
                          {isOccupied ? 'X' : id}
                        </button>
                      )
                    })()}
                  </div>

                  {/* Aisle */}
                  <div className="flex-1 flex justify-center items-center relative">
                    <div className="h-[28px] w-px bg-[#00ff88]/20 border-r border-dashed border-[#00ff88]/30"></div>
                  </div>

                  {/* Right group - Cols D, E */}
                  <div className="flex gap-2">
                    {[columns[1], columns[2]].map(col => {
                      const id = row + col;
                      const isOccupied = id === '1D' || id === '5E';
                      const isSelected = selectedSeat === id;

                      return (
                        <button
                          key={id}
                          disabled={isOccupied}
                          onClick={() => toggleSeat(id)}
                          className={`w-[28px] h-[28px] rounded flex items-center justify-center text-[10px] font-bold transition-all outline-none
                            ${isOccupied ? 'bg-white/10 text-white/30 border border-white/5 cursor-not-allowed' : 
                              isSelected ? 'bg-[#00ff88] text-[#0a1a0f] shadow-[0_0_10px_#00ff88] outline outline-2 outline-[#00ff88] outline-offset-1 z-10' : 
                              'border border-[#00ff88]/50 text-[#00ff88] hover:bg-[#00ff88]/20 hover:border-[#00ff88]'}
                          `}
                        >
                          {isOccupied ? 'X' : id}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LEGEND */}
        <div className="w-full flex justify-center gap-6 pt-6 mt-auto border-t border-[#00ff88]/10 text-[10px] font-bold tracking-widest text-[#00ff88]/70">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#00ff88] shadow-[0_0_6px_#00ff88] rounded-[2px]"></div>
            <span>SELECTED</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border border-[#00ff88] rounded-[2px]"></div>
            <span>AVAILABLE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white/10 border border-white/5 flex items-center justify-center text-[6px] text-white/40">X</div>
            <span>OCCUPIED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
