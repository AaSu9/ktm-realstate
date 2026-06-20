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
  address: string | null;
}

const QuickActions = () => {
  const { toast } = useToast();
  const [contactDetails, setContactDetails] = useState<QuickContactDetails | null>(null);

  useEffect(() => {
    const fetchContactDetails = async () => {
      const { data, error } = await supabase
        .from('contacts')
        .select('phone, whatsapp, address')
        .single();

      if (!error && data) {
        setContactDetails(data);
      }
    };

    fetchContactDetails();
  }, []);

  const handleWhatsApp = () => {
    if (!contactDetails?.whatsapp) return;
    const message = encodeURIComponent('Hi! I am interested in your real estate services. Can you help me find a property?');
    const whatsappUrl = `https://wa.me/${contactDetails.whatsapp}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {contactDetails?.phone && (
        <Button
          size="icon"
          className="h-14 w-14 rounded-full bg-accent hover:bg-accent-hover text-white shadow-lg hover:scale-110 transition-transform"
          onClick={() => window.location.href = `tel:${contactDetails.phone}`}
        >
          <Phone className="h-6 w-6" />
        </Button>
      )}
      {contactDetails?.whatsapp && (
        <Button
          className="h-14 px-6 rounded-full bg-accent hover:bg-accent-hover text-white shadow-lg hover:scale-110 transition-transform flex items-center gap-2 text-lg font-bold"
          onClick={handleWhatsApp}
        >
          <MessageCircle className="h-6 w-6" />
          WhatsApp
        </Button>
      )}
    </div>
  );
};

export default QuickActions;