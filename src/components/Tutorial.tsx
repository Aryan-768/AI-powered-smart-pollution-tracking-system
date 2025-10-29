import { useState, useEffect } from 'react';
import { X, ChevronRight, MousePointer, MapPin, FileText, MessageCircle } from 'lucide-react';

interface TutorialProps {
  onComplete: () => void;
}

export default function Tutorial({ onComplete }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [show, setShow] = useState(true);

  const steps = [
    {
      icon: MousePointer,
      title: 'Welcome to AquaSentinel',
      description:
        'Your AI-powered platform for monitoring and preventing water pollution. Let me show you around!',
      highlight: 'none',
    },
    {
      icon: MapPin,
      title: 'Interactive Pollution Map',
      description:
        'Click anywhere on the map to analyze pollution levels. Each marker shows real-time data including plastic density, water clarity, and pollution trends.',
      highlight: 'map',
    },
    {
      icon: FileText,
      title: 'Report Pollution',
      description:
        'Spotted pollution? Go to the Community Reporting Hub to submit a report. Your GPS location is auto-detected, and you can add photos and descriptions.',
      highlight: 'community',
    },
    {
      icon: MessageCircle,
      title: 'Ask Aqua AI',
      description:
        'Need help understanding the data or want to draft a complaint? Click the chat icon to talk with Aqua AI, your digital water guardian.',
      highlight: 'assistant',
    },
  ];

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('aquasentinel_tutorial_seen');
    if (hasSeenTutorial) {
      setShow(false);
      onComplete();
    }
  }, []);

  const saveTutorialComplete = () => {
    localStorage.setItem('aquasentinel_tutorial_seen', 'true');
    handleClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-scale-in">
        <div className="bg-gradient-to-r from-[#002f4b] to-[#00bcd4] p-6 text-white relative">
          <button
            onClick={saveTutorialComplete}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <X size={24} />
          </button>

          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-white/20 rounded-full">
              <Icon size={40} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center">{currentStepData.title}</h2>
        </div>

        <div className="p-6">
          <p className="text-gray-700 text-center leading-relaxed mb-6">
            {currentStepData.description}
          </p>

          <div className="flex items-center justify-center space-x-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-8 bg-[#00bcd4]'
                    : index < currentStep
                    ? 'w-2 bg-[#00bcd4]/50'
                    : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={saveTutorialComplete}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Skip Tutorial
            </button>
            <button
              onClick={handleNext}
              className="flex-1 py-3 bg-[#00bcd4] hover:bg-[#0097a7] text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <span>{currentStep < steps.length - 1 ? 'Next' : 'Get Started'}</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
