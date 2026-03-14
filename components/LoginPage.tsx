
import React, { useState } from 'react';
import { LoginIllustration } from './Illustrations';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { View, UserInfo } from '../App';

interface LoginPageProps {
  onNavigate: (view: View, data?: UserInfo) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const trimmedEmail = email.trim();

    if (!trimmedEmail.includes('@')) {
      setError("Please enter a valid email address. (e.g. name@family.com)");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
      const user = userCredential.user;

      if (user) {
        if (!user.emailVerified) {
          setError("Your email hasn't been verified yet. Please check your inbox for the verification link, then try logging in again.");
          setLoading(false);
          return;
        }
        
        let userData: UserInfo | null = null;
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            userData = userDoc.data() as UserInfo;
          }
        } catch (firestoreErr: any) {
          console.error("Firestore read error:", firestoreErr);
          // We don't block login if Firestore fails to read, but we should log it
        }
        
        if (userData) {
          if (userData.hubId) {
            onNavigate('dashboard', userData);
          } else if (userData.pendingHubId) {
            onNavigate('waiting-approval', userData);
          } else {
            onNavigate('hub-selection', userData);
          }
        } else {
          // If verified but no doc exists (e.g. signed up elsewhere or skipped verification page)
          const newUserData = {
            name: user.displayName || 'Friend',
            email: user.email,
            createdAt: new Date().toISOString(),
            hubId: null
          };
          
          try {
            await setDoc(doc(db, "users", user.uid), newUserData);
          } catch (firestoreErr: any) {
            console.error("Firestore write error:", firestoreErr);
            // If we can't write the doc, we still navigate but with local state
          }
          
          onNavigate('hub-selection', newUserData as UserInfo);
        }
      }
    } catch (err: any) {
      console.error("Login error:", err);
      
      const errorCode = err.code;
      if (errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found' || errorCode === 'auth/invalid-credential') {
        setError("We couldn’t sign you in.\nThe email or password doesn’t seem to match. Try Again");
      } else if (errorCode === 'auth/too-many-requests') {
        setError("Too many failed login attempts. Please try again later or reset your password.");
      } else if (errorCode === 'auth/network-request-failed') {
        setError("Network error. Please check your internet connection and try again.");
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col md:flex-row animate-in fade-in duration-700">
      <div className="w-full md:w-[40%] bg-[#EFEAE3] flex flex-col justify-center items-center p-12 text-center md:text-left relative">
        <button 
          onClick={() => onNavigate('landing')}
          className="absolute top-8 left-8 p-3 bg-white/50 rounded-full text-[#2E2A4A] hover:bg-white transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="max-w-xs space-y-8">
          <LoginIllustration />
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-[#2E2A4A]">Welcome back</h2>
            <p className="text-xl text-[#4FA3B1] font-medium">Someone’s glad you’re here.</p>
          </div>
          <p className="text-[#6A6875] text-sm italic">
            Let’s continue caring — together.
          </p>
        </div>
      </div>

      <div className="w-full md:w-[60%] flex items-center justify-center p-8 md:p-24 bg-[#F4F1EC]">
        <div className="w-full max-w-md space-y-12">
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-6">
              {error && (
                <div className="bg-[#E5A23C]/10 border-l-4 border-[#E5A23C] p-4 rounded-xl animate-in slide-in-from-top-2 duration-300 whitespace-pre-line">
                  <p className="text-[#E5A23C] font-semibold text-sm leading-relaxed">{error}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#2E2A4A] px-2">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@family.com"
                  required
                  className="w-full bg-[#EFEAE3] border-none rounded-2xl px-6 py-4 text-lg text-[#2E2A4A] placeholder-[#6A6875]/50 focus:ring-2 focus:ring-[#4FA3B1]/20 focus:outline-none transition-all shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center px-2">
                  <label className="text-sm font-bold text-[#2E2A4A]">Password</label>
                  <button 
                    type="button" 
                    onClick={() => onNavigate('forgot-password')}
                    className="text-xs font-bold text-[#4FA3B1] hover:text-[#2E2A4A] transition-colors uppercase tracking-widest"
                  >
                    Forgot Password?
                  </button>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#EFEAE3] border-none rounded-2xl px-6 py-4 text-lg text-[#2E2A4A] placeholder-[#6A6875]/50 focus:ring-2 focus:ring-[#4FA3B1]/20 focus:outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-4">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#4FA3B1] text-[#F4F1EC] py-5 rounded-full font-bold text-xl hover-lift shadow-lg shadow-[#4FA3B1]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Logging in...' : 'Log in'}
              </button>
              <div className="text-center">
                <button 
                  type="button"
                  onClick={() => onNavigate('signup')}
                  className="text-[#6A6875] hover:text-[#4FA3B1] transition-colors font-medium"
                >
                  New here? <span className="text-[#E5A23C] font-bold border-b-2 border-[#E5A23C]/20">Get started</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
