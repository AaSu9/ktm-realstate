import { Button } from '@/components/ui/button';
import Newsletter from '@/components/Newsletter';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Instagram, 
  Youtube,
  MessageCircle
} from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Properties', href: '#properties' },
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' }
  ];

  const propertyTypes = [
    'Houses for Sale',
    'Apartments',
    'Commercial Properties',
    'Land & Plots',
    'Rental Properties',
    'Investment Properties'
  ];

  const locations = [
    'Kathmandu',
    'Bhaktapur',
    'Lalitpur',
    'Pokhara',
    'Butwal',
    'Chitwan'
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold bg-accent-gradient bg-clip-text text-transparent mb-4">
              KTM Realstate
            </h3>
            <p className="text-primary-foreground/80 mb-6 leading-relaxed">
              Your trusted partner in Nepal's real estate market. Making property dreams come true since 2008.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-accent mr-3" />
                <a href="tel:+9779741690374" className="hover:text-accent transition-colors">
                  +977 974-1690374
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-accent mr-3" />
                <a href="mailto:sumanghimire138@gmail.com" className="hover:text-accent transition-colors">
                  sumanghimire138@gmail.com
                </a>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-accent mr-3" />
                <span>New Baneshwor, Kathmandu</span>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                onClick={() => window.open('https://facebook.com', '_blank')}
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                onClick={() => window.open('https://instagram.com', '_blank')}
              >
                <Instagram className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                onClick={() => window.open('https://youtube.com', '_blank')}
              >
                <Youtube className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                onClick={() => window.open('https://wa.me/9779741690374', '_blank')}
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-accent transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Property Types</h4>
            <ul className="space-y-3">
              {propertyTypes.map((type) => (
                <li key={type}>
                  <a 
                    href="#properties"
                    className="text-primary-foreground/80 hover:text-accent transition-colors duration-300"
                  >
                    {type}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Stay Updated</h4>
            <p className="text-primary-foreground/80 mb-4">
              Subscribe to get the latest property listings and market updates.
            </p>
            
            <Newsletter />

            <div className="mt-6">
              <h5 className="font-medium mb-3">Popular Locations</h5>
              <div className="flex flex-wrap gap-2">
                {locations.map((location) => (
                  <span 
                    key={location}
                    className="px-2 py-1 bg-primary-foreground/10 rounded text-xs text-primary-foreground/80 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
                    onClick={() => window.open(`https://www.google.com/maps/search/properties+in+${location}+Nepal`, '_blank')}
                  >
                    {location}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-primary-foreground/80 text-sm mb-4 md:mb-0">
              © 2024 KTM Realstate. All rights reserved. | Proudly serving Nepal since 2008
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">
                Cookie Policy
              </a>
              <a href="/admin" className="text-primary-foreground/60 hover:text-accent transition-colors text-xs">
                Admin
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;