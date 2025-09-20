'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ContactDetails {
  id: number;
  phone: string;
  email: string;
  address: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  whatsapp_number: string;
  map_lat: number;
  map_lng: number;
  map_zoom: number;
  business_hours: { [key: string]: string };
  updated_at: string;
}

const AdminContactPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactDetails, setContactDetails] = useState<Partial<ContactDetails>>({});

  useEffect(() => {
    const fetchContactDetails = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('contact_details')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116: single row not found
        toast({ title: 'Error fetching contact details', description: error.message, variant: 'destructive' });
      } else {
        setContactDetails(data || {});
      }
      setLoading(false);
    };
    fetchContactDetails();
  }, [toast]);

  const handleInputChange = (field: keyof ContactDetails, value: string | number) => {
    setContactDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleBusinessHoursChange = (day: string, value: string) => {
    setContactDetails((prev) => ({
      ...prev,
      business_hours: {
        ...(prev.business_hours || {}),
        [day]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { id, updated_at, ...updateData } = contactDetails;

    const { error } = await supabase
      .from('contact_details')
      .upsert({ id: 1, ...updateData });

    if (error) {
      toast({ title: 'Error saving details', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Contact details updated successfully!' });
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Contact & Office Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input value={contactDetails?.phone || ''} onChange={(e) => handleInputChange('phone', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input type="email" value={contactDetails?.email || ''} onChange={(e) => handleInputChange('email', e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Office Address</Label>
                <Input value={contactDetails?.address || ''} onChange={(e) => handleInputChange('address', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Facebook URL</Label>
                <Input value={contactDetails?.facebook_url || ''} onChange={(e) => handleInputChange('facebook_url', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Instagram URL</Label>
                <Input value={contactDetails?.instagram_url || ''} onChange={(e) => handleInputChange('instagram_url', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>YouTube URL</Label>
                <Input value={contactDetails?.youtube_url || ''} onChange={(e) => handleInputChange('youtube_url', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp Number</Label>
                <Input value={contactDetails?.whatsapp_.number || ''} onChange={(e) => handleInputChange('whatsapp_number', e.target.value)} />
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Google Maps</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="space-y-2">
                  <Label>Latitude</Label>
                  <Input type="number" step="any" value={contactDetails?.map_lat || ''} onChange={(e) => handleInputChange('map_lat', parseFloat(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label>Longitude</Label>
                  <Input type="number" step="any" value={contactDetails?.map_lng || ''} onChange={(e) => handleInputChange('map_lng', parseFloat(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label>Zoom Level</Label>
                  <Input type="number" value={contactDetails?.map_zoom || ''} onChange={(e) => handleInputChange('map_zoom', parseInt(e.target.value, 10))} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(contactDetails?.business_hours || {}).map(([day, time]) => (
                  <div key={day} className="flex items-center gap-4">
                    <Label className="w-32">{day}</Label>
                    <Input value={time as string} onChange={(e) => handleBusinessHoursChange(day, e.target.value)} />
                  </div>
                ))}
                 <Button type="button" variant="outline" onClick={() => {
                  const newDay = prompt('Enter new day (e.g., Wednesday)');
                  if (newDay) {
                    handleBusinessHoursChange(newDay, '9:00 AM - 5:00 PM');
                  }
                }}>Add Day</Button>
              </CardContent>
            </Card>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminContactPage;