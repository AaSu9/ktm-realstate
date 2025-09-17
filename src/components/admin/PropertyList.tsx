import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, Eye, Star, StarOff } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  images: string[];
  bedrooms?: number;
  bathrooms?: number;
  area_sqft?: number;
  property_type: string;
  status: string;
  is_featured: boolean;
  is_hot_deal: boolean;
  discount_percentage: number;
  description?: string;
  features?: string[];
  category: string;
}

interface PropertyListProps {
  properties: Property[];
  loading: boolean;
  onEdit: (property: Property) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onToggleFeatured: (id: string, featured: boolean) => void;
  onDelete: (id: string) => void;
}

const PropertyList = ({
  properties,
  loading,
  onEdit,
  onUpdateStatus,
  onToggleFeatured,
  onDelete
}: PropertyListProps) => {
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `Rs. ${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `Rs. ${(price / 100000).toFixed(1)} Lakh`;
    } else {
      return `Rs. ${price.toLocaleString()}`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'sold':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-muted"></div>
            <CardContent className="p-4">
              <div className="h-6 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded mb-4 w-3/4"></div>
              <div className="h-10 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {properties.map((property) => (
          <Card key={property.id} className="overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/3">
                <img
                  src={property.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400'}
                  alt={property.title}
                  className="w-full h-48 lg:h-full object-cover"
                />
              </div>
              <div className="lg:w-2/3 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                    <p className="text-muted-foreground mb-2">{property.location}</p>
                    <p className="text-2xl font-bold text-accent mb-2">
                      {formatPrice(property.price)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge className={getStatusColor(property.status)}>
                      {property.status.toUpperCase()}
                    </Badge>
                    {property.is_featured && (
                      <Badge variant="secondary">Featured</Badge>
                    )}
                    {property.is_hot_deal && (
                      <Badge variant="destructive">Hot Deal</Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                  <span>{property.property_type}</span>
                  <span>{property.category}</span>
                  {property.bedrooms && <span>{property.bedrooms} bed</span>}
                  {property.bathrooms && <span>{property.bathrooms} bath</span>}
                  {property.area_sqft && <span>{property.area_sqft} sq ft</span>}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Select
                    value={property.status}
                    onValueChange={(value) => onUpdateStatus(property.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    size="sm"
                    variant={property.is_featured ? "default" : "outline"}
                    onClick={() => onToggleFeatured(property.id, !property.is_featured)}
                  >
                    {property.is_featured ? <Star className="h-4 w-4 mr-1" /> : <StarOff className="h-4 w-4 mr-1" />}
                    Featured
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" onClick={() => onEdit(property)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(property.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(property.images[0], '_blank')}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Image
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {properties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No properties found.</p>
        </div>
      )}
    </div>
  );
};

export default PropertyList;