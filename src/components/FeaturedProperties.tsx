import PropertyCard from './PropertyCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import property1 from '@/assets/property-1.jpg';
import property2 from '@/assets/property-2.jpg';
import property3 from '@/assets/property-3.jpg';

const FeaturedProperties = () => {
  const properties = [
    {
      id: '1',
      title: 'Luxury Mountain View Villa',
      location: 'Budhanilkantha, Kathmandu',
      price: 'Rs. 2.5 Crore',
      image: property1,
      bedrooms: 4,
      bathrooms: 3,
      area: '3,500 sq ft',
      type: 'sale' as const,
      featured: true,
      discount: '10% Off'
    },
    {
      id: '2',
      title: 'Modern Apartment Complex',
      location: 'New Baneshwor, Kathmandu',
      price: 'Rs. 85 Lakh',
      image: property2,
      bedrooms: 3,
      bathrooms: 2,
      area: '1,200 sq ft',
      type: 'sale' as const,
      featured: true
    },
    {
      id: '3',
      title: 'Premium Development Land',
      location: 'Bhaktapur, Nepal',
      price: 'Rs. 45 Lakh',
      image: property3,
      area: '5 Ropani',
      type: 'sale' as const,
      featured: true
    }
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {properties.map((property, index) => (
            <div
              key={property.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <PropertyCard {...property} />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center animate-fade-in">
          <Button className="btn-hero">
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