import { Waves, ArrowDown } from 'lucide-react';

interface LandingPageProps {
  onExplore: () => void;
}

export default function LandingPage({ onExplore }: LandingPageProps) {
  return (
    <div className="relative h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#002f4b] via-[#004d6b] to-[#00bcd4]">
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${Math.random() * 300 + 50}px`,
                height: `${Math.random() * 300 + 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 15}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
                filter: 'blur(40px)',
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-6">
        <div className="mb-8 animate-pulse">
          <Waves size={80} className="text-[#00bcd4]" strokeWidth={1.5} />
        </div>

        <h1 className="text-6xl md:text-8xl font-bold mb-6 text-center tracking-tight">
          AquaSentinel
        </h1>

        <p className="text-xl md:text-2xl mb-4 text-[#00bcd4] font-light tracking-wide">
          Watch Over Your Waters
        </p>

        <p className="text-lg md:text-xl mb-12 text-gray-200 font-light">
          Detect. Predict. Protect.
        </p>

        <div className="max-w-2xl text-center mb-12 text-gray-100 leading-relaxed">
          <p className="text-lg">
            Join a global movement to monitor plastic and water pollution.
            Using AI-powered insights and community data, we're building
            a smarter, safer future for our oceans and waterways.
          </p>
        </div>

        <button
          onClick={onExplore}
          className="group relative px-8 py-4 bg-[#00bcd4] hover:bg-[#00acc1] text-white rounded-full font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
        >
          View Pollution Map
          <ArrowDown className="inline-block ml-2 group-hover:translate-y-1 transition-transform" size={20} />
        </button>

        <div className="absolute bottom-8 animate-bounce">
          <ArrowDown size={32} className="text-white/50" />
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-40px) translateX(-10px); }
          75% { transform: translateY(-20px) translateX(5px); }
        }
      `}</style>
    </div>
  );
}
