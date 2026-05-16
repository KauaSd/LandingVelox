import React, { useState } from 'react';
import { ArrowRightLeft, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Flight } from '../types';

interface FlightSearchWidgetProps {
  onResults: (flights: Flight[]) => void;
}

interface CustomDatePickerProps {
  value: string;
  onChange: (val: string) => void;
  label: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 9)); // Simulate Oct 2026

  const days = Array.from({length: 31}, (_, i) => i + 1);

  const formatDate = (val: string) => {
    if (!val) return '';
    const [y, m, d] = val.split('-');
    const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    return `${dateObj.getDate()} ${dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase()}`;
  };

  return (
    <div className="flex-1 bg-white/[0.03] rounded-[12px] p-4 cursor-pointer hover:bg-white/[0.06] transition-colors outline-none" onClick={() => setIsOpen(!isOpen)}>
      <div className="flex flex-col">
        <span className="text-[10px] text-white/50 uppercase font-bold tracking-widest whitespace-nowrap">{label}</span>
        <span className="text-[16px] sm:text-[18px] font-bold text-white mt-1 uppercase truncate min-h-[24px]">
          {value ? formatDate(value) : '---'}
        </span>
      </div>

      {isOpen && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] bg-[#0a1a0f] border border-[#00ff88]/80 rounded-xl shadow-[0_0_40px_rgba(0,255,136,0.3)] z-[9999] p-5 font-mono cursor-default" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-4 text-[#00ff88]">
            <button type="button" onClick={(e) => { e.stopPropagation(); setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)) }} className="p-1 hover:bg-[#00ff88]/20 rounded transition-colors outline-none"><ChevronLeft className="w-5 h-5"/></button>
            <span className="text-sm tracking-widest uppercase font-bold">{currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</span>
            <button type="button" onClick={(e) => { e.stopPropagation(); setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)) }} className="p-1 hover:bg-[#00ff88]/20 rounded transition-colors outline-none"><ChevronRight className="w-5 h-5"/></button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-[#00ff88]/60 mb-2 font-bold tracking-widest">
            <div>SU</div><div>MO</div><div>TU</div><div>WE</div><div>TH</div><div>FR</div><div>SA</div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            <div className="col-span-4 border border-[#00ff88]/10 rounded-sm bg-[#00ff88]/5"></div>
            {days.map(day => {
               const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth()+1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
               const isSelected = value === dateStr;
               return (
                 <button 
                   type="button"
                   key={day}
                   onClick={(e) => { e.stopPropagation(); onChange(dateStr); setIsOpen(false); }}
                   className={`h-8 rounded-md flex items-center justify-center text-[12px] font-bold transition-all outline-none
                     ${isSelected ? 'bg-[#00ff88] text-[#0a1a0f] shadow-[0_0_12px_rgba(0,255,136,0.8)]' : 'text-white hover:text-[#00ff88] hover:bg-[#00ff88]/10 border border-transparent hover:border-[#00ff88]/30'}
                   `}
                 >
                   {day}
                 </button>
               );
            })}
          </div>
          <div className="mt-4 flex justify-end">
            <button type="button" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="text-[10px] text-white/50 hover:text-white uppercase tracking-widest outline-none">Close</button>
          </div>
        </div>
      )}
      
      {/* Backdrop for fixed view - blocking clicks to outside */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-[9998]" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}></div>
      )}
    </div>
  );
};

export default function FlightSearchWidget({ onResults }: FlightSearchWidgetProps) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [depDate, setDepDate] = useState('');
  const [retDate, setRetDate] = useState('');
  const [isSwapped, setIsSwapped] = useState(false);

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
    setIsSwapped(!isSwapped);
  };

  const handleSearch = () => {
    // Return dummy results just so UI behaves 
    onResults([]); 
  };

  return (
    <div className="w-full bg-[#0a1a0f] border border-[#00ff88]/20 rounded-[28px] p-6 shadow-[0_16px_40px_rgba(10,26,15,0.8)] relative font-mono text-white h-auto overflow-visible">
      {/* BACKGROUND ACCENT */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#00ff88]/5 blur-3xl pointer-events-none rounded-full"></div>

      <div className="relative z-10 w-full flex flex-col pt-2 gap-8">
        
        {/* ROW 1: FROM <-> TO */}
        <div className="flex justify-between items-center w-full">
          
          <div className="flex flex-col w-[40%]">
            <span className="text-[10px] sm:text-[11px] text-white/50 uppercase font-bold tracking-widest mb-1">FROM</span>
            <input 
              className="w-full bg-transparent outline-none text-[24px] sm:text-[28px] font-extrabold text-white text-left uppercase placeholder:text-white/20 min-w-0" 
              value={from} 
              onChange={e => setFrom(e.target.value)} 
              placeholder="ORIG"
            />
          </div>
          
          {/* Animated Swap Button */}
          <motion.button 
            whileTap={{ scale: 0.9 }}
            animate={{ rotate: isSwapped ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            onClick={handleSwap}
            className="w-12 h-12 flex-shrink-0 rounded-full bg-[#00ff88] flex items-center justify-center text-[#0a1a0f] z-10 shadow-[0_0_20px_rgba(0,255,136,0.5)] outline-none"
            title="Swap Origin and Destination"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </motion.button>

          <div className="flex flex-col w-[40%] text-right items-end">
            <span className="text-[10px] sm:text-[11px] text-white/50 uppercase font-bold tracking-widest mb-1 whitespace-nowrap">TO</span>
            <input 
              className="w-full bg-transparent outline-none text-[24px] sm:text-[28px] font-extrabold text-white text-right uppercase placeholder:text-white/20 min-w-0" 
              value={to} 
              onChange={e => setTo(e.target.value)} 
              placeholder="DEST"
            />
          </div>

        </div>

        {/* ROW 2: DEPARTURE & RETURN DATES */}
        <div className="flex gap-4">
          <CustomDatePicker label="DEPARTURE DATE" value={depDate} onChange={setDepDate} />
          <CustomDatePicker label="RETURN DATE" value={retDate} onChange={setRetDate} />
        </div>

        {/* SEARCH BUTTON */}
        <motion.button 
          whileHover={{ y: -2, boxShadow: '0px 0px 30px rgba(0,255,136,0.6)' }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSearch}
          className="w-full flex items-center justify-center gap-3 bg-[#00ff88] text-[#0a1a0f] py-4 rounded-xl text-[14px] sm:text-[16px] font-extrabold tracking-[0.1em] uppercase shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-colors border border-transparent outline-none focus:ring-2 focus:ring-[#00ff88] focus:ring-offset-2 focus:ring-offset-[#0a1a0f]"
        >
          <Search className="w-5 h-5 stroke-[3]" />
          SEARCH TICKET (3)
        </motion.button>

      </div>
    </div>
  );
}
