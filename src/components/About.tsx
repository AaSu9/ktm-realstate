import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Award, 
  Users, 
  Building, 
  Star, 
  CheckCircle,
  TrendingUp,
  Shield,
  Heart
} from 'lucide-react';

const About = () => {
  const achievements = [
    { icon: Building, value: '500+', label: 'Properties Sold' },
    { icon: Users, value: '1000+', label: 'Happy Clients' },
    { icon: Award, value: '15+', label: 'Years Experience' },
    { icon: Star, value: '4.9/5', label: 'Client Rating' }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Trust & Transparency',
      description: 'We believe in complete transparency in all our dealings, ensuring our clients make informed decisions.'
    },
    {
      icon: Heart,
      title: 'Client-Centric Approach',
      description: 'Your satisfaction is our priority. We go above and beyond to exceed your expectations.'
    },
    {
      icon: TrendingUp,
      title: 'Market Expertise',
      description: 'Deep understanding of Nepal\'s real estate market trends and opportunities.'
    },
    {
      icon: CheckCircle,
      title: 'Quality Assurance',
      description: 'Every property in our portfolio is thoroughly verified and meets our quality standards.'
    }
  ];

  const testimonials = [
    {
      name: 'Rajesh Shrestha',
      role: 'Property Investor',
      comment: 'KTM Realstate helped me find the perfect investment property. Their market knowledge is exceptional.',
      rating: 5
    },
    {
      name: 'Priya Tamang',
      role: 'Homeowner',
      comment: 'Professional service and transparent dealing. Found my dream home within my budget. Highly recommended!',
      rating: 5
    },
    {
      name: 'Dinesh Karki',
      role: 'Business Owner',
      comment: 'Excellent support for commercial property purchase. The team guided us through every step.',
      rating: 5
    }
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="animate-fade-in">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              About KTM Realstate
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your trusted partner in Nepal's real estate market. We've been helping families and investors find their perfect properties for over 15 years.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="animate-slide-up">
            <h3 className="text-3xl font-bold text-foreground mb-6">
              Our Story
            </h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Founded in 2008, KTM Realstate began with a simple mission: to make real estate transactions transparent, trustworthy, and hassle-free for everyone in Nepal.
              </p>
              <p>
                What started as a small team of passionate real estate professionals has grown into one of Nepal's most trusted property consultancy firms. We've successfully facilitated over 500 property transactions and helped more than 1000 families find their dream homes.
              </p>
              <p>
                Our deep understanding of local markets, combined with modern technology and personalized service, sets us apart in the Nepal real estate landscape.
              </p>
            </div>
            <Button 
              className="btn-hero mt-6"
              onClick={() => window.location.href = '#contact'}
            >
              Learn More About Us
            </Button>
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
              <Card
                key={achievement.label}
                className="property-card text-center animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <achievement.icon className="h-12 w-12 text-accent mx-auto mb-4" />
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {achievement.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {achievement.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Our Values
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do at KTM Realstate
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card
                key={value.title}
                className="property-card text-center animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-accent" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-3">
                    {value.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              What Our Clients Say
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our satisfied clients have to say about our services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={testimonial.name}
                className="property-card animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-accent fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.comment}"
                  </p>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Ready to Work With Us?
          </h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied clients who have found their perfect properties with KTM Realstate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="btn-hero"
              onClick={() => window.location.href = '#properties'}
            >
              View Properties
            </Button>
            <Button 
              variant="outline" 
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              onClick={() => window.location.href = '#contact'}
            >
              Contact Us Today
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;