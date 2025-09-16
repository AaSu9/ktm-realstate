import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Home, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PropertySearchProps {
  onSearchResults?: (results: any[]) => void;
  className?: string;
}

const PropertySearch = ({ onSearchResults, className }: PropertySearchProps) => {
  const { toast } = useToast();
  const [searchData, setSearchData] = useState({
    location: '',
    propertyType: '',
    budget: ''
  });
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchData.location.trim()) {
      toast({
        title: "Please enter a location",
        description: "Location is required to search properties.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);

    try {
      let query = supabase
        .from('properties')
        .select('*')
        .ilike('location', `%${searchData.location}%`)
        .eq('status', 'available');

      if (searchData.propertyType) {
        query = query.eq('property_type', searchData.propertyType);
      }

      if (searchData.budget) {
        const [min, max] = searchData.budget.split('-').map(Number);
        if (max) {
          query = query.gte('price', min * 1000000).lte('price', max * 1000000);
        } else {
          query = query.gte('price', min * 1000000);
        }
      }

      const { data, error } = await query.limit(10);

      if (error) throw error;

      if (data && data.length > 0) {
        toast({
          title: `Found ${data.length} properties`,
          description: `Properties matching your search criteria in ${searchData.location}`,
        });
        onSearchResults?.(data);
      } else {
        toast({
          title: "No properties found",
          description: "Try adjusting your search criteria or contact us for more options.",
        });
      }
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className={`bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-luxury ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Enter location (e.g., Kathmandu, Pokhara)"
              className="pl-10 h-12 border-border/20"
              value={searchData.location}
              onChange={(e) => setSearchData(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>
        </div>
        
        <Select onValueChange={(value) => setSearchData(prev => ({ ...prev, propertyType: value }))}>
          <SelectTrigger className="h-12">
            <Home className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="land">Land</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => setSearchData(prev => ({ ...prev, budget: value }))}>
          <SelectTrigger className="h-12">
            <DollarSign className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Budget" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0-50">Under Rs. 50 Lakh</SelectItem>
            <SelectItem value="50-100">Rs. 50L - 1 Crore</SelectItem>
            <SelectItem value="100-200">Rs. 1-2 Crore</SelectItem>
            <SelectItem value="200">Above Rs. 2 Crore</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <Button 
          className="btn-hero flex-1 h-12" 
          onClick={handleSearch}
          disabled={isSearching}
        >
          <Search className="h-5 w-5 mr-2" />
          {isSearching ? 'Searching...' : 'Search Properties'}
        </Button>
        <Button 
          variant="outline" 
          className="h-12 px-8"
          onClick={() => window.location.href = '#contact'}
        >
          Advanced Filters
        </Button>
      </div>
    </div>
  );
};

export default PropertySearch;