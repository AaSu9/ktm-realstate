import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Bed, Bath, Square, Phone, MessageCircle, Heart, Eye } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import PropertyDetailsModal from './PropertyDetailsModal';

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  bedrooms?: number;
  bathrooms?: number;
  area: string;
  type: 'sale' | 'rent';
  featured?: boolean;
  discount?: string;
  property?: any; // Full property object for detailed view
}

const PropertyCard = ({ 
  id,
  title, 
  location, 
  price, 
  image, 
  bedrooms, 
  bathrooms, 
  area, 
  type, 
  featured, 
  discount,
  property 
}: PropertyCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { toast } = useToast();

  const handleInquiry = async (inquiryType: 'phone' | 'whatsapp' | 'details') => {
    if (inquiryType === 'phone') {
      window.location.href = 'tel:+9779741690374';
      return;
    }
    
    if (inquiryType === 'whatsapp') {
      const message = `Hi! I'm interested in the property: ${title} located at ${location}. Price: ${price}. Can you provide more details?`;
      window.open(`https://wa.me/9779741690374?text=${encodeURIComponent(message)}`, '_blank');
      return;
    }

    if (inquiryType === 'details') {
      setShowDetailsModal(true);
      return;
    }
  };

  return (
    <div className="property-card overflow-hidden group">
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {featured && (
            <Badge className="bg-accent text-accent-foreground font-semibold">
              Featured
            </Badge>
          )}
          {discount && (
            <Badge className="bg-success text-success-foreground font-semibold">
              {discount}
            </Badge>
          )}
          <Badge variant={type === 'sale' ? 'default' : 'secondary'} className="font-semibold">
            For {type === 'sale' ? 'Sale' : 'Rent'}
          </Badge>
        </div>

        {/* Like Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/30"
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
        </Button>

        {/* Price Overlay */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-lg font-bold">
            {price}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
          {title}
        </h3>
        
        <div className="flex items-center text-muted-foreground mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{location}</span>
        </div>

        {/* Property Details */}
        <div className="flex items-center justify-between mb-6 text-sm text-muted-foreground">
          {bedrooms && (
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span>{bedrooms} Beds</span>
            </div>
          )}
          {bathrooms && (
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{bathrooms} Baths</span>
            </div>
          )}
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            <span>{area}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={() => handleInquiry('details')}
          >
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>
          <Button 
            size="sm" 
            className="px-3 hover:scale-105 transition-transform"
            onClick={() => handleInquiry('phone')}
          >
            <Phone className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            className="px-3 bg-green-600 hover:bg-green-700 hover:scale-105 transition-all"
            onClick={() => handleInquiry('whatsapp')}
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Property Details Modal */}
      <PropertyDetailsModal
        property={property}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />
    </div>
  );
};

export default PropertyCard;