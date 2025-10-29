import { useState, useEffect } from 'react';
import { MapPin, Send, CheckCircle, Users } from 'lucide-react';
import { supabase, PollutionReport } from '../lib/supabase';

export default function CommunityReporting() {
  const [reports, setReports] = useState<PollutionReport[]>([]);
  const [formData, setFormData] = useState({
    location_lat: 19.0760,
    location_lng: 72.8777,
    category: 'Plastic',
    description: '',
    plastic_density_index: 50,
    water_clarity_level: 'Moderate',
    reported_by: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReports();
    getUserLocation();
  }, []);

  const fetchReports = async () => {
    const { data } = await supabase
      .from('pollution_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) setReports(data);
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            location_lat: position.coords.latitude,
            location_lng: position.coords.longitude,
          }));
        },
        (error) => {
          console.log('Location access denied', error);
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('pollution_reports').insert([
      {
        ...formData,
        reported_by: formData.reported_by || 'Anonymous',
        status: 'New',
      },
    ]);

    if (!error) {
      setSubmitted(true);
      fetchReports();
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          location_lat: 19.0760,
          location_lng: 72.8777,
          category: 'Plastic',
          description: '',
          plastic_density_index: 50,
          water_clarity_level: 'Moderate',
          reported_by: '',
        });
      }, 3000);
    }

    setLoading(false);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Plastic: 'bg-blue-100 text-blue-800',
      Chemical: 'bg-purple-100 text-purple-800',
      Oil: 'bg-gray-800 text-white',
      Sewage: 'bg-brown-100 text-brown-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      New: 'bg-yellow-100 text-yellow-800',
      Verified: 'bg-green-100 text-green-800',
      Resolved: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#002f4b] to-[#004d6b] py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Users className="text-[#00bcd4]" size={48} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Community Reporting Hub
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Your eyes on the ground matter. Report pollution incidents to help
            authorities respond faster and build a comprehensive pollution database.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-[#002f4b] mb-6">Submit a Report</h3>

            {submitted ? (
              <div className="py-12 text-center">
                <CheckCircle className="mx-auto mb-4 text-green-500" size={64} />
                <h4 className="text-xl font-bold text-green-700 mb-2">
                  Report Submitted Successfully!
                </h4>
                <p className="text-gray-600">
                  Thank you for helping protect our waters. Your report has been logged
                  and will be reviewed by authorities.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="inline mr-2" size={16} />
                    Location
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      step="any"
                      value={formData.location_lat}
                      onChange={(e) =>
                        setFormData({ ...formData, location_lat: parseFloat(e.target.value) })
                      }
                      placeholder="Latitude"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00bcd4] focus:border-transparent"
                      required
                    />
                    <input
                      type="number"
                      step="any"
                      value={formData.location_lng}
                      onChange={(e) =>
                        setFormData({ ...formData, location_lng: parseFloat(e.target.value) })
                      }
                      placeholder="Longitude"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00bcd4] focus:border-transparent"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Auto-detected from GPS (you can modify if needed)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pollution Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00bcd4] focus:border-transparent"
                  >
                    <option value="Plastic">Plastic</option>
                    <option value="Chemical">Chemical</option>
                    <option value="Oil">Oil</option>
                    <option value="Sewage">Sewage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what you observed..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00bcd4] focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Estimated Plastic Density: {formData.plastic_density_index}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.plastic_density_index}
                    onChange={(e) =>
                      setFormData({ ...formData, plastic_density_index: parseInt(e.target.value) })
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Water Clarity Level
                  </label>
                  <select
                    value={formData.water_clarity_level}
                    onChange={(e) =>
                      setFormData({ ...formData, water_clarity_level: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00bcd4] focus:border-transparent"
                  >
                    <option value="Clear">Clear</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.reported_by}
                    onChange={(e) => setFormData({ ...formData, reported_by: e.target.value })}
                    placeholder="Anonymous"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00bcd4] focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#00bcd4] hover:bg-[#0097a7] text-white font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>Submit Report</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-[#002f4b] mb-6">Recent Reports</h3>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(
                          report.category
                        )}`}
                      >
                        {report.category}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {report.status}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(report.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 mb-2">
                    {report.description || 'No description provided'}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>
                      <MapPin className="inline" size={12} /> {report.location_lat.toFixed(4)}°,{' '}
                      {report.location_lng.toFixed(4)}°
                    </span>
                    <span className="text-gray-500">by {report.reported_by}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
