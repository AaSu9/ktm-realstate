'use client';

import { Button } from '@/components/ui/button';
import Newsletter from '@/components/Newsletter';
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
  email: string;
  address: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  whatsapp_number: string;
}

const Footer = () => {
  const [contactDetails, setContactDetails] = useState<ContactDetails | null>(null);

  useEffect(() => {
    const fetchContactDetails = async () => {
      const { data, error } = await supabase
        .from('contact_details')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching footer contact details:', error);
      } else {
        setContactDetails(data as ContactDetails);
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
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold bg-accent-gradient bg-clip-text text-transparent mb-4">
              KTM Realstate
            </h3>
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
                  <Mail className="h-5 w-5 text-accent mr-3" />
                  <a href={`mailto:${contactDetails.email}`} className="hover:text-accent transition-colors">
                    {contactDetails.email}
                  </a>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-accent mr-3" />
                  <span>{contactDetails.address}</span>
                </div>
              </div>
            )}

            <div className="flex space-x-3 mt-6">
              <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground" onClick={() => window.open(contactDetails?.facebook_url, '_blank')} disabled={!contactDetails?.facebook_url}><Facebook className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground" onClick={() => window.open(contactDetails?.instagram_url, '_blank')} disabled={!contactDetails?.instagram_url}><Instagram className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground" onClick={() => window.open(contactDetails?.youtube_url, '_blank')} disabled={!contactDetails?.youtube_url}><Youtube className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white" onClick={() => window.open(`https://wa.me/${contactDetails?.whatsapp_number}`, '_blank')} disabled={!contactDetails?.whatsapp_number}><MessageCircle className="h-4 w-4" /></Button>
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
            <div className="mt-6">
              <h5 className="font-medium mb-3">Popular Locations</h5>
              <div className="flex flex-wrap gap-2">
                {locations.map((location) => (
                  <span key={location} className="px-2 py-1 bg-primary-foreground/10 rounded text-xs text-primary-foreground/80 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors" onClick={() => window.open(`https://www.google.com/maps/search/properties+in+${location}+Nepal`, '_blank')}>{location}</span>
                ))}
              </div>
            </div>
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
              <a href="/admin" className="text-primary-foreground/60 hover:text-accent transition-colors text-xs">Admin</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;