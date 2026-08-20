import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { Mail, Phone, User as UserIcon, Facebook, Instagram } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Agent {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  isActive: boolean;
  designation?: string;
  bio?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  whatsappNumber?: string;
  showOnWebsite?: boolean;
}

const Agents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const { data, error } = await supabase
          .from('User' as keyof Database['public']['Tables'])
          .select('id, name, email, phone, avatar, role, isActive, designation, bio, facebookUrl, instagramUrl, whatsappNumber, showOnWebsite')
          .eq('isActive', true)
          .eq('showOnWebsite', true);

        if (error) throw error;
        setAgents((data as unknown as Agent[]) || []);
      } catch (err) {
        console.error('Error fetching agents:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  if (loading) {
    return (
      <section id="agents" className="py-20 bg-background/50 border-t border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
          Loading our team of professional agents...
        </div>
      </section>
    );
  }

  if (agents.length === 0) {
    const fallbackAgents = [
      {
        id: '1',
        name: 'Raj Kumar Sharma',
        email: 'raj@ktmrealstate.com',
        phone: '+977-9812345678',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
        role: 'AGENT',
        designation: 'Co-Founder & CEO',
        bio: 'Over 10 years of experience in real estate transactions in Kathmandu valley.'
      },
      {
        id: '2',
        name: 'Priya Thapa',
        email: 'priya@ktmrealstate.com',
        phone: '+977-9822345678',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
        role: 'AGENT',
        designation: 'Senior Property Consultant',
        bio: 'Specialist in luxury apartments and commercial renting.'
      },
      {
        id: '3',
        name: 'Aashish Ghimire',
        email: 'aashish@ktmrealstate.com',
        phone: '+977-9841234567',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
        role: 'AGENT',
        designation: 'Land & Legal Expert',
        bio: 'Handles legal compliance and land validation assessments.'
      }
    ];

    return (
      <section id="agents" className="py-20 bg-background/50 border-t border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our dedicated professionals are here to guide you through Nepal's real estate market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {fallbackAgents.map((agent) => (
              <Card key={agent.id} className="property-card overflow-hidden transition-all hover:shadow-lg rounded-2xl border-border bg-card">
                <CardContent className="p-0">
                  <div className="h-64 overflow-hidden relative bg-muted flex items-center justify-center">
                    {agent.avatar ? (
                      <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    ) : (
                      <UserIcon className="h-16 w-16 text-muted-foreground" />
                    )}
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h4 className="font-bold text-xl text-foreground">{agent.name}</h4>
                      <p className="text-sm font-semibold text-accent mt-0.5">{agent.designation}</p>
                      {agent.bio && (
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-3 italic">
                          "{agent.bio}"
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground pt-2 border-t border-border/50">
                      <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${agent.email}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-accent transition-colors">
                        <Mail className="h-4 w-4 text-accent flex-shrink-0" />
                        <span className="truncate">{agent.email}</span>
                      </a>
                      {agent.phone && (
                        <a href={`https://wa.me/${agent.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-accent transition-colors">
                          <Phone className="h-4 w-4 text-accent flex-shrink-0" />
                          <span>{agent.phone}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="agents" className="py-20 bg-background/50 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Meet Our Team</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our dedicated professionals are here to guide you through Nepal's real estate market.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {agents.map((agent) => (
            <Card key={agent.id} className="property-card overflow-hidden transition-all hover:shadow-lg rounded-2xl border-border bg-card">
              <CardContent className="p-0">
                <div className="h-64 overflow-hidden relative bg-muted flex items-center justify-center">
                  {agent.avatar ? (
                    <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                  ) : (
                    <UserIcon className="h-16 w-16 text-muted-foreground" />
                  )}
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h4 className="font-bold text-xl text-foreground">{agent.name}</h4>
                    <p className="text-sm font-semibold text-accent mt-0.5">
                      {agent.designation || 'Real Estate Consultant'}
                    </p>
                    {agent.bio && (
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-3 bg-muted/20 p-2 rounded-lg italic">
                        "{agent.bio}"
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm text-muted-foreground pt-2 border-t border-border/50">
                    <a href={`mailto:${agent.email}`} className="flex items-center gap-2 hover:text-accent transition-colors">
                      <Mail className="h-4 w-4 text-accent flex-shrink-0" />
                      <span className="truncate">{agent.email}</span>
                    </a>
                    {agent.phone && (
                      <a href={`tel:${agent.phone}`} className="flex items-center gap-2 hover:text-accent transition-colors">
                        <Phone className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>{agent.phone}</span>
                      </a>
                    )}
                  </div>

                  {/* Social Links */}
                  {(agent.facebookUrl || agent.instagramUrl || agent.whatsappNumber) && (
                    <div className="flex items-center gap-3 pt-2 border-t border-border/30">
                      {agent.whatsappNumber && (
                        <a href={`https://wa.me/${agent.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors" title="WhatsApp">
                          <Phone className="h-4 w-4" />
                        </a>
                      )}
                      {agent.facebookUrl && (
                        <a href={agent.facebookUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors" title="Facebook">
                          <Facebook className="h-4 w-4" />
                        </a>
                      )}
                      {agent.instagramUrl && (
                        <a href={agent.instagramUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-600 transition-colors" title="Instagram">
                          <Instagram className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Agents;

