import { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hello! I'm Aqua AI, your digital water guardian. I can help you understand pollution metrics, draft complaint messages, explain safety measures, and answer questions about water quality. How can I assist you today?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickActions = [
    'Explain my area\'s pollution level',
    'Draft a complaint email',
    'What safety measures should I take?',
    'How do I read the metrics?',
  ];

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('pollution') && lowerMessage.includes('level')) {
      return "Based on recent data, pollution levels vary across regions. I can see from our latest reports that areas with high plastic density (70+) require immediate attention. Would you like me to analyze a specific location? Just provide the coordinates or location name.";
    }

    if (lowerMessage.includes('complaint') || lowerMessage.includes('email')) {
      return `Here's a template you can use:

Subject: Urgent: Pollution Report at [Location]

Dear [Authority Name],

I am writing to report a pollution incident observed at [Location, Coordinates]. On [Date], I noticed [describe what you saw - plastic accumulation, oil spill, sewage discharge, etc.].

This poses a serious risk to [water quality/marine life/public health]. I have documented the incident with photographs and submitted a report through AquaSentinel (Report ID: [if available]).

I kindly request immediate investigation and appropriate action to address this issue.

Thank you for your attention to this matter.

Sincerely,
[Your Name]

Would you like me to customize this for a specific organization?`;
    }

    if (lowerMessage.includes('safety') || lowerMessage.includes('protection')) {
      return "For personal safety around polluted water:\n\n1. Avoid direct contact with visibly contaminated water\n2. Use certified water filters for drinking water\n3. Wash hands thoroughly if contact occurs\n4. Keep children and pets away from polluted areas\n5. Report any suspicious discharge immediately\n\nFor specific guidance based on pollution type (chemical, oil, sewage, plastic), which would you like to know more about?";
    }

    if (lowerMessage.includes('metric') || lowerMessage.includes('read')) {
      return "Let me explain our key metrics:\n\n• Plastic Density Index (0-100): Measures plastic particle concentration. 0-30 is Low, 30-50 is Moderate, 50-70 is High, 70+ is Critical.\n\n• Water Clarity: Visual assessment - Clear (minimal contamination), Moderate (visible particles), Poor (significant pollution).\n\n• Microplastic Count: Particles per cubic meter of water.\n\n• Pollution Trend: Rising (getting worse), Stable (unchanged), Declining (improving).\n\nWhich metric would you like more details about?";
    }

    if (lowerMessage.includes('report') || lowerMessage.includes('submit')) {
      return "To submit a pollution report:\n\n1. Go to the Community Reporting Hub\n2. Your GPS location will auto-populate (or manually enter coordinates)\n3. Select pollution category (Plastic, Chemical, Oil, Sewage)\n4. Describe what you observed\n5. Estimate plastic density and water clarity\n6. Submit (anonymous reporting is available)\n\nYour report helps authorities respond faster and builds our community database. Every report matters!";
    }

    if (lowerMessage.includes('predict') || lowerMessage.includes('forecast')) {
      return "Our AI prediction system analyzes:\n\n• Weather patterns (rainfall increases plastic runoff)\n• Waste hotspot proximity\n• Historical pollution trends\n• Seasonal factors\n\nCheck the AI Insights section for risk forecasts in different regions. We update predictions daily based on new data. Would you like me to explain a specific prediction?";
    }

    return "I'm here to help you understand pollution data and take action. I can:\n\n• Summarize pollution reports for any location\n• Explain complex metrics in simple terms\n• Draft complaint messages to authorities\n• Suggest personal safety actions\n• Guide you through using AquaSentinel features\n\nWhat would you like to know more about?";
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = { role: 'user', content: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(inputMessage);
      const assistantMessage: Message = { role: 'assistant', content: response };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
    handleSendMessage();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-br from-[#00bcd4] to-[#0097a7] text-white rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 group"
      >
        {isOpen ? (
          <X size={28} />
        ) : (
          <>
            <MessageCircle size={28} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></span>
          </>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
          <div className="bg-gradient-to-r from-[#002f4b] to-[#00bcd4] p-4 text-white">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Sparkles size={32} className="animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Aqua AI</h3>
                <p className="text-xs text-white/80">Your Digital Water Guardian</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-[#00bcd4] text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none shadow-md'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-md">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.4s' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {messages.length === 1 && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-2">Quick Actions:</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action)}
                    className="px-3 py-1 bg-white hover:bg-[#00bcd4] hover:text-white text-xs rounded-full border border-gray-300 transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00bcd4] text-sm"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 bg-[#00bcd4] hover:bg-[#0097a7] text-white rounded-full transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
