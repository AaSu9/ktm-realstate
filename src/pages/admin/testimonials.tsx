'''import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [newTestimonial, setNewTestimonial] = useState({ name: '', role: '', comment: '', rating: 5 });
  const { toast } = useToast();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const { data, error } = await supabase.from('testimonials').select('*');
    if (data) setTestimonials(data);
    else if (error) toast({ title: 'Error', description: 'Could not load testimonials.', variant: 'destructive' });
  };

  const handleSave = async (testimonial) => {
    const { error } = await supabase.from('testimonials').update(testimonial).eq('id', testimonial.id);
    if (error) toast({ title: 'Error', description: 'Could not save testimonial.', variant: 'destructive' });
    else toast({ title: 'Success', description: 'Testimonial saved.' });
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) toast({ title: 'Error', description: 'Could not delete testimonial.', variant: 'destructive' });
    else {
      fetchTestimonials();
      toast({ title: 'Success', description: 'Testimonial deleted.' });
    }
  };

  const handleCreate = async () => {
    const { error } = await supabase.from('testimonials').insert([newTestimonial]);
    if (error) toast({ title: 'Error', description: 'Could not create testimonial.', variant: 'destructive' });
    else {
      fetchTestimonials();
      setNewTestimonial({ name: '', role: '', comment: '', rating: 5 });
      toast({ title: 'Success', description: 'Testimonial created.' });
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Testimonials</h1>

      {/* Create New */}
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

      {/* Existing Testimonials */}
      <div className="space-y-4">
        {testimonials.map(t => (
          <Card key={t.id}>
            <CardContent className="p-4">
              <Input value={t.name} onChange={(e) => setTestimonials(testimonials.map(i => i.id === t.id ? { ...i, name: e.target.value } : i))} className="mb-2" />
              <Input value={t.role} onChange={(e) => setTestimonials(testimonials.map(i => i.id === t.id ? { ...i, role: e.target.value } : i))} className="mb-2" />
              <Textarea value={t.comment} onChange={(e) => setTestimonials(testimonials.map(i => i.id === t.id ? { ...i, comment: e.target.value } : i))} className="mb-2" />
              <Input type="number" value={t.rating} onChange={(e) => setTestimonials(testimonials.map(i => i.id === t.id ? { ...i, rating: parseInt(e.target.value) } : i))} className="mb-2" />
              <Button onClick={() => handleSave(t)} className="mr-2">Save</Button>
              <Button onClick={() => handleDelete(t.id)} variant="destructive">Delete</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminTestimonials;'''