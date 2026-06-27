import { useState } from 'react';
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
  inquiries: Inquiry[];
}

const InquiriesList = ({ loading, inquiries }: InquiriesListProps) => {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const { toast } = useToast();

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

  if (loading) {
    return <div className="text-center py-10">Loading inquiries...</div>;
  }

  if (inquiries.length === 0) {
    return <div className="text-center py-10 text-muted-foreground">No inquiries found.</div>;
  }

  return (
    <div className="space-y-4">
      {inquiries.map((inquiry) => (
        <Card key={inquiry.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="bg-muted/30 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {inquiry.full_name}
                </CardTitle>
                <div className="text-sm text-muted-foreground mt-1 flex items-center gap-4">
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {inquiry.email}</span>
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {inquiry.phone}</span>
                </div>
              </div>
              <Badge variant={inquiry.status === 'new' ? 'default' : 'secondary'}>
                {inquiry.status || 'new'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {inquiry.property_interest && (
              <div className="flex items-start gap-2 text-sm bg-blue-50 text-blue-800 p-2 rounded-md">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span className="font-medium">Interested in: {inquiry.property_interest}</span>
              </div>
            )}
            <div className="text-sm border-l-2 border-muted pl-4 py-1">
              <p className="whitespace-pre-wrap">{inquiry.message}</p>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(inquiry.created_at).toLocaleString()}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleReply(inquiry.id)}
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Reply
              </Button>
            </div>

            {replyingTo === inquiry.id && (
              <div className="pt-4 border-t mt-4 animate-in fade-in slide-in-from-top-2">
                <h4 className="text-sm font-medium mb-2">Reply to {inquiry.full_name}</h4>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={4}
                  placeholder={`Hi ${inquiry.full_name},`}
                />
                <div className="flex justify-end gap-2 mt-3">
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
