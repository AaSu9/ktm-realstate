import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PropertyCard from './PropertyCard';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Filter, ArrowRight } from 'lucide-react';
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
  category: string;
  status?: string;
}

const FeaturedProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        let query = supabase
          .from('properties')
          .select('*')
          .eq('status', 'available')
          .order('created_at', { ascending: false });

        if (activeTab === 'featured') {
          query = query.eq('is_featured', true);
        } else if (activeTab === 'sale') {
          query = query.eq('category', 'sale');
        } else if (activeTab === 'rent') {
          query = query.eq('category', 'rent');
        } else if (activeTab === 'hot-deals') {
          query = query.eq('is_hot_deal', true);
        }

        query = query.limit(20);

        const { data, error } = await query;

        if (error) throw error;
        setProperties(data || []);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [activeTab]);

  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted/30">
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
            <TabsTrigger value="hot-deals" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">🔥 Hot Deals</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-8">
            {/* Properties Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="property-card animate-pulse">
                    <div className="h-64 bg-muted rounded-t-lg"></div>
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
            ) : properties.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">No properties found in this category.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setActiveTab('all')}
                >
                  View All Properties
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {properties.map((property, index) => (
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
                        image={property.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'}
                        bedrooms={property.bedrooms}
                        bathrooms={property.bathrooms}
                        area={property.area_sqft ? `${property.area_sqft} sq ft` : 'N/A'}
                        type={property.category as 'sale' | 'rent'}
                        featured={property.is_featured}
                        discount={property.discount_percentage > 0 ? `${property.discount_percentage}% OFF` : undefined}
                        property={property}
                      />
                    </div>
                  ))}
                </div>

                {/* View All Button */}
                <div className="text-center animate-fade-in">
                  <Button 
                    className="btn-hero hover:scale-105 transition-transform"
                    onClick={() => window.location.href = '#contact'}
                    size="lg"
                  >
                    View All Properties ({properties.length}+ available)
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
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
          <div className="animate-scale-in bg-card/50 backdrop-blur-sm rounded-lg p-6 border" style={{ animationDelay: '0.1s' }}>
            <div className="text-3xl font-bold text-accent mb-2">75+</div>
            <div className="text-muted-foreground">Apartments</div>
          </div>
          <div className="animate-scale-in bg-card/50 backdrop-blur-sm rounded-lg p-6 border" style={{ animationDelay: '0.2s' }}>
            <div className="text-3xl font-bold text-accent mb-2">200+</div>
            <div className="text-muted-foreground">Land Plots</div>
          </div>
          <div className="animate-scale-in bg-card/50 backdrop-blur-sm rounded-lg p-6 border" style={{ animationDelay: '0.3s' }}>
            <div className="text-3xl font-bold text-accent mb-2">50+</div>
            <div className="text-muted-foreground">Commercial</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;