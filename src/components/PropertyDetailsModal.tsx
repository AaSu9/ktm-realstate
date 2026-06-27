import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { MapPin, Bed, Bath, Square, Phone, MessageCircle, Mail, Calendar, Star, Play, Video, Youtube } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import EMICalculator from '@/components/EMICalculator';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  images?: string[];
  bedrooms?: number;
  bathrooms?: number;
  area_sqft?: number;
  property_type: string;
  status?: string;
  is_featured?: boolean;
  is_hot_deal?: boolean;
  discount_percentage?: number;
  description?: string;
  features?: string[];
  category: string;
  video_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
  created_at: string;
  property_id?: string;
  map_url?: string;
}

interface PropertyDetailsModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

const PropertyDetailsModal = ({ property, isOpen, onClose }: PropertyDetailsModalProps) => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [showContactForm, setShowContactForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (!property) return null;

  const handleContact = async (type: 'phone' | 'whatsapp' | 'email' | 'form') => {
    if (type === 'phone') {
      window.location.href = 'tel:+9779741690374';
      return;
    }
    
    if (type === 'whatsapp') {
      const message = `Hi! I'm interested in the property: ${property.title} located at ${property.location}. Price: NPR ${property.price.toLocaleString()}. Can you provide more details?`;
      window.open(`https://wa.me/9779741690374?text=${encodeURIComponent(message)}`, '_blank');
      return;
    }

    if (type === 'email') {
      const subject = `Inquiry about ${property.title}`;
      const body = `Hi,\n\nI'm interested in the property: ${property.title} located at ${property.location}.\nPrice: NPR ${property.price.toLocaleString()}\n\nPlease provide more details.\n\nThank you.`;
      window.location.href = `mailto:sumanghimire138@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return;
    }

    if (type === 'form') {
      setShowContactForm(true);
    }
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('inquiries')
        .insert([{
          full_name: contactForm.name,
          email: contactForm.email,
          phone: contactForm.phone,
          property_interest: `${property.title} - ${property.location}`,
          message: contactForm.message || `Interested in property: ${property.title}`,
          inquiry_type: 'property_inquiry',
          property_id: property.id
        }]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your inquiry has been submitted. We'll contact you soon!",
      });

      setContactForm({ name: '', email: '', phone: '', message: '' });
      setShowContactForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit inquiry. Please try calling us directly.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `NPR ${price.toLocaleString()}`;
  };

  // Returns embed src ONLY if embeddable, null otherwise
  const getEmbedSrc = (url: string): string | null => {
    if (!url) return null;
    // Full iframe tag — extract src
    if (url.includes('<iframe') && url.includes('src=')) {
      const match = url.match(/src="([^"]+)"/);
      return match ? match[1] : null;
    }
    // Direct embed URLs
    if (url.includes('google.com/maps/embed') || url.includes('maps.google.com/maps?')) {
      return url;
    }
    // Short links (maps.app.goo.gl, goo.gl, etc.) — cannot be embedded
    return null;
  };

  // Returns true if the url is a regular/short link the user can open directly
  const isOpenableLink = (url: string): boolean => {
    if (!url) return false;
    return url.trim().startsWith('http') && getEmbedSrc(url) === null;
  };

  // Embed src to use when NO map_url is set — shows the area based on location text
  const getLocationFallbackSrc = (location: string): string => {
    return `https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{property.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Carousel */}
          {property.images && property.images.length > 0 && (
            <div className="relative">
              <Carousel className="w-full">
                <CarouselContent>
                  {property.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative">
                        <img
                          src={image}
                          alt={`${property.title} - Image ${index + 1}`}
                          className="w-full h-80 object-cover rounded-lg"
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                          {property.is_featured && (
                            <Badge className="bg-accent text-accent-foreground">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          {property.is_hot_deal && (
                            <Badge className="bg-destructive text-destructive-foreground">
                              🔥 Hot Deal
                            </Badge>
                          )}
                          {property.discount_percentage && property.discount_percentage > 0 && (
                            <Badge className="bg-green-600 text-white">
                              {property.discount_percentage}% OFF
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          )}

          {/* Property Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{property.location}</span>
              </div>

              <div className="text-3xl font-bold text-primary">
                {formatPrice(property.price)}
                {property.category === 'rent' && <span className="text-lg text-muted-foreground">/month</span>}
              </div>

              <div className="flex gap-4 text-sm">
                {property.bedrooms && (
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    <span>{property.bedrooms} Beds</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    <span>{property.bathrooms} Baths</span>
                  </div>
                )}
                {property.area_sqft && (
                  <div className="flex items-center">
                    <Square className="h-4 w-4 mr-1" />
                    <span>{property.area_sqft} sq ft</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {property.property_id && (
                  <Badge className="bg-secondary text-secondary-foreground font-semibold">
                    ID: {property.property_id}
                  </Badge>
                )}
                <Badge variant={property.category === 'sale' ? 'default' : 'secondary'}>
                  For {property.category === 'sale' ? 'Sale' : 'Rent'}
                </Badge>
                <Badge variant="outline">{property.property_type}</Badge>
                <Badge variant={property.status === 'available' ? 'default' : 'destructive'}>
                  {property.status}
                </Badge>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Us</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => handleContact('phone')} className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Call Now
                </Button>
                <Button onClick={() => handleContact('whatsapp')} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Button>
                <Button onClick={() => handleContact('email')} variant="outline" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Button>
                <Button onClick={() => handleContact('form')} variant="outline" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Send Message
                </Button>
              </div>
            </div>
          </div>

          {/* Media Links */}
          {(property.video_url || property.youtube_url || property.tiktok_url) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Property Videos</h3>
              <div className="flex gap-2">
                {property.video_url && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(property.video_url, '_blank')}
                    className="flex items-center gap-2"
                  >
                    <Video className="h-4 w-4" />
                    Watch Video
                  </Button>
                )}
                {property.youtube_url && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(property.youtube_url, '_blank')}
                    className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <Youtube className="h-4 w-4" />
                    YouTube
                  </Button>
                )}
                {property.tiktok_url && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(property.tiktok_url, '_blank')}
                    className="flex items-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    TikTok
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Map Location */}
          {(property.map_url || property.location) && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Location Map</h3>
              {(() => {
                const mapUrl = property.map_url || '';
                const embedSrc = getEmbedSrc(mapUrl);
                const canOpen = isOpenableLink(mapUrl);
                // Only show location fallback if NO map_url was provided
                const fallbackSrc = !mapUrl && property.location ? getLocationFallbackSrc(property.location) : null;

                return (
                  <>
                    {/* Embeddable iframe — proper embed code */}
                    {embedSrc && (
                      <div className="w-full h-[400px] rounded-lg overflow-hidden border">
                        <iframe 
                          src={embedSrc}
                          width="100%" 
                          height="100%" 
                          style={{ border: 0 }} 
                          allowFullScreen 
                          loading="lazy" 
                          referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                      </div>
                    )}

                    {/* Short/regular link — show button that opens EXACT location */}
                    {canOpen && (
                      <a 
                        href={mapUrl}
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
                      >
                        <MapPin className="h-4 w-4" /> View Exact Location on Google Maps
                      </a>
                    )}

                    {/* No map_url at all — show area-level fallback from location text */}
                    {fallbackSrc && (
                      <div className="w-full h-[400px] rounded-lg overflow-hidden border">
                        <iframe 
                          src={fallbackSrc}
                          width="100%" 
                          height="100%" 
                          style={{ border: 0 }} 
                          allowFullScreen 
                          loading="lazy" 
                          referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {/* Description */}
          {property.description && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{property.description}</p>
            </div>
          )}

          {/* Features */}
          {property.features && property.features.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Features</h3>
              <div className="flex flex-wrap gap-2">
                {property.features.map((feature, index) => (
                  <Badge key={index} variant="secondary">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* EMI Calculator — only for sale properties */}
          {property.category === 'sale' && property.price > 0 && (
            <div className="space-y-2">
              <EMICalculator propertyPrice={property.price} />
            </div>
          )}

          {/* Contact Form */}
          {showContactForm && (
            <form onSubmit={handleSubmitInquiry} className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-semibold">Send us a message</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone *</label>
                <input
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={4}
                  placeholder="Tell us more about your requirements..."
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Inquiry'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowContactForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {/* Property Info */}
          <div className="text-xs text-muted-foreground border-t pt-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span>Listed on {new Date(property.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetailsModal;