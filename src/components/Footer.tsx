'use client';

import { Button } from '@/components/ui/button';
import Newsletter from '@/components/Newsletter';
import { BrandLogo } from '@/components/BrandLogo';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Instagram, 
  Youtube,
  MessageCircle
} from 'lucide-react';

interface ContactDetails {
  phone: string;
  address: string;
  facebook: string;
  instagram: string;
  youtube: string;
  whatsapp: string;
}

const Footer = () => {
  const [contactDetails, setContactDetails] = useState<ContactDetails | null>(null);

  useEffect(() => {
    const fetchContactDetails = async () => {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching footer contact details:', error);
      } else {
        setContactDetails(data as unknown as ContactDetails);
      }
    };
    fetchContactDetails();
  }, []);

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Properties', href: '#properties' },
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' }
  ];

  const locations = ['Kathmandu', 'Bhaktapur', 'Lalitpur', 'Pokhara', 'Butwal', 'Chitwan'];

  return (
    <footer className="bg-[#1B3A1F] text-primary-foreground border-t-4 border-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <BrandLogo />
            </div>
            <p className="text-primary-foreground/80 mb-6 leading-relaxed">
              Your trusted partner in Nepal's real estate market. Making property dreams come true since 2008.
            </p>
            
            {contactDetails && (
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-accent mr-3" />
                  <a href={`tel:${contactDetails.phone}`} className="hover:text-accent transition-colors">
                    {contactDetails.phone}
                  </a>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-accent mr-3" />
                  <span>{contactDetails.address}</span>
                </div>
              </div>
            )}

            <div className="flex space-x-3 mt-6">
              <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground" onClick={() => window.open(contactDetails?.facebook, '_blank')} disabled={!contactDetails?.facebook}><Facebook className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground" onClick={() => window.open(contactDetails?.instagram, '_blank')} disabled={!contactDetails?.instagram}><Instagram className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground" onClick={() => window.open(contactDetails?.youtube, '_blank')} disabled={!contactDetails?.youtube}><Youtube className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white" onClick={() => window.open(`https://wa.me/${contactDetails?.whatsapp}`, '_blank')} disabled={!contactDetails?.whatsapp}><MessageCircle className="h-4 w-4" /></Button>
            </div>
          </div>

          {/* Quick Links, Property Types, Newsletter */}
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

          <div>
            <h4 className="text-lg font-semibold mb-6">Property Types</h4>
             <ul className="space-y-3">
                <li><a href="#properties" className="text-primary-foreground/80 hover:text-accent transition-colors duration-300">Houses for Sale</a></li>
                <li><a href="#properties" className="text-primary-foreground/80 hover:text-accent transition-colors duration-300">Apartments</a></li>
                <li><a href="#properties" className="text-primary-foreground/80 hover:text-accent transition-colors duration-300">Land & Plots</a></li>
             </ul>
          </div>

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
              © {new Date().getFullYear()} KTM Realstate. All rights reserved.
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