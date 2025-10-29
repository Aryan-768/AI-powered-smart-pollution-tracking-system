import { useState } from 'react';
import { Shield, Filter, Trash2, Users, AlertTriangle, Droplet, ChevronDown, ExternalLink } from 'lucide-react';

export default function Prevention() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const preventionMethods = [
    {
      icon: Filter,
      title: 'Safe Household Water Filtering',
      color: 'blue',
      summary: 'Protect your family from microplastic contamination',
      content: [
        'Install multi-stage water filters with 1-micron or smaller pores',
        'Use activated carbon filters to remove chemicals and microplastics',
        'Regularly replace filter cartridges as per manufacturer guidelines',
        'Consider reverse osmosis systems for maximum protection',
        'Boil water for 10 minutes to kill bacteria (does not remove plastics)',
      ],
      tips: 'Test your water quality quarterly to ensure filter effectiveness',
    },
    {
      icon: Droplet,
      title: 'Reducing Microplastic Exposure',
      color: 'teal',
      summary: 'Minimize plastic in your daily life',
      content: [
        'Switch to glass or stainless steel water bottles and food containers',
        'Avoid heating food in plastic containers or wrapping',
        'Choose natural fiber clothing (cotton, wool, linen) over synthetic',
        'Use reusable shopping bags and produce bags',
        'Opt for plastic-free personal care products and cosmetics',
      ],
      tips: 'Microplastics shed from synthetic fabrics during washing—use a Guppyfriend bag',
    },
    {
      icon: Users,
      title: 'Community Cleanup Drives',
      color: 'green',
      summary: 'Organize and participate in local cleanups',
      content: [
        'Form a local cleanup group with neighbors and friends',
        'Schedule monthly beach, river, or park cleanup events',
        'Provide proper safety equipment (gloves, bags, grabbers)',
        'Document cleanup results and share on social media',
        'Partner with schools and local businesses for larger initiatives',
      ],
      tips: 'Report hazardous waste to authorities—never handle it directly',
    },
    {
      icon: AlertTriangle,
      title: 'Reporting Waste Disposal Mishandling',
      color: 'orange',
      summary: 'Be a pollution watchdog in your community',
      content: [
        'Document evidence with photos, videos, and location data',
        'Use the Community Reporting Hub to submit official reports',
        'Contact local environmental authorities for serious violations',
        'Report illegal dumping to municipal corporations immediately',
        'Follow up on reports to ensure action is taken',
      ],
      tips: 'Anonymous reporting is available—your safety comes first',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string; border: string }> = {
      blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-900',
        icon: 'text-blue-600',
        border: 'border-blue-200',
      },
      teal: {
        bg: 'bg-teal-50',
        text: 'text-teal-900',
        icon: 'text-teal-600',
        border: 'border-teal-200',
      },
      green: {
        bg: 'bg-green-50',
        text: 'text-green-900',
        icon: 'text-green-600',
        border: 'border-green-200',
      },
      orange: {
        bg: 'bg-orange-50',
        text: 'text-orange-900',
        icon: 'text-orange-600',
        border: 'border-orange-200',
      },
    };
    return colors[color];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#002f4b] to-[#004d6b] py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="text-[#00bcd4]" size={48} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Prevention & Safety Methods
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Practical steps everyone can take to reduce pollution exposure and
            protect our water systems for future generations.
          </p>
        </div>

        <div className="space-y-4">
          {preventionMethods.map((method, index) => {
            const Icon = method.icon;
            const colors = getColorClasses(method.color);
            const isExpanded = expandedCard === index;

            return (
              <div
                key={index}
                className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl"
              >
                <button
                  onClick={() => setExpandedCard(isExpanded ? null : index)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${colors.bg}`}>
                      <Icon className={colors.icon} size={28} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-[#002f4b] mb-1">
                        {method.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{method.summary}</p>
                    </div>
                  </div>

                  <ChevronDown
                    className={`text-gray-400 transition-transform duration-300 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    size={24}
                  />
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 animate-expand">
                    <div className={`rounded-xl p-5 border ${colors.bg} ${colors.border}`}>
                      <ul className="space-y-3 mb-4">
                        {method.content.map((item, i) => (
                          <li key={i} className="flex items-start space-x-3">
                            <div className="mt-1">
                              <div className={`w-2 h-2 rounded-full ${colors.icon.replace('text', 'bg')}`} />
                            </div>
                            <span className={`${colors.text} text-sm leading-relaxed`}>
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <div className={`mt-4 pt-4 border-t ${colors.border}`}>
                        <div className="flex items-start space-x-2">
                          <Trash2 className={colors.icon} size={16} />
                          <div>
                            <div className={`${colors.text} font-semibold text-xs mb-1`}>
                              Pro Tip
                            </div>
                            <p className={`${colors.text} text-sm`}>{method.tips}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button className="flex items-center space-x-2 text-[#00bcd4] hover:text-[#0097a7] text-sm font-medium transition-colors">
                        <span>Learn More</span>
                        <ExternalLink size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-[#00bcd4] to-[#0097a7] rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-3">Prevention Saves Lives</h3>
            <p className="text-white/90 leading-relaxed">
              Every small action contributes to a larger impact. By adopting these
              prevention methods, you're not just protecting yourself—you're
              safeguarding entire ecosystems.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-3">Stay Informed</h3>
            <p className="text-gray-300 leading-relaxed">
              Check the AI Insights section regularly for pollution forecasts in your
              area and take preventive action before risks escalate.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes expand {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 1000px;
          }
        }
        .animate-expand {
          animation: expand 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
