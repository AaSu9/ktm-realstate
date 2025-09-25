'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, MessageCircle, Mail, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface QuickContactDetails {
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
}

const QuickActions = () => {
  const { toast } = useToast();
  const [contactDetails, setContactDetails] = useState<QuickContactDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactDetails = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('contacts')
        .select('phone, whatsapp, email, address')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching quick contact details:', error);
      } else {
        setContactDetails(data);
      }
      setLoading(false);
    };

    fetchContactDetails();
  }, []);

  const handleCall = () => {
    if (!contactDetails?.phone) return;
    window.location.href = `tel:${contactDetails.phone}`;
  };

  const handleWhatsApp = async () => {
    if (!contactDetails?.whatsapp) return;
    
    try {
      await supabase.functions.invoke('whatsapp-send', {
        body: {
          to: contactDetails.whatsapp,
          message: 'Hi! I am interested in your real estate services. Can you help me find a property?'
        }
      });
      
      toast({
        title: "WhatsApp Message Sent!",
        description: "We'll respond to you shortly.",
      });
    } catch (error) {
      console.error('WhatsApp function failed, using fallback:', error);
      const message = encodeURIComponent('Hi! I am interested in your real estate services. Can you help me find a property?');
      const whatsappUrl = `https://wa.me/${contactDetails.whatsapp}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleEmail = () => {
    if (!contactDetails?.email) return;
    const subject = encodeURIComponent('Real Estate Inquiry from Website');
    const body = encodeURIComponent('Hi,\n\nI am interested in your real estate services. Please contact me to discuss my requirements.\n\nBest regards');
    window.location.href = `mailto:${contactDetails.email}?subject=${subject}&body=${body}`;
  };

  const handleLocation = () => {
    const mapsSection = document.querySelector('#maps');
    if (mapsSection) {
      mapsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (contactDetails?.address) {
        setTimeout(() => {
            window.open(`https://maps.google.com/?q=${encodeURIComponent(contactDetails.address)}`, '_blank');
        }, 1000);
    }
  };

  const quickActions = [
    {
      icon: Phone,
      label: 'Call Now',
      action: handleCall,
      className: 'btn-primary',
      disabled: !contactDetails?.phone,
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      action: handleWhatsApp,
      className: 'bg-green-600 hover:bg-green-700 text-white',
      disabled: !contactDetails?.whatsapp,
    },
    {
      icon: Mail,
      label: 'Email Us',
      action: handleEmail,
      className: 'bg-blue-600 hover:bg-blue-700 text-white',
      disabled: !contactDetails?.email,
    },
    {
      icon: MapPin,
      label: 'Visit Office',
      action: handleLocation,
      className: 'bg-purple-600 hover:bg-purple-700 text-white',
      disabled: !contactDetails?.address,
    }
  ];
  
  if (loading || !contactDetails) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 hidden md:block">
      <Card className="property-card">
        <CardContent className="p-4">
          <div className="flex flex-col gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                size="sm"
                className={action.className}
                onClick={action.action}
                disabled={action.disabled || loading}
              >
                <action.icon className="h-4 w-4 mr-2" />
                {action.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickActions;