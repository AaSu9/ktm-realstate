import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Building, 
  MapPin, 
  Calculator, 
  FileText, 
  Users, 
  Shield, 
  TrendingUp 
} from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Home,
      title: 'Residential Properties',
      description: 'Find your dream home from our extensive collection of houses, apartments, and villas.',
      features: ['Premium Locations', 'Modern Amenities', 'Flexible Payment']
    },
    {
      icon: Building,
      title: 'Commercial Real Estate',
      description: 'Invest in commercial properties including offices, shops, and business complexes.',
      features: ['High ROI', 'Prime Locations', 'Legal Support']
    },
    {
      icon: MapPin,
      title: 'Land Development',
      description: 'Premium land plots in developing areas with excellent connectivity and facilities.',
      features: ['Clear Titles', 'Road Access', 'Utility Connections']
    },
    {
      icon: Calculator,
      title: 'Property Valuation',
      description: 'Get accurate property valuations from our certified experts and market analysis.',
      features: ['Market Analysis', 'Expert Evaluation', 'Detailed Reports']
    },
    {
      icon: FileText,
      title: 'Legal Documentation',
      description: 'Complete legal support for property transactions, registration, and documentation.',
      features: ['Title Verification', 'Registration Support', 'Legal Consultation']
    },
    {
      icon: TrendingUp,
      title: 'Investment Advisory',
      description: 'Expert guidance on real estate investments and market trends in Nepal.',
      features: ['Market Insights', 'Investment Planning', 'Risk Assessment']
    }
  ];

  return (
    <section id="services" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="animate-fade-in">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Our Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive real estate solutions tailored to your needs. From buying and selling to investment advisory, we've got you covered.
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Card
              key={service.title}
              className="property-card group cursor-pointer animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                    <service.icon className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {service.description}
                  </p>
                </div>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button variant="outline" className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Why Choose KTM Realstate?
              </h3>
              <p className="text-muted-foreground">
                Your trusted partner in Nepal's real estate market with proven expertise and results.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 md:col-span-2">
              <div className="text-center">
                <Shield className="h-8 w-8 text-accent mx-auto mb-2" />
                <div className="text-sm font-semibold text-foreground">Verified Properties</div>
                <div className="text-xs text-muted-foreground">100% Legal</div>
              </div>
              <div className="text-center">
                <Users className="h-8 w-8 text-accent mx-auto mb-2" />
                <div className="text-sm font-semibold text-foreground">Expert Team</div>
                <div className="text-xs text-muted-foreground">15+ Years</div>
              </div>
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-accent mx-auto mb-2" />
                <div className="text-sm font-semibold text-foreground">Best Prices</div>
                <div className="text-xs text-muted-foreground">Market Value</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;