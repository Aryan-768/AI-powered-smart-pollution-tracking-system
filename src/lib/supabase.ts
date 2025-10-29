import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface PollutionReport {
  id: string;
  location_lat: number;
  location_lng: number;
  category: 'Plastic' | 'Chemical' | 'Oil' | 'Sewage';
  description: string;
  photo_url?: string;
  plastic_density_index: number;
  water_clarity_level: 'Clear' | 'Moderate' | 'Poor';
  reported_by: string;
  status: 'New' | 'Verified' | 'Resolved';
  created_at: string;
}

export interface PollutionMetric {
  id: string;
  location_lat: number;
  location_lng: number;
  location_name: string;
  plastic_density_index: number;
  water_clarity_level: 'Clear' | 'Moderate' | 'Poor';
  microplastic_count: number;
  pollution_trend: 'Rising' | 'Stable' | 'Declining';
  last_updated: string;
  created_at: string;
}

export interface AIPrediction {
  id: string;
  location_lat: number;
  location_lng: number;
  risk_level: 'Low' | 'Moderate' | 'High';
  prediction_text: string;
  confidence_score: number;
  factors: {
    weather?: string;
    waste_hotspots?: number;
    historical_trend?: string;
  };
  valid_until: string;
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  type: 'Authority' | 'Corporation' | 'NGO';
  location_lat: number;
  location_lng: number;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  created_at: string;
}
