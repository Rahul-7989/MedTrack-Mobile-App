
import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { LoginPage } from './components/LoginPage';
import { GetStartedPage } from './components/GetStartedPage';
import { HubSelectionPage } from './components/HubSelectionPage';
import { EmailVerificationPage } from './components/EmailVerificationPage';
import { CreateHubPage } from './components/CreateHubPage';
import { JoinHubPage } from './components/JoinHubPage';
import { DashboardPage } from './components/DashboardPage';
import { WaitingApprovalPage } from './components/WaitingApprovalPage';
import { RequestDeclinedPage } from './components/RequestDeclinedPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { ProfilePage } from './components/ProfilePage';
import { CareMate } from './components/CareMate';
import { LandingPage } from './components/LandingPage';
import { auth, db } from './lib/firebase';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';

export type View = 'landing' | 'login' | 'signup' | 'hub-selection' | 'email-verification' | 'create-hub' | 'join-hub' | 'dashboard' | 'waiting-approval' | 'request-declined' | 'forgot-password' | 'profile';

export interface UserInfo {
  name: string;
  gender: string | null;
  age?: number | null;
  avatarIndex?: number;
  hubId?: string | null;
  pendingHubId?: string | null;
  notificationsEnabled?: boolean;
  familyAlertsEnabled?: boolean;
  createdAt?: string;
}

const App: React.FC = () => {
  const [view, setView] = useState<View>('landing');
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: 'Friend', gender: null });
  const [pendingUserInfo, setPendingUserInfo] = useState<UserInfo | null>(null);
  const [medications, setMedications] = useState<any[]>([]);

  const navigateTo = (newView: View, data?: UserInfo) => {
    if (newView === 'email-verification' && data) {
      setPendingUserInfo(data);
      setUserInfo(data); 
    } else if (data) {
      setUserInfo(prev => ({ ...prev, ...data }));
    }
    setView(newView);
    window.scrollTo(0, 0);
  };

  // Sync session on auth state change and real-time profile updates
  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined;
    let unsubscribeMeds: (() => void) | undefined;

    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user && user.emailVerified) {
        // Start listening to the user profile for real-time redirects
        unsubscribeProfile = onSnapshot(doc(db, "users", user.uid), (userDoc) => {
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserInfo;
            setUserInfo(userData);

            // Global Redirect Logic
            if (userData.hubId) {
              if (['hub-selection', 'login', 'signup', 'waiting-approval', 'join-hub', 'request-declined', 'forgot-password'].includes(view)) {
                setView('dashboard');
              }
              
              // Listen to meds for CareMate context
              if (!unsubscribeMeds) {
                const medsQuery = query(collection(db, "medications"), where("hubId", "==", userData.hubId));
                unsubscribeMeds = onSnapshot(medsQuery, (snapshot) => {
                  setMedications(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
                });
              }
            } else if (userData.pendingHubId) {
              if (['hub-selection', 'login', 'signup', 'join-hub', 'request-declined', 'forgot-password'].includes(view)) {
                setView('waiting-approval');
              }
            } else {
              if (view === 'waiting-approval') {
                setView('request-declined');
              } else if (['login', 'signup'].includes(view)) {
                setView('hub-selection');
              }
            }
          }
        }, (error) => {
          console.error("Profile sync error:", error);
        });
      } else {
        if (unsubscribeProfile) unsubscribeProfile();
        if (unsubscribeMeds) unsubscribeMeds();
        setMedications([]);
        // Reset user info on logout
        setUserInfo({ name: 'Friend', gender: null });
        setPendingUserInfo(null);
        if (view !== 'login' && view !== 'signup' && view !== 'forgot-password' && view !== 'landing') {
          setView('landing');
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
      if (unsubscribeMeds) unsubscribeMeds();
    };
  }, [view]);

    const showChatbot = ['dashboard', 'profile'].includes(view) && userInfo.hubId;

  return (
    <div className="min-h-screen bg-[#F4F1EC] selection:bg-[#4FA3B1] selection:text-[#F4F1EC]">
      <Navigation 
        onNavigate={navigateTo} 
        currentView={view} 
        userInfo={userInfo}
      />
      
      <main>
        {view === 'landing' && (
          <LandingPage onNavigate={navigateTo} />
        )}

        {view === 'login' && (
          <LoginPage onNavigate={navigateTo} />
        )}
        
        {view === 'signup' && (
          <GetStartedPage onNavigate={navigateTo} />
        )}

        {view === 'forgot-password' && (
          <ForgotPasswordPage onNavigate={navigateTo} />
        )}

        {view === 'email-verification' && (
          <EmailVerificationPage 
            pendingData={pendingUserInfo}
            onVerified={() => navigateTo('hub-selection')} 
          />
        )}

        {view === 'hub-selection' && (
          <HubSelectionPage userName={userInfo.name} onNavigate={navigateTo} />
        )}

        {view === 'create-hub' && (
          <CreateHubPage onNavigate={navigateTo} />
        )}

        {view === 'join-hub' && (
          <JoinHubPage onNavigate={navigateTo} />
        )}

        {view === 'waiting-approval' && (
          <WaitingApprovalPage onNavigate={navigateTo} pendingHubId={userInfo.pendingHubId} />
        )}

        {view === 'request-declined' && (
          <RequestDeclinedPage onNavigate={navigateTo} />
        )}

        {view === 'dashboard' && (
          <DashboardPage hubId={userInfo.hubId || ''} onNavigate={navigateTo} />
        )}

        {view === 'profile' && (
          <ProfilePage onNavigate={navigateTo} userInfo={userInfo} />
        )}
      </main>
      
      {showChatbot && <CareMate userInfo={userInfo} medications={medications} />}
    </div>
  );
};

export default App;
