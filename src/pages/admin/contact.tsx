import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Edit2, Save, X, Building2, Phone, MessageCircle, Facebook, Instagram, Youtube, MapPin } from 'lucide-react';

interface ContactBranch {
  id?: number;
  branch_name?: string | null;
  address: string | null;
  phone: string | null;
  whatsapp: string | null;
  facebook: string | null;
  instagram: string | null;
  youtube: string | null;
  youtube_api_key: string | null;
  youtube_channel_id: string | null;
}

const emptyBranch = (): ContactBranch => ({
  branch_name: '',
  address: '',
  phone: '',
  whatsapp: '',
  facebook: '',
  instagram: '',
  youtube: '',
  youtube_api_key: '',
  youtube_channel_id: '',
});

const ContactAdmin = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState<ContactBranch[]>([]);
  const [editingId, setEditingId] = useState<number | 'new' | null>(null);
  const [editForm, setEditForm] = useState<ContactBranch>(emptyBranch());
  const [saving, setSaving] = useState(false);

  const fetchBranches = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching branches:', error);
      toast({ title: 'Error', description: 'Could not fetch branch contacts.', variant: 'destructive' });
    } else {
      setBranches((data as ContactBranch[]) || []);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const handleEdit = (branch: ContactBranch) => {
    setEditingId(branch.id!);
    setEditForm({ ...branch });
  };

  const handleAddNew = () => {
    setEditingId('new');
    setEditForm(emptyBranch());
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm(emptyBranch());
  };

  const handleSave = async () => {
    setSaving(true);
    const dataToSave = Object.fromEntries(
      Object.entries(editForm).map(([k, v]) => [k, v === '' ? null : v])
    );

    if (editingId === 'new') {
      const { data, error } = await supabase.from('contacts').insert([dataToSave]).select();
      if (error) {
        toast({ title: 'Error', description: `Failed to add branch: ${error.message}`, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'New branch added successfully!' });
        setBranches(prev => [...prev, ...(data as ContactBranch[])]);
        setEditingId(null);
      }
    } else {
      const { error } = await supabase.from('contacts').update(dataToSave).eq('id', editingId!);
      if (error) {
        toast({ title: 'Error', description: `Failed to update branch: ${error.message}`, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Branch updated successfully!' });
        setBranches(prev => prev.map(b => b.id === editingId ? { ...b, ...editForm } : b));
        setEditingId(null);
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this branch?')) return;
    const { error } = await supabase.from('contacts').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: `Failed to delete branch: ${error.message}`, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Branch deleted.' });
      setBranches(prev => prev.filter(b => b.id !== id));
    }
  };

  const BranchForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
      <div className="space-y-1">
        <Label htmlFor="branch_name" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Branch Name</Label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input id="branch_name" className="pl-9" placeholder="e.g. Kathmandu Head Office" value={editForm.branch_name || ''} onChange={e => setEditForm(p => ({ ...p, branch_name: e.target.value }))} />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="address" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input id="address" className="pl-9" placeholder="Full address" value={editForm.address || ''} onChange={e => setEditForm(p => ({ ...p, address: e.target.value }))} />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="phone" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone Number</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input id="phone" className="pl-9" placeholder="+977-XXX-XXXXXXX" value={editForm.phone || ''} onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))} />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="whatsapp" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">WhatsApp Number</Label>
        <div className="relative">
          <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input id="whatsapp" className="pl-9" placeholder="e.g. 9779812345678" value={editForm.whatsapp || ''} onChange={e => setEditForm(p => ({ ...p, whatsapp: e.target.value }))} />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="facebook" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Facebook URL</Label>
        <div className="relative">
          <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input id="facebook" className="pl-9" placeholder="https://facebook.com/..." value={editForm.facebook || ''} onChange={e => setEditForm(p => ({ ...p, facebook: e.target.value }))} />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="instagram" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Instagram URL</Label>
        <div className="relative">
          <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input id="instagram" className="pl-9" placeholder="https://instagram.com/..." value={editForm.instagram || ''} onChange={e => setEditForm(p => ({ ...p, instagram: e.target.value }))} />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="youtube" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">YouTube Channel URL</Label>
        <div className="relative">
          <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input id="youtube" className="pl-9" placeholder="https://youtube.com/..." value={editForm.youtube || ''} onChange={e => setEditForm(p => ({ ...p, youtube: e.target.value }))} />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="youtube_api_key" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">YouTube API Key</Label>
        <Input id="youtube_api_key" placeholder="Optional" value={editForm.youtube_api_key || ''} onChange={e => setEditForm(p => ({ ...p, youtube_api_key: e.target.value }))} />
      </div>
      <div className="space-y-1 md:col-span-2">
        <Label htmlFor="youtube_channel_id" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">YouTube Channel ID</Label>
        <Input id="youtube_channel_id" placeholder="Optional" value={editForm.youtube_channel_id || ''} onChange={e => setEditForm(p => ({ ...p, youtube_channel_id: e.target.value }))} />
      </div>
      <div className="md:col-span-2 flex gap-3 pt-2">
        <Button onClick={handleSave} disabled={saving} className="bg-[#1B3A1F] hover:bg-[#2c5831] text-white">
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Branch'}
        </Button>
        <Button variant="outline" onClick={handleCancel}>
          <X className="h-4 w-4 mr-2" /> Cancel
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map(i => (
          <div key={i} className="animate-pulse h-24 bg-gray-100 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Branch Contacts</h2>
          <p className="text-sm text-gray-500 mt-1">Manage contact details for all your branches. Social media from the first branch shows in the website footer.</p>
        </div>
        {editingId !== 'new' && (
          <Button onClick={handleAddNew} className="bg-[#1B3A1F] hover:bg-[#2c5831] text-white gap-2">
            <Plus className="h-4 w-4" /> Add Branch
          </Button>
        )}
      </div>

      {/* New Branch Form */}
      {editingId === 'new' && (
        <div className="border border-green-200 bg-green-50/30 rounded-2xl p-4">
          <h3 className="text-base font-semibold text-gray-700 mb-1 flex items-center gap-2">
            <Plus className="h-4 w-4 text-green-600" /> New Branch
          </h3>
          <BranchForm />
        </div>
      )}

      {/* Existing Branches */}
      {branches.length === 0 && editingId !== 'new' && (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
          <Building2 className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No branches yet.</p>
          <p className="text-gray-400 text-sm">Click "Add Branch" to add your first branch contact.</p>
        </div>
      )}

      <div className="space-y-4">
        {branches.map((branch, idx) => (
          <div key={branch.id} className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#1B3A1F]/5 to-transparent border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-[#1B3A1F]/10 flex items-center justify-center text-[#1B3A1F] font-bold text-sm">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{branch.branch_name || `Branch ${idx + 1}`}</h3>
                  {idx === 0 && (
                    <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">Primary Branch</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {editingId !== branch.id && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(branch)} className="gap-1 text-xs">
                      <Edit2 className="h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(branch.id!)} className="gap-1 text-xs text-red-500 hover:text-red-700 hover:border-red-300">
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </Button>
                  </>
                )}
              </div>
            </div>

            {editingId === branch.id ? (
              <div className="p-4">
                <BranchForm />
              </div>
            ) : (
              <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600">
                {branch.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>{branch.address}</span>
                  </div>
                )}
                {branch.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span>{branch.phone}</span>
                  </div>
                )}
                {branch.whatsapp && (
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span>{branch.whatsapp}</span>
                  </div>
                )}
                {branch.facebook && (
                  <div className="flex items-center gap-2">
                    <Facebook className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{branch.facebook}</span>
                  </div>
                )}
                {branch.instagram && (
                  <div className="flex items-center gap-2">
                    <Instagram className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{branch.instagram}</span>
                  </div>
                )}
                {branch.youtube && (
                  <div className="flex items-center gap-2">
                    <Youtube className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{branch.youtube}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactAdmin;
