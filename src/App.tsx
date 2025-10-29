import { useState, useRef } from 'react';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import PollutionMap from './components/PollutionMap';
import AIInsights from './components/AIInsights';
import Prevention from './components/Prevention';
import CommunityReporting from './components/CommunityReporting';
import Corporations from './components/Corporations';
import AIAssistant from './components/AIAssistant';
import Tutorial from './components/Tutorial';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [showTutorial, setShowTutorial] = useState(true);
  const sectionsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    if (section !== 'home' && section !== 'assistant') {
      setTimeout(() => {
        sectionsRef.current[section]?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleExplore = () => {
    setActiveSection('map');
    setTimeout(() => {
      sectionsRef.current['map']?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="relative">
      {showTutorial && <Tutorial onComplete={() => setShowTutorial(false)} />}

      <Navigation activeSection={activeSection} onNavigate={handleNavigate} />

      {activeSection === 'home' && <LandingPage onExplore={handleExplore} />}

      <div
        ref={(el) => (sectionsRef.current['map'] = el)}
        className={activeSection === 'map' ? 'block' : 'hidden'}
      >
        <PollutionMap />
      </div>

      <div
        ref={(el) => (sectionsRef.current['insights'] = el)}
        className={activeSection === 'insights' ? 'block' : 'hidden'}
      >
        <AIInsights />
      </div>

      <div
        ref={(el) => (sectionsRef.current['prevention'] = el)}
        className={activeSection === 'prevention' ? 'block' : 'hidden'}
      >
        <Prevention />
      </div>

      <div
        ref={(el) => (sectionsRef.current['community'] = el)}
        className={activeSection === 'community' ? 'block' : 'hidden'}
      >
        <CommunityReporting />
      </div>

      <div
        ref={(el) => (sectionsRef.current['corporations'] = el)}
        className={activeSection === 'corporations' ? 'block' : 'hidden'}
      >
        <Corporations />
      </div>

      <AIAssistant />
    </div>
  );
}

export default App;
