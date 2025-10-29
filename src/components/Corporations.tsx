import { useEffect, useState } from 'react';
import { Building2, Phone, Mail, MapPin, ExternalLink, Navigation } from 'lucide-react';
import { supabase, Organization } from '../lib/supabase';

export default function Corporations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('organizations')
      .select('*')
      .order('name');

    if (data) setOrganizations(data);
    setLoading(false);
  };

  const filteredOrganizations =
    filter === 'All'
      ? organizations
      : organizations.filter((org) => org.type === filter);

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      Authority: 'bg-blue-100 text-blue-800 border-blue-200',
      Corporation: 'bg-purple-100 text-purple-800 border-purple-200',
      NGO: 'bg-green-100 text-green-800 border-green-200',
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const calculateDistance = (lat: number, lng: number) => {
    const userLat = 19.0760;
    const userLng = 72.8777;
    const R = 6371;
    const dLat = ((lat - userLat) * Math.PI) / 180;
    const dLng = ((lng - userLng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userLat * Math.PI) / 180) *
        Math.cos((lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#002f4b] to-[#004d6b] py-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00bcd4]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#002f4b] to-[#004d6b] py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="text-[#00bcd4]" size={48} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Nearby Corporations & Authorities
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Connect with verified environmental organizations, pollution control boards,
            and NGOs ready to respond to pollution incidents in your area.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {['All', 'Authority', 'Corporation', 'NGO'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                filter === type
                  ? 'bg-[#00bcd4] text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredOrganizations.map((org) => (
            <div
              key={org.id}
              className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#002f4b] mb-2">{org.name}</h3>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(
                        org.type
                      )}`}
                    >
                      {org.type}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-600">Distance</div>
                    <div className="text-2xl font-bold text-[#00bcd4]">
                      {calculateDistance(org.location_lat, org.location_lng)} km
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-start space-x-3 text-sm">
                    <MapPin className="text-gray-400 flex-shrink-0 mt-0.5" size={16} />
                    <span className="text-gray-700">{org.address}</span>
                  </div>

                  {org.phone && (
                    <div className="flex items-center space-x-3 text-sm">
                      <Phone className="text-gray-400 flex-shrink-0" size={16} />
                      <a
                        href={`tel:${org.phone}`}
                        className="text-[#00bcd4] hover:text-[#0097a7] font-medium"
                      >
                        {org.phone}
                      </a>
                    </div>
                  )}

                  {org.email && (
                    <div className="flex items-center space-x-3 text-sm">
                      <Mail className="text-gray-400 flex-shrink-0" size={16} />
                      <a
                        href={`mailto:${org.email}`}
                        className="text-[#00bcd4] hover:text-[#0097a7] font-medium"
                      >
                        {org.email}
                      </a>
                    </div>
                  )}

                  {org.website && (
                    <div className="flex items-center space-x-3 text-sm">
                      <ExternalLink className="text-gray-400 flex-shrink-0" size={16} />
                      <a
                        href={org.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00bcd4] hover:text-[#0097a7] font-medium"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${org.location_lat},${org.location_lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-center text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <Navigation size={16} />
                    <span>Get Directions</span>
                  </a>
                  <button className="flex-1 py-2 px-4 bg-[#00bcd4] hover:bg-[#0097a7] text-white rounded-lg text-center text-sm font-medium transition-colors">
                    Report Issue
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOrganizations.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="mx-auto mb-4 text-gray-400" size={64} />
            <p className="text-gray-300 text-lg">
              No organizations found for this filter.
            </p>
          </div>
        )}

        <div className="mt-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-3">Quick Response Network</h3>
          <p className="text-white/90 leading-relaxed mb-4">
            These organizations are part of AquaSentinel's verified response network.
            They have committed to monitoring reports and responding to pollution
            incidents within their jurisdictions.
          </p>
          <p className="text-sm text-white/75">
            For emergencies involving chemical spills or health hazards, contact local
            emergency services immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
