-- Create properties table
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(15,2) NOT NULL,
  location TEXT NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('house', 'apartment', 'land', 'commercial')),
  category TEXT NOT NULL CHECK (category IN ('sale', 'rent')),
  bedrooms INTEGER,
  bathrooms INTEGER,
  area_sqft INTEGER,
  features TEXT[],
  images TEXT[],
  video_url TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_featured BOOLEAN DEFAULT false,
  is_hot_deal BOOLEAN DEFAULT false,
  discount_percentage INTEGER DEFAULT 0,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold', 'rented')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create inquiries table
CREATE TABLE public.inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  property_interest TEXT,
  message TEXT,
  inquiry_type TEXT DEFAULT 'contact_form' CHECK (inquiry_type IN ('contact_form', 'property_inquiry', 'whatsapp', 'phone')),
  property_id UUID REFERENCES public.properties(id),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Create policies for properties (public read access)
CREATE POLICY "Properties are viewable by everyone" 
ON public.properties 
FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated users can manage properties" 
ON public.properties 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Create policies for inquiries (public can insert, authenticated can view all)
CREATE POLICY "Anyone can submit inquiries" 
ON public.inquiries 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only authenticated users can view inquiries" 
ON public.inquiries 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample properties
INSERT INTO public.properties (title, description, price, location, property_type, category, bedrooms, bathrooms, area_sqft, features, images, is_featured, is_hot_deal) VALUES
('Modern 3BHK Apartment in Baneshwor', 'Luxurious apartment with modern amenities, parking, and great city views', 15000000, 'Baneshwor, Kathmandu', 'apartment', 'sale', 3, 2, 1200, ARRAY['parking', 'elevator', 'security', 'garden'], ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'], true, false),
('Premium Villa in Lalitpur', 'Spacious villa with garden, modern kitchen, and premium finishes', 35000000, 'Lalitpur, Nepal', 'house', 'sale', 4, 3, 2500, ARRAY['garden', 'parking', 'modern_kitchen', 'security'], ARRAY['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'], true, true),
('Commercial Land in Bhaktapur', 'Prime commercial land perfect for business development', 8000000, 'Bhaktapur, Nepal', 'land', 'sale', NULL, NULL, 3000, ARRAY['road_access', 'electricity', 'water'], ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'], false, true);