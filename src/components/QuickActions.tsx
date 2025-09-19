import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, MessageCircle, Mail, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const QuickActions = () => {
  const { toast } = useToast();
  
  const handleCall = () => {
    // For mobile devices, this will trigger the phone dialer
    window.location.href = 'tel:+9779741690374';
  };

  const handleWhatsApp = async () => {
    try {
      // Send WhatsApp message via edge function
      await supabase.functions.invoke('whatsapp-send', {
        body: {
          to: '9779741690374',
          message: 'Hi! I am interested in your real estate services. Can you help me find a property?'
        }
      });
      
      toast({
        title: "WhatsApp Message Sent!",
        description: "We'll respond to you shortly.",
      });
    } catch (error) {
      console.error('WhatsApp function failed, using fallback:', error);
      // Fallback to opening WhatsApp Web
      const message = encodeURIComponent('Hi! I am interested in your real estate services. Can you help me find a property?');
      const whatsappUrl = `https://wa.me/9779741690374?text=${message}`;
      
      // Check if it's a mobile device for better WhatsApp experience
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Try to open WhatsApp app first, fallback to web
        window.location.href = `whatsapp://send?phone=9779741690374&text=${message}`;
        setTimeout(() => {
          window.open(whatsappUrl, '_blank');
        }, 500);
      } else {
        window.open(whatsappUrl, '_blank');
      }
    }
  };

  const handleEmail = () => {
    const subject = encodeURIComponent('Real Estate Inquiry from Website');
    const body = encodeURIComponent('Hi,\n\nI am interested in your real estate services. Please contact me to discuss my requirements.\n\nBest regards');
    window.location.href = `mailto:sumanghimire138@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleLocation = () => {
    // Scroll to maps section first, then optionally open external map
    const mapsSection = document.querySelector('#maps');
    if (mapsSection) {
      mapsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    // Optional: Also open in Google Maps
    setTimeout(() => {
      window.open('https://maps.google.com/?q=New+Baneshwor,Kathmandu,Nepal', '_blank');
    }, 1000);
  };

  const quickActions = [
    {
      icon: Phone,
      label: 'Call Now',
      action: handleCall,
      className: 'btn-primary'
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      action: handleWhatsApp,
      className: 'bg-green-600 hover:bg-green-700 text-white'
    },
    {
      icon: Mail,
      label: 'Email Us',
      action: handleEmail,
      className: 'bg-blue-600 hover:bg-blue-700 text-white'
    },
    {
      icon: MapPin,
      label: 'Visit Office',
      action: handleLocation,
      className: 'bg-purple-600 hover:bg-purple-700 text-white'
    }
  ];

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