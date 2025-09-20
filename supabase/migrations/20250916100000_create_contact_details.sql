
-- Create contact_details table
CREATE TABLE public.contact_details (
  id INT PRIMARY KEY DEFAULT 1,
  phone TEXT,
  email TEXT,
  address TEXT,
  map_lat DOUBLE PRECISION,
  map_lng DOUBLE PRECISION,
  map_zoom INT,
  facebook_url TEXT,
  instagram_url TEXT,
  youtube_url TEXT,
  whatsapp_number TEXT,
  business_hours JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT singleton_check CHECK (id = 1)
);

-- Enable Row Level Security
ALTER TABLE public.contact_details ENABLE ROW LEVEL SECURITY;

-- Policies for contact_details
-- Public read access
CREATE POLICY "Contact details are viewable by everyone"
ON public.contact_details
FOR SELECT
USING (true);

-- Admin write access
CREATE POLICY "Only authenticated users can manage contact details"
ON public.contact_details
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Seed initial data
INSERT INTO public.contact_details (
  id,
  phone,
  email,
  address,
  map_lat,
  map_lng,
  map_zoom,
  facebook_url,
  instagram_url,
  youtube_url,
  whatsapp_number,
  business_hours
) VALUES (
  1,
  '+977 974-1690374',
  'sumanghimire138@gmail.com',
  'New Baneshwor, Kathmandu, Nepal',
  27.7043,
  85.342,
  15,
  'https://facebook.com',
  'https://instagram.com',
  'https://www.youtube.com/@sumancreation138',
  '9779741690374',
  '{
    "Monday - Friday": "9:00 AM - 6:00 PM",
    "Saturday": "10:00 AM - 4:00 PM",
    "Sunday": "Closed"
  }'
);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION public.update_contact_details_updated_at()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update timestamp
CREATE TRIGGER on_contact_details_update
  BEFORE UPDATE ON public.contact_details
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_contact_details_updated_at();
