-- Add sample properties with correct lowercase property types
INSERT INTO properties (title, location, price, property_type, category, description, bedrooms, bathrooms, area_sqft, images, is_featured, is_hot_deal, discount_percentage, features) VALUES
('Luxury House in Lalitpur', 'Lalitpur, Nepal', 15000000, 'house', 'sale', 'Beautiful 3-story house with modern amenities and garden', 4, 3, 2500, ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'], true, false, 0, ARRAY['Garden', 'Parking', 'Modern Kitchen', 'Security']),

('Spacious Apartment in Thamel', 'Thamel, Kathmandu', 8500000, 'apartment', 'sale', 'Modern apartment in the heart of Thamel with city views', 3, 2, 1800, ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'], false, true, 15, ARRAY['City View', 'Elevator', 'Balcony', 'WiFi Ready']),

('Prime Land in Durbar Marg', 'Durbar Marg, Kathmandu', 25000000, 'land', 'sale', 'Prime land plot perfect for commercial development', 0, 0, 3000, ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'], true, false, 0, ARRAY['Prime Location', 'High Traffic', 'Development Ready']),

('Modern House in Banepa', 'Banepa, Nepal', 12000000, 'house', 'sale', 'Stunning house with panoramic mountain views', 4, 3, 2200, ARRAY['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', 'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800'], true, true, 20, ARRAY['Mountain View', 'Rooftop Terrace', 'Premium Finishes']),

('Family House in Bhaktapur', 'Bhaktapur, Nepal', 6500000, 'house', 'sale', 'Traditional Newari house with modern renovations', 3, 2, 1600, ARRAY['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'], false, false, 0, ARRAY['Traditional Architecture', 'Renovated', 'Cultural Area']),

('Studio Apartment for Rent', 'New Baneshwor, Kathmandu', 25000, 'apartment', 'rent', 'Cozy studio apartment perfect for students or professionals', 1, 1, 500, ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'], false, false, 0, ARRAY['Furnished', 'Near Universities', 'Public Transport']),

('Luxury Apartment in Patan', 'Patan, Nepal', 18000000, 'apartment', 'sale', 'Modern luxury apartment with premium amenities', 3, 2, 2000, ARRAY['https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800'], true, false, 0, ARRAY['Swimming Pool', 'Gym', 'Concierge', 'Security']),

('Commercial Land Putalisadak', 'Putalisadak, Kathmandu', 8000000, 'land', 'sale', 'Prime commercial land in business district', 0, 0, 1200, ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'], false, false, 0, ARRAY['Business District', 'Road Access', 'High Potential']),

('Modern House in Kirtipur', 'Kirtipur, Nepal', 9500000, 'house', 'sale', 'Beautiful house with garden and parking', 3, 2, 1900, ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'], false, true, 10, ARRAY['Garden', 'Parking', 'Quiet Neighborhood']),

('Land Plot in Bhaktapur', 'Bhaktapur, Nepal', 3500000, 'land', 'sale', 'Prime land plot for construction with road access', 0, 0, 5000, ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'], false, false, 0, ARRAY['Road Access', 'Clear Title', 'Development Ready']);