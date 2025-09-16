import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface NewsletterProps {
  className?: string;
}

const Newsletter = ({ className }: NewsletterProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('inquiries')
        .insert([{
          full_name: 'Newsletter Subscriber',
          phone: '',
          email: email,
          property_interest: '',
          message: 'Newsletter subscription',
          inquiry_type: 'newsletter'
        }]);

      if (error) throw error;

      toast({
        title: "Successfully subscribed!",
        description: "You'll receive the latest property updates in your inbox.",
      });

      setEmail('');
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubscribe} className={`space-y-3 ${className}`}>
      <Input 
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
        disabled={isSubmitting}
      />
      <Button 
        type="submit" 
        className="btn-hero w-full" 
        disabled={isSubmitting}
      >
        <Send className="h-4 w-4 mr-2" />
        {isSubmitting ? 'Subscribing...' : 'Subscribe'}
      </Button>
    </form>
  );
};

export default Newsletter;