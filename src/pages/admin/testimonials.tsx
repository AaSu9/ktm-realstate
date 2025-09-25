import { useState, useEffect, ChangeEvent } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface Testimonial {
  id: number;
  name: string | null;
  role: string | null;
  comment: string | null;
  rating: number | null;
}

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [newTestimonial, setNewTestimonial] = useState({ name: '', role: '', comment: '', rating: 5 });
  const { toast } = useToast();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const { data, error } = await supabase.from('testimonials').select('*');
    if (data) setTestimonials(data as Testimonial[]);
    else if (error) toast({ title: 'Error', description: 'Could not load testimonials.', variant: 'destructive' });
  };

  const handleSave = async (testimonial: Testimonial | null) => {
    if (!testimonial) return;
    const { error } = await supabase.from('testimonials').update(testimonial).eq('id', testimonial.id);
    if (error) {
      toast({ title: 'Error', description: 'Could not save testimonial.', variant: 'destructive' });
    } else {
      fetchTestimonials();
      setEditingTestimonial(null);
      toast({ title: 'Success', description: 'Testimonial saved.' });
    }
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Could not delete testimonial.', variant: 'destructive' });
    } else {
      fetchTestimonials();
      toast({ title: 'Success', description: 'Testimonial deleted.' });
    }
  };

  const handleCreate = async () => {
    const testimonialToCreate = {
        name: newTestimonial.name || null,
        role: newTestimonial.role || null,
        comment: newTestimonial.comment || null,
        rating: newTestimonial.rating || null,
    };
    const { error } = await supabase.from('testimonials').insert([testimonialToCreate]);
    if (error) {
      toast({ title: 'Error', description: 'Could not create testimonial.', variant: 'destructive' });
    } else {
      fetchTestimonials();
      setNewTestimonial({ name: '', role: '', comment: '', rating: 5 });
      toast({ title: 'Success', description: 'Testimonial created.' });
    }
  };
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Omit<Testimonial, 'id' | 'rating'>) => {
    if (editingTestimonial) {
        setEditingTestimonial({ ...editingTestimonial, [field]: e.target.value });
    }
  };
  
  const handleRatingChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (editingTestimonial) {
        setEditingTestimonial({ ...editingTestimonial, rating: parseInt(e.target.value) || null });
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Testimonials</h1>

      <Card className="mb-4">
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">New Testimonial</h2>
          <Input placeholder="Name" value={newTestimonial.name} onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })} className="mb-2" />
          <Input placeholder="Role" value={newTestimonial.role} onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })} className="mb-2" />
          <Textarea placeholder="Comment" value={newTestimonial.comment} onChange={(e) => setNewTestimonial({ ...newTestimonial, comment: e.target.value })} className="mb-2" />
          <Input type="number" placeholder="Rating" value={newTestimonial.rating} onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: parseInt(e.target.value) })} className="mb-2" />
          <Button onClick={handleCreate}>Create</Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {testimonials.map(t => (
          <Card key={t.id}>
            <CardContent className="p-4">
              <Input value={(editingTestimonial && editingTestimonial.id === t.id ? editingTestimonial.name : t.name) || ''} onChange={(e) => handleInputChange(e, 'name')} onFocus={() => setEditingTestimonial(t)} className="mb-2" />
              <Input value={(editingTestimonial && editingTestimonial.id === t.id ? editingTestimonial.role : t.role) || ''} onChange={(e) => handleInputChange(e, 'role')} onFocus={() => setEditingTestimonial(t)} className="mb-2" />
              <Textarea value={(editingTestimonial && editingTestimonial.id === t.id ? editingTestimonial.comment : t.comment) || ''} onChange={(e) => handleInputChange(e, 'comment')} onFocus={() => setEditingTestimonial(t)} className="mb-2" />
              <Input type="number" value={(editingTestimonial && editingTestimonial.id === t.id ? editingTestimonial.rating : t.rating) || ''} onChange={handleRatingChange} onFocus={() => setEditingTestimonial(t)} className="mb-2" />
              <Button onClick={() => handleSave(editingTestimonial)} className="mr-2" disabled={!editingTestimonial || editingTestimonial.id !== t.id}>Save</Button>
              <Button onClick={() => handleDelete(t.id)} variant="destructive">Delete</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminTestimonials;
