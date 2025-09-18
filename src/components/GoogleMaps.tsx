import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Navigation, Phone, MessageCircle, Mail, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const GoogleMaps = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(true);

  const initializeMap = async (key: string) => {
    if (!mapRef.current || !key) return;

    try {
      const loader = new Loader({
        apiKey: key,
        version: 'weekly',
        libraries: ['places']
      });

      const google = await loader.load();
      
      // Kathmandu, Nepal coordinates
      const kathmandu = { lat: 27.7172, lng: 85.3240 };

      const mapInstance = new (google as any).maps.Map(mapRef.current, {
        center: kathmandu,
        zoom: 13,
        styles: [
          {
            featureType: 'all',
            elementType: 'geometry.fill',
            stylers: [{ color: '#f5f5f5' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#e9e9e9' }, { lightness: 17 }]
          }
        ]
      });

      // Add marker for office location
      new (google as any).maps.Marker({
        position: kathmandu,
        map: mapInstance,
        title: 'KTM Realstate Office',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="#D4AF37"/>
              <path d="M16 8C13.239 8 11 10.239 11 13C11 17.25 16 24 16 24S21 17.25 21 13C21 10.239 18.761 8 16 8ZM16 15.5C14.619 15.5 13.5 14.381 13.5 13S14.619 10.5 16 10.5S18.5 11.619 18.5 13S17.381 15.5 16 15.5Z" fill="white"/>
            </svg>
          `),
          scaledSize: new (google as any).maps.Size(32, 32)
        }
      });

      setMap(mapInstance);
      setShowApiInput(false);
    } catch (error) {
      console.error('Error loading Google Maps:', error);
      alert('Failed to load Google Maps. Please check your API key.');
    }
  };

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      initializeMap(apiKey.trim());
    }
  };

  const handleViewOnMaps = () => {
    window.open('https://maps.google.com/?q=Kathmandu,Nepal', '_blank');
  };

  const handleGetDirections = () => {
    window.open('https://maps.google.com/dir/?api=1&destination=New+Baneshwor,Kathmandu,Nepal', '_blank');
  };

  const handleCall = () => {
    window.location.href = 'tel:+9779741690374';
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hi! I am interested in your real estate services. Can you help me?');
    window.open(`https://wa.me/9779741690374?text=${message}`, '_blank');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent('Real Estate Inquiry');
    const body = encodeURIComponent('Hi,\n\nI am interested in your real estate services. Please contact me.\n\nBest regards');
    window.location.href = `mailto:sumanghimire138@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <section id="maps" className="py-20 bg-gradient-to-br from-muted/20 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="animate-fade-in">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Visit Our Office
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Find us in the heart of Kathmandu. We're here to help you with all your real estate needs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Map Section */}
          <div className="space-y-6">
            {showApiInput ? (
              <Card className="p-6">
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-accent mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Google Maps Integration</h3>
                    <p className="text-muted-foreground mb-4">
                      Enter your Google Maps API key to view our interactive map
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Input
                      type="password"
                      placeholder="Enter Google Maps API Key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleApiKeySubmit()}
                    />
                    <Button 
                      onClick={handleApiKeySubmit}
                      className="w-full btn-primary"
                      disabled={!apiKey.trim()}
                    >
                      Load Interactive Map
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Get your API key from{' '}
                      <a 
                        href="https://console.cloud.google.com/apis/credentials" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-accent hover:underline"
                      >
                        Google Cloud Console
                      </a>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="relative">
                <div 
                  ref={mapRef} 
                  className="w-full h-96 rounded-xl shadow-card border border-border"
                />
                <div className="absolute top-4 right-4 space-y-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleViewOnMaps}
                    className="shadow-lg"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Larger Map
                  </Button>
                </div>
              </div>
            )}

            {/* Map Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={handleViewOnMaps}
                className="btn-primary flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                View on Google Maps
              </Button>
              <Button
                onClick={handleGetDirections}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Navigation className="h-4 w-4" />
                Get Directions
              </Button>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Office Address */}
            <Card className="property-card">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Office Address</h3>
                    <p className="text-muted-foreground">
                      New Baneshwor<br />
                      Kathmandu, Nepal<br />
                      Postal Code: 44600
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card className="property-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact */}
            <Card className="property-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Contact</h3>
                <div className="space-y-3">
                  <Button
                    onClick={handleCall}
                    className="w-full btn-primary flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    Call Now: +977 974-169-0374
                  </Button>
                  <Button
                    onClick={handleWhatsApp}
                    variant="outline"
                    className="w-full flex items-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp Business
                  </Button>
                  <Button
                    onClick={handleEmail}
                    variant="outline"
                    className="w-full flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Send Email
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

export default GoogleMaps;