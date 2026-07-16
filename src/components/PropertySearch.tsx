import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Home, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  is_featured: boolean;
  is_hot_deal: boolean;
  discount_percentage: number;
  category: string;
  status?: string;
  created_at: string;
  property_id?: string;
}

interface PropertySearchProps {
  onSearchResults?: (results: Property[]) => void;
  className?: string;
}

const PropertySearch = ({ onSearchResults, className }: PropertySearchProps) => {
  const { toast } = useToast();
  const [searchData, setSearchData] = useState({
    location: '',
    propertyType: '',
    budget: '',
    category: 'buy',
    propertyId: ''
  });
  const [isSearching, setIsSearching] = useState(false);
  const isInitialMount = useRef(true);

  const handleSearch = useCallback(async (currentSearchData) => {
    if (!currentSearchData.location.trim() && !currentSearchData.propertyId.trim()) {
      return;
    }

    setIsSearching(true);

    try {
      let query = supabase
        .from('properties')
        .select('*')
        .in('status', ['available', 'AVAILABLE']);

      if (currentSearchData.propertyId) {
        query = query.eq('property_id', currentSearchData.propertyId);
      } else {
        if (currentSearchData.location) {
          query = query.ilike('location', `%${currentSearchData.location}%`);
        }
        if (currentSearchData.propertyType) {
          query = query.eq('property_type', currentSearchData.propertyType);
        }
      }

      if (currentSearchData.budget) {
        const [min, max] = currentSearchData.budget.split('-').map(Number);
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
          description: `Properties matching your search criteria in ${currentSearchData.location}`,
        });
        onSearchResults?.(data as Property[]);
      } else {
        toast({
          title: "No properties found",
          description: "Try adjusting your search criteria or contact us for more options.",
        });
        onSearchResults?.([]);
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
  }, [toast, onSearchResults]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!searchData.location.trim() && !searchData.propertyId.trim()) {
      return;
    }

    const handler = setTimeout(() => {
      handleSearch(searchData);
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchData.location, searchData.propertyType, searchData.budget, searchData.propertyId, handleSearch]);

  const handleManualSearchClick = () => {
    if (!searchData.location.trim() && !searchData.propertyId.trim()) {
      toast({
        title: "Please enter search criteria",
        description: "Location or Property ID is required to search.",
        variant: "destructive",
      });
      return;
    }
    handleSearch(searchData);
  }

  return (
    <div className={`bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-luxury ${className}`}>
      {/* Search Toggle */}
      <div className="flex gap-2 mb-6 border-b border-border/50 pb-4">
        {['Buy', 'Rent', 'Land'].map((tab) => (
          <button
            key={tab}
            type="button"
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              searchData.category === tab.toLowerCase()
                ? 'bg-primary text-white shadow-md'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
            onClick={() => setSearchData(prev => ({ ...prev, category: tab.toLowerCase() }))}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Property ID — FIRST */}
        <div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">#</span>
            <Input
              placeholder="Property ID"
              className="pl-9 h-12 border-primary/30 font-semibold focus:border-primary"
              value={searchData.propertyId}
              onChange={(e) => setSearchData(prev => ({ ...prev, propertyId: e.target.value }))}
            />
          </div>
        </div>

        {/* Location */}
        <div className="md:col-span-2">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Enter location (e.g., Imadol, Budhanilkantha)"
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
          onClick={handleManualSearchClick}
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