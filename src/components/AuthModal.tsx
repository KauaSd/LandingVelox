import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEmailValid = email.includes('@') && email.includes('.');
  const isPasswordValid = password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailValid || !isPasswordValid) {
      setError('Please provide a valid email and a 6+ char password.');
      return;
    }
    setIsLoading(true);
    setError(null);
    
    // Simulate API Auth Request
    setTimeout(() => {
      setIsLoading(false);
      const fakeToken = `jwt-mock-${Date.now()}`;
      sessionStorage.setItem('velox_auth_token', fakeToken);
      sessionStorage.setItem('velox_user', JSON.stringify({ email, name: email.split('@')[0] }));
      onLoginSuccess({ email, name: email.split('@')[0] });
      onClose();
    }, 1200);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({ email: 'user@gmail.com', name: 'Google User' });
      onClose();
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface-container-low/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="glass-card w-full max-w-md rounded-3xl border border-primary-container/20 overflow-hidden shadow-[0_0_40px_rgba(61,255,160,0.1)] relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-primary transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-8">
            <h2 className="text-2xl font-mono font-extrabold text-primary mb-1 uppercase text-center tracking-tighter">
              {mode === 'login' ? 'Terminal Access' : 'Secure Registration'}
            </h2>
            <p className="text-xs text-on-surface-variant font-mono text-center mb-8">
              {mode === 'login' ? 'Enter credentials for AERO_CORE' : 'Establish new crew credentials'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-on-surface-variant">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  placeholder="Crew Email Address"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  className={`w-full bg-surface-container border rounded-xl py-3 pl-10 pr-4 text-xs text-primary font-mono transition-all outline-none 
                    ${email && !isEmailValid ? 'border-error focus:ring-error focus:border-error' : 'border-outline-variant/40 focus:border-primary-container focus:ring-1 focus:ring-primary-container'}
                  `}
                />
              </div>

              <div className="relative">
                <span className="absolute left-3 top-3.5 text-on-surface-variant">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Authorization Protocol (Password)"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  className={`w-full bg-surface-container border rounded-xl py-3 pl-10 pr-10 text-xs text-primary font-mono transition-all outline-none 
                    ${password && !isPasswordValid ? 'border-error focus:ring-error focus:border-error' : 'border-outline-variant/40 focus:border-primary-container focus:ring-1 focus:ring-primary-container'}
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-on-surface-variant hover:text-primary"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-[10px] text-error font-mono bg-error-container/20 p-2 rounded-lg border border-error/30 text-center">
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-container text-surface-container-lowest font-mono font-extrabold tracking-widest py-3 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 uppercase mt-4 shadow-[0_4px_16px_rgba(61,255,160,0.2)] rounded-xl flex items-center justify-center h-[44px]"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : mode === 'login' ? 'Initiate Login' : 'Register Identity'}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-[1px] bg-outline-variant/30"></div>
              <span className="text-[9px] text-on-surface-variant font-mono uppercase tracking-widest">OR</span>
              <div className="flex-1 h-[1px] bg-outline-variant/30"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-surface-container-high border border-outline-variant/40 text-on-surface py-3 rounded-xl hover:bg-surface-container hover:border-primary-container/30 transition-all font-mono text-xs flex justify-center items-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Enter via Google Proxy
            </button>
          </div>

          <div className="bg-surface-container-high/50 p-4 text-center border-t border-outline-variant/20">
            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); }}
              className="text-xs font-mono text-primary-container hover:underline"
            >
              {mode === 'login' ? 'Request Clearance (Sign up)' : 'Already Cleared? Authenticate (Login)'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
