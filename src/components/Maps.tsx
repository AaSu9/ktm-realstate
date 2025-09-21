'''import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Maps = () => {
  const [contactDetails, setContactDetails] = useState({ address: '', phone: '', whatsapp: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactDetails = async () => {
      const { data, error } = await supabase
        .from('contacts')
        .select('address, phone, whatsapp')
        .eq('id', 1)
        .single();

      if (data) {
        setContactDetails(data);
      }
      if(error && error.code !== 'PGRST116') {
        console.error("Error fetching map details", error)
      }
      setLoading(false);
    };
    fetchContactDetails();
  }, []);


  const handleViewOnMaps = () => {
    if (!contactDetails.address) return;
    window.open(`https://maps.google.com/?q=${encodeURIComponent(contactDetails.address)}`, '_blank');
  };

  const handleGetDirections = () => {
    if (!contactDetails.address) return;
    window.open(`https://www.google.com/maps/dir//${encodeURIComponent(contactDetails.address)}`, '_blank');
  };

  if (loading) {
    return <div className="py-20 text-center">Loading Map...</div>;
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Visit Our Office
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Come meet our team in person. We\'re located in the heart of Kathmandu, ready to help you find your perfect property.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map Embed */}
          <Card className="property-card overflow-hidden">
            <CardContent className="p-0">
              <div className="relative w-full h-80">
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(contactDetails.address)}&output=embed`}
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
                      {contactDetails.address.split(',').map((line, index) => (
                        <span key={index}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </p>
                    <div className="space-y-3">
                      <Button
                        onClick={handleViewOnMaps}
                        className="w-full justify-center"
                        variant="outline"
                        disabled={!contactDetails.address}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View on Google Maps
                      </Button>
                      <Button
                        onClick={handleGetDirections}
                        className="btn-primary w-full justify-center"
                        disabled={!contactDetails.address}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Get Directions
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Hours (keeping it static as it\'s not in DB) */}
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
                    onClick={() => window.location.href = `tel:${contactDetails.phone}`}
                    className="btn-primary"
                    disabled={!contactDetails.phone}
                  >
                    Call Now
                  </Button>
                  <Button
                    onClick={() => window.open(`https://wa.me/${contactDetails.whatsapp}`, '_blank')}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={!contactDetails.whatsapp}
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

export default Maps;'''