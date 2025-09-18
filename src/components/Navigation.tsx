import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone, MessageCircle } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Home', href: '#home' },
    { name: 'Properties', href: '#properties' },
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
    { name: 'Location', href: '#maps' },
    { name: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-md border-b border-border/50 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold bg-accent-gradient bg-clip-text text-transparent">
              KTM Realstate
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="text-foreground hover:text-accent transition-colors duration-300 font-medium"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => window.location.href = 'tel:+9779741690374'}
            >
              <Phone className="h-4 w-4" />
              Call Us
            </Button>
            <Button 
              className="btn-primary flex items-center gap-2"
              onClick={() => window.open('https://wa.me/9779741690374', '_blank')}
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-b border-border">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="block w-full text-left px-3 py-2 text-foreground hover:text-accent transition-colors"
              >
                {item.name}
              </button>
            ))}
            <div className="pt-4 pb-3 border-t border-border">
              <div className="flex flex-col space-y-2 px-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2 justify-center"
                  onClick={() => window.location.href = 'tel:+9779741690374'}
                >
                  <Phone className="h-4 w-4" />
                  Call Us
                </Button>
                <Button 
                  className="btn-primary flex items-center gap-2 justify-center"
                  onClick={() => window.open('https://wa.me/9779741690374', '_blank')}
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;