import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import FeaturedProperties from '@/components/FeaturedProperties';
import Services from '@/components/Services';
import About from '@/components/About';
import GoogleMaps from '@/components/GoogleMaps';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import QuickActions from '@/components/QuickActions';
import YouTube from '@/components/Youtube';
import { useState } from 'react';

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
}

const Index = () => {
  const [searchResults, setSearchResults] = useState<Property[] | undefined>(undefined);

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <section id="home">
          <Hero onSearchResults={setSearchResults} />
        </section>
        <section id="properties">
          <FeaturedProperties searchResults={searchResults} />
        </section>
        <section id="services">
          <Services />
        </section>
        <section id="about">
          <About />
        </section>
        <section id="maps">
          <GoogleMaps />
        </section>
        <section id="youtube">
          <YouTube />
        </section>
        <section id="contact">
          <Contact />
        </section>
      </main>
      <Footer />
      <QuickActions />
    </div>
  );
};

export default Index;
