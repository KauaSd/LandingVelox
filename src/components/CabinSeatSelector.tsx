import React, { useMemo } from 'react';
import { CabinClass, Seat } from '../types';
import { generateSeatsForClass } from '../constants';
import { motion } from 'motion/react';
import { Check, X, ShieldAlert, BadgeInfo } from 'lucide-react';

interface CabinSeatSelectorProps {
  selectedClass: CabinClass;
  onChangeClass: (newClass: CabinClass) => void;
  selectedSeats: string[];
  onToggleSeat: (seatId: string) => void;
  basePrice: number;
}

export default function CabinSeatSelector({
  selectedClass,
  onChangeClass,
  selectedSeats,
  onToggleSeat,
  basePrice,
}: CabinSeatSelectorProps) {
  // Generate seats grid based on selected class
  const seatsList = useMemo(() => {
    return generateSeatsForClass(selectedClass);
  }, [selectedClass]);

  // Dynamic ticket price multiplier
  const classMultiplier = {
    First: 1.8,
    Business: 1.0,
    Economy: 0.4,
  }[selectedClass];

  const singleSeatPrice = Math.round(basePrice * classMultiplier);
  const totalBill = selectedSeats.length * singleSeatPrice;

  // Split seats list into rows for structured layout
  const seatRows = useMemo(() => {
    const rowsMap: { [key: string]: Seat[] } = {};
    seatsList.forEach((seat) => {
      if (!rowsMap[seat.row]) {
        rowsMap[seat.row] = [];
      }
      rowsMap[seat.row].push(seat);
    });
    return Object.entries(rowsMap);
  }, [seatsList]);

  return (
    <section className="glass-card rounded-[24px] p-6 flex flex-col h-full bg-surface-container-low/40">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold font-sans text-primary tracking-wide uppercase">SELECT SEATS</h3>
          <p className="text-xs text-on-surface-variant font-mono">DOCK: {selectedClass.toUpperCase()} CABIN</p>
        </div>
        <div className="flex items-center gap-1.5 bg-primary-container/10 px-2.5 py-1 rounded-full border border-primary-container/20">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse shadow-[0_0_8px_#3dffa0]"></span>
          <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-primary-container">
            Live Cabin
          </span>
        </div>
      </div>

      {/* Cabin Class Selection Selector Tabs */}
      <div className="grid grid-cols-3 bg-surface rounded-xl p-1.5 mb-6 border border-outline-variant/30 font-mono text-xs">
        {(['First', 'Business', 'Economy'] as CabinClass[]).map((tab) => {
          const isActive = selectedClass === tab;
          return (
            <button
              key={tab}
              onClick={() => onChangeClass(tab)}
              className={`py-2 px-1 rounded-lg font-semibold tracking-wider transition-all duration-300 ${
                isActive
                  ? 'bg-primary-container text-surface-container-lowest font-bold shadow-[0_0_12px_rgba(61,255,160,0.3)]'
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high/40'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Airplane Cabin Visual Diagram Design */}
      <div className="flex-1 bg-surface-container-lowest/80 rounded-2xl border border-outline-variant/30 p-4 flex justify-center items-start mb-6 relative overflow-y-auto max-h-[300px]">
        {/* Fuselage layout guide container */}
        <div className="w-full max-w-[260px] border-x-2 border-t-[42px] border-primary-container/10 rounded-t-[100px] p-4 flex flex-col gap-6 relative">
          
          {/* Plane Nose Up Pointer */}
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-primary-container/40 flex flex-col items-center">
            <span className="text-[9px] font-mono tracking-widest font-bold">COCKPIT</span>
            <span className="material-symbols-outlined text-sm animate-bounce">keyboard_double_arrow_up</span>
          </div>

          <div className="flex flex-col gap-5 pt-4">
            {seatRows.map(([rowName, rowSeats]) => (
              <div key={rowName} className="flex flex-col gap-1">
                {/* Row Letter Tag */}
                <div className="text-[10px] text-center text-primary-container/50 font-mono font-bold">{rowName} Row</div>
                
                {/* Seat Columns Layout grid */}
                <div className="flex justify-between items-center gap-1.5 px-1">
                  {/* Left row cluster */}
                  <div className="flex gap-1.5">
                    {rowSeats.slice(0, Math.ceil(rowSeats.length / 2)).map((seat) => {
                      const isSelected = selectedSeats.includes(seat.id);
                      return (
                        <button
                          key={seat.id}
                          disabled={seat.isOccupied}
                          onClick={() => onToggleSeat(seat.id)}
                          className={`w-7 h-7 rounded text-[10px] font-mono font-bold flex items-center justify-center transition-all ${
                            seat.isOccupied
                              ? 'bg-surface-container-highest/60 text-on-surface-variant/30 cursor-not-allowed border border-outline-variant/20'
                              : isSelected
                              ? 'bg-primary-container/20 border-2 border-primary-container text-primary-container shadow-[0_0_10px_rgba(61,255,160,0.3)]'
                              : 'border border-primary-container/30 hover:border-primary-container/80 text-on-surface-variant hover:text-primary cursor-pointer'
                          }`}
                          title={`Seat ${seat.id} (${seat.class} Cabin)`}
                        >
                          {seat.isOccupied ? (
                            <X className="w-3 h-3 stroke-2 opacity-50" />
                          ) : isSelected ? (
                            <Check className="w-3 h-3 stroke-[3]" />
                          ) : (
                            seat.number
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Fuselage central aisle spacer */}
                  <div className="w-4 h-5 border-x border-dashed border-outline-variant/30 flex items-center justify-center">
                    <span className="text-[7px] text-on-surface-variant/30 font-mono">AISLE</span>
                  </div>

                  {/* Right row cluster */}
                  <div className="flex gap-1.5">
                    {rowSeats.slice(Math.ceil(rowSeats.length / 2)).map((seat) => {
                      const isSelected = selectedSeats.includes(seat.id);
                      return (
                        <button
                          key={seat.id}
                          disabled={seat.isOccupied}
                          onClick={() => onToggleSeat(seat.id)}
                          className={`w-7 h-7 rounded text-[10px] font-mono font-bold flex items-center justify-center transition-all ${
                            seat.isOccupied
                              ? 'bg-surface-container-highest/60 text-on-surface-variant/30 cursor-not-allowed border border-outline-variant/20'
                              : isSelected
                              ? 'bg-primary-container/20 border-2 border-primary-container text-primary-container shadow-[0_0_10px_rgba(61,255,160,0.3)]'
                              : 'border border-primary-container/30 hover:border-primary-container/80 text-on-surface-variant hover:text-primary cursor-pointer'
                          }`}
                          title={`Seat ${seat.id} (${seat.class} Cabin)`}
                        >
                          {seat.isOccupied ? (
                            <X className="w-3 h-3 stroke-2 opacity-50" />
                          ) : isSelected ? (
                            <Check className="w-3 h-3 stroke-[3]" />
                          ) : (
                            seat.number
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Seat Interactive Indicators Legend */}
      <div className="grid grid-cols-3 gap-1 bg-surface-container-low/80 p-2.5 rounded-xl border border-outline-variant/20 text-[10px] font-mono font-semibold text-center mb-6">
        <div className="flex items-center justify-center gap-1.5">
          <div className="w-3 h-3 rounded bg-primary-container/25 border border-primary-container"></div>
          <span className="text-on-surface">SELECTED</span>
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <div className="w-3 h-3 rounded border border-primary-container/45"></div>
          <span className="text-on-surface-variant">AVAILABLE</span>
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <div className="w-3 h-3 rounded bg-surface-container-highest/60 flex items-center justify-center text-on-surface-variant/40 border border-outline-variant/30">
            <X className="w-2.5 h-2.5" />
          </div>
          <span className="text-on-surface-variant/70">OCCUPIED</span>
        </div>
      </div>

      {/* Dynamically Calibrated Summary Panel */}
      <div className="bg-surface p-3.5 rounded-xl border border-secondary-container/40 flex justify-between items-center text-xs">
        <div>
          <div className="font-semibold text-primary">{selectedSeats.length} Seated • {selectedClass}</div>
          <div className="text-on-surface-variant text-[11px] font-mono">
            {selectedSeats.length > 0 
              ? `Seats: ${selectedSeats.join(', ')}` 
              : 'Please click active tags upstairs'}
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-on-surface-variant block uppercase tracking-widest leading-none mb-1">
            Price / Seat
          </span>
          <span className="text-sm font-bold font-mono text-primary-container">
            ${singleSeatPrice}
          </span>
        </div>
      </div>

      {/* Alert constraint check when seat list is empty */}
      {selectedSeats.length === 0 && (
        <div className="mt-3 flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-300 text-[10px] font-mono">
          <BadgeInfo className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Select at least 1 cabin seat to unlock checkout booking block.</span>
        </div>
      )}
    </section>
  );
}
