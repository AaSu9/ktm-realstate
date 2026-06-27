import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Property {
  id?: string;
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
  video_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
  property_id?: string;
  map_url?: string;
}

interface PropertyFormProps {
  property?: Property | null;
  onSubmit: () => void;
  onCancel: () => void;
}

const PropertyForm = ({ property, onSubmit, onCancel }: PropertyFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [newImage, setNewImage] = useState('');
  const [newFeature, setNewFeature] = useState('');
  
  const [formData, setFormData] = useState<Property>({
    title: '',
    location: '',
    price: 0,
    images: [],
    bedrooms: undefined,
    bathrooms: undefined,
    area_sqft: undefined,
    property_type: 'apartment',
    status: 'available',
    is_featured: false,
    is_hot_deal: false,
    discount_percentage: 0,
    description: '',
    features: [],
    category: 'sale',
    video_url: '',
    youtube_url: '',
    tiktok_url: '',
    property_id: '',
    map_url: '',
  });

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        location: property.location || '',
        price: property.price || 0,
        images: property.images || [],
        bedrooms: property.bedrooms || undefined,
        bathrooms: property.bathrooms || undefined,
        area_sqft: property.area_sqft || undefined,
        property_type: property.property_type || 'apartment',
        status: property.status || 'available',
        is_featured: property.is_featured || false,
        is_hot_deal: property.is_hot_deal || false,
        discount_percentage: property.discount_percentage || 0,
        description: property.description || '',
        features: property.features || [],
        category: property.category || 'sale',
        video_url: property.video_url || '',
        youtube_url: property.youtube_url || '',
        tiktok_url: property.tiktok_url || '',
        property_id: property.property_id || '',
        map_url: property.map_url || '',
      });
    } else {
      setFormData({
        title: '',
        location: '',
        price: 0,
        images: [],
        bedrooms: undefined,
        bathrooms: undefined,
        area_sqft: undefined,
        property_type: 'apartment',
        status: 'available',
        is_featured: false,
        is_hot_deal: false,
        discount_percentage: 0,
        description: '',
        features: [],
        category: 'sale',
        video_url: '',
        youtube_url: '',
        tiktok_url: '',
        property_id: '',
        map_url: '',
      });
    }
  }, [property]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.location || !formData.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (property?.id) {
        // Update existing property
        const { error } = await supabase
          .from('properties')
          .update(formData)
          .eq('id', property.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Property updated successfully",
        });
      } else {
        // Create new property
        const { data, error } = await supabase
          .from('properties')
          .insert([formData])
          .select();

        if (error) throw error;
        toast({
          title: "Success",
          description: "Property created successfully",
        });
      }

      onSubmit();
    } catch (error) {
      console.error('Error saving property:', error);
      toast({
        title: "Error",
        description: "Failed to save property",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addImage = () => {
    if (newImage && !formData.images.includes(newImage)) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage]
      }));
      setNewImage('');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addFeature = () => {
    if (newFeature && !formData.features?.includes(newFeature)) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || []
    }));
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {property ? 'Edit Property' : 'Add New Property'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="property_id">Custom Property ID (Optional)</Label>
              <Input
                id="property_id"
                value={formData.property_id}
                onChange={(e) => setFormData(prev => ({ ...prev, property_id: e.target.value }))}
                placeholder="e.g., 1001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Property title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Property location"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                placeholder="Price in NPR"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="property_type">Property Type</Label>
              <Select
                value={formData.property_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, property_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                value={formData.bedrooms || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  bedrooms: e.target.value ? Number(e.target.value) : undefined 
                }))}
                placeholder="Number of bedrooms"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                value={formData.bathrooms || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  bathrooms: e.target.value ? Number(e.target.value) : undefined 
                }))}
                placeholder="Number of bathrooms"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area_sqft">Area (sq ft)</Label>
              <Input
                id="area_sqft"
                type="number"
                value={formData.area_sqft || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  area_sqft: e.target.value ? Number(e.target.value) : undefined 
                }))}
                placeholder="Area in square feet"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount">Discount %</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                max="100"
                value={formData.discount_percentage}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  discount_percentage: Number(e.target.value) 
                }))}
                placeholder="Discount percentage"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="video_url">Video URL</Label>
              <Input
                id="video_url"
                value={formData.video_url || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                placeholder="Property video URL"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtube_url">YouTube URL</Label>
              <Input
                id="youtube_url"
                value={formData.youtube_url || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, youtube_url: e.target.value }))}
                placeholder="YouTube video URL"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tiktok_url">TikTok URL</Label>
              <Input
                id="tiktok_url"
                value={formData.tiktok_url || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, tiktok_url: e.target.value }))}
                placeholder="TikTok video URL"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="map_url">📍 Google Maps Embed Code</Label>
              <Textarea
                id="map_url"
                value={formData.map_url || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, map_url: e.target.value }))}
                placeholder={`Paste the full iframe embed code from Google Maps:\n1. Go to Google Maps → find location → Share → Embed a map\n2. Click "Copy HTML" and paste it here`}
                rows={4}
                className="font-mono text-xs"
              />
              {formData.map_url && (() => {
                const url = formData.map_url;
                const isIframe = url.includes('<iframe');
                const isEmbedUrl = url.includes('google.com/maps/embed') || url.includes('maps.google.com/maps?');
                const srcMatch = isIframe ? url.match(/src="([^"]+)"/) : null;
                const embedSrc = srcMatch ? srcMatch[1] : (isEmbedUrl ? url : null);
                return (
                  <div className="space-y-2">
                    {embedSrc ? (
                      <div className="rounded-lg overflow-hidden border h-[200px]">
                        <iframe src={embedSrc} width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy"></iframe>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <span className="text-amber-700 text-xs">⚠️ This link cannot be embedded. Use Google Maps → Share → <strong>Embed a map</strong> → Copy HTML instead. Your link will still be saved and shown as a button.</span>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Property description"
              rows={4}
            />
          </div>

          <div className="space-y-4">
            <Label>Images</Label>
            <div className="flex gap-2">
              <Input
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                placeholder="Image URL"
              />
              <Button type="button" onClick={addImage}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.images.map((image, index) => (
                <Badge key={index} variant="secondary" className="pr-1">
                  <img src={image} alt="" className="w-8 h-8 object-cover rounded mr-2" />
                  Image {index + 1}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeImage(index)}
                    className="ml-1 h-auto p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label>Features</Label>
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add feature"
              />
              <Button type="button" onClick={addFeature}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.features?.map((feature, index) => (
                <Badge key={index} variant="secondary" className="pr-1">
                  {feature}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFeature(index)}
                    className="ml-1 h-auto p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
              />
              <Label htmlFor="featured">Featured Property</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="hot_deal"
                checked={formData.is_hot_deal}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_hot_deal: checked }))}
              />
              <Label htmlFor="hot_deal">Hot Deal</Label>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : property ? 'Update Property' : 'Create Property'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PropertyForm;