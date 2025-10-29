import { Waves, MapPin, Brain, Shield, Users, Building2, MessageCircle } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

export default function Navigation({ activeSection, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Waves },
    { id: 'map', label: 'Pollution Map', icon: MapPin },
    { id: 'insights', label: 'AI Insights', icon: Brain },
    { id: 'prevention', label: 'Prevention', icon: Shield },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'corporations', label: 'Corporations', icon: Building2 },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#002f4b]/90 backdrop-blur-lg border-b border-[#00bcd4]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Waves className="text-[#00bcd4]" size={28} />
            <span className="text-white font-bold text-xl">AquaSentinel</span>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-[#00bcd4] text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onNavigate('assistant')}
            className="flex items-center space-x-2 px-4 py-2 bg-[#00bcd4] hover:bg-[#00acc1] text-white rounded-lg transition-all duration-200"
          >
            <MessageCircle size={18} />
            <span className="hidden sm:inline text-sm font-medium">Assistant</span>
          </button>
        </div>
      </div>

      <div className="md:hidden flex overflow-x-auto px-4 pb-2 space-x-2 scrollbar-hide">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center space-y-1 px-3 py-1 rounded-lg whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-[#00bcd4] text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Icon size={16} />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
