import PropertyCard from './PropertyCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

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
}

const FeaturedProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('is_featured', true)
          .limit(6);

        if (error) throw error;
        setProperties(data || []);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <section id="properties" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="animate-fade-in">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Featured Properties
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover our hand-picked selection of premium properties. From luxury homes to prime investment opportunities, find your perfect match.
            </p>
          </div>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="property-card animate-pulse">
                <div className="h-64 bg-muted"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded mb-4 w-3/4"></div>
                  <div className="flex justify-between mb-4">
                    <div className="h-4 bg-muted rounded w-16"></div>
                    <div className="h-4 bg-muted rounded w-16"></div>
                    <div className="h-4 bg-muted rounded w-16"></div>
                  </div>
                  <div className="h-10 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {properties.map((property, index) => (
              <div
                key={property.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <PropertyCard 
                  id={property.id}
                  title={property.title}
                  location={property.location}
                  price={`Rs. ${(property.price / 10000000).toFixed(1)} Cr`}
                  image={property.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'}
                  bedrooms={property.bedrooms}
                  bathrooms={property.bathrooms}
                  area={property.area_sqft ? `${property.area_sqft} sq ft` : undefined}
                  type="sale"
                  featured={property.is_featured}
                  discount={property.discount_percentage > 0 ? `${property.discount_percentage}% Off` : undefined}
                />
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center animate-fade-in">
          <Button 
            className="btn-hero"
            onClick={() => window.location.href = '#contact'}
          >
            View All Properties
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="animate-scale-in">
            <div className="text-3xl font-bold text-accent mb-2">150+</div>
            <div className="text-muted-foreground">Houses for Sale</div>
          </div>
          <div className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <div className="text-3xl font-bold text-accent mb-2">75+</div>
            <div className="text-muted-foreground">Apartments</div>
          </div>
          <div className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-3xl font-bold text-accent mb-2">200+</div>
            <div className="text-muted-foreground">Land Plots</div>
          </div>
          <div className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="text-3xl font-bold text-accent mb-2">50+</div>
            <div className="text-muted-foreground">Commercial</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;