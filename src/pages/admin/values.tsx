import { useState, useEffect, ChangeEvent } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface CompanyValue {
  id: number;
  icon: string | null;
  title: string | null;
  description: string | null;
}

const AdminValues = () => {
  const [values, setValues] = useState<CompanyValue[]>([]);
  const [editingValue, setEditingValue] = useState<CompanyValue | null>(null);
  const [newValue, setNewValue] = useState({ icon: '', title: '', description: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchValues();
  }, []);

  const fetchValues = async () => {
    const { data, error } = await supabase.from('company_values').select('*');
    if (data) setValues(data as CompanyValue[]);
    else if (error) toast({ title: 'Error', description: 'Could not load values.', variant: 'destructive' });
  };

  const handleSave = async (value: CompanyValue | null) => {
    if (!value) return;
    const { error } = await supabase.from('company_values').update(value).eq('id', value.id);
    if (error) {
      toast({ title: 'Error', description: 'Could not save value.', variant: 'destructive' });
    } else {
      fetchValues();
      setEditingValue(null);
      toast({ title: 'Success', description: 'Value saved.' });
    }
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from('company_values').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Could not delete value.', variant: 'destructive' });
    } else {
      fetchValues();
      toast({ title: 'Success', description: 'Value deleted.' });
    }
  };

  const handleCreate = async () => {
    const valueToCreate = {
        icon: newValue.icon || null,
        title: newValue.title || null,
        description: newValue.description || null,
    };
    const { error } = await supabase.from('company_values').insert([valueToCreate]);
    if (error) {
      toast({ title: 'Error', description: 'Could not create value.', variant: 'destructive' });
    } else {
      fetchValues();
      setNewValue({ icon: '', title: '', description: '' });
      toast({ title: 'Success', description: 'Value created.' });
    }
  };
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Omit<CompanyValue, 'id'>) => {
    if (editingValue) {
        setEditingValue({ ...editingValue, [field]: e.target.value });
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Company Values</h1>

      <Card className="mb-4">
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">New Value</h2>
          <Input placeholder="Icon (e.g., Shield)" value={newValue.icon} onChange={(e) => setNewValue({ ...newValue, icon: e.target.value })} className="mb-2" />
          <Input placeholder="Title" value={newValue.title} onChange={(e) => setNewValue({ ...newValue, title: e.target.value })} className="mb-2" />
          <Textarea placeholder="Description" value={newValue.description} onChange={(e) => setNewValue({ ...newValue, description: e.target.value })} className="mb-2" />
          <Button onClick={handleCreate}>Create</Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {values.map(v => (
          <Card key={v.id}>
            <CardContent className="p-4">
              <Input value={(editingValue && editingValue.id === v.id ? editingValue.icon : v.icon) || ''} onChange={(e) => handleInputChange(e, 'icon')} onFocus={() => setEditingValue(v)} className="mb-2" />
              <Input value={(editingValue && editingValue.id === v.id ? editingValue.title : v.title) || ''} onChange={(e) => handleInputChange(e, 'title')} onFocus={() => setEditingValue(v)} className="mb-2" />
              <Textarea value={(editingValue && editingValue.id === v.id ? editingValue.description : v.description) || ''} onChange={(e) => handleInputChange(e, 'description')} onFocus={() => setEditingValue(v)} className="mb-2" />
              <Button onClick={() => handleSave(editingValue)} className="mr-2" disabled={!editingValue || editingValue.id !== v.id}>Save</Button>
              <Button onClick={() => handleDelete(v.id)} variant="destructive">Delete</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminValues;
