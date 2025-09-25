import { useState, useEffect, ChangeEvent } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface Stats {
    id: number;
    properties_listed: number | null;
    happy_clients: number | null;
    years_experience: number | null;
}

const AdminStats = () => {
  const [stats, setStats] = useState<Omit<Stats, 'id'>>({ properties_listed: 0, happy_clients: 0, years_experience: 0 });
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase.from('stats').select('*').single();
      if (data) {
        const { id, ...rest } = data;
        setStats(rest);
      } else if (error && error.code !== 'PGRST116') {
        toast({ title: 'Error', description: 'Could not load stats.', variant: 'destructive' });
      }
    };
    fetchStats();
  }, [toast]);

  const handleSave = async () => {
    const { error } = await supabase.from('stats').update(stats).eq('id', 1);
    if (error) {
      toast({ title: 'Error', description: 'Could not save stats.', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Stats saved successfully.' });
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStats(prev => ({ ...prev, [name]: value === '' ? null : parseInt(value, 10) }));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Stats</h1>
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="properties_listed">Properties Listed</label>
              <Input id="properties_listed" name="properties_listed" type="number" value={stats.properties_listed ?? ''} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="happy_clients">Happy Clients</label>
              <Input id="happy_clients" name="happy_clients" type="number" value={stats.happy_clients ?? ''} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="years_experience">Years Experience</label>
              <Input id="years_experience" name="years_experience" type="number" value={stats.years_experience ?? ''} onChange={handleChange} />
            </div>
          </div>
          <Button onClick={handleSave} className="mt-4">Save</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStats;
