import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { MapPin, Bed, Bath, Square, Phone, MessageCircle, Mail, Calendar, Star, Play, Video, Youtube, Facebook, Instagram, Sofa, UtensilsCrossed, Home, Layers, Ruler, CheckCircle2, Compass, Tags, Eye, Globe, Car } from 'lucide-react';
import { useState, useEffect } from 'react';
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
  
  // New Fields
  pillarSize?: string;
  tankCapacity?: string;
  roadSize?: string;
  roadType?: string;
  landArea?: string;
  livingRooms?: number;
  kitchens?: number;
  faceDirection?: string;
  parking?: string;
  totalFloors?: number;
  yearBuilt?: number;
  furnishing?: string;
  negotiable?: boolean;
  cityArea?: string;
  municipality?: string;
  wardNumber?: number;
  dimension?: string;
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
  const [agent, setAgent] = useState<any | null>(null);
  const [agentLoading, setAgentLoading] = useState(false);
  const { toast } = useToast();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    if (!isOpen || !property) return;
    
    // Check if the property has an agent assigned (support camelCase and snake_case)
    const agentId = (property as any).agentId || (property as any).agent_id;
    if (!agentId) {
      setAgent(null);
      return;
    }

    const fetchAgent = async () => {
      setAgentLoading(true);
      try {
        const { data, error } = await supabase
          .from('User' as any)
          .select('id, name, email, phone, avatar, designation, facebookUrl, instagramUrl, whatsappNumber')
          .eq('id', agentId)
          .single();

        if (error) throw error;
        setAgent(data);
      } catch (err) {
        console.error('Error fetching property agent:', err);
        setAgent(null);
      } finally {
        setAgentLoading(false);
      }
    };

    fetchAgent();
  }, [isOpen, property]);

  if (!property) return null;

  const handleContact = async (type: 'phone' | 'whatsapp' | 'email' | 'form') => {
    // Prefer agent's direct contact, fallback to company default details
    const phone = agent?.phone || '+9779741690374';
    const email = agent?.email || 'sumanghimire138@gmail.com';
    const whatsapp = agent?.whatsappNumber || agent?.phone || '+9779741690374';

    if (type === 'phone') {
      window.location.href = `tel:${phone}`;
      return;
    }
    
    if (type === 'whatsapp') {
      const message = `Hi! I'm interested in the property: ${property.title} located at ${property.location}. Price: NPR ${property.price.toLocaleString()}. Can you provide more details?`;
      const waNumber = whatsapp.replace(/[^0-9]/g, '');
      window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank');
      return;
    }

    if (type === 'email') {
      const subject = `Inquiry about ${property.title}`;
      const body = `Hi,\n\nI'm interested in the property: ${property.title} located at ${property.location}.\nPrice: NPR ${property.price.toLocaleString()}\n\nPlease provide more details.\n\nThank you.`;
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
          id: crypto.randomUUID(),
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
        description: "Your inquiry has been successfully sent. We will get back to you shortly.",
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

  const getEmbedSrc = (url: string): string | null => {
    if (!url) return null;
    // Full iframe tag — extract src
    if (url.includes('<iframe') && url.includes('src=')) {
      const match = url.match(/src="([^"]+)"/);
      return match ? match[1] : null;
    }
    // Direct embed URLs
    if (url.includes('google.com/maps/embed') || (url.includes('maps.google.com/maps') && url.includes('embed'))) {
      return url;
    }
    // Do not attempt to embed short links or standard Google Maps URLs directly via iframe.
    // They have X-Frame-Options set to SAMEORIGIN and embedding them as q=URL fails.
    return null;
  };

  // Returns true if the url is a regular/short link the user can open directly
  const isOpenableLink = (url: string): boolean => {
    if (!url) return false;
    return url.trim().startsWith('http') && !url.includes('<iframe');
  };

  // Embed src to use when NO map_url is set — shows the area based on location text
  const getLocationFallbackSrc = (location: string): string => {
    return `https://maps.google.com/maps?width=100%25&height=600&hl=en&q=${encodeURIComponent(location)}&t=&z=14&ie=UTF8&iwloc=B&output=embed`;
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

              {/* Premium Core Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 bg-muted/20 p-4 rounded-2xl border border-border/60">
                <div className="flex flex-col items-center text-center p-1 bg-white rounded-xl shadow-xs border border-border/30">
                  <Home className="h-4 w-4 text-emerald-600 mb-1" />
                  <span className="text-[11px] font-bold text-foreground capitalize truncate max-w-full">{property.property_type}</span>
                  <span className="text-[9px] text-muted-foreground uppercase font-semibold mt-0.5">Type</span>
                </div>
                
                {property.landArea ? (
                  <div className="flex flex-col items-center text-center p-1 bg-white rounded-xl shadow-xs border border-border/30">
                    <Ruler className="h-4 w-4 text-emerald-600 mb-1" />
                    <span className="text-[11px] font-bold text-foreground truncate max-w-full">{property.landArea}</span>
                    <span className="text-[9px] text-muted-foreground uppercase font-semibold mt-0.5">Area</span>
                  </div>
                ) : property.area_sqft ? (
                  <div className="flex flex-col items-center text-center p-1 bg-white rounded-xl shadow-xs border border-border/30">
                    <Square className="h-4 w-4 text-emerald-600 mb-1" />
                    <span className="text-[11px] font-bold text-foreground truncate max-w-full">{property.area_sqft} Sqft</span>
                    <span className="text-[9px] text-muted-foreground uppercase font-semibold mt-0.5">Area</span>
                  </div>
                ) : null}
                
                {property.bedrooms ? (
                  <div className="flex flex-col items-center text-center p-1 bg-white rounded-xl shadow-xs border border-border/30">
                    <Bed className="h-4 w-4 text-emerald-600 mb-1" />
                    <span className="text-[11px] font-bold text-foreground">{property.bedrooms}</span>
                    <span className="text-[9px] text-muted-foreground uppercase font-semibold mt-0.5">Bedrooms</span>
                  </div>
                ) : null}

                {property.kitchens ? (
                  <div className="flex flex-col items-center text-center p-1 bg-white rounded-xl shadow-xs border border-border/30">
                    <UtensilsCrossed className="h-4 w-4 text-emerald-600 mb-1" />
                    <span className="text-[11px] font-bold text-foreground">{property.kitchens}</span>
                    <span className="text-[9px] text-muted-foreground uppercase font-semibold mt-0.5">Kitchen</span>
                  </div>
                ) : null}

                {property.bathrooms ? (
                  <div className="flex flex-col items-center text-center p-1 bg-white rounded-xl shadow-xs border border-border/30">
                    <Bath className="h-4 w-4 text-emerald-600 mb-1" />
                    <span className="text-[11px] font-bold text-foreground">{property.bathrooms}</span>
                    <span className="text-[9px] text-muted-foreground uppercase font-semibold mt-0.5">Bathrooms</span>
                  </div>
                ) : null}

                {property.livingRooms ? (
                  <div className="flex flex-col items-center text-center p-1 bg-white rounded-xl shadow-xs border border-border/30">
                    <Sofa className="h-4 w-4 text-emerald-600 mb-1" />
                    <span className="text-[11px] font-bold text-foreground">{property.livingRooms}</span>
                    <span className="text-[9px] text-muted-foreground uppercase font-semibold mt-0.5">Living</span>
                  </div>
                ) : null}

                {property.parking ? (
                  <div className="flex flex-col items-center text-center p-1 bg-white rounded-xl shadow-xs border border-border/30">
                    <Car className="h-4 w-4 text-emerald-600 mb-1" />
                    <span className="text-[11px] font-bold text-foreground truncate max-w-full" title={property.parking}>{property.parking}</span>
                    <span className="text-[9px] text-muted-foreground uppercase font-semibold mt-0.5">Parking</span>
                  </div>
                ) : null}

                {property.totalFloors ? (
                  <div className="flex flex-col items-center text-center p-1 bg-white rounded-xl shadow-xs border border-border/30">
                    <Layers className="h-4 w-4 text-emerald-600 mb-1" />
                    <span className="text-[11px] font-bold text-foreground">{property.totalFloors}</span>
                    <span className="text-[9px] text-muted-foreground uppercase font-semibold mt-0.5">Floors</span>
                  </div>
                ) : null}
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
              <h3 className="text-lg font-semibold">Contact Agent</h3>
              
              {agentLoading ? (
                <div className="flex items-center gap-3 animate-pulse bg-muted/40 p-4 rounded-xl">
                  <div className="w-12 h-12 bg-muted rounded-full" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded w-2/3" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ) : agent ? (
                <div className="flex items-start gap-4 bg-card border border-border/80 p-4 rounded-2xl shadow-sm">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm">
                    {agent.avatar ? (
                      <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
                    ) : (
                      getInitials(agent.name)
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-foreground truncate text-md">{agent.name}</h4>
                    <p className="text-xs font-semibold text-accent mt-0.5 truncate">
                      {agent.designation || 'Real Estate Consultant'}
                    </p>
                    
                    {/* Socials */}
                    {(agent.facebookUrl || agent.instagramUrl) && (
                      <div className="flex items-center gap-2 mt-2">
                        {agent.facebookUrl && (
                          <a href={agent.facebookUrl} target="_blank" rel="noopener noreferrer" className="p-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors" title="Facebook">
                            <Facebook className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {agent.instagramUrl && (
                          <a href={agent.instagramUrl} target="_blank" rel="noopener noreferrer" className="p-1 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-600 transition-colors" title="Instagram">
                            <Instagram className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-muted/30 rounded-2xl border border-dashed border-border text-center text-xs text-muted-foreground">
                  No direct agent assigned. Contact our support team.
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button onClick={() => handleContact('phone')} className="flex items-center gap-2 rounded-xl">
                  <Phone className="h-4 w-4" />
                  Call Now
                </Button>
                <Button onClick={() => handleContact('whatsapp')} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 rounded-xl">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Button>
                <Button onClick={() => handleContact('email')} variant="outline" className="flex items-center gap-2 rounded-xl">
                  <Mail className="h-4 w-4" />
                  Email
                </Button>
                <Button onClick={() => handleContact('form')} variant="outline" className="flex items-center gap-2 rounded-xl">
                  <MessageCircle className="h-4 w-4" />
                  Send Message
                </Button>
              </div>
            </div>
          </div>

          {/* SECTION: Overview Grid Card */}
          <div className="bg-white border border-border rounded-3xl p-6 space-y-4 shadow-sm animate-fade-in transition-all">
            <div className="flex items-center gap-2 border-b pb-3 border-border/60">
              <Compass className="h-5 w-5 text-emerald-600 animate-pulse animate-duration-1000" />
              <h3 className="text-xl font-bold text-foreground">Property Overview</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-border/40 hover:bg-muted/10 px-2 rounded-lg transition-colors">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium"><Home className="h-4 w-4 text-emerald-500" /> Property Type:</span>
                <span className="font-semibold text-foreground capitalize">{property.property_type}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/40 hover:bg-muted/10 px-2 rounded-lg transition-colors">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium"><Tags className="h-4 w-4 text-emerald-500" /> Purpose:</span>
                <span className="font-semibold text-foreground capitalize">For {property.category === 'sale' ? 'Sale' : 'Rent'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/40 hover:bg-muted/10 px-2 rounded-lg transition-colors">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium"><Compass className="h-4 w-4 text-emerald-500" /> Property Face:</span>
                <span className="font-semibold text-foreground">{property.faceDirection || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/40 hover:bg-muted/10 px-2 rounded-lg transition-colors">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium"><Ruler className="h-4 w-4 text-emerald-500" /> Land Area:</span>
                <span className="font-semibold text-foreground">{property.landArea || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/40 hover:bg-muted/10 px-2 rounded-lg transition-colors">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium"><Calendar className="h-4 w-4 text-emerald-500" /> Year Built:</span>
                <span className="font-semibold text-foreground">{property.yearBuilt || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/40 hover:bg-muted/10 px-2 rounded-lg transition-colors">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium"><Layers className="h-4 w-4 text-emerald-500" /> Road Access:</span>
                <span className="font-semibold text-foreground">{property.roadSize || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/40 hover:bg-muted/10 px-2 rounded-lg transition-colors">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium"><MapPin className="h-4 w-4 text-emerald-500" /> Road Type:</span>
                <span className="font-semibold text-foreground">{property.roadType || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/40 hover:bg-muted/10 px-2 rounded-lg transition-colors">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium"><Ruler className="h-4 w-4 text-emerald-500" /> Dimension:</span>
                <span className="font-semibold text-foreground">{property.dimension || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/40 hover:bg-muted/10 px-2 rounded-lg transition-colors">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Negotiable:</span>
                <span className="font-semibold text-foreground">{property.negotiable !== false ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/40 hover:bg-muted/10 px-2 rounded-lg transition-colors">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium"><Calendar className="h-4 w-4 text-emerald-500" /> Date Posted:</span>
                <span className="font-semibold text-foreground">{new Date(property.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/40 hover:bg-muted/10 px-2 rounded-lg transition-colors">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium"><Sofa className="h-4 w-4 text-emerald-500" /> Furnishing:</span>
                <span className="font-semibold text-foreground">{property.furnishing || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/40 hover:bg-muted/10 px-2 rounded-lg transition-colors">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium"><Eye className="h-4 w-4 text-emerald-500" /> Views:</span>
                <span className="font-semibold text-foreground">{(property as any).views || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/40 hover:bg-muted/10 px-2 rounded-lg transition-colors">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium"><Globe className="h-4 w-4 text-emerald-500" /> City & Area:</span>
                <span className="font-semibold text-foreground">{property.cityArea || property.location || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/40 hover:bg-muted/10 px-2 rounded-lg transition-colors">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium"><MapPin className="h-4 w-4 text-emerald-500" /> Municipality / Ward:</span>
                <span className="font-semibold text-foreground">
                  {property.municipality ? `${property.municipality}${property.wardNumber ? `, Ward ${property.wardNumber}` : ''}` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* SECTION: Structural Details Card */}
          <div className="bg-white border border-border rounded-3xl p-6 space-y-4 shadow-sm animate-fade-in transition-all">
            <div className="flex items-center justify-between bg-primary text-primary-foreground px-5 py-3 rounded-2xl">
              <span className="font-bold text-md">Property Details</span>
              <Home className="h-5 w-5" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2">
              <div className="flex items-center gap-3 py-1.5 border-b border-border/30">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span className="text-muted-foreground">Pillar Size:</span>
                <span className="font-semibold text-foreground ml-auto">{property.pillarSize || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 py-1.5 border-b border-border/30">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span className="text-muted-foreground">Tank Capacity:</span>
                <span className="font-semibold text-foreground ml-auto">{property.tankCapacity || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 py-1.5 border-b border-border/30">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span className="text-muted-foreground">Road Size:</span>
                <span className="font-semibold text-foreground ml-auto">{property.roadSize || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 py-1.5 border-b border-border/30">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span className="text-muted-foreground">Road Type:</span>
                <span className="font-semibold text-foreground ml-auto">{property.roadType || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 py-1.5 border-b border-border/30">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span className="text-muted-foreground">Land Area:</span>
                <span className="font-semibold text-foreground ml-auto">{property.landArea || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 py-1.5 border-b border-border/30">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span className="text-muted-foreground">Beds:</span>
                <span className="font-semibold text-foreground ml-auto">{property.bedrooms || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 py-1.5 border-b border-border/30">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span className="text-muted-foreground">Living Rooms:</span>
                <span className="font-semibold text-foreground ml-auto">{property.livingRooms || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 py-1.5 border-b border-border/30">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span className="text-muted-foreground">Kitchens:</span>
                <span className="font-semibold text-foreground ml-auto">{property.kitchens || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 py-1.5 border-b border-border/30">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span className="text-muted-foreground">Bathrooms:</span>
                <span className="font-semibold text-foreground ml-auto">{property.bathrooms || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 py-1.5 border-b border-border/30">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span className="text-muted-foreground">Property Face Direction:</span>
                <span className="font-semibold text-foreground ml-auto">{property.faceDirection || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 py-1.5 border-b border-border/30">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span className="text-muted-foreground">Parking Space:</span>
                <span className="font-semibold text-foreground ml-auto">{property.parking || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 py-1.5 border-b border-border/30">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span className="text-muted-foreground">Total Floors:</span>
                <span className="font-semibold text-foreground ml-auto">{property.totalFloors || 'N/A'}</span>
              </div>
            </div>
          </div>
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