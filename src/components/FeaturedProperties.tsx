import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PropertyCard from './PropertyCard';
import { Filter, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

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
  map_url?: string;
}

interface FeaturedPropertiesProps {
  searchResults?: Property[];
}

const FeaturedProperties = ({ searchResults }: FeaturedPropertiesProps) => {
  const [activeTab, setActiveTab] = useState('all');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchResults) {
      setProperties(searchResults);
      setLoading(false);
      return;
    }

    const fetchProperties = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching properties:', error);
        setError('Failed to load properties. Please try again later.');
      } else {
        setProperties(data || []);
      }
      setLoading(false);
    };

    fetchProperties();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('public:properties')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, () => {
        fetchProperties(); // Refresh data on any property change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [searchResults]);

  const filteredProperties = useMemo(() => {
    const sourceProperties = searchResults ? properties : properties;

    if (activeTab === 'all') {
      return sourceProperties;
    } else if (activeTab === 'featured') {
      return sourceProperties.filter(p => p.is_featured);
    } else if (activeTab === 'sale') {
      return sourceProperties.filter(p => p.category === 'sale');
    } else if (activeTab === 'rent') {
      return sourceProperties.filter(p => p.category === 'rent');
    } else if (activeTab === 'hot-deals') {
      return sourceProperties.filter(p => p.is_hot_deal);
    }
    return [];
  }, [activeTab, properties, searchResults]);

  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="animate-fade-in">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              {searchResults ? 'Search Results' : 'Featured Properties'}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {searchResults
                ? `Found ${properties.length} properties matching your criteria.`
                : 'Discover our hand-picked selection of premium properties. From luxury homes to prime investment opportunities, find your perfect match.'}
            </p>
          </div>
        </div>

        {/* Property Filters */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-5 max-w-2xl mx-auto bg-card border shadow-sm">
            <TabsTrigger value="all" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Filter className="h-4 w-4" />
              All
            </TabsTrigger>
            <TabsTrigger value="featured" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Featured</TabsTrigger>
            <TabsTrigger value="sale" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">For Sale</TabsTrigger>
            <TabsTrigger value="rent" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">For Rent</TabsTrigger>
            <TabsTrigger value="hot-deals" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              🔥 Hot Deals
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-8">
            {/* Properties Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="space-y-4">
                    <Skeleton className="h-64 w-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-500 text-lg">{error}</p>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">No properties found.</p>
                {searchResults && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => window.location.reload()} // A simple way to reset the search
                  >
                    Clear Search & View All
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {filteredProperties.map((property, index) => (
                    <div
                      key={property.id}
                      className="animate-slide-up hover-scale"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <PropertyCard
                        id={property.id}
                        title={property.title}
                        location={property.location}
                        price={`NPR ${property.price.toLocaleString()}`}
                        image={
                          property.images?.[0] ||
                          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
                        }
                        bedrooms={property.bedrooms}
                        bathrooms={property.bathrooms}
                        area={property.area_sqft ? `${property.area_sqft} sq ft` : 'N/A'}
                        type={property.category as 'sale' | 'rent'}
                        featured={property.is_featured}
                        discount={
                          property.discount_percentage > 0
                            ? `${property.discount_percentage}% OFF`
                            : undefined
                        }
                        property={property}
                      />
                    </div>
                  ))}
                </div>

                {/* View All Button */}
                {!searchResults && (
                  <div className="text-center animate-fade-in">
                    <Button
                      className="btn-hero hover:scale-105 transition-transform"
                      onClick={() => setActiveTab('all')}
                      size="lg"
                    >
                      View All
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="animate-scale-in bg-card/50 backdrop-blur-sm rounded-lg p-6 border">
            <div className="text-3xl font-bold text-accent mb-2">150+</div>
            <div className="text-muted-foreground">Houses for Sale</div>
          </div>
          <div
            className="animate-scale-in bg-card/50 backdrop-blur-.sm rounded-lg p-6 border"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="text-3xl font-bold text-accent mb-2">75+</div>
            <div className="text-muted-foreground">Apartments</div>
          </div>
          <div
            className="animate-scale-in bg-card/50 backdrop-blur-sm rounded-lg p-6 border"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="text-3xl font-bold text-accent mb-2">200+</div>
            <div className="text-muted-foreground">Land Plots</div>
          </div>
          <div
            className="animate-scale-in bg-card/50 backdrop-blur-sm rounded-lg p-6 border"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="text-3xl font-bold text-accent mb-2">50+</div>
            <div className="text-muted-foreground">Commercial</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
