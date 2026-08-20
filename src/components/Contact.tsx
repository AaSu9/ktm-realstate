'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Send,
  Facebook,
  Instagram,
  Youtube
} from 'lucide-react';

interface ContactDetails {
  branch_name?: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  facebook: string | null;
  instagram: string | null;
  youtube: string | null;
}

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [branches, setBranches] = useState<ContactDetails[]>([]);
  const [activeBranchIndex, setActiveBranchIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    propertyInterest: '',
    message: ''
  });

  useEffect(() => {
    const fetchContactDetails = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('contacts')
        .select('branch_name, phone, whatsapp, address, facebook, instagram, youtube')
        .order('id', { ascending: true });

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching contact details:', error);
        toast({ title: 'Error', description: 'Could not load contact information.', variant: 'destructive' });
      } else if (data && data.length > 0) {
        setBranches(data);
      }
      setLoading(false);
    };
    fetchContactDetails();
  }, [toast]);

  const contactDetails = branches[activeBranchIndex];

  const handleWhatsApp = () => {
    if (!contactDetails?.whatsapp) return;
    const message = encodeURIComponent('Hello! I am interested in your real estate services. Could you please provide more information?');
    window.open(`https://wa.me/${contactDetails.whatsapp.replace(/\D/g,'')}?text=${message}`, '_blank');
  };

  const handleCall = () => {
    if (!contactDetails?.phone) return;
    window.location.href = `tel:${contactDetails.phone}`;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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

      const { error: dbError } = await supabase.from('inquiries').insert([{
        id: generateUUID(),
        full_name: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        property_interest: formData.propertyInterest,
        message: formData.message,
        inquiry_type: 'contact_form'
      }]);

      if (dbError) throw dbError;

      toast({ title: "Message Sent!", description: "Thank you! We will get back to you shortly." });
      setFormData({ fullName: '', phone: '', email: '', propertyInterest: '', message: '' });
    } catch (error) {
      const err = error as { message: string };
      toast({ title: "Error", description: err.message || "Failed to send message.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = contactDetails ? [
    {
      icon: Phone,
      title: 'Call Us',
      details: contactDetails.phone || 'Not available',
      subtitle: 'Mon-Sun: 7:00 AM - 8:00 PM',
      action: handleCall
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      details: contactDetails.whatsapp ? `+${contactDetails.whatsapp}` : 'Not available',
      subtitle: 'Quick response guaranteed',
      action: handleWhatsApp
    },
    {
      icon: MapPin,
      title: 'Get Directions',
      details: contactDetails.address || 'Not available',
      subtitle: 'Visit us for consultation',
      action: () => contactDetails.address && window.open(
        contactDetails.address.startsWith('http') 
          ? contactDetails.address 
          : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactDetails.address)}`, 
        '_blank'
      )
    }
  ] : [];

  if (loading) {
    return <div className="py-20 text-center">Loading Contact Information...</div>;
  }

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Get In Touch</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Ready to find your dream property? Contact our expert team today.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="animate-slide-up">
            <Card className="property-card">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-foreground mb-6">Send us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                      <Input placeholder="John Doe" className="h-12" value={formData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                      <Input placeholder="+977 98XXXXXXXX" className="h-12" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                    <Input type="email" placeholder="john@example.com" className="h-12" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Property Interest</label>
                    <Input placeholder="e.g., 3 BHK Apartment in Kathmandu" className="h-12" value={formData.propertyInterest} onChange={(e) => handleInputChange('propertyInterest', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                    <Textarea placeholder="Tell us about your requirements..." className="min-h-[120px] resize-none" value={formData.message} onChange={(e) => handleInputChange('message', e.target.value)} />
                  </div>
                  <Button type="submit" className="btn-hero w-full h-12" disabled={isSubmitting}>
                    <Send className="h-5 w-5 mr-2" />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="property-card">
              <CardContent className="p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <h3 className="text-2xl font-semibold text-foreground">Quick Contacts</h3>
                  
                  {/* Branch Selector */}
                  {branches.length > 1 && (
                    <div className="flex flex-wrap gap-2">
                      {branches.map((b, i) => (
                        <Button 
                          key={i} 
                          variant={activeBranchIndex === i ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setActiveBranchIndex(i)}
                          className={activeBranchIndex === i ? 'bg-[#1B3A1F] text-white hover:bg-[#2c5831]' : 'hover:bg-gray-100'}
                        >
                          {b.branch_name || `Branch ${i + 1}`}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <Card key={info.title} className="property-card cursor-pointer animate-slide-up transition-transform hover:-translate-y-1" style={{ animationDelay: `${index * 0.1}s` }} onClick={info.action}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <info.icon className="h-6 w-6 text-accent" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-foreground mb-1">{info.title}</h4>
                            <p className="text-accent font-medium mb-1 break-all line-clamp-1">{info.details}</p>
                            <p className="text-sm text-muted-foreground">{info.subtitle}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <Button className="btn-primary h-14 text-lg" onClick={handleCall} disabled={!contactDetails?.phone}>
                <Phone className="h-5 w-5 mr-2" /> Call Now
              </Button>
              <Button className="h-14 text-lg bg-green-600 hover:bg-green-700 text-white" onClick={handleWhatsApp} disabled={!contactDetails?.whatsapp}>
                <MessageCircle className="h-5 w-5 mr-2" /> WhatsApp
              </Button>
            </div>

            {/* Render social media only if this specific branch has at least one link */}
            {(contactDetails?.facebook || contactDetails?.instagram || contactDetails?.youtube) && (
              <Card className="property-card mt-6">
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold text-foreground mb-4">Follow Us</h4>
                  <div className="flex space-x-4">
                    {contactDetails?.facebook && (
                      <Button variant="outline" size="sm" className="flex-1 hover:text-[#1877F2]" onClick={() => window.open(contactDetails.facebook!, '_blank')}>
                        <Facebook className="h-4 w-4 mr-2" /> Facebook
                      </Button>
                    )}
                    {contactDetails?.instagram && (
                      <Button variant="outline" size="sm" className="flex-1 hover:text-[#E4405F]" onClick={() => window.open(contactDetails.instagram!, '_blank')}>
                        <Instagram className="h-4 w-4 mr-2" /> Instagram
                      </Button>
                    )}
                    {contactDetails?.youtube && (
                      <Button variant="outline" size="sm" className="flex-1 hover:text-[#FF0000]" onClick={() => window.open(contactDetails.youtube!, '_blank')}>
                        <Youtube className="h-4 w-4 mr-2" /> YouTube
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
