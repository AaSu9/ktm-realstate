import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Phone, MessageSquare, Calendar, User, MapPin, ExternalLink } from 'lucide-react';

interface Inquiry {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  message: string;
  property_interest?: string;
  inquiry_type: string;
  status: string;
  property_id?: string;
  created_at: string;
}

interface InquiriesListProps {
  loading: boolean;
}

const InquiriesList = ({ loading }: InquiriesListProps) => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const { toast } = useToast();

  const fetchInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      toast({
        title: "Error",
        description: "Failed to fetch inquiries",
        variant: "destructive",
      });
    }
  };

  const updateInquiryStatus = async (inquiryId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status })
        .eq('id', inquiryId);

      if (error) throw error;

      setInquiries(prev => prev.map(inquiry => 
        inquiry.id === inquiryId ? { ...inquiry, status } : inquiry
      ));

      toast({
        title: "Success",
        description: "Inquiry status updated",
      });
    } catch (error) {
      console.error('Error updating inquiry:', error);
      toast({
        title: "Error",
        description: "Failed to update inquiry status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleWhatsApp = async (phone: string, name: string) => {
    try {
      const message = `Hello ${name}, thank you for your inquiry. How can we assist you further?`;
      
      // Send WhatsApp message via edge function
      await supabase.functions.invoke('whatsapp-send', {
        body: {
          to: phone.replace(/\D/g, ''),
          message: message
        }
      });
      
      toast({
        title: "WhatsApp Message Sent!",
        description: `Message sent to ${name}`,
      });
    } catch (error) {
      console.error('WhatsApp function failed, using fallback:', error);
      // Fallback to opening WhatsApp Web
      const message = `Hello ${name}, thank you for your inquiry. How can we assist you further?`;
      const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleEmail = (email: string, name: string) => {
    const subject = 'Response to Your Property Inquiry';
    const body = `Dear ${name},\n\nThank you for your inquiry. We appreciate your interest and will get back to you soon.\n\nBest regards,\nProperty Team`;
    const emailUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(emailUrl, '_blank');
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_blank');
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (inquiries.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No inquiries found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {inquiries.map((inquiry) => (
        <Card key={inquiry.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <CardTitle className="text-lg">{inquiry.full_name}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(inquiry.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(inquiry.status)}>
                  {inquiry.status}
                </Badge>
                <select
                  value={inquiry.status}
                  onChange={(e) => updateInquiryStatus(inquiry.id, e.target.value)}
                  className="text-sm border rounded px-2 py-1 bg-white"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{inquiry.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{inquiry.phone}</span>
              </div>
            </div>

            {inquiry.property_interest && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Interested in: <strong>{inquiry.property_interest}</strong>
                </span>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Message:</h4>
              <p className="text-sm text-gray-600">{inquiry.message}</p>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCall(inquiry.phone)}
                className="flex items-center gap-2"
              >
                <Phone className="h-3 w-3" />
                Call
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleWhatsApp(inquiry.phone, inquiry.full_name)}
                className="flex items-center gap-2 text-green-600 border-green-600 hover:bg-green-50"
              >
                <MessageSquare className="h-3 w-3" />
                WhatsApp
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEmail(inquiry.email, inquiry.full_name)}
                className="flex items-center gap-2"
              >
                <Mail className="h-3 w-3" />
                Email
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default InquiriesList;