import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  Facebook,
  Instagram,
  Youtube
} from 'lucide-react';

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    propertyInterest: '',
    message: ''
  });

  const handleWhatsApp = async () => {
    try {
      // Send WhatsApp message via edge function
      await supabase.functions.invoke('whatsapp-send', {
        body: {
          to: '9779741690374',
          message: 'Hello! I am interested in your real estate services. Could you please provide more information?'
        }
      });
      
      toast({
        title: "WhatsApp Message Sent!",
        description: "We'll respond to you shortly.",
      });
    } catch (error) {
      // Fallback to opening WhatsApp Web
      window.open('https://wa.me/9779741690374?text=Hello! I am interested in your real estate services. Could you please provide more information?', '_blank');
    }
  };

  const handleCall = () => {
    window.location.href = 'tel:+9779741690374';
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save to database
      const { error } = await supabase
        .from('inquiries')
        .insert([{
          full_name: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          property_interest: formData.propertyInterest,
          message: formData.message,
          inquiry_type: 'contact_form'
        }]);

      if (error) throw error;

      // Send email notification
      try {
        await supabase.functions.invoke('send-email', {
          body: {
            to: 'sumanghimire138@gmail.com',
            subject: `New Inquiry from ${formData.fullName}`,
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #333;">New Property Inquiry</h2>
                <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
                  <p><strong>Name:</strong> ${formData.fullName}</p>
                  <p><strong>Phone:</strong> ${formData.phone}</p>
                  <p><strong>Email:</strong> ${formData.email}</p>
                  <p><strong>Property Interest:</strong> ${formData.propertyInterest}</p>
                  <p><strong>Message:</strong> ${formData.message}</p>
                </div>
                <p style="color: #666; font-size: 14px;">This inquiry was submitted through your real estate website contact form.</p>
              </div>
            `
          }
        });
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
      }

      // Send WhatsApp notification (optional)
      try {
        await supabase.functions.invoke('whatsapp-send', {
          body: {
            to: '9779741690374',
            message: `🏠 New Property Inquiry\n\nName: ${formData.fullName}\nPhone: ${formData.phone}\nEmail: ${formData.email}\nInterest: ${formData.propertyInterest}\n\nMessage: ${formData.message}`
          }
        });
      } catch (whatsappError) {
        console.error('WhatsApp notification failed:', whatsappError);
      }

      toast({
        title: "Message Sent Successfully!",
        description: "We'll get back to you within 2 hours.",
      });

      setFormData({
        fullName: '',
        phone: '',
        email: '',
        propertyInterest: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Call Us',
      details: '+977 974-1690374',
      subtitle: 'Mon-Sun: 7:00 AM - 8:00 PM',
      action: handleCall
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      details: '+977 974-1690374',
      subtitle: 'Quick response guaranteed',
      action: handleWhatsApp
    },
    {
      icon: Mail,
      title: 'Email',
      details: 'sumanghimire138@gmail.com',
      subtitle: 'We reply within 2 hours',
      action: () => window.location.href = 'mailto:sumanghimire138@gmail.com'
    },
    {
      icon: MapPin,
      title: 'Office',
      details: 'New Baneshwor, Kathmandu',
      subtitle: 'Visit us for consultation',
      action: () => window.open('https://maps.google.com', '_blank')
    }
  ];

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="animate-fade-in">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Ready to find your dream property? Contact our expert team today. We're here to help you every step of the way.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="animate-slide-up">
            <Card className="property-card">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-foreground mb-6">
                  Send us a Message
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Full Name
                      </label>
                      <Input 
                        placeholder="John Doe" 
                        className="h-12"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <Input 
                        placeholder="+977 98XXXXXXXX" 
                        className="h-12"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <Input 
                      type="email" 
                      placeholder="john@example.com" 
                      className="h-12"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Property Interest
                    </label>
                    <Input 
                      placeholder="e.g., 3 BHK Apartment in Kathmandu" 
                      className="h-12"
                      value={formData.propertyInterest}
                      onChange={(e) => handleInputChange('propertyInterest', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message
                    </label>
                    <Textarea 
                      placeholder="Tell us about your requirements..."
                      className="min-h-[120px] resize-none"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="btn-hero w-full h-12" 
                    disabled={isSubmitting}
                  >
                    <Send className="h-5 w-5 mr-2" />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <Card
                key={info.title}
                className="property-card cursor-pointer animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={info.action}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <info.icon className="h-6 w-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-foreground mb-1">
                        {info.title}
                      </h4>
                      <p className="text-accent font-medium mb-1">
                        {info.details}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {info.subtitle}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <Button 
                className="btn-primary h-14 text-lg"
                onClick={handleCall}
              >
                <Phone className="h-5 w-5 mr-2" />
                Call Now
              </Button>
              <Button 
                className="h-14 text-lg bg-green-600 hover:bg-green-700"
                onClick={handleWhatsApp}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                WhatsApp
              </Button>
            </div>

            {/* Social Media */}
            <Card className="property-card mt-6">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-foreground mb-4">
                  Follow Us
                </h4>
                <div className="flex space-x-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Instagram className="h-4 w-4 mr-2" />
                    Instagram
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Youtube className="h-4 w-4 mr-2" />
                    YouTube
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Office Hours */}
            <Card className="property-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Clock className="h-6 w-6 text-accent" />
                  <h4 className="text-lg font-semibold text-foreground">
                    Office Hours
                  </h4>
                </div>
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;