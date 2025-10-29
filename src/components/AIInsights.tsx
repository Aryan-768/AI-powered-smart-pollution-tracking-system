import { useEffect, useState } from 'react';
import { Brain, TrendingUp, AlertCircle, CheckCircle, Cloud, Droplets } from 'lucide-react';
import { supabase, AIPrediction } from '../lib/supabase';

export default function AIInsights() {
  const [predictions, setPredictions] = useState<AIPrediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('ai_predictions')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setPredictions(data);
    setLoading(false);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'from-red-500 to-red-600';
      case 'Moderate':
        return 'from-yellow-500 to-orange-500';
      case 'Low':
        return 'from-green-500 to-green-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'High':
        return <AlertCircle className="text-red-600" size={24} />;
      case 'Moderate':
        return <TrendingUp className="text-yellow-600" size={24} />;
      case 'Low':
        return <CheckCircle className="text-green-600" size={24} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00bcd4]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#002f4b] to-[#004d6b] py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Brain className="text-[#00bcd4]" size={48} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            AI Insights & Predictions
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Advanced machine learning models analyze weather patterns, waste hotspots,
            and historical data to predict pollution risks across monitored regions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Cloud className="text-blue-400" size={24} />
              </div>
              <div>
                <div className="text-white font-semibold">Weather Integration</div>
                <div className="text-gray-400 text-sm">Real-time climate data</div>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              Rainfall patterns, temperature changes, and storm predictions help forecast
              pollution dispersion and accumulation.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Droplets className="text-purple-400" size={24} />
              </div>
              <div>
                <div className="text-white font-semibold">Microplastic Analysis</div>
                <div className="text-gray-400 text-sm">Particle tracking</div>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              AI models track microplastic concentration trends and predict future
              hotspot formations based on current flow patterns.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {predictions.map((prediction) => (
            <div
              key={prediction.id}
              className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]"
            >
              <div className={`h-2 bg-gradient-to-r ${getRiskColor(prediction.risk_level)}`} />

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getRiskIcon(prediction.risk_level)}
                    <div>
                      <h3 className="text-xl font-bold text-[#002f4b]">
                        {prediction.risk_level} Risk Level
                      </h3>
                      <p className="text-sm text-gray-600">
                        {prediction.location_lat.toFixed(4)}°N, {prediction.location_lng.toFixed(4)}°E
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-gray-600">Confidence</div>
                    <div className="text-2xl font-bold text-[#00bcd4]">
                      {(prediction.confidence_score * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-gray-800 leading-relaxed">
                    {prediction.prediction_text}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {prediction.factors.weather && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-xs text-blue-700 font-semibold mb-1">Weather</div>
                      <div className="text-sm text-blue-900">{prediction.factors.weather}</div>
                    </div>
                  )}

                  {prediction.factors.waste_hotspots !== undefined && (
                    <div className="bg-orange-50 rounded-lg p-3">
                      <div className="text-xs text-orange-700 font-semibold mb-1">
                        Waste Hotspots
                      </div>
                      <div className="text-sm text-orange-900">
                        {prediction.factors.waste_hotspots} identified
                      </div>
                    </div>
                  )}

                  {prediction.factors.historical_trend && (
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="text-xs text-purple-700 font-semibold mb-1">
                        Historical Trend
                      </div>
                      <div className="text-sm text-purple-900 capitalize">
                        {prediction.factors.historical_trend}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-xs text-gray-600">
                    Valid until {new Date(prediction.valid_until).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    Generated {new Date(prediction.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-[#00bcd4] to-[#0097a7] rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">Predictive Intelligence</h3>
          <p className="text-white/90 max-w-2xl mx-auto">
            Our AI models process millions of data points daily to provide actionable
            insights. These predictions help communities prepare for pollution events
            and guide preventive measures before problems escalate.
          </p>
        </div>
      </div>
    </div>
  );
}
