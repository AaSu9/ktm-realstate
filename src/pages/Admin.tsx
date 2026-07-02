import { useState, useEffect } from 'react';
import PropertyList from '@/components/admin/PropertyList';
import PropertyForm from '@/components/admin/PropertyForm';
import InquiriesList from '@/components/admin/InquiriesList';
import ContactAdmin from '@/pages/admin/contact';
import AdminStats from '@/pages/admin/stats';
import AdminTestimonials from '@/pages/admin/testimonials';
import AdminValues from '@/pages/admin/values';
import AdminAchievements from '@/pages/admin/achievements';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Building2, 
  MessageSquare, 
  Phone, 
  BarChart2, 
  MessageCircle, 
  Heart, 
  Award, 
  LogOut, 
  Lock,
  Menu,
  X
} from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';

const Admin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('properties');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const fetchData = async () => {
    const { data: propertiesData, error: propertiesError } = await supabase.from('properties').select('*').order('created_at', { ascending: false });
    if (propertiesError) console.error('Error fetching properties:', propertiesError);
    else setProperties(propertiesData);

    const { data: inquiriesData, error: inquiriesError } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
    if (inquiriesError) console.error('Error fetching inquiries:', inquiriesError);
    else setInquiries(inquiriesData);

    setLoading(false);
  };

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    if (isAuthenticated) {
      fetchData();

      // Subscribe to real-time changes
      const propertiesChannel = supabase
        .channel('public:properties')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, () => {
          fetchData(); // Refresh data on any property change
        })
        .subscribe();

      const inquiriesChannel = supabase
        .channel('public:inquiries')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'inquiries' }, () => {
          fetchData(); // Refresh data on any inquiry change
        })
        .subscribe();

      return () => {
        supabase.removeChannel(propertiesChannel);
        supabase.removeChannel(inquiriesChannel);
        subscription.unsubscribe();
      };
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const { toast } = useToast();

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast({ 
        title: 'Validation Error', 
        description: 'Password must be at least 6 characters long.', 
        variant: 'destructive' 
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ 
        title: 'Validation Error', 
        description: 'Passwords do not match.', 
        variant: 'destructive' 
      });
      return;
    }

    setUpdatingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setUpdatingPassword(false);

    if (error) {
      toast({ title: 'Error updating password', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Password updated successfully!' });
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('properties').update({ status }).eq('id', id);
    if (error) {
      console.error('Error updating status:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleToggleFeatured = async (id: string, is_featured: boolean) => {
    const { error } = await supabase.from('properties').update({ is_featured }).eq('id', id);
    if (error) {
      console.error('Error updating featured:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if(window.confirm('Are you sure you want to delete this property?')) {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (error) {
        console.error('Error deleting property:', error);
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        setProperties(properties.filter(p => p.id !== id));
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="flex justify-center mb-6">
            <BrandLogo />
          </div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            Admin Portal
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Secure access for authorized personnel only
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/20">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[#1B3A1F] hover:bg-[#2c5831] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B3A1F] transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
                >
                  Verify Access
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const newInquiriesCount = inquiries.filter((inq: any) => inq.status === 'new' || !inq.status).length;
  const navItems = [
    { id: 'properties', label: 'Properties', icon: Building2 },
    { id: 'inquiries', label: 'Inquiries', icon: MessageSquare, badge: newInquiriesCount },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'stats', label: 'Stats', icon: BarChart2 },
    { id: 'testimonials', label: 'Testimonials', icon: MessageCircle },
    { id: 'values', label: 'Values', icon: Heart },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-gray-900/50 transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#1B3A1F] text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-20 px-6 bg-[#132a15] border-b border-green-800/50">
          <BrandLogo />
          <button className="lg:hidden text-white hover:text-gray-300" onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="px-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setSidebarOpen(false);
                  // When clicking Inquiries, optimistically clear badge immediately
                  // and persist to Supabase in the background
                  if (item.id === 'inquiries' && newInquiriesCount > 0) {
                    // Optimistic update: mark all locally as 'read' so badge clears instantly
                    setInquiries((prev: any[]) =>
                      prev.map((inq) =>
                        inq.status === 'new' || !inq.status ? { ...inq, status: 'read' } : inq
                      )
                    );
                    // Persist to Supabase - mark status='new' as read
                    supabase
                      .from('inquiries')
                      .update({ status: 'read' })
                      .eq('status', 'new')
                      .then(({ error }) => {
                        if (error) console.error('Error marking new inquiries as read:', error);
                      });
                    // Also mark null-status inquiries as read
                    supabase
                      .from('inquiries')
                      .update({ status: 'read' })
                      .is('status', null)
                      .then(({ error }) => {
                        if (error) console.error('Error marking null-status inquiries as read:', error);
                      });
                  }
                }}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  currentTab === item.id
                    ? 'bg-green-600/20 text-green-400 border border-green-500/30 shadow-sm'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${currentTab === item.id ? 'text-green-400' : 'text-gray-400'}`} />
                {item.label}
                {'badge' in item && item.badge > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold min-w-[20px] h-5 flex items-center justify-center px-1.5 rounded-full shadow-lg animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => supabase.auth.signOut()}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-300 rounded-xl hover:bg-red-500/10 hover:text-red-200 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm z-10 border-b border-gray-200 h-20 flex items-center px-4 sm:px-6 lg:px-8 justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="mr-4 text-gray-500 hover:text-gray-700 lg:hidden focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800 capitalize tracking-tight">
              {currentTab.replace('-', ' ')} Dashboard
            </h1>
          </div>
          <div className="flex items-center">
             <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center border border-green-200">
               <span className="text-green-800 font-bold text-sm">AD</span>
             </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {currentTab === 'properties' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <PropertyForm 
                    property={selectedProperty} 
                    onSubmit={() => {
                      setSelectedProperty(null);
                      fetchData();
                    }} 
                    onCancel={() => setSelectedProperty(null)}
                  />
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <PropertyList 
                    properties={properties} 
                    loading={loading} 
                    onEdit={setSelectedProperty} 
                    onUpdateStatus={handleUpdateStatus} 
                    onToggleFeatured={handleToggleFeatured} 
                    onDelete={handleDelete} 
                  />
                </div>
              </div>
            )}

            {currentTab === 'inquiries' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-in fade-in duration-500">
                <InquiriesList loading={loading} inquiries={inquiries} />
              </div>
            )}
            
            {currentTab === 'contact' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-in fade-in duration-500">
                <ContactAdmin />
              </div>
            )}

            {currentTab === 'stats' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-in fade-in duration-500">
                <AdminStats />
              </div>
            )}
            
            {currentTab === 'testimonials' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-in fade-in duration-500">
                <AdminTestimonials />
              </div>
            )}
            
            {currentTab === 'values' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-in fade-in duration-500">
                <AdminValues />
              </div>
            )}
            
            {currentTab === 'achievements' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-in fade-in duration-500">
                <AdminAchievements />
              </div>
            )}

            {currentTab === 'security' && (
              <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-in fade-in duration-500">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-green-50 text-green-700 rounded-xl">
                    <Lock className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>
                    <p className="text-sm text-gray-500">Update your administrator password</p>
                  </div>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-5">
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="new-password"
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
                        placeholder="Min. 6 characters"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirm-password"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
                        placeholder="Re-enter new password"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[#1B3A1F] hover:bg-[#2c5831] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B3A1F] transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {updatingPassword ? 'Updating Password...' : 'Update Password'}
                  </button>
                </form>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
