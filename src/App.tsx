import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Navigation,
  Plane,
  Search,
  Sliders,
  Bell,
  Sparkles,
  ArrowLeftRight,
  TrendingUp,
  Ticket,
  MapPin,
  CalendarDays,
  CheckCircle,
  HelpCircle,
  BookOpen,
  Volume2,
  AlertCircle,
  BadgeInfo,
  Layers,
  ShieldCheck,
  Award
} from 'lucide-react';
import { AIRPORTS, INITIAL_FLIGHTS } from './constants';
import { Flight, CabinClass, NotificationItem } from './types';

const FlightTrackerMap = lazy(() => import('./components/FlightTrackerMap'));
const CabinSeatSelector = lazy(() => import('./components/CabinSeatSelector'));
const CheckoutModal = lazy(() => import('./components/CheckoutModal'));
const AiCopilot = lazy(() => import('./components/AiCopilot'));
const FlightSearchWidget = lazy(() => import('./components/FlightSearchWidget'));
const AuthModal = lazy(() => import('./components/AuthModal'));

export default function App() {
  // Navigation Tabs State: 'dashboard' | 'flights' | 'schedule' | 'support'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'flights' | 'schedule' | 'support'>('dashboard');

  // Flight routing states (JFK to MXP initially)
  const [fromAirport, setFromAirport] = useState('JFK');
  const [toAirport, setToAirport] = useState('MXP');
  const [dropdownFromOpen, setDropdownFromOpen] = useState(false);
  const [dropdownToOpen, setDropdownToOpen] = useState(false);

  // Active dates
  const [departureDate, setDepartureDate] = useState('12 Oct');
  const [returnDate, setReturnDate] = useState('24 Oct');

  // Selected carriers & dynamic searches
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<CabinClass>('Business');
  const [selectedSeats, setSelectedSeats] = useState<string[]>(['D1', 'E1']);
  const [activeFlights, setActiveFlights] = useState<Flight[]>(INITIAL_FLIGHTS);
  
  // Loaded carrier detail based on matching From/To
  const [activeFlight, setActiveFlight] = useState<Flight>(INITIAL_FLIGHTS[0]);

  // General Filter panels for flights list
  const [carrierFilter, setCarrierFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Interactive Live simulation tracking loop states
  const [simProgress, setSimProgress] = useState(36); // Matching mockup initial percentage
  const [isSimulating, setIsSimulating] = useState(false);

  // Notifications systems
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Departure Gateway Assigned',
      message: 'Lufthansa LH 401 gate updated to Runway A14. Readying boarding pass protocols.',
      type: 'success',
      timestamp: '15:05 Z'
    },
    {
      id: 'notif-2',
      title: 'North Atlantic Weather Warning',
      message: 'Thermal jet stream activity detected at index level-4. Expect initial clearance protocols.',
      type: 'warn',
      timestamp: '14:30 Z'
    }
  ]);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  // Checkout overlay states
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Auth states
  const [user, setUser] = useState<{name: string, email: string} | null>(() => {
    const saved = sessionStorage.getItem('velox_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Static alerts list
  const [systemAlert, setSystemAlert] = useState<string | null>(null);

  // Dynamic calculation for seats base charges
  const classMultiplier = useMemo(() => {
    return {
      First: 1.8,
      Business: 1.0,
      Economy: 0.4
    }[selectedClass];
  }, [selectedClass]);

  const singleSeatPrice = Math.round(activeFlight.basePrice * classMultiplier);
  const totalPrice = selectedSeats.length * singleSeatPrice;

  // Sync state whenever flight routes or selection parameters change
  useEffect(() => {
    const match = activeFlights.find(
      (f) => f.from === fromAirport && f.to === toAirport
    );
    if (match) {
      setActiveFlight(match);
      setSimProgress(match.progress || 0);
    } else {
      // Create a simulated custom dynamically generated flight if row isn't in constant list
      const randomFlight: Flight = {
        id: `dyn-${Date.now()}`,
        flightNo: `VX ${Math.floor(100 + Math.random() * 800)}`,
        airlineName: 'Velox Aero-Tech',
        airlineLogoUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=120&auto=format&fit=crop',
        from: fromAirport,
        to: toAirport,
        departureTime: '09:40 AM',
        arrivalTime: '11:15 PM',
        basePrice: 520,
        duration: '10h 20m',
        aircraft: 'A350-1000 Premium',
        distance: 7200,
        status: 'Scheduled',
        progress: 0,
        gate: 'G24'
      };
      setActiveFlight(randomFlight);
      setSimProgress(0);
    }
    // Clean out previous selections when route changes
    setSelectedSeats([]);
  }, [fromAirport, toAirport, activeFlights]);

  // Tracking Simulation timer loops
  useEffect(() => {
    let intervalId: any = null;
    if (isSimulating) {
      intervalId = setInterval(() => {
        setSimProgress((prev) => {
          if (prev >= 100) {
            setIsSimulating(false);
            addNotification(
              'Arrival Confirmed',
              `Flight ${activeFlight.flightNo} successfully landed at terminal sector ${toAirport}. Welcome!`,
              'success'
            );
            return 100;
          }
          return prev + 0.5; // Slowly advance
        });
      }, 800);
    }
    return () => clearInterval(intervalId);
  }, [isSimulating, activeFlight, toAirport]);

  // Utility to dispatch user alerts/notifications
  const addNotification = (title: string, message: string, type: 'info' | 'success' | 'warn' | 'alert') => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Z'
    };
    setNotifications((prev) => [newNotif, ...prev]);
    // Display brief state alert on screen banner
    setSystemAlert(`${title}: ${message}`);
    setTimeout(() => setSystemAlert(null), 5000);
  };

  // Switch/Rotate route airports selection
  const handleSwapRoute = () => {
    const temp = fromAirport;
    setFromAirport(toAirport);
    setToAirport(temp);
    addNotification('Route Inverted', `Searching flights matching terminal ${toAirport} ➔ ${fromAirport}`, 'info');
  };

  // Selection from airport tables updates state
  const selectProposition = (f: Flight) => {
    setFromAirport(f.from);
    setToAirport(f.to);
    setActiveFlight(f);
    setSimProgress(f.progress || 0);
    addNotification(
      'Proposition Loaded',
      `Switched terminal systems to carrier deal: ${f.airlineName} ${f.flightNo}`,
      'success'
    );
  };

  // Seat toggle selection
  const handleToggleSeat = (seatId: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  };

  // Filter lists configuration
  const filteredFlights = useMemo(() => {
    return activeFlights.filter((f) => {
      const matchQuery =
        f.flightNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.airlineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.aircraft.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCarrier = carrierFilter === 'All' ? true : f.airlineName === carrierFilter;
      const matchStatus = statusFilter === 'All' ? true : f.status === statusFilter;

      return matchQuery && matchCarrier && matchStatus;
    });
  }, [activeFlights, searchQuery, carrierFilter, statusFilter]);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* 1. TOP NAVBAR SECTION */}
      <nav className="bg-surface/75 backdrop-blur-xl border-b border-primary/20 shadow-[0_10px_30px_-10px_rgba(61,255,160,0.15)] sticky top-0 z-40">
        <div className="flex justify-between items-center w-full px-container-margin-desktop py-4 mx-auto max-w-7xl">
          <div className="flex items-center gap-8">
            {/* Tactical Velvet Arrow Brand Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="w-8 h-8 rounded bg-gradient-to-tr from-[#133725] to-[#3dffa0] p-1.5 flex items-center justify-center transform hover:scale-105 transition-all">
                {/* UP-Arrow Vector Symbol icon */}
                <Navigation className="w-5 h-5 text-surface-container-lowest fill-current rotate-45" />
              </div>
              <span className="text-lg font-mono font-extrabold text-primary tracking-tighter uppercase flex items-center gap-1">
                VELOX <span className="text-xs font-semibold py-0.5 px-1.5 rounded bg-primary-container/10 border border-primary-container/30 text-primary-container">Aero</span>
              </span>
            </div>

            {/* Links Tab Navigation block */}
            <div className="hidden md:flex gap-6 font-mono text-xs">
              {(['dashboard', 'flights', 'schedule', 'support'] as const).map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative pb-1 tracking-wider uppercase font-bold transition-all ${
                      isActive ? 'text-primary-container font-extrabold' : 'text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    {tab}
                    {isActive && (
                      <motion.span
                        layoutId="activeTabUnderline"
                        className="absolute bottom-0 left-0 w-full h-[2px] bg-primary-container shadow-[0_0_8px_#3dffa0]"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right action controls */}
          <div className="flex items-center gap-4 relative">
            
            {/* Smart Alerts Indicator when trigger */}
            <AnimatePresence>
              {systemAlert && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="absolute right-32 top-1 bg-surface-container-high border border-primary-container px-3 py-1.5 rounded-lg text-[10px] text-primary-container font-mono max-w-xs truncate shadow-lg z-50 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 bg-primary-container rounded-full animate-ping" />
                  <span>{systemAlert}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Live Notifications bell badge */}
            <div className="relative">
              <button
                aria-label="Toggle notifications"
                onClick={() => setShowNotificationPanel(!showNotificationPanel)}
                className="p-2 mr-2 text-on-surface-variant hover:text-primary transition-all rounded-lg hover:bg-surface-container/60 border border-transparent hover:border-outline-variant/30 relative focus:outline-none focus:ring-2 focus:ring-primary-container"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary-container rounded-full shadow-[0_0_8px_#3dffa0]" />
                )}
              </button>

              {/* Collapsible live log notifications overlay window */}
              {showNotificationPanel && (
                <div className="absolute right-0 mt-3 w-80 glass-card bg-surface rounded-2xl shadow-xl p-4 z-50 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-outline-variant/20">
                    <span className="text-xs font-bold text-primary flex items-center gap-1">
                      <Volume2 className="w-4 h-4 text-primary-container" /> Broadcast Feed Logs
                    </span>
                    <button
                      onClick={() => setNotifications([])}
                      className="text-[9px] font-mono text-on-surface-variant hover:text-red-400"
                    >
                      CLEAR DISPATCH
                    </button>
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-on-surface-variant font-mono">
                        No active dispatch broadcasts logged.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif.id} className="p-2 rounded-lg bg-surface-container-low border border-outline-variant/10 relative text-xs font-mono space-y-1">
                          <div className="flex justify-between items-center">
                            <span className={`text-[10px] font-bold ${
                              notif.type === 'success' ? 'text-primary-container' : 'text-amber-300'
                            }`}>
                              {notif.title}
                            </span>
                            <span className="text-[8px] text-on-surface-variant/70">{notif.timestamp}</span>
                          </div>
                          <p className="text-[10.5px] text-on-surface-variant select-text leading-tight">
                            {notif.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Simulated interactive Pilot Avatar Headshot / Authentication */}
            <div className="relative hidden sm:block">
              {user ? (
                <div 
                  className="flex items-center gap-2 relative group cursor-pointer"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <img
                    alt="Current User"
                    className="w-10 h-10 rounded-full border border-primary-container/40 group-hover:border-primary-container shadow-[0_0_8px_rgba(61,255,160,0.1)] transition-all object-cover"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop"
                  />
                  <div className="text-left leading-none">
                    <div className="text-xs font-bold text-primary">{user.name}</div>
                    <div className="text-[9px] text-primary-container font-mono uppercase tracking-wider">Cleared Crew</div>
                  </div>

                  {showProfileMenu && (
                    <div className="absolute right-0 top-12 mt-2 w-48 bg-surface-container border border-outline-variant rounded-xl shadow-xl p-2 z-50">
                      <div className="px-2 pb-2 mb-2 border-b border-outline-variant/30 text-[10px] text-on-surface-variant break-all">
                        {user.email}
                      </div>
                      <button className="w-full text-left px-2 py-1.5 text-xs text-primary hover:bg-primary-container/10 rounded font-mono">Profile Details</button>
                      <button className="w-full text-left px-2 py-1.5 text-xs text-primary hover:bg-primary-container/10 rounded font-mono">My Bookings</button>
                      <div className="h-[1px] bg-outline-variant/30 my-1" />
                      <button 
                        onClick={() => {
                          sessionStorage.removeItem('velox_auth_token');
                          sessionStorage.removeItem('velox_user');
                          setUser(null);
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-2 py-1.5 text-xs text-error hover:bg-error-container/20 rounded font-mono"
                      >
                        Logout Session
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-4 py-2 border border-primary-container/50 rounded-lg text-xs font-mono font-bold text-primary-container hover:bg-primary-container/10 transition-all shadow-[0_0_8px_rgba(61,255,160,0.1)] uppercase tracking-wider"
                >
                  Login / Register
                </button>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* 2. DYNAMIC CONTENT VIEWER BASED ON TAB */}
      <main className="px-container-margin-desktop py-base max-w-7xl mx-auto w-full flex-1">
        
        {/* TAB 1: DASHBOARD (MOCKUP RENDER) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Huge Display Dashboard Header & Search metrics */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 py-6 border-b border-outline-variant/10">
              <div className="flex-1">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary-container block mb-1">
                  Tactical Aviation Terminal
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tighter text-primary font-mono uppercase">
                  DASHBOARD
                </h1>
                
                {/* Search Bar input */}
                <div className="flex items-center gap-3 mt-4 w-full max-w-lg relative bg-surface-container rounded-xl border border-outline-variant/40 px-3 py-2.5 focus-within:border-primary-container/40 focus-within:ring-1 focus-within:ring-primary-container/10 transition-all">
                  <Search className="w-5 h-5 text-primary-container flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search schedules, airline carriers (e.g. Lufthansa, Delta)..."
                    className="bg-transparent border-none focus:ring-0 focus:outline-none text-xs text-on-surface placeholder:text-on-surface-variant/40 flex-1 font-body"
                  />
                  <span className="px-2 py-1 rounded bg-surface-container-highest text-[9px] font-mono tracking-wider font-bold text-on-surface-variant border border-outline-variant">
                    CTRL + K
                  </span>
                </div>
              </div>

              {/* Widget filter dials icons */}
              <div className="flex gap-3">
                <button
                  onClick={() => addNotification('Filters Opened', 'Opened tactical pricing filters panels.', 'info')}
                  className="w-12 h-12 rounded-xl glass-card flex items-center justify-center hover:bg-primary-container/10 transition-all group border border-outline-variant/30 active:scale-95"
                  title="Tune Custom Price Rules"
                >
                  <Sliders className="w-5 h-5 text-primary-container transition-transform group-hover:rotate-180" />
                </button>
                <button
                  onClick={() => {
                    setActiveTab('flights');
                    addNotification('Active Catalog loaded', 'Toggled terminal tracking panel.', 'info');
                  }}
                  className="w-12 h-12 rounded-xl glass-card flex items-center justify-center hover:bg-primary-container/10 transition-all border border-outline-variant/30 active:scale-95"
                  title="Carrier Capacity Tracking charts"
                >
                  <TrendingUp className="w-5 h-5 text-primary-container" />
                </button>
              </div>
            </header>

            {/* 3-Column Responsive Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[290px_1fr_310px] gap-gutter items-start">
              
              {/* LEFT COLUMN: CRUISE ROUTE CREATOR & FLIGHTS CARD */}
              <div className="flex flex-col gap-6">
                
                {/* Booking Flight Route Form */}
                <Suspense fallback={<div className="h-40 rounded-2xl glass-card flex items-center justify-center text-primary-container animate-pulse gap-2"><Sparkles className="w-5 h-5 animate-spin"/> Loading Search Module...</div>}>
                  <FlightSearchWidget onResults={(results) => {
                    setActiveFlights(results);
                    if (results.length > 0) {
                      setFromAirport(results[0].from);
                      setToAirport(results[0].to);
                      setActiveFlight(results[0]);
                      setSimProgress(0);
                      addNotification(
                        'Tickets Queried',
                        `Successfully fetched ${results.length} active schedules for ${results[0].from} ➔ ${results[0].to} via AviationStack/Amadeus.`,
                        'success'
                      );
                    }
                  }} />
                </Suspense>

                {/* Next Flight Card */}
                <section className="glass-card rounded-[24px] overflow-hidden border border-outline-variant/20 p-5 bg-surface-container-low/20">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-[9px] font-mono tracking-widest text-primary-container block uppercase font-bold">NEXT DISPATCH</span>
                      <h4 className="text-xs font-bold text-on-surface-variant font-mono">{activeFlight.airlineName} Aircraft</h4>
                    </div>
                    <div className="p-1.5 rounded-lg bg-surface border border-outline-variant/40">
                      <Plane className="w-4 h-4 text-primary-container" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-7 h-7 bg-primary-container/20 rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-primary-container" />
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-primary">{activeFlight.flightNo} • {activeFlight.aircraft}</div>
                      <div className="text-[10px] text-on-surface-variant font-mono">Terminal dispatch confirmed</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-2 border-y border-dashed border-outline-variant/30 text-center relative mb-4">
                    <div>
                      <div className="text-lg font-bold font-mono text-primary">{activeFlight.departureTime.split(' ')[0]}</div>
                      <div className="text-[10px] text-on-surface-variant font-mono font-bold">{fromAirport}</div>
                    </div>

                    <div className="flex-1 px-4 relative flex items-center justify-center">
                      <div className="w-full h-[1.5px] border-t border-dashed border-outline-variant/80"></div>
                      <Plane className="w-3.5 h-3.5 text-primary-container absolute rotate-90" />
                    </div>

                    <div>
                      <div className="text-lg font-bold font-mono text-primary">{activeFlight.arrivalTime.split(' ')[0]}</div>
                      <div className="text-[10px] text-on-surface-variant font-mono font-bold">{toAirport}</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[10px] uppercase font-mono bg-primary-container/10 border border-primary-container/20 text-primary-container rounded-full px-2.5 py-0.5 font-bold">
                      {selectedClass} Cabin
                    </span>
                    <span className="font-bold text-sm text-primary-container font-mono">
                      ${singleSeatPrice} / seat
                    </span>
                  </div>
                </section>

              </div>

              {/* CENTER COLUMN: MAP SIMULATION & HOT DEALS PROPOSITIONS */}
              <div className="flex flex-col gap-gutter">
                
                {/* Visual Route tracking with progress simulation */}
                <Suspense fallback={<div className="h-64 rounded-2xl glass-card flex items-center justify-center text-primary-container animate-pulse gap-2"><Sparkles className="w-5 h-5 animate-spin" /> Loading Module...</div>}>
                  <FlightTrackerMap
                    flightNo={activeFlight.flightNo}
                    fromCode={fromAirport}
                    toCode={toAirport}
                    departureTime={activeFlight.departureTime}
                    arrivalTime={activeFlight.arrivalTime}
                    distance={activeFlight.distance}
                    progress={simProgress}
                    isSimulating={isSimulating}
                    onToggleSim={() => {
                      setIsSimulating(!isSimulating);
                      addNotification(
                        isSimulating ? 'Simulation Paused' : 'Simulation Engaged',
                        isSimulating 
                          ? 'Aeroline tracking is paused.' 
                          : `Avionics dynamic flight track simulation running live for route ${fromAirport} ➔ ${toAirport}!`,
                        isSimulating ? 'warn' : 'success'
                      );
                    }}
                    onResetSim={() => {
                      setSimProgress(0);
                      setIsSimulating(false);
                      addNotification('Simulation Reset', `Reset tracking milestones of ${activeFlight.flightNo} to runway.`, 'info');
                    }}
                  />
                </Suspense>

                {/* Hot Deals Comparison Propositions Table */}
                <section className="glass-card rounded-[24px] overflow-hidden border border-outline-variant/20 bg-surface-container-low/10">
                  <div className="p-4 flex justify-between items-center border-b border-outline-variant/20">
                    <div>
                      <h3 className="text-xs font-mono font-extrabold tracking-widest text-primary-container uppercase">
                        HOT DEALS & EXCEEDED OFFERS
                      </h3>
                      <p className="text-[10px] text-on-surface-variant font-mono">Select a row to populate live booking terminal routing inputs.</p>
                    </div>
                    <span className="material-symbols-outlined text-primary-container animate-pulse">bolt</span>
                  </div>

                  <div className="overflow-x-auto text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-[#05110a] text-on-surface-variant font-mono text-[9px] uppercase tracking-wider border-b border-outline-variant/20">
                        <tr>
                          <th className="px-6 py-3">Carrier Airline</th>
                          <th className="px-6 py-3">Route Track</th>
                          <th className="px-6 py-3">Departure</th>
                          <th className="px-1 py-3 text-right">Base Fare</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/10">
                        {INITIAL_FLIGHTS.map((f) => {
                          const isCurrent = f.flightNo === activeFlight.flightNo;
                          return (
                            <tr
                              key={f.id}
                              onClick={() => selectProposition(f)}
                              className={`cursor-pointer transition-colors ${
                                isCurrent 
                                  ? 'bg-primary-container/10 hover:bg-primary-container/15 font-semibold text-primary' 
                                  : 'hover:bg-primary-container/5 text-on-surface-variant'
                              }`}
                            >
                              <td className="px-6 py-4 flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-primary-container animate-pulse shadow-[0_0_8px_#3dffa0]' : 'bg-transparent'}`} />
                                <span className="text-xs font-semibold text-primary">{f.airlineName}</span>
                                <span className="text-[9px] font-mono text-on-surface-variant">({f.flightNo})</span>
                              </td>
                              <td className="px-6 py-4 font-mono font-bold">
                                {f.from} ➔ {f.to}
                              </td>
                              <td className="px-6 py-4 text-on-surface-variant font-mono">
                                {f.departureTime}
                              </td>
                              <td className="px-4 py-4 text-right font-mono font-bold text-primary-container pr-4">
                                ${f.basePrice}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>

              </div>

              {/* RIGHT COLUMN: INTERACTIVE SEATING & CHECKOUT BILL */}
              <div className="flex flex-col gap-6">
                
                {/* Fuselage Seat picker card */}
                <Suspense fallback={<div className="h-64 rounded-2xl glass-card flex items-center justify-center text-primary-container animate-pulse gap-2"><Sparkles className="w-5 h-5 animate-spin"/> Loading Module...</div>}>
                  <CabinSeatSelector
                    selectedClass={selectedClass}
                    onChangeClass={setSelectedClass}
                    selectedSeats={selectedSeats}
                    onToggleSeat={handleToggleSeat}
                    basePrice={activeFlight.basePrice}
                  />
                </Suspense>

                {/* Pricing display summary and Checkout triggers */}
                <div className="glass-card rounded-2xl p-5 border border-primary-container/20 flex flex-col gap-4">
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-primary">Summary Estimate</div>
                      <div className="text-[10px] text-on-surface-variant font-mono">
                        {selectedSeats.length} ticket{selectedSeats.length === 1 ? '' : 's'} assigned
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-mono font-extrabold text-primary-container leading-none">
                        ${totalPrice.toLocaleString()}
                      </div>
                      <span className="text-[8px] font-mono text-on-surface-variant">SECURED RATE</span>
                    </div>
                  </div>

                  <button
                    disabled={selectedSeats.length === 0}
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full bg-primary-container text-surface-container-lowest font-mono font-extrabold tracking-widest py-3 rounded-xl text-xs hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-30 disabled:pointer-events-none disabled:cursor-not-allowed uppercase shadow-[0_4px_16px_rgba(61,255,160,0.2)]"
                  >
                    Proceed to Settle
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 2: ACTIVE FLIGHTS CATALOG */}
        {activeTab === 'flights' && (
          <div className="space-y-6">
            <header className="py-6 border-b border-outline-variant/10">
              <h2 className="text-2xl font-extrabold text-primary font-mono uppercase">Airborne Flights Dispatch</h2>
              <p className="text-xs text-on-surface-variant">Real-time status analysis of current active jet fleets over regional checkpoints.</p>
            </header>

            {/* Searing Search Filter dials bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 glass-card rounded-2xl">
              
              {/* Carriers Quick Selector */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-on-surface-variant font-mono">Filter Carrier:</span>
                <select
                  value={carrierFilter}
                  onChange={(e) => setCarrierFilter(e.target.value)}
                  className="bg-surface font-mono text-xs rounded-lg border border-outline-variant/65 text-on-surface px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-container"
                >
                  <option value="All">All Carriers</option>
                  <option value="Delta Air">Delta Air</option>
                  <option value="Lufthansa">Lufthansa</option>
                  <option value="Emirates">Emirates</option>
                  <option value="Air France">Air France</option>
                  <option value="United Airlines">United Airlines</option>
                </select>
              </div>

              {/* Status Select Filter dials */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-on-surface-variant font-mono">Status check:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-surface font-mono text-xs rounded-lg border border-outline-variant/65 text-on-surface px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-container"
                >
                  <option value="All">All Statuses</option>
                  <option value="Airborne">Airborne</option>
                  <option value="Boarding">Boarding</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Delayed">Delayed</option>
                  <option value="Landed">Landed</option>
                </select>
              </div>

              <div className="text-xs text-primary-container font-mono bg-primary-container/15 px-3 py-1 rounded-lg border border-primary-container/30">
                {filteredFlights.length} match{filteredFlights.length === 1 ? '' : 'es'} filtered
              </div>
            </div>

            {/* Flights search layouts in grid formats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              {filteredFlights.map((f) => {
                const isSelectedFlight = f.flightNo === activeFlight.flightNo;
                return (
                  <div
                    key={f.id}
                    className="glass-card rounded-[22px] p-5 flex flex-col justify-between hover:border-primary-container/40 transition-all cursor-pointer relative"
                    onClick={() => {
                      setFromAirport(f.from);
                      setToAirport(f.to);
                      setActiveFlight(f);
                      setSimProgress(f.progress || 0);
                      addNotification('Route Loaded', `Aero-Terminal parameters synced to ${f.flightNo}`, 'success');
                    }}
                  >
                    {/* Background visual indicators if highlighted matches current dispatch */}
                    {isSelectedFlight && (
                      <div className="absolute top-4 right-4 bg-primary-container/10 border border-primary-container/30 px-2 py-0.5 rounded text-[9px] font-mono text-primary-container uppercase font-bold">
                        ACTIVE DOCK
                      </div>
                    )}

                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-[10px] font-mono text-primary-container uppercase font-bold tracking-widest block">
                            {f.airlineName} Flight
                          </span>
                          <span className="text-base font-extrabold text-primary font-mono">{f.flightNo} • {f.aircraft}</span>
                        </div>
                        <span className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded font-bold border ${
                          f.status === 'Airborne'
                            ? 'bg-primary-container/10 text-primary-container border-primary-container/30 animate-pulse'
                            : f.status === 'Delayed'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : 'bg-surface border-outline-variant/40 text-on-surface-variant'
                        }`}>
                          {f.status}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-4 border-y border-dashed border-outline-variant/20 relative my-4">
                        <div className="text-left">
                          <span className="text-xs text-on-surface-variant/70 uppercase font-mono block">Departure</span>
                          <span className="text-base font-bold text-primary font-mono">{f.departureTime}</span>
                          <span className="text-xs text-on-surface-variant font-semibold block">{f.from} Terminal</span>
                        </div>

                        <div className="flex-1 px-4 relative flex items-center justify-center">
                          <div className="w-full h-[1.5px] border-t border-dashed border-outline-variant/60"></div>
                          <Plane className="w-4 h-4 text-primary-container absolute rotate-90" />
                        </div>

                        <div className="text-right">
                          <span className="text-xs text-on-surface-variant/70 uppercase font-mono block">Arrival</span>
                          <span className="text-base font-bold text-primary font-mono">{f.arrivalTime}</span>
                          <span className="text-xs text-on-surface-variant font-semibold block">{f.to} Terminal</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div className="text-xs">
                        <span className="text-on-surface-variant font-mono">Distance metrics: </span>
                        <span className="font-bold text-primary">{f.distance} km</span>
                      </div>
                      <span className="text-sm font-extrabold text-primary-container font-mono">
                        Base Fare: ${f.basePrice}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: FLIGHT SCHEDULE CALENDAR & DISPATCH */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <header className="py-6 border-b border-outline-variant/10 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-primary font-mono uppercase">Aviation Schedule Board</h2>
                <p className="text-xs text-on-surface-variant font-mono">Runway gating indicators, delays, and schedule update protocols.</p>
              </div>

              {/* Action trigger button to mock live alerts */}
              <button
                onClick={() => {
                  const gates = ['A14', 'B22', 'C09', 'E11', 'G03'];
                  const pickedGate = gates[Math.floor(Math.random() * gates.length)];
                  addNotification(
                    'Gate Closure Alert',
                    `Temporary runway checkpoint lockdown initiated. Reinforcing baggage checking for Gate ${pickedGate}.`,
                    'warn'
                  );
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 hover:bg-amber-500/20 text-xs font-mono font-bold transition-all flex items-center gap-1.5 self-start active:scale-[0.98]"
              >
                <AlertCircle className="w-4 h-4" /> Trigger Mock Gate Closure Delay Alert
              </button>
            </header>

            {/* Timetable schedule lists */}
            <div className="glass-card rounded-[24px] overflow-hidden border border-outline-variant/20 p-5 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-primary-container flex items-center gap-1.5 font-mono uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse shadow-[0_0_8px_#3dffa0]" />
                  Active Oceanic Gate Schedules
                </span>
                <span className="text-xs text-on-surface-variant font-mono">Zulu Time: 15:09 Z</span>
              </div>

              <div className="space-y-3">
                {INITIAL_FLIGHTS.map((f) => (
                  <div
                    key={f.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/10 text-xs gap-4 hover:border-primary-container/30 transition-all font-mono"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded bg-[#05110a] flex items-center justify-center font-bold text-primary-container border border-primary-container/20">
                        {f.gate}
                      </div>
                      <div>
                        <div className="font-bold text-primary flex items-center gap-1">
                          {f.flightNo} <span className="text-[10px] text-on-surface-variant font-normal">➔ {f.airlineName}</span>
                        </div>
                        <div className="text-on-surface-variant text-[11px]">
                          Route Corridor: {f.from} ➔ {f.to} ({f.distance} km)
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-left">
                        <span className="text-on-surface-variant uppercase text-[9px] block">Departure Time</span>
                        <span className="font-bold text-primary">{f.departureTime}</span>
                      </div>

                      <div className="text-left">
                        <span className="text-on-surface-variant uppercase text-[9px] block">Duration Parameter</span>
                        <span className="font-bold text-primary-container">{f.duration}</span>
                      </div>

                      <div>
                        <span className="text-on-surface-variant uppercase text-[9px] block text-right">Gate Status</span>
                        <span className={`font-bold inline-block text-right ${
                          f.status === 'Airborne'
                            ? 'text-primary-container'
                            : f.status === 'Delayed'
                            ? 'text-red-400'
                            : f.status === 'Boarding'
                            ? 'text-amber-300'
                            : 'text-on-surface-variant'
                        }`}>
                          {f.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Informative summary alert badge */}
            <div className="p-4 bg-primary-container/10 border border-primary-container/20 text-xs text-on-surface rounded-2xl flex items-start gap-3">
              <BadgeInfo className="w-5 h-5 text-primary-container flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-primary font-sans">Velox Aero-Tech Security Protocol G-18</span>
                <p className="text-on-surface-variant font-body">
                  Passengers are requested to arrive at designated terminals and baggage dispatch grids at least 150 minutes prior to oceanic schedules. Gate parameters closing locks automatically 15 minutes prior to airplane dispatch vectors.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: CO-PILOT AI DISPATCH (FULL VIEW) */}
        {activeTab === 'support' && (
          <div className="space-y-6">
            <header className="py-6 border-b border-outline-variant/10">
              <h2 className="text-2xl font-extrabold text-primary font-mono uppercase">AI Flight Co-Pilot Operations</h2>
              <p className="text-xs text-on-surface-variant">Real-time terminal computations, luggage upgrades, and oceanic atmospheric analysis directly with our AI.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter items-stretch">
              {/* Informative Side Panel instructions */}
              <div className="md:col-span-1 glass-card rounded-[24px] p-6 space-y-6 border border-outline-variant/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-primary-container" />
                    <span className="text-xs uppercase font-mono tracking-widest text-primary font-bold">TACTICAL SUGGESTIONS</span>
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-3">AI Flight Assistant</h3>
                  <p className="text-xs text-on-surface-variant font-body leading-relaxed">
                    AERO_CORE co-pilot is synthesized directly with the Google Gemini structural database to yield real-time avionics calculation assistance.
                  </p>

                  <ul className="space-y-3 pt-6 text-xs text-on-surface-variant font-mono">
                    <li className="flex items-start gap-2">
                      <span className="text-primary-container font-bold">✓</span>
                      <span>Real-time flight layout and routing planning.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-container font-bold">✓</span>
                      <span>Baggage rules & frequent flyer elite statuses calculator.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-container font-bold">✓</span>
                      <span>Weather turbulence vector estimations.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#05110a] p-3.5 rounded-xl border border-primary-container/20 flex gap-2.5 items-center">
                  <ShieldCheck className="w-5 h-5 text-primary-container" />
                  <span className="text-[10px] text-on-surface-variant tracking-normal font-mono">
                    Your queries are fully protected using secure Zero-Knowledge aeronautic pipelines.
                  </span>
                </div>
              </div>

              {/* Central Big conversational panel */}
              <div className="md:col-span-2">
                <Suspense fallback={<div className="h-96 rounded-2xl glass-card flex flex-col items-center justify-center text-primary-container animate-pulse gap-2"><Sparkles className="w-8 h-8 animate-spin"/> Processing Secure Connection...</div>}>
                  <AiCopilot currentFlightContext={`Route: ${fromAirport} to ${toAirport}. Flight carrier: ${activeFlight.flightNo} (${activeFlight.aircraft}). Cabin Class: ${selectedClass}. Selected seats: ${selectedSeats.join(', ') || 'None'}.`} />
                </Suspense>
              </div>

            </div>
          </div>
        )}

      </main>

      <Suspense fallback={null}>
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          flightNo={activeFlight.flightNo}
          fromCity={AIRPORTS.find((a) => a.code === fromAirport)?.city || 'New York'}
          toCity={AIRPORTS.find((a) => a.code === toAirport)?.city || 'Milan'}
          fromCode={fromAirport}
          toCode={toAirport}
          departureTime={activeFlight.departureTime}
          aircraft={activeFlight.aircraft}
          gate={activeFlight.gate || 'A14'}
          cabinClass={selectedClass}
          selectedSeats={selectedSeats}
          totalPrice={totalPrice}
        />
      </Suspense>

      {/* 5. TACTICAL FOOTER AREA */}
      <footer className="mt-20 border-t border-dashed border-secondary-container bg-surface-container-lowest w-full py-8 text-xs font-mono">
        <div className="flex flex-col md:flex-row justify-between items-center px-container-margin-desktop gap-4 mx-auto max-w-7xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse shadow-[0_0_8px_#3dffa0]" />
            <span className="font-extrabold text-primary-container tracking-tighter uppercase text-sm">
              AERO_CORE TECHNOLOGIES
            </span>
          </div>
          <span className="text-on-tertiary-fixed-variant text-[10.5px] text-center">
            © 2026 AERO_CORE TECHNOLOGIES. ALL FLIGHT PARAMETERS SECURED UNDER GLOBAL PROTOCOL G-18.
          </span>
          <div className="flex gap-4">
            <a className="text-on-tertiary-fixed-variant hover:text-primary-container transition-colors text-[10px]" href="#">
              Privacy Protocol
            </a>
            <a className="text-on-tertiary-fixed-variant hover:text-primary-container transition-colors text-[10px]" href="#">
              Terms of Service
            </a>
            <a className="text-on-tertiary-fixed-variant hover:text-primary-container transition-colors text-[10px]" href="#">
              API Status
            </a>
          </div>
        </div>
      </footer>

      {/* AUTHENTICATION OVERLAY MODAL */}
      <Suspense fallback={null}>
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          onLoginSuccess={(userData) => setUser(userData)}
        />
      </Suspense>
    </div>
  );
}
