import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PassengerDetails, CabinClass } from '../types';
import { X, ShieldCheck, Ticket, QrCode, CreditCard, AlertCircle } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  flightNo: string;
  fromCity: string;
  toCity: string;
  fromCode: string;
  toCode: string;
  departureTime: string;
  aircraft: string;
  gate: string;
  cabinClass: CabinClass;
  selectedSeats: string[];
  totalPrice: number;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  flightNo,
  fromCity,
  toCity,
  fromCode,
  toCode,
  departureTime,
  aircraft,
  gate,
  cabinClass,
  selectedSeats,
  totalPrice,
}: CheckoutModalProps) {
  // Form input states
  const [details, setDetails] = useState<PassengerDetails>({
    fullName: '',
    email: '',
    passportNumber: '',
    mealPreference: 'Standard',
    loyaltyNumber: '',
  });

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Validation error tracking state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [checkoutStep, setCheckoutStep] = useState<'form' | 'success'>('form');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  // Perform form and credit card field validation checks
  const validateForm = () => {
    const errs: { [key: string]: string } = {};

    if (!details.fullName.trim()) errs.fullName = 'Full Name is required.';
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!details.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!emailPattern.test(details.email)) {
      errs.email = 'Please provide a valid email format.';
    }

    if (!details.passportNumber.trim()) {
      errs.passportNumber = 'Passport registry identifier is required.';
    } else if (details.passportNumber.length < 5) {
      errs.passportNumber = 'Provide a valid passport number.';
    }

    const cleanedCard = cardNumber.replace(/\s+/g, '');
    if (!cleanedCard) {
      errs.cardNumber = 'Billable card token is missing.';
    } else if (cleanedCard.length < 13 || isNaN(Number(cleanedCard))) {
      errs.cardNumber = 'Credit card must possess at least 13-16 integer parameters.';
    }

    if (!cvv.trim() || cvv.length < 3 || isNaN(Number(cvv))) {
      errs.cvv = 'Valid CVV parameter (3 digits) is matching.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setCheckoutStep('success');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative glass-card rounded-[28px] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row bg-surface"
        >
          {/* Close trigger action top right */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 text-on-surface-variant hover:text-primary transition-colors bg-surface-container/60 rounded-full border border-outline-variant/30 hover:rotate-90 duration-300"
          >
            <X className="w-5 h-5" />
          </button>

          {checkoutStep === 'form' ? (
            <>
              {/* LEFT SIDE: SUMMARY CARD */}
              <div className="w-md md:w-2/5 border-b md:border-b-0 md:border-r border-outline-variant/30 p-6 bg-surface-container-low/40 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-primary-container block mb-1">
                    Booking Payload Details
                  </span>
                  <h3 className="text-xl font-extrabold font-sans text-primary mb-6">
                    VELOX TRAVEL DISPATCH
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-dashed border-outline-variant/30 pb-2 text-sm">
                      <span className="text-on-surface-variant font-mono">Flight Carrier:</span>
                      <span className="font-bold text-primary">{flightNo}</span>
                    </div>

                    <div className="flex justify-between border-b border-dashed border-outline-variant/30 pb-2 text-sm">
                      <span className="text-on-surface-variant font-mono">Terminal Route:</span>
                      <span className="font-bold text-primary">{fromCode} ➔ {toCode}</span>
                    </div>

                    <div className="flex justify-between border-b border-dashed border-outline-variant/30 pb-2 text-sm">
                      <span className="text-on-surface-variant font-mono">Cabin Category:</span>
                      <span className="font-bold text-primary-container uppercase">{cabinClass}</span>
                    </div>

                    <div className="flex justify-between border-b border-dashed border-outline-variant/30 pb-2 text-sm">
                      <span className="text-on-surface-variant font-mono">Seating Keys:</span>
                      <span className="font-mono font-bold text-primary-container">{selectedSeats.join(', ')}</span>
                    </div>

                    <div className="flex justify-between border-b border-dashed border-outline-variant/30 pb-2 text-sm">
                      <span className="text-on-surface-variant font-mono">Aircraft Hull:</span>
                      <span className="font-bold text-on-surface-variant">{aircraft}</span>
                    </div>

                    <div className="flex justify-between pb-2 text-sm">
                      <span className="text-on-surface-variant font-mono">Assigned Gate:</span>
                      <span className="font-bold text-primary">{gate}</span>
                    </div>
                  </div>
                </div>

                {/* Pricing indicator block */}
                <div className="mt-8 bg-surface-container-high/60 p-4 rounded-2xl border border-secondary-container/40">
                  <div className="text-[10px] font-mono tracking-wider text-on-surface-variant uppercase">
                    Consolidated Total Billing Rate
                  </div>
                  <div className="flex justify-between items-baseline mt-1">
                    <span className="text-3xl font-extrabold font-mono text-primary-container">
                      ${totalPrice.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-mono text-on-surface-variant">USD</span>
                  </div>
                  <div className="text-[9px] text-on-surface-variant/70 mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary-container" /> Secured 256-Bit SSL Encrypted
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: CUSTOM FORM & PAYMENT SUBMIT */}
              <form onSubmit={handlePaymentSubmit} className="flex-1 p-6 md:p-8 space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-primary flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-primary-container" /> Passenger Manifest Info
                  </h4>
                  <p className="text-xs text-on-surface-variant">Input detailed security parameters below to generate tickets</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Participant Name */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-mono font-bold uppercase text-on-surface-variant tracking-wider">
                      Passenger Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={details.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Captain Jean-Luc Picard"
                      className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl px-3.5 py-2.5 text-sm focus:ring-1 focus:ring-primary-container focus:border-primary-container focus:outline-none transition-all"
                    />
                    {errors.fullName && (
                      <span className="text-red-400 text-[10px] font-mono flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3" /> {errors.fullName}
                      </span>
                    )}
                  </div>

                  {/* Participant Email Address */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-mono font-bold uppercase text-on-surface-variant tracking-wider">
                      Passenger Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={details.email}
                      onChange={handleInputChange}
                      placeholder="e.g. j.picard@enterprise.com"
                      className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl px-3.5 py-2.5 text-sm focus:ring-1 focus:ring-primary-container focus:border-primary-container focus:outline-none transition-all"
                    />
                    {errors.email && (
                      <span className="text-red-400 text-[10px] font-mono flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3" /> {errors.email}
                      </span>
                    )}
                  </div>

                  {/* Passport Registry Reference */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-mono font-bold uppercase text-on-surface-variant tracking-wider">
                      Passport Identifier *
                    </label>
                    <input
                      type="text"
                      name="passportNumber"
                      value={details.passportNumber}
                      onChange={handleInputChange}
                      placeholder="e.g. US9483017B"
                      className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:ring-1 focus:ring-primary-container focus:border-primary-container focus:outline-none transition-all"
                    />
                    {errors.passportNumber && (
                      <span className="text-red-400 text-[10px] font-mono flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3" /> {errors.passportNumber}
                      </span>
                    )}
                  </div>

                  {/* Meal Preferences selector */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-mono font-bold uppercase text-on-surface-variant tracking-wider">
                      Cuisine Special Selection
                    </label>
                    <select
                      name="mealPreference"
                      value={details.mealPreference}
                      onChange={handleInputChange}
                      className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl px-3.5 py-3 text-sm focus:ring-1 focus:ring-primary-container focus:border-primary-container focus:outline-none transition-all text-on-surface"
                    >
                      <option value="Standard">Standard Balanced Diet</option>
                      <option value="Vegan">Vegan Plant Profile</option>
                      <option value="Halal">Halal Airline Pack</option>
                      <option value="Kosher">Kosher Standard Plate</option>
                      <option value="None">No Food Dispenser Plan</option>
                    </select>
                  </div>

                  {/* Frequent flyer registry number */}
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <label className="text-xs font-mono font-bold uppercase text-on-surface-variant tracking-wider">
                      Aero-Credits / Loyalty ID Number (Optional)
                    </label>
                    <input
                      type="text"
                      name="loyaltyNumber"
                      value={details.loyaltyNumber}
                      onChange={handleInputChange}
                      placeholder="e.g. AEROC-4091-M"
                      className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:ring-1 focus:ring-primary-container focus:border-primary-container focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <hr className="border-outline-variant/20 my-4" />

                {/* Credit Card billing parameters */}
                <div>
                  <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary-container" /> Secured Flight Settlement
                  </h4>
                  <p className="text-[11px] text-on-surface-variant">Your transaction is fully secured using encrypted zero-knowledge hashing protocols.</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-3 sm:col-span-2 flex flex-col gap-1">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="💳 Card Number (e.g. 4532 9901 8421 9503)"
                      className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:ring-1 focus:ring-primary-container focus:border-primary-container focus:outline-none transition-all"
                    />
                    {errors.cardNumber && (
                      <span className="text-red-400 text-[10px] font-mono flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3" /> {errors.cardNumber}
                      </span>
                    )}
                  </div>

                  <div className="col-span-2 sm:col-span-1 flex flex-col gap-1 border-r border-outline-variant/10">
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      maxLength={4}
                      placeholder="Lock Code (CVV)"
                      className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:ring-1 focus:ring-primary-container focus:border-primary-container focus:outline-none transition-all"
                    />
                    {errors.cvv && (
                      <span className="text-red-400 text-[10px] font-mono flex items-center gap-1 mt-0.5 animate-pulse">
                        <AlertCircle className="w-3 h-3" /> {errors.cvv}
                      </span>
                    )}
                  </div>
                </div>

                {/* Submit button bar */}
                <button
                  type="submit"
                  className="w-full bg-primary-container text-surface-container-lowest font-extrabold font-mono py-4 rounded-xl shadow-[0_4px_24px_rgba(61,255,160,0.3)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm tracking-wider"
                >
                  SETTLE TRANSACTION & DEPLOY ticket (${totalPrice.toLocaleString()} USD)
                </button>
              </form>
            </>
          ) : (
            /* CONVERSION SUCCESS: DYNAMIC BOARDING PASS SHEET GENERATION */
            <div className="w-full p-6 md:p-10 flex flex-col items-center justify-center text-center space-y-8">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-14 h-14 bg-primary-container/20 border-2 border-primary-container rounded-full flex items-center justify-center text-primary-container shadow-[0_0_24px_#3dffa0]">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-extrabold text-primary font-sans">
                  DISPATCH CONFIRMED!
                </h3>
                <p className="text-sm text-on-surface-variant max-w-lg">
                  Excellent, <strong className="text-primary">{details.fullName}</strong>. Your payment cleared successfully. We have dispatched your digital barcode parameters to your loyalty system.
                </p>
              </div>

              {/* PREMIUM DESIGNED AERO_CORE BOARDING TICKET PASS */}
              <div className="w-full max-w-2xl bg-surface-container border-2 border-primary-container/40 rounded-3xl overflow-hidden shadow-2xl relative font-mono text-left">
                {/* Visual side ticket notches */}
                <div className="absolute top-1/2 -left-3 w-6 h-6 bg-surface border-r border-primary-container/30 rounded-full -translate-y-1/2"></div>
                <div className="absolute top-1/2 -right-3 w-6 h-6 bg-surface border-l border-primary-container/30 rounded-full -translate-y-1/2"></div>

                {/* Top header pass */}
                <div className="bg-gradient-to-r from-secondary-container/30 to-surface-container-highest px-6 py-4 border-b border-primary-container/20 flex justify-between items-center">
                  <span className="text-xs font-bold text-primary-container flex items-center gap-1.5 uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse shadow-[0_0_8px_#3dffa0]"></span>
                    Boarding Authorization Pack
                  </span>
                  <div className="text-right">
                    <div className="text-[10px] text-on-surface-variant uppercase font-mono">Dispatched Flight</div>
                    <div className="text-sm font-bold text-primary">{flightNo}</div>
                  </div>
                </div>

                {/* Main Pass core layout */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left block information */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="grid grid-cols-2 gap-4 border-b border-outline-variant/20 pb-4">
                      <div>
                        <span className="text-[9px] text-on-surface-variant block uppercase leading-none mb-1">PASSENGER NAME</span>
                        <span className="text-sm font-bold text-primary uppercase font-sans">{details.fullName}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-on-surface-variant block uppercase leading-none mb-1">PASSPORT ID</span>
                        <span className="text-sm font-bold text-primary font-mono">{details.passportNumber}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 border-b border-outline-variant/20 pb-4">
                      <div>
                        <span className="text-[9px] text-on-surface-variant block uppercase leading-none mb-1">FROM</span>
                        <span className="text-lg font-bold text-primary block leading-none">{fromCode}</span>
                        <span className="text-[9px] text-on-surface-variant">{fromCity}</span>
                      </div>
                      <div className="text-center flex flex-col justify-center items-center">
                        <span className="text-[10px] text-primary-container leading-none opacity-40">➔</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-on-surface-variant block uppercase leading-none mb-1 text-right">TO</span>
                        <span className="text-lg font-bold text-primary block leading-none text-right">{toCode}</span>
                        <span className="text-[9px] text-on-surface-variant block text-right">{toCity}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <span className="text-[9px] text-on-surface-variant block uppercase leading-none mb-1">DEPARTURE</span>
                        <span className="text-xs font-semibold text-primary">{departureTime}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-on-surface-variant block uppercase leading-none mb-1">GATE</span>
                        <span className="text-xs font-semibold text-primary">{gate}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-on-surface-variant block uppercase leading-none mb-1 font-bold text-primary-container">SEATS</span>
                        <span className="text-xs font-bold text-primary-container">{selectedSeats.join(', ')}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-on-surface-variant block uppercase leading-none mb-1">CLASS</span>
                        <span className="text-xs font-semibold text-primary uppercase">{cabinClass}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right block: Barcode + Interactive QR generator */}
                  <div className="border-t md:border-t-0 md:border-l border-outline-variant/20 pt-6 md:pt-0 md:pl-6 flex flex-col justify-between items-center text-center">
                    <div className="space-y-1">
                      <span className="text-[9.2px] text-on-surface-variant uppercase tracking-widest block font-bold">Security QR Lock</span>
                      {/* Stylized Simulated QR Matrix block */}
                      <div className="bg-primary/5 p-2 rounded-xl border border-primary-container/20 flex justify-center inline-block">
                        <QrCode className="w-24 h-24 text-primary-container animate-pulse shadow-[0_0_12px_rgba(61,255,160,0.1)]" />
                      </div>
                    </div>

                    {/* Analog Barcode generator layout block */}
                    <div className="w-full space-y-1 pt-3">
                      <div className="h-9 w-full bg-primary-container/10 flex items-center justify-around rounded overflow-hidden p-1 border border-primary-container/20">
                        {Array.from({ length: 24 }).map((_, i) => (
                          <div
                            key={i}
                            className="bg-primary-container h-full"
                            style={{
                              width: `${(i % 3 === 0 ? 3 : i % 2 === 0 ? 1 : 2)}px`,
                              opacity: i % 4 === 0 ? 0.35 : 0.85
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-[8px] text-on-surface-variant/70 tracking-widest block text-center uppercase font-mono">
                        AERCP-{flightNo.replace(/\s+/g, '')}-{selectedSeats[0] || 'X1'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Close panel action controls */}
              <div className="flex gap-4">
                <button
                  onClick={() => window.print()}
                  className="px-6 py-2.5 rounded-xl border border-primary-container/30 text-primary hover:bg-primary-container/10 text-xs font-mono font-bold transition-all"
                >
                  PRINT BOARDING PASS
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-primary-container text-surface-container-lowest text-xs font-mono font-bold hover:brightness-110 tracking-widest transition-all shadow-[0_4px_16px_rgba(61,255,160,0.2)]"
                >
                  DISMISS DOCK
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
