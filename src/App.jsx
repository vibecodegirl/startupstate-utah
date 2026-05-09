import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AdvisorFloating from '@/components/advisor/AdvisorFloating';
import Home from '@/pages/Home';
import Advisor from '@/pages/Advisor';
import StartupMap from '@/pages/StartupMap';
import Resources from '@/pages/Resources';
import AddStartup from '@/pages/AddStartup';
import WhyUtah from '@/pages/WhyUtah';
import Events from '@/pages/Events';
import StartPage from '@/pages/StartPage';
import Funding from '@/pages/Funding';
import AdminDashboard from '@/pages/AdminDashboard';
import InvestorResources from '@/pages/InvestorResources';
import StartupProfile from '@/pages/StartupProfile';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const [role, setRole] = useState('visitor');
  const [advisorContext, setAdvisorContext] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      setAdvisorContext(e.detail?.context || '__open__');
    };
    window.addEventListener('openAdvisor', handler);
    return () => window.removeEventListener('openAdvisor', handler);
  }, []);

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <img
            src="https://media.base44.com/images/public/user_67cc86b158aeb10359268a7e/44ea76f88_StartupState_Logo_Web_Color_Horiz.webp"
            alt="Startup State"
            className="h-12 w-auto animate-pulse-gentle"
          />
          <div className="w-8 h-8 border-4 border-green-light border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <>
      <Navbar role={role} setRole={setRole} />
      <Routes>
        <Route path="/" element={<Home role={role} />} />
        <Route path="/advisor" element={<Advisor />} />
        <Route path="/map" element={<StartupMap />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/add-startup" element={<AddStartup />} />
        <Route path="/why-utah" element={<WhyUtah />} />
        <Route path="/events" element={<Events />} />
        <Route path="/start" element={<StartPage />} />
        <Route path="/funding" element={<Funding />} />
        <Route path="/admin" element={<AdminDashboard role={role} />} />
        <Route path="/investors" element={<InvestorResources />} />
        <Route path="/startups/:id" element={<StartupProfile />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
      <AdvisorFloating initialContext={advisorContext === '__open__' ? null : advisorContext} />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;