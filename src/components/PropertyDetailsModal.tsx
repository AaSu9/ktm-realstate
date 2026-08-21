import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { MapPin, Bed, Bath, Square, Phone, MessageCircle, Mail, Calendar, Star, Play, Video, Youtube, Facebook, Instagram, Sofa, UtensilsCrossed, Home, Layers, Ruler, CheckCircle2, Compass, Tags, Eye, Globe, Car, Droplets, Columns3, ArrowUpDown, Hammer, Shield, Armchair, CookingPot } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
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
  agentId?: string;
  agent_id?: string;
  views?: number;
}

interface AgentDetails {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  avatar?: string | null;
  designation?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  whatsappNumber?: string | null;
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
  const [agent, setAgent] = useState<AgentDetails | null>(null);
  const [agentLoading, setAgentLoading] = useState(false);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (showContactForm) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }
  }, [showContactForm]);

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
    const agentId = property.agentId || property.agent_id;
    if (!agentId) {
      setAgent(null);
      return;
    }

    const fetchAgent = async () => {
      setAgentLoading(true);
      try {
        const { data, error } = await supabase
          .from('User' as keyof Database['public']['Tables'])
          .select('id, name, email, phone, avatar, designation, facebookUrl, instagramUrl, whatsappNumber')
          .eq('id', agentId as string)
          .single();

        if (error) throw error;
        setAgent(data as unknown as AgentDetails);
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
      const generateUUID = () => {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
          return crypto.randomUUID();
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      };

      const { error } = await supabase
        .from('inquiries')
        .insert([{
          id: generateUUID(),
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
                <CarouselPrevious className="absolute !left-4 top-1/2 -translate-y-1/2 z-10 bg-white/85 hover:bg-white text-emerald-900 border-none shadow-md h-9 w-9 hidden md:flex items-center justify-center transition-all hover:scale-105" />
                <CarouselNext className="absolute !right-4 top-1/2 -translate-y-1/2 z-10 bg-white/85 hover:bg-white text-emerald-900 border-none shadow-md h-9 w-9 hidden md:flex items-center justify-center transition-all hover:scale-105" />
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

          {/* SECTION: Unified Property Overview & Specifications Section */}
          <div className="bg-white border border-border rounded-3xl p-5 sm:p-7 space-y-6 shadow-sm animate-fade-in transition-all">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-border/60">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-2xl shadow-md shadow-emerald-500/20">
                  <Compass className="h-6 w-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-foreground tracking-tight">Property Overview & Specifications</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Key features, structural specs, and location attributes</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                {property.property_id && (
                  <Badge variant="outline" className="bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 font-semibold px-3 py-1 rounded-full text-xs">
                    ID: {property.property_id}
                  </Badge>
                )}
                <Badge className="bg-emerald-600 text-white font-semibold px-3 py-1 rounded-full text-xs capitalize">
                  For {property.category === 'sale' ? 'Sale' : 'Rent'}
                </Badge>
              </div>
            </div>

            {/* Part 1: Interactive Hover Spec Cards (Key Highlights) */}
            <div className="space-y-2.5">
              <h4 className="text-[11px] uppercase font-extrabold tracking-wider text-emerald-700 dark:text-emerald-400">Key Attribute Highlights</h4>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {/* 1. Property Type */}
                <div
                  tabIndex={0}
                  role="region"
                  aria-label={`Property Type: ${property.property_type}`}
                  title={`Property Type: ${property.property_type}`}
                  className="group relative flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-border/50 hover:border-emerald-500/60 hover:bg-emerald-50/60 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-[1.04] active:scale-98 cursor-default focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-xs"
                >
                  <div className="p-2.5 rounded-xl bg-emerald-100/90 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 ease-in-out shadow-xs shrink-0">
                    <Home className="h-5 w-5 transition-transform duration-300 group-hover:rotate-6" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground group-hover:text-emerald-800 transition-colors duration-200">Type</p>
                    <p className="text-sm font-bold text-foreground capitalize truncate">{property.property_type}</p>
                  </div>
                </div>

                {/* 2. Land Area / Sqft */}
                {(property.landArea || property.area_sqft) && (
                  <div
                    tabIndex={0}
                    role="region"
                    aria-label={`Area: ${property.landArea || `${property.area_sqft} sqft`}`}
                    title={`Area: ${property.landArea || `${property.area_sqft} sqft`}`}
                    className="group relative flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-border/50 hover:border-teal-500/60 hover:bg-teal-50/60 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-[1.04] active:scale-98 cursor-default focus:outline-none focus:ring-2 focus:ring-teal-500/50 shadow-xs"
                  >
                    <div className="p-2.5 rounded-xl bg-teal-100/90 text-teal-700 group-hover:bg-teal-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 ease-in-out shadow-xs shrink-0">
                      {property.landArea ? <Ruler className="h-5 w-5 transition-transform duration-300 group-hover:rotate-6" aria-hidden="true" /> : <Square className="h-5 w-5 transition-transform duration-300 group-hover:rotate-6" aria-hidden="true" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground group-hover:text-teal-800 transition-colors duration-200">
                        {property.landArea ? 'Land Area' : 'Built-up Area'}
                      </p>
                      <p className="text-sm font-bold text-foreground truncate">
                        {property.landArea || `${property.area_sqft} sqft`}
                      </p>
                    </div>
                  </div>
                )}

                {/* 3. Bedrooms */}
                {property.bedrooms ? (
                  <div
                    tabIndex={0}
                    role="region"
                    aria-label={`Bedrooms: ${property.bedrooms}`}
                    title={`Bedrooms: ${property.bedrooms} Bedrooms`}
                    className="group relative flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-border/50 hover:border-blue-500/60 hover:bg-blue-50/60 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-[1.04] active:scale-98 cursor-default focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-xs"
                  >
                    <div className="p-2.5 rounded-xl bg-blue-100/90 text-blue-700 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 ease-in-out shadow-xs shrink-0">
                      <Bed className="h-5 w-5 transition-transform duration-300 group-hover:rotate-6" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground group-hover:text-blue-800 transition-colors duration-200">Bedrooms</p>
                      <p className="text-sm font-bold text-foreground truncate">{property.bedrooms}</p>
                    </div>
                  </div>
                ) : null}

                {/* 4. Bathrooms */}
                {property.bathrooms ? (
                  <div
                    tabIndex={0}
                    role="region"
                    aria-label={`Bathrooms: ${property.bathrooms}`}
                    title={`Bathrooms: ${property.bathrooms} Bathrooms`}
                    className="group relative flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-border/50 hover:border-cyan-500/60 hover:bg-cyan-50/60 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-[1.04] active:scale-98 cursor-default focus:outline-none focus:ring-2 focus:ring-cyan-500/50 shadow-xs"
                  >
                    <div className="p-2.5 rounded-xl bg-cyan-100/90 text-cyan-700 group-hover:bg-cyan-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 ease-in-out shadow-xs shrink-0">
                      <Bath className="h-5 w-5 transition-transform duration-300 group-hover:rotate-6" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground group-hover:text-cyan-800 transition-colors duration-200">Bathrooms</p>
                      <p className="text-sm font-bold text-foreground truncate">{property.bathrooms}</p>
                    </div>
                  </div>
                ) : null}

                {/* 5. Living Rooms */}
                {property.livingRooms ? (
                  <div
                    tabIndex={0}
                    role="region"
                    aria-label={`Living Rooms: ${property.livingRooms}`}
                    title={`Living Rooms: ${property.livingRooms}`}
                    className="group relative flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-border/50 hover:border-amber-500/60 hover:bg-amber-50/60 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-[1.04] active:scale-98 cursor-default focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-xs"
                  >
                    <div className="p-2.5 rounded-xl bg-amber-100/90 text-amber-700 group-hover:bg-amber-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 ease-in-out shadow-xs shrink-0">
                      <Armchair className="h-5 w-5 transition-transform duration-300 group-hover:rotate-6" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground group-hover:text-amber-800 transition-colors duration-200">Living Rooms</p>
                      <p className="text-sm font-bold text-foreground truncate">{property.livingRooms}</p>
                    </div>
                  </div>
                ) : null}

                {/* 6. Kitchens */}
                {property.kitchens ? (
                  <div
                    tabIndex={0}
                    role="region"
                    aria-label={`Kitchens: ${property.kitchens}`}
                    title={`Kitchens: ${property.kitchens}`}
                    className="group relative flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-border/50 hover:border-orange-500/60 hover:bg-orange-50/60 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-[1.04] active:scale-98 cursor-default focus:outline-none focus:ring-2 focus:ring-orange-500/50 shadow-xs"
                  >
                    <div className="p-2.5 rounded-xl bg-orange-100/90 text-orange-700 group-hover:bg-orange-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 ease-in-out shadow-xs shrink-0">
                      <UtensilsCrossed className="h-5 w-5 transition-transform duration-300 group-hover:rotate-6" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground group-hover:text-orange-800 transition-colors duration-200">Kitchens</p>
                      <p className="text-sm font-bold text-foreground truncate">{property.kitchens}</p>
                    </div>
                  </div>
                ) : null}

                {/* 7. Parking */}
                {property.parking ? (
                  <div
                    tabIndex={0}
                    role="region"
                    aria-label={`Parking: ${property.parking}`}
                    title={`Parking Facilities: ${property.parking}`}
                    className="group relative flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-border/50 hover:border-indigo-500/60 hover:bg-indigo-50/60 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-[1.04] active:scale-98 cursor-default focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-xs"
                  >
                    <div className="p-2.5 rounded-xl bg-indigo-100/90 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 ease-in-out shadow-xs shrink-0">
                      <Car className="h-5 w-5 transition-transform duration-300 group-hover:rotate-6" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground group-hover:text-indigo-800 transition-colors duration-200">Parking</p>
                      <p className="text-sm font-bold text-foreground truncate">{property.parking}</p>
                    </div>
                  </div>
                ) : null}

                {/* 8. Total Floors */}
                {property.totalFloors ? (
                  <div
                    tabIndex={0}
                    role="region"
                    aria-label={`Total Floors: ${property.totalFloors}`}
                    title={`Total Building Floors: ${property.totalFloors}`}
                    className="group relative flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-border/50 hover:border-purple-500/60 hover:bg-purple-50/60 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-[1.04] active:scale-98 cursor-default focus:outline-none focus:ring-2 focus:ring-purple-500/50 shadow-xs"
                  >
                    <div className="p-2.5 rounded-xl bg-purple-100/90 text-purple-700 group-hover:bg-purple-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 ease-in-out shadow-xs shrink-0">
                      <Layers className="h-5 w-5 transition-transform duration-300 group-hover:rotate-6" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground group-hover:text-purple-800 transition-colors duration-200">Total Floors</p>
                      <p className="text-sm font-bold text-foreground truncate">{property.totalFloors}</p>
                    </div>
                  </div>
                ) : null}

                {/* 9. Furnishing */}
                {property.furnishing ? (
                  <div
                    tabIndex={0}
                    role="region"
                    aria-label={`Furnishing: ${property.furnishing}`}
                    title={`Furnishing Status: ${property.furnishing}`}
                    className="group relative flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-border/50 hover:border-pink-500/60 hover:bg-pink-50/60 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-[1.04] active:scale-98 cursor-default focus:outline-none focus:ring-2 focus:ring-pink-500/50 shadow-xs"
                  >
                    <div className="p-2.5 rounded-xl bg-pink-100/90 text-pink-700 group-hover:bg-pink-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 ease-in-out shadow-xs shrink-0">
                      <Sofa className="h-5 w-5 transition-transform duration-300 group-hover:rotate-6" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground group-hover:text-pink-800 transition-colors duration-200">Furnishing</p>
                      <p className="text-sm font-bold text-foreground truncate">{property.furnishing}</p>
                    </div>
                  </div>
                ) : null}

                {/* 10. Property Facing */}
                {property.faceDirection ? (
                  <div
                    tabIndex={0}
                    role="region"
                    aria-label={`Property Facing: ${property.faceDirection}`}
                    title={`Facing Direction: ${property.faceDirection}`}
                    className="group relative flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-border/50 hover:border-rose-500/60 hover:bg-rose-50/60 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-[1.04] active:scale-98 cursor-default focus:outline-none focus:ring-2 focus:ring-rose-500/50 shadow-xs"
                  >
                    <div className="p-2.5 rounded-xl bg-rose-100/90 text-rose-700 group-hover:bg-rose-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 ease-in-out shadow-xs shrink-0">
                      <Compass className="h-5 w-5 transition-transform duration-300 group-hover:rotate-6" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground group-hover:text-rose-800 transition-colors duration-200">Facing</p>
                      <p className="text-sm font-bold text-foreground truncate">{property.faceDirection}</p>
                    </div>
                  </div>
                ) : null}

                {/* 11. Year Built */}
                {property.yearBuilt ? (
                  <div
                    tabIndex={0}
                    role="region"
                    aria-label={`Year Built: ${property.yearBuilt}`}
                    title={`Construction Year: ${property.yearBuilt}`}
                    className="group relative flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-border/50 hover:border-yellow-500/60 hover:bg-yellow-50/60 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-[1.04] active:scale-98 cursor-default focus:outline-none focus:ring-2 focus:ring-yellow-500/50 shadow-xs"
                  >
                    <div className="p-2.5 rounded-xl bg-yellow-100/90 text-yellow-800 group-hover:bg-yellow-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 ease-in-out shadow-xs shrink-0">
                      <Hammer className="h-5 w-5 transition-transform duration-300 group-hover:rotate-6" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground group-hover:text-yellow-800 transition-colors duration-200">Year Built</p>
                      <p className="text-sm font-bold text-foreground truncate">{property.yearBuilt}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Part 2: Technical & Location Specifications Table */}
            <div className="space-y-3 pt-3">
              <h4 className="text-[11px] uppercase font-extrabold tracking-wider text-emerald-700 dark:text-emerald-400 border-b pb-2 border-border/50">Full Specifications & Attributes</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-sm">
                {/* Purpose */}
                <div 
                  tabIndex={0}
                  aria-label={`Purpose: For ${property.category === 'sale' ? 'Sale' : 'Rent'}`}
                  title={`Listing Purpose: For ${property.category === 'sale' ? 'Sale' : 'Rent'}`}
                  className="flex justify-between items-center py-2.5 border-b border-border/40 hover:bg-emerald-50/60 px-3 rounded-xl transition-all duration-200 group cursor-default"
                >
                  <span className="text-muted-foreground flex items-center gap-2 font-medium">
                    <Tags className="h-4 w-4 text-violet-500 group-hover:scale-110 transition-transform duration-200" aria-hidden="true" /> 
                    Purpose:
                  </span>
                  <span className="font-semibold text-foreground capitalize">For {property.category === 'sale' ? 'Sale' : 'Rent'}</span>
                </div>

                {/* Built-up Area */}
                {property.area_sqft ? (
                  <div 
                    tabIndex={0}
                    aria-label={`Built-up Area: ${property.area_sqft} sqft`}
                    title={`Built-up Area: ${property.area_sqft} sqft`}
                    className="flex justify-between items-center py-2.5 border-b border-border/40 hover:bg-emerald-50/60 px-3 rounded-xl transition-all duration-200 group cursor-default"
                  >
                    <span className="text-muted-foreground flex items-center gap-2 font-medium">
                      <Square className="h-4 w-4 text-sky-500 group-hover:scale-110 transition-transform duration-200" aria-hidden="true" /> 
                      Built-up Area:
                    </span>
                    <span className="font-semibold text-foreground">{property.area_sqft} sqft</span>
                  </div>
                ) : null}

                {/* Dimension */}
                {property.dimension ? (
                  <div 
                    tabIndex={0}
                    aria-label={`Dimension: ${property.dimension}`}
                    title={`Property Dimension: ${property.dimension}`}
                    className="flex justify-between items-center py-2.5 border-b border-border/40 hover:bg-emerald-50/60 px-3 rounded-xl transition-all duration-200 group cursor-default"
                  >
                    <span className="text-muted-foreground flex items-center gap-2 font-medium">
                      <ArrowUpDown className="h-4 w-4 text-lime-600 group-hover:scale-110 transition-transform duration-200" aria-hidden="true" /> 
                      Dimension:
                    </span>
                    <span className="font-semibold text-foreground">{property.dimension}</span>
                  </div>
                ) : null}

                {/* Pillar Size */}
                {property.pillarSize ? (
                  <div 
                    tabIndex={0}
                    aria-label={`Pillar Size: ${property.pillarSize}`}
                    title={`Structural Pillar Size: ${property.pillarSize}`}
                    className="flex justify-between items-center py-2.5 border-b border-border/40 hover:bg-emerald-50/60 px-3 rounded-xl transition-all duration-200 group cursor-default"
                  >
                    <span className="text-muted-foreground flex items-center gap-2 font-medium">
                      <Columns3 className="h-4 w-4 text-stone-500 group-hover:scale-110 transition-transform duration-200" aria-hidden="true" /> 
                      Pillar Size:
                    </span>
                    <span className="font-semibold text-foreground">{property.pillarSize}</span>
                  </div>
                ) : null}

                {/* Tank Capacity */}
                {property.tankCapacity ? (
                  <div 
                    tabIndex={0}
                    aria-label={`Tank Capacity: ${property.tankCapacity}`}
                    title={`Water Tank Capacity: ${property.tankCapacity}`}
                    className="flex justify-between items-center py-2.5 border-b border-border/40 hover:bg-emerald-50/60 px-3 rounded-xl transition-all duration-200 group cursor-default"
                  >
                    <span className="text-muted-foreground flex items-center gap-2 font-medium">
                      <Droplets className="h-4 w-4 text-blue-400 group-hover:scale-110 transition-transform duration-200" aria-hidden="true" /> 
                      Tank Capacity:
                    </span>
                    <span className="font-semibold text-foreground">{property.tankCapacity}</span>
                  </div>
                ) : null}

                {/* Road Type */}
                {property.roadType ? (
                  <div 
                    tabIndex={0}
                    aria-label={`Road Type: ${property.roadType}`}
                    title={`Road Construction Type: ${property.roadType}`}
                    className="flex justify-between items-center py-2.5 border-b border-border/40 hover:bg-emerald-50/60 px-3 rounded-xl transition-all duration-200 group cursor-default"
                  >
                    <span className="text-muted-foreground flex items-center gap-2 font-medium">
                      <Shield className="h-4 w-4 text-emerald-600 group-hover:scale-110 transition-transform duration-200" aria-hidden="true" /> 
                      Road Type:
                    </span>
                    <span className="font-semibold text-foreground">{property.roadType}</span>
                  </div>
                ) : null}

                {/* Road Access / Size */}
                {property.roadSize ? (
                  <div 
                    tabIndex={0}
                    aria-label={`Road Access: ${property.roadSize}`}
                    title={`Road Access Size: ${property.roadSize}`}
                    className="flex justify-between items-center py-2.5 border-b border-border/40 hover:bg-emerald-50/60 px-3 rounded-xl transition-all duration-200 group cursor-default"
                  >
                    <span className="text-muted-foreground flex items-center gap-2 font-medium">
                      <MapPin className="h-4 w-4 text-red-500 group-hover:scale-110 transition-transform duration-200" aria-hidden="true" /> 
                      Road Access:
                    </span>
                    <span className="font-semibold text-foreground">{property.roadSize}</span>
                  </div>
                ) : null}

                {/* City & Area */}
                <div 
                  tabIndex={0}
                  aria-label={`City & Area: ${property.cityArea || property.location}`}
                  title={`City & Area: ${property.cityArea || property.location}`}
                  className="flex justify-between items-center py-2.5 border-b border-border/40 hover:bg-emerald-50/60 px-3 rounded-xl transition-all duration-200 group cursor-default"
                >
                  <span className="text-muted-foreground flex items-center gap-2 font-medium">
                    <Globe className="h-4 w-4 text-emerald-500 group-hover:scale-110 transition-transform duration-200" aria-hidden="true" /> 
                    City & Area:
                  </span>
                  <span className="font-semibold text-foreground">{property.cityArea || property.location || 'N/A'}</span>
                </div>

                {/* Municipality / Ward */}
                <div 
                  tabIndex={0}
                  aria-label={`Municipality & Ward: ${property.municipality ? `${property.municipality}${property.wardNumber ? `, Ward ${property.wardNumber}` : ''}` : 'N/A'}`}
                  title={`Local Municipality / Ward: ${property.municipality ? `${property.municipality}${property.wardNumber ? `, Ward ${property.wardNumber}` : ''}` : 'N/A'}`}
                  className="flex justify-between items-center py-2.5 border-b border-border/40 hover:bg-emerald-50/60 px-3 rounded-xl transition-all duration-200 group cursor-default"
                >
                  <span className="text-muted-foreground flex items-center gap-2 font-medium">
                    <MapPin className="h-4 w-4 text-purple-500 group-hover:scale-110 transition-transform duration-200" aria-hidden="true" /> 
                    Municipality / Ward:
                  </span>
                  <span className="font-semibold text-foreground">
                    {property.municipality ? `${property.municipality}${property.wardNumber ? `, Ward ${property.wardNumber}` : ''}` : 'N/A'}
                  </span>
                </div>

                {/* Price Negotiable */}
                <div 
                  tabIndex={0}
                  aria-label={`Negotiable: ${property.negotiable !== false ? 'Yes' : 'No'}`}
                  title={`Price Negotiable: ${property.negotiable !== false ? 'Yes' : 'No'}`}
                  className="flex justify-between items-center py-2.5 border-b border-border/40 hover:bg-emerald-50/60 px-3 rounded-xl transition-all duration-200 group cursor-default"
                >
                  <span className="text-muted-foreground flex items-center gap-2 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-green-500 group-hover:scale-110 transition-transform duration-200" aria-hidden="true" /> 
                    Negotiable:
                  </span>
                  <span className="font-semibold text-foreground">{property.negotiable !== false ? 'Yes' : 'No'}</span>
                </div>

                {/* Date Posted */}
                <div 
                  tabIndex={0}
                  aria-label={`Date Posted: ${new Date(property.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}`}
                  title={`Date Posted: ${new Date(property.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}`}
                  className="flex justify-between items-center py-2.5 border-b border-border/40 hover:bg-emerald-50/60 px-3 rounded-xl transition-all duration-200 group cursor-default"
                >
                  <span className="text-muted-foreground flex items-center gap-2 font-medium">
                    <Calendar className="h-4 w-4 text-orange-400 group-hover:scale-110 transition-transform duration-200" aria-hidden="true" /> 
                    Date Posted:
                  </span>
                  <span className="font-semibold text-foreground">{new Date(property.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>

                {/* Total Views */}
                <div 
                  tabIndex={0}
                  aria-label={`Total Views: ${property.views || 0}`}
                  title={`Total Listing Views: ${property.views || 0}`}
                  className="flex justify-between items-center py-2.5 border-b border-border/40 hover:bg-emerald-50/60 px-3 rounded-xl transition-all duration-200 group cursor-default"
                >
                  <span className="text-muted-foreground flex items-center gap-2 font-medium">
                    <Eye className="h-4 w-4 text-gray-500 group-hover:scale-110 transition-transform duration-200" aria-hidden="true" /> 
                    Views:
                  </span>
                  <span className="font-semibold text-foreground">{property.views || 0}</span>
                </div>
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
            <form ref={formRef} onSubmit={handleSubmitInquiry} className="space-y-4 border-t pt-4">
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