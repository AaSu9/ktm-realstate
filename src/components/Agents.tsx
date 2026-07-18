import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Phone, User as UserIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Agent {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  isActive: boolean;
}

const Agents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('User')
          .select('id, name, email, phone, avatar, role, isActive')
          .eq('role', 'AGENT')
          .eq('isActive', true);

        if (error) throw error;
        setAgents(data || []);
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
        role: 'AGENT'
      },
      {
        id: '2',
        name: 'Priya Thapa',
        email: 'priya@ktmrealstate.com',
        phone: '+977-9822345678',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
        role: 'AGENT'
      },
      {
        id: '3',
        name: 'Aashish Ghimire',
        email: 'aashish@ktmrealstate.com',
        phone: '+977-9841234567',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
        role: 'AGENT'
      }
    ];

    return (
      <section id="agents" className="py-20 bg-background/50 border-t border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Meet Our Agents</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our dedicated professionals are here to help you guide through Nepal's real estate market.
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
                      <p className="text-sm font-semibold text-accent mt-0.5">Real Estate Consultant</p>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground pt-2 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-accent flex-shrink-0" />
                        <span className="truncate">{agent.email}</span>
                      </div>
                      {agent.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-accent flex-shrink-0" />
                          <span>{agent.phone}</span>
                        </div>
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
          <h2 className="text-4xl font-bold text-foreground mb-4">Meet Our Agents</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our dedicated professionals are here to help you guide through Nepal's real estate market.
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
                    <p className="text-sm font-semibold text-accent mt-0.5">Real Estate Consultant</p>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground pt-2 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-accent flex-shrink-0" />
                      <span className="truncate">{agent.email}</span>
                    </div>
                    {agent.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>{agent.phone}</span>
                      </div>
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
};

export default Agents;
