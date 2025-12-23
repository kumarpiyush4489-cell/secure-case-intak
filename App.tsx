
import React, { useState, useEffect } from 'react';
import { Shield, Lock, Sun, Moon, TreePine, Search } from 'lucide-react';
import IntroSlide from './components/IntroSlide';
import LoginSlide from './components/LoginSlide';
import IntakeForm from './components/IntakeForm';
import SuccessView from './components/SuccessView';
import { ScamCase, TrackingStatus } from './types';

type Slide = 'intro' | 'login' | 'form' | 'success' | 'check-status';
type Theme = 'light' | 'dark' | 'olive';

const App: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<Slide>('intro');
  const [theme, setTheme] = useState<Theme>('light');
  const [submittedCase, setSubmittedCase] = useState<ScamCase | null>(null);
  const [contactInfo, setContactInfo] = useState('');
  const [searchId, setSearchId] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Simulation logic: Move status automatically for demo purposes
  useEffect(() => {
    if (submittedCase && submittedCase.trackingStatus !== TrackingStatus.CALLBACK_SCHEDULED) {
      const timer = setTimeout(() => {
        const statuses = Object.values(TrackingStatus);
        const currentIndex = statuses.indexOf(submittedCase.trackingStatus);
        if (currentIndex < statuses.length - 1) {
          setSubmittedCase({
            ...submittedCase,
            trackingStatus: statuses[currentIndex + 1]
          });
        }
      }, 8000); // Progress every 8 seconds for demo
      return () => clearTimeout(timer);
    }
  }, [submittedCase]);

  const handleProceedToIntake = () => setCurrentSlide('login');
  
  const handleLogin = (info: string) => {
    setContactInfo(info);
    setCurrentSlide('form');
  };

  const handleFormSubmit = (data: ScamCase) => {
    const finalData = { ...data, contactInfo, trackingStatus: TrackingStatus.SUBMITTED };
    setSubmittedCase(finalData);
    setCurrentSlide('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFlow = () => {
    setSubmittedCase(null);
    setCurrentSlide('intro');
  };

  const themes: { name: Theme; icon: any }[] = [
    { name: 'light', icon: Sun },
    { name: 'dark', icon: Moon },
    { name: 'olive', icon: TreePine }
  ];

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-main)]/80 backdrop-blur-lg">
        <div className="flex items-center space-x-2">
          <div className="bg-[var(--accent)] p-1.5 rounded-lg shadow-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold tracking-tight text-[var(--text-main)] uppercase text-sm sm:text-base cursor-pointer" onClick={resetFlow}>
            Financial <span className="text-[var(--accent)]">Protection</span>
          </span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="hidden md:flex items-center bg-[var(--bg-card)] rounded-xl border border-[var(--border)] px-3 py-1.5 mr-2">
             <Search className="w-4 h-4 text-[var(--text-muted)] mr-2" />
             <input 
              placeholder="Track Case ID" 
              className="bg-transparent border-none outline-none text-xs text-[var(--text-main)] w-24"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && alert('Case search feature demo: Please submit a case first.')}
             />
          </div>
          <div className="flex bg-[var(--bg-card)] p-1 rounded-full border border-[var(--border)]">
            {themes.map((t) => (
              <button
                key={t.name}
                onClick={() => setTheme(t.name)}
                className={`p-2 rounded-full transition-all ${
                  theme === t.name 
                    ? 'bg-[var(--accent)] text-white shadow-md' 
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <t.icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Slide Container */}
      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto w-full">
          {currentSlide === 'intro' && (
            <IntroSlide onProceed={handleProceedToIntake} />
          )}
          
          {currentSlide === 'login' && (
            <LoginSlide onContinue={handleLogin} />
          )}

          {currentSlide === 'form' && (
            <IntakeForm onSubmit={handleFormSubmit} />
          )}

          {currentSlide === 'success' && submittedCase && (
            <SuccessView caseData={submittedCase} onReset={resetFlow} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-center space-x-2 text-[var(--text-muted)] text-xs uppercase tracking-widest">
            <Lock className="w-3 h-3" />
            <span>256-bit SSL Secure • Official Reporting Portal</span>
          </div>
          <p className="text-[var(--text-muted)] text-[10px] max-w-lg mx-auto leading-relaxed">
            Legal Disclaimer: This platform provides documentation and preliminary assessment. 
            We strictly adhere to RBI/SEBI safety norms. We never charge recovery fees.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
