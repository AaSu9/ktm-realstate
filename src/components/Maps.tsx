import { Card, CardContent } from '@/components/ui/card';
import { MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Maps = () => {
  const handleViewOnMaps = () => {
    // Opens Google Maps to Kathmandu, Nepal
    window.open('https://www.google.com/maps/place/Kathmandu,+Nepal/@27.7172453,85.3239605,11z', '_blank');
  };

  const handleGetDirections = () => {
    // Opens directions to New Baneshwor, Kathmandu
    window.open('https://www.google.com/maps/dir//New+Baneshwor,+Kathmandu,+Nepal/', '_blank');
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Visit Our Office
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Come meet our team in person. We're located in the heart of Kathmandu, ready to help you find your perfect property.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map Embed */}
          <Card className="property-card overflow-hidden">
            <CardContent className="p-0">
              <div className="relative w-full h-80">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.6871857777746!2d85.3239605!3d27.7172453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb196c8de7bec5%3A0x3e82b32d60140ce4!2sNew%20Baneshwor%2C%20Kathmandu%2044600%2C%20Nepal!5e0!3m2!1sen!2sus!4v1705123456789!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="KTM Realstate Office Location"
                />
              </div>
            </CardContent>
          </Card>

          {/* Office Information */}
          <div className="space-y-6">
            <Card className="property-card">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Our Location
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      New Baneshwor, Kathmandu, Nepal<br />
                      Near Main Road<br />
                      Postal Code: 44600
                    </p>
                    <div className="space-y-3">
                      <Button 
                        onClick={handleViewOnMaps}
                        className="w-full justify-center"
                        variant="outline"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View on Google Maps
                      </Button>
                      <Button 
                        onClick={handleGetDirections}
                        className="btn-primary w-full justify-center"
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Get Directions
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card className="property-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Business Hours
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monday - Friday:</span>
                    <span className="text-foreground font-medium">9:00 AM - 7:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday:</span>
                    <span className="text-foreground font-medium">9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday:</span>
                    <span className="text-foreground font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact */}
            <Card className="property-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Quick Contact
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={() => window.location.href = 'tel:+9779741690374'}
                    className="btn-primary"
                  >
                    Call Now
                  </Button>
                  <Button 
                    onClick={() => window.open('https://wa.me/9779741690374', '_blank')}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Maps;