'use client';

import { Button } from '@/components/ui/button';
import Newsletter from '@/components/Newsletter';
import { BrandLogo } from '@/components/BrandLogo';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Youtube,
  MessageCircle,
  Building2
} from 'lucide-react';

interface ContactBranch {
  id: number;
  branch_name?: string | null;
  phone: string | null;
  address: string | null;
  facebook: string | null;
  instagram: string | null;
  youtube: string | null;
  whatsapp: string | null;
}

const Footer = () => {
  const [branches, setBranches] = useState<ContactBranch[]>([]);

  useEffect(() => {
    const fetchBranches = async () => {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('id', { ascending: true });

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching footer contact details:', error);
      } else if (data) {
        setBranches(data as ContactBranch[]);
      }
    };
    fetchBranches();
  }, []);

  // Use the first branch for social media links
  const primaryBranch = branches[0] ?? null;

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Properties', href: '#properties' },
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <footer className="bg-[#1B3A1F] text-primary-foreground border-t-4 border-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info + Branches */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <BrandLogo />
            </div>
            <p className="text-primary-foreground/80 mb-6 leading-relaxed">
              Your trusted partner in Nepal's real estate market. Making property dreams come true since 2008.
            </p>
            
            {/* Multi-branch addresses */}
            {branches.length > 0 && (
              <div className="space-y-4 mb-6">
                {branches.map((branch, idx) => (
                  <div key={branch.id} className="space-y-1.5">
                    {/* Branch label */}
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-accent flex-shrink-0" />
                      <span className="text-accent text-sm font-semibold">
                        {branch.branch_name || (idx === 0 ? 'Head Office' : `Branch ${idx + 1}`)}
                      </span>
                    </div>
                    {branch.address && (
                      <div className="flex items-start gap-2 pl-6">
                        <MapPin className="h-4 w-4 text-primary-foreground/60 flex-shrink-0 mt-0.5" />
                        {branch.address.startsWith('http') ? (
                          <a href={branch.address} target="_blank" rel="noreferrer" className="text-primary-foreground/80 text-sm hover:text-accent transition-colors break-all">
                            View on Google Maps
                          </a>
                        ) : (
                          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}`} target="_blank" rel="noreferrer" className="text-primary-foreground/80 text-sm hover:text-accent transition-colors">
                            {branch.address}
                          </a>
                        )}
                      </div>
                    )}
                    {branch.phone && (
                      <div className="flex items-center gap-2 pl-6">
                        <Phone className="h-4 w-4 text-primary-foreground/60 flex-shrink-0" />
                        <a href={`tel:${branch.phone}`} className="text-primary-foreground/80 text-sm hover:text-accent transition-colors">
                          {branch.phone}
                        </a>
                      </div>
                    )}
                    {/* Social Media for this branch */}
                    <div className="flex space-x-3 pl-6 pt-2">
                      {branch.whatsapp && (
                        <a href={`https://wa.me/${branch.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="text-primary-foreground/60 hover:text-green-500 transition-colors" title="WhatsApp">
                          <MessageCircle className="h-4 w-4" />
                        </a>
                      )}
                      {branch.facebook && (
                        <a href={branch.facebook} target="_blank" rel="noreferrer" className="text-primary-foreground/60 hover:text-[#1877F2] transition-colors" title="Facebook">
                          <Facebook className="h-4 w-4" />
                        </a>
                      )}
                      {branch.instagram && (
                        <a href={branch.instagram} target="_blank" rel="noreferrer" className="text-primary-foreground/60 hover:text-[#E4405F] transition-colors" title="Instagram">
                          <Instagram className="h-4 w-4" />
                        </a>
                      )}
                      {branch.youtube && (
                        <a href={branch.youtube} target="_blank" rel="noreferrer" className="text-primary-foreground/60 hover:text-[#FF0000] transition-colors" title="YouTube">
                          <Youtube className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-primary-foreground/80 hover:text-accent transition-colors duration-300">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Property Types</h4>
            <ul className="space-y-3">
              <li><a href="#properties" className="text-primary-foreground/80 hover:text-accent transition-colors duration-300">Houses for Sale</a></li>
              <li><a href="#properties" className="text-primary-foreground/80 hover:text-accent transition-colors duration-300">Apartments</a></li>
              <li><a href="#properties" className="text-primary-foreground/80 hover:text-accent transition-colors duration-300">Land & Plots</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Stay Updated</h4>
            <p className="text-primary-foreground/80 mb-4">Get the latest listings and market updates.</p>
            <Newsletter />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-primary-foreground/80 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} KTM Realstate. All rights reserved. • AAN creator💚
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">Privacy Policy</a>
              <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;