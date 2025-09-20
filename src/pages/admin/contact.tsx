
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const ContactAdmin = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [contactDetails, setContactDetails] = useState({
    id: 1, // Primary key for the contacts table
    address: '',
    phone: '',
    whatsapp: '',
    facebook: '',
    instagram: '',
    youtube: '',
    youtube_api_key: '',
    youtube_channel_id: '',
  });

  const fetchContactDetails = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', 1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error('Error fetching contact details:', error);
      toast({
        title: 'Error',
        description: 'Could not fetch contact details.',
        variant: 'destructive',
      });
    } else if (data) {
      setContactDetails(data);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchContactDetails();
  }, [fetchContactDetails]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('contacts')
      .upsert(contactDetails, { onConflict: 'id' });

    if (error) {
      console.error('Error saving contact details:', error);
      toast({
        title: 'Error',
        description: `Failed to save contact details: ${error.message}`,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Contact details saved successfully.',
      });
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Manage Contact & Socials</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" name="address" value={contactDetails.address || ''} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" name="phone" value={contactDetails.phone || ''} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp Number</Label>
          <Input id="whatsapp" name="whatsapp" value={contactDetails.whatsapp || ''} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="facebook">Facebook URL</Label>
          <Input id="facebook" name="facebook" value={contactDetails.facebook || ''} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="instagram">Instagram URL</Label>
          <Input id="instagram" name="instagram" value={contactDetails.instagram || ''} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="youtube">YouTube Channel URL</Label>
          <Input id="youtube" name="youtube" value={contactDetails.youtube || ''} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="youtube_api_key">YouTube API Key</Label>
          <Input id="youtube_api_key" name="youtube_api_key" value={contactDetails.youtube_api_key || ''} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="youtube_channel_id">YouTube Channel ID</Label>
          <Input id="youtube_channel_id" name="youtube_channel_id" value={contactDetails.youtube_channel_id || ''} onChange={handleInputChange} />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Details'}
        </Button>
      </form>
    </div>
  );
};

export default ContactAdmin;
