'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Phone, MessageCircle, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ContactDetails {
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  map_lat?: number;
  map_lng?: number;
  map_zoom?: number;
  business_hours?: { [key: string]: string };
}

const GoogleMaps = () => {
  const { toast } = useToast();
  const [contactDetails, setContactDetails] = useState<ContactDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactDetails = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching contact details:', error);
        toast({ title: 'Error', description: 'Could not load map information.', variant: 'destructive' });
      } else {
        setContactDetails(data as ContactDetails);
      }
      setLoading(false);
    };
    fetchContactDetails();
  }, [toast]);

  const handleViewOnMaps = () => {
    if (!contactDetails?.address) return;
    window.open(`https://maps.google.com/?q=${encodeURIComponent(contactDetails.address)}`, '_blank');
  };

  const handleGetDirections = () => {
    if (!contactDetails?.address) return;
    window.open(`https://maps.google.com/dir/?api=1&destination=${encodeURIComponent(contactDetails.address)}`, '_blank');
  };

  const handleCall = () => {
    if (!contactDetails?.phone) return;
    window.location.href = `tel:${contactDetails.phone}`;
  };

  const handleWhatsApp = () => {
    if (!contactDetails?.whatsapp) return;
    const message = encodeURIComponent('Hi! I am interested in your real estate services. Can you help me?');
    window.open(`https://wa.me/${contactDetails.whatsapp}?text=${message}`, '_blank');
  };

  const handleEmail = () => {
    if (!contactDetails?.email) return;
    const subject = encodeURIComponent('Real Estate Inquiry');
    const body = encodeURIComponent('Hi,\n\nI am interested in your real estate services. Please contact me.\n\nBest regards');
    window.location.href = `mailto:${contactDetails.email}?subject=${subject}&body=${body}`;
  };

  if (loading) {
    return <div className="py-20 text-center">Loading Map...</div>;
  }

  if (!contactDetails) {
    return (
      <section id="maps" className="py-20 bg-gradient-to-br from-muted/20 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <h2 className="text-2xl font-bold text-foreground mb-4">Visit Our Office</h2>
           <p className="text-muted-foreground">Contact information is not available at the moment. Please check back later.</p>
        </div>
      </section>
    );
  }

  const canDisplayMap = contactDetails.map_lat && contactDetails.map_lng && contactDetails.map_zoom;
  const mapEmbedUrl = canDisplayMap 
    ? `https://maps.google.com/maps?q=${contactDetails.map_lat},${contactDetails.map_lng}&z=${contactDetails.map_zoom}&output=embed`
    : '';

  return (
    <section id="maps" className="py-20 bg-gradient-to-br from-muted/20 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="animate-fade-in">
            <h2 className="text-4xl font-bold text-foreground mb-4">Visit Our Office</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Find us in the heart of Kathmandu. We're here to help you with all your real estate needs.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            {canDisplayMap && (
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="w-full h-96">
                     <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{ border: 0 }}
                        src={mapEmbedUrl}
                        allowFullScreen
                      ></iframe>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button onClick={handleViewOnMaps} className="btn-primary flex items-center gap-2" disabled={!contactDetails?.address}>
                <MapPin className="h-4 w-4" /> View on Google Maps
              </Button>
              <Button onClick={handleGetDirections} variant="outline" className="flex items-center gap-2" disabled={!contactDetails?.address}>
                <Navigation className="h-4 w-4" /> Get Directions
              </Button>
            </div>
          </div>

          <div className="space-y-8">
            <Card className="property-card">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Office Address</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{contactDetails.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {contactDetails.business_hours && 
              <Card className="property-card">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
                  <div className="space-y-2">
                    {Object.entries(contactDetails.business_hours).map(([day, time]) => (
                      <div key={day} className="flex justify-between">
                        <span className="text-muted-foreground">{day}</span>
                        <span className="font-medium">{time as string}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            }

            <Card className="property-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Contact</h3>
                <div className="space-y-3">
                  <Button onClick={handleCall} className="w-full btn-primary flex items-center gap-2" disabled={!contactDetails.phone}>
                    <Phone className="h-4 w-4" /> Call Now: {contactDetails.phone}
                  </Button>
                  <Button onClick={handleWhatsApp} variant="outline" className="w-full flex items-center gap-2" disabled={!contactDetails.whatsapp}>
                    <MessageCircle className="h-4 w-4" /> WhatsApp Business
                  </Button>
                  <Button onClick={handleEmail} variant="outline" className="w-full flex items-center gap-2" disabled={!contactDetails.email}>
                    <Mail className="h-4 w-4" /> Send Email
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