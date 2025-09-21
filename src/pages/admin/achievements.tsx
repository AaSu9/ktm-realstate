'''import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const AdminAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState({ icon: '', value: '', label: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    const { data, error } = await supabase.from('achievements').select('*');
    if (data) setAchievements(data);
    else if (error) toast({ title: 'Error', description: 'Could not load achievements.', variant: 'destructive' });
  };

  const handleSave = async (achievement) => {
    const { error } = await supabase.from('achievements').update(achievement).eq('id', achievement.id);
    if (error) toast({ title: 'Error', description: 'Could not save achievement.', variant: 'destructive' });
    else toast({ title: 'Success', description: 'Achievement saved.' });
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('achievements').delete().eq('id', id);
    if (error) toast({ title: 'Error', description: 'Could not delete achievement.', variant: 'destructive' });
    else {
      fetchAchievements();
      toast({ title: 'Success', description: 'Achievement deleted.' });
    }
  };

  const handleCreate = async () => {
    const { error } = await supabase.from('achievements').insert([newAchievement]);
    if (error) toast({ title: 'Error', description: 'Could not create achievement.', variant: 'destructive' });
    else {
      fetchAchievements();
      setNewAchievement({ icon: '', value: '', label: '' });
      toast({ title: 'Success', description: 'Achievement created.' });
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Achievements</h1>

      <Card className="mb-4">
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">New Achievement</h2>
          <Input placeholder="Icon (e.g., Building)" value={newAchievement.icon} onChange={(e) => setNewAchievement({ ...newAchievement, icon: e.target.value })} className="mb-2" />
          <Input placeholder="Value (e.g., 500+)" value={newAchievement.value} onChange={(e) => setNewAchievement({ ...newAchievement, value: e.target.value })} className="mb-2" />
          <Input placeholder="Label (e.g., Properties Sold)" value={newAchievement.label} onChange={(e) => setNewAchievement({ ...newAchievement, label: e.target.value })} className="mb-2" />
          <Button onClick={handleCreate}>Create</Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {achievements.map(a => (
          <Card key={a.id}>
            <CardContent className="p-4">
              <Input value={a.icon} onChange={(e) => setAchievements(achievements.map(i => i.id === a.id ? { ...i, icon: e.target.value } : i))} className="mb-2" />
              <Input value={a.value} onChange={(e) => setAchievements(achievements.map(i => i.id === a.id ? { ...i, value: e.target.value } : i))} className="mb-2" />
              <Input value={a.label} onChange={(e) => setAchievements(achievements.map(i => i.id === a.id ? { ...i, label: e.target.value } : i))} className="mb-2" />
              <Button onClick={() => handleSave(a)} className="mr-2">Save</Button>
              <Button onClick={() => handleDelete(a.id)} variant="destructive">Delete</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminAchievements;'''