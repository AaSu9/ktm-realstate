import { useState, useEffect, ChangeEvent } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

// Interface now allows for null values, matching the database schema
interface Achievement {
  id: number;
  icon: string | null;
  value: string | null;
  label: string | null;
}

const AdminAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [newAchievement, setNewAchievement] = useState({ icon: '', value: '', label: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    const { data, error } = await supabase.from('achievements').select('*');
    if (data) setAchievements(data as Achievement[]);
    else if (error) toast({ title: 'Error', description: 'Could not load achievements.', variant: 'destructive' });
  };

  const handleSave = async (achievement: Achievement | null) => {
    if (!achievement) return;
    const { id, ...updateData } = achievement;
    const { error } = await supabase.from('achievements').update(updateData).eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Could not save achievement.', variant: 'destructive' });
    } else {
      fetchAchievements();
      setEditingAchievement(null);
      toast({ title: 'Success', description: 'Achievement saved.' });
    }
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from('achievements').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Could not delete achievement.', variant: 'destructive' });
    } else {
      fetchAchievements();
      toast({ title: 'Success', description: 'Achievement deleted.' });
    }
  };

  const handleCreate = async () => {
    // Ensure empty strings are not sent as null if the db expects strings
    const achievementToCreate = {
        icon: newAchievement.icon || null,
        value: newAchievement.value || null,
        label: newAchievement.label || null,
    };
    const { error } = await supabase.from('achievements').insert([achievementToCreate]);
    if (error) {
      toast({ title: 'Error', description: 'Could not create achievement.', variant: 'destructive' });
    } else {
      fetchAchievements();
      setNewAchievement({ icon: '', value: '', label: '' });
      toast({ title: 'Success', description: 'Achievement created.' });
    }
  };
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, field: keyof Omit<Achievement, 'id'>) => {
    if (editingAchievement) {
        setEditingAchievement({ ...editingAchievement, [field]: e.target.value });
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
              {/* Inputs now use '|| ''' to prevent passing null to the value prop */}
              <Input value={(editingAchievement && editingAchievement.id === a.id ? editingAchievement.icon : a.icon) || ''} onChange={(e) => handleInputChange(e, 'icon')} onFocus={() => setEditingAchievement(a)} className="mb-2" />
              <Input value={(editingAchievement && editingAchievement.id === a.id ? editingAchievement.value : a.value) || ''} onChange={(e) => handleInputChange(e, 'value')} onFocus={() => setEditingAchievement(a)} className="mb-2" />
              <Input value={(editingAchievement && editingAchievement.id === a.id ? editingAchievement.label : a.label) || ''} onChange={(e) => handleInputChange(e, 'label')} onFocus={() => setEditingAchievement(a)} className="mb-2" />
              <Button onClick={() => handleSave(editingAchievement)} className="mr-2" disabled={!editingAchievement || editingAchievement.id !== a.id}>Save</Button>
              <Button onClick={() => handleDelete(a.id)} variant="destructive">Delete</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminAchievements;
