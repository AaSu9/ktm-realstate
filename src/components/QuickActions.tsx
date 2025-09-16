import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, MessageCircle, Mail, MapPin } from 'lucide-react';

const QuickActions = () => {
  const quickActions = [
    {
      icon: Phone,
      label: 'Call Now',
      action: () => window.location.href = 'tel:+9779741690374',
      className: 'btn-primary'
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      action: () => window.open('https://wa.me/9779741690374', '_blank'),
      className: 'bg-green-600 hover:bg-green-700 text-white'
    },
    {
      icon: Mail,
      label: 'Email Us',
      action: () => window.location.href = 'mailto:sumanghimire138@gmail.com',
      className: 'bg-blue-600 hover:bg-blue-700 text-white'
    },
    {
      icon: MapPin,
      label: 'Visit Office',
      action: () => window.open('https://www.google.com/maps/place/New+Baneshwor,+Kathmandu,+Nepal', '_blank'),
      className: 'bg-purple-600 hover:bg-purple-700 text-white'
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 hidden md:block">
      <Card className="property-card">
        <CardContent className="p-4">
          <div className="flex flex-col gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                size="sm"
                className={action.className}
                onClick={action.action}
              >
                <action.icon className="h-4 w-4 mr-2" />
                {action.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickActions;