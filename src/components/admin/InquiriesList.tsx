import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Phone, MessageSquare, Calendar, User, MapPin } from 'lucide-react';

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
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const { toast } = useToast();

  const fetchInquiries = useCallback(async () => {
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
  }, [toast]);

  const updateInquiryStatus = async (inquiryId: string, status: string) => {
    // ... (existing code)
  };

  const handleReply = (inquiryId: string) => {
    setReplyingTo(inquiryId);
  };

  const handleSendReply = async (inquiry: Inquiry) => {
    try {
      await supabase.functions.invoke('send-email', {
        body: {
          to: inquiry.email,
          subject: `Re: Your inquiry about ${inquiry.property_interest || 'your inquiry'}`,
          text: replyMessage,
        },
      });
      toast({ title: "Success", description: "Reply sent successfully" });
      setReplyingTo(null);
      setReplyMessage('');
    } catch (error) {
      console.error("Error sending reply:", error);
      toast({ title: "Error", description: "Failed to send reply", variant: "destructive" });
    }
  };

  // ... (existing code)

  return (
    <div className="space-y-4">
      {inquiries.map((inquiry) => (
        <Card key={inquiry.id} className="hover:shadow-md transition-shadow">
          {/* ... (existing code) ... */}
          <CardContent className="space-y-4">
            {/* ... (existing code) ... */}
            <div className="flex gap-2 pt-4 border-t">
              {/* ... (existing buttons) ... */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleReply(inquiry.id)}
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-3 w-3" />
                Reply
              </Button>
            </div>
            {replyingTo === inquiry.id && (
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Reply to {inquiry.full_name}</h4>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-gray-700 border rounded-lg focus:outline-none"
                  rows={4}
                  placeholder={`Hi ${inquiry.full_name},`}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button size="sm" variant="ghost" onClick={() => setReplyingTo(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={() => handleSendReply(inquiry)}>
                    Send Reply
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default InquiriesList;
