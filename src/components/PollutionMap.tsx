import { useEffect, useRef, useState } from 'react';
import { supabase, PollutionMetric, PollutionReport } from '../lib/supabase';
import { X, TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';

interface PollutionMapProps {
  onLocationSelect?: (metric: PollutionMetric | null) => void;
}

export default function PollutionMap({ onLocationSelect }: PollutionMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<PollutionMetric | null>(null);
  const [metrics, setMetrics] = useState<PollutionMetric[]>([]);
  const [reports, setReports] = useState<PollutionReport[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: metricsData } = await supabase
      .from('pollution_metrics')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: reportsData } = await supabase
      .from('pollution_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (metricsData) setMetrics(metricsData);
    if (reportsData) setReports(reportsData);
  };

  useEffect(() => {
    if (!mapRef.current || typeof window === 'undefined') return;

    const initMap = () => {
      const map = new google.maps.Map(mapRef.current!, {
        center: { lat: 20.5937, lng: 78.9629 },
        zoom: 5,
        styles: [
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#004d6b' }],
          },
          {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [{ color: '#f5f5f5' }],
          },
        ],
      });

      googleMapRef.current = map;

      metrics.forEach((metric) => {
        const marker = new google.maps.Marker({
          position: { lat: metric.location_lat, lng: metric.location_lng },
          map,
          title: metric.location_name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: getColorByDensity(metric.plastic_density_index),
            fillOpacity: 0.8,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
          animation: google.maps.Animation.DROP,
        });

        marker.addListener('click', () => {
          setSelectedLocation(metric);
          onLocationSelect?.(metric);
          map.panTo({ lat: metric.location_lat, lng: metric.location_lng });
          map.setZoom(10);
        });

        markersRef.current.push(marker);
      });

      reports.forEach((report) => {
        const marker = new google.maps.Marker({
          position: { lat: report.location_lat, lng: report.location_lng },
          map,
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 6,
            fillColor: '#ff6b6b',
            fillOpacity: 0.9,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
        });

        markersRef.current.push(marker);
      });
    };

    if (window.google && window.google.maps) {
      initMap();
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyALIa6iemOejolCat_PulfRXhBAbCQ9e8A`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    }

    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };
  }, [metrics, reports]);

  const getColorByDensity = (density: number): string => {
    if (density >= 70) return '#ef4444';
    if (density >= 50) return '#f59e0b';
    if (density >= 30) return '#eab308';
    return '#10b981';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'Rising':
        return <TrendingUp className="text-red-500" size={20} />;
      case 'Declining':
        return <TrendingDown className="text-green-500" size={20} />;
      default:
        return <Minus className="text-yellow-500" size={20} />;
    }
  };

  const getClarityColor = (clarity: string) => {
    switch (clarity) {
      case 'Clear':
        return 'text-green-600 bg-green-100';
      case 'Moderate':
        return 'text-yellow-600 bg-yellow-100';
      case 'Poor':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="relative w-full h-screen">
      <div ref={mapRef} className="w-full h-full" />

      {selectedLocation && (
        <div className="absolute top-4 right-4 w-96 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-6 animate-slide-in">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-[#002f4b]">
              {selectedLocation.location_name}
            </h3>
            <button
              onClick={() => {
                setSelectedLocation(null);
                onLocationSelect?.(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-[#002f4b] to-[#00bcd4] rounded-xl p-4 text-white">
              <div className="text-sm opacity-90 mb-1">Plastic Density Index</div>
              <div className="text-4xl font-bold">
                {selectedLocation.plastic_density_index}
                <span className="text-lg">/100</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">Water Clarity</div>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getClarityColor(
                    selectedLocation.water_clarity_level
                  )}`}
                >
                  {selectedLocation.water_clarity_level}
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">Pollution Trend</div>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(selectedLocation.pollution_trend)}
                  <span className="text-sm font-semibold">
                    {selectedLocation.pollution_trend}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <div className="text-xs font-semibold text-amber-900 mb-1">
                    Microplastic Count
                  </div>
                  <div className="text-lg font-bold text-amber-700">
                    {selectedLocation.microplastic_count.toLocaleString()}
                  </div>
                  <div className="text-xs text-amber-600 mt-1">
                    particles per cubic meter
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-600 mb-1">Last Updated</div>
              <div className="text-sm font-medium">
                {new Date(selectedLocation.last_updated).toLocaleString()}
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200">
              <div className="text-xs text-gray-500 italic">
                Click anywhere on the map to explore other locations
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-lg rounded-xl shadow-xl p-4">
        <div className="text-sm font-semibold text-[#002f4b] mb-3">Legend</div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-xs">Low (0-30)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span className="text-xs">Moderate (30-50)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
            <span className="text-xs">High (50-70)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-xs">Critical (70+)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-400 rotate-45"></div>
            <span className="text-xs">Community Report</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
