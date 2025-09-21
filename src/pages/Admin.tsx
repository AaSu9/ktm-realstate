import { useState, useEffect } from 'react';
import PropertyList from '@/components/admin/PropertyList';
import PropertyForm from '@/components/admin/PropertyForm';
import InquiriesList from '@/components/admin/InquiriesList';
import ContactAdmin from '@/pages/admin/contact'; // Import the new component
import AdminStats from '@/pages/admin/stats';
import AdminTestimonials from '@/pages/admin/testimonials';
import AdminValues from '@/pages/admin/values';
import AdminAchievements from '@/pages/admin/achievements';
import { supabase } from '@/integrations/supabase/client';

const ADMIN_SECRET = "2059asis@#"; // Replace with an environment variable

const Admin = () => {
  const [secret, setSecret] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('properties');

  useEffect(() => {
    const fetchData = async () => {
      const { data: propertiesData, error: propertiesError } = await supabase.from('properties').select('*');
      if (propertiesError) console.error('Error fetching properties:', propertiesError);
      else setProperties(propertiesData);

      const { data: inquiriesData, error: inquiriesError } = await supabase.from('inquiries').select('*');
      if (inquiriesError) console.error('Error fetching inquiries:', inquiriesError);
      else setInquiries(inquiriesData);

      setLoading(false);
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (secret === ADMIN_SECRET) {
      setIsAuthenticated(true);
    } else {
      alert('Invalid secret');
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('properties').update({ status }).eq('id', id);
    if (error) console.error('Error updating status:', error);
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    const { error } = await supabase.from('properties').update({ featured }).eq('id', id);
    if (error) console.error('Error updating featured:', error);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('properties').delete().eq('id', id);
    if (error) console.error('Error deleting property:', error);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-4 bg-white rounded shadow-md">
          <h1 className="mb-4 text-xl font-bold">Admin Login</h1>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            placeholder="Enter admin secret"
          />
          <button
            onClick={handleLogin}
            className="w-full px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>

      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 text-lg font-semibold ${currentTab === 'properties' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setCurrentTab('properties')}
        >
          Properties
        </button>
        <button
          className={`px-4 py-2 text-lg font-semibold ${currentTab === 'inquiries' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setCurrentTab('inquiries')}
        >
          Inquiries
        </button>
        <button
          className={`px-4 py-2 text-lg font-semibold ${currentTab === 'contact' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setCurrentTab('contact')}
        >
          Contact
        </button>
        <button
          className={`px-4 py-2 text-lg font-semibold ${currentTab === 'stats' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setCurrentTab('stats')}
        >
          Stats
        </button>
        <button
          className={`px-4 py-2 text-lg font-semibold ${currentTab === 'testimonials' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setCurrentTab('testimonials')}
        >
          Testimonials
        </button>
        <button
          className={`px-4 py-2 text-lg font-semibold ${currentTab === 'values' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setCurrentTab('values')}
        >
          Values
        </button>
        <button
          className={`px-4 py-2 text-lg font-semibold ${currentTab === 'achievements' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setCurrentTab('achievements')}
        >
          Achievements
        </button>
      </div>

      {currentTab === 'properties' && (
        <div>
          <PropertyForm 
            property={selectedProperty} 
            onSubmit={() => setSelectedProperty(null)} 
            onCancel={() => setSelectedProperty(null)}
          />
          <PropertyList 
            properties={properties} 
            loading={loading} 
            onEdit={setSelectedProperty} 
            onUpdateStatus={handleUpdateStatus} 
            onToggleFeatured={handleToggleFeatured} 
            onDelete={handleDelete} 
          />
        </div>
      )}

      {currentTab === 'inquiries' && (
        <InquiriesList inquiries={inquiries} loading={loading} />
      )}
      
      {currentTab === 'contact' && (
        <ContactAdmin />
      )}

      {currentTab === 'stats' && <AdminStats />}
      {currentTab === 'testimonials' && <AdminTestimonials />}
      {currentTab === 'values' && <AdminValues />}
      {currentTab === 'achievements' && <AdminAchievements />}
    </div>
  );
};

export default Admin;
