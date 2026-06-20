import { Button } from '@/components/ui/button';
import PropertySearch from '@/components/PropertySearch';
import heroImage from '@/assets/hero-property.jpg';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  images: string[];
  bedrooms?: number;
  bathrooms?: number;
  area_sqft?: number;
  property_type: string;
  is_featured: boolean;
  is_hot_deal: boolean;
  discount_percentage: number;
  category: string;
  status?: string;
  created_at: string;
}

interface HeroProps {
  onSearchResults: (results: Property[]) => void;
}

const Hero = ({ onSearchResults }: HeroProps) => {
  const [stats, setStats] = useState({ properties_listed: 0, happy_clients: 0, years_experience: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from('stats')
        .select('*')
        .single();
      if (data) {
        setStats(data);
      }
      if(error && error.code !== 'PGRST116') {
        console.error("Error fetching stats", error)
      }
    };
    fetchStats();
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/80 mix-blend-multiply"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-md">
              Find Your Perfect
              <span className="block text-accent">
                Dream Home in Nepal
              </span>
            </h1>
            <p className="text-xl text-white/95 mb-8 leading-relaxed font-medium drop-shadow-sm">
              Discover premium properties in Imadol, Budhanilkantha, and Pepsicola. From luxury homes to prime land investments, we make your real estate dreams a reality.
            </p>
          </div>

          {/* Search Form */}
          <PropertySearch className="animate-slide-up" onSearchResults={onSearchResults} />

          {/* Stats */}
          <div className="mt-12 animate-scale-in">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-white mb-2">{stats.properties_listed}+</div>
                <div className="text-white/80">Properties Listed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">{stats.happy_clients}+</div>
                <div className="text-white/80">Happy Clients</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">{stats.years_experience}+</div>
                <div className="text-white/80">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-accent rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;