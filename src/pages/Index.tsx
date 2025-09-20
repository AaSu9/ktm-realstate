import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import FeaturedProperties from '@/components/FeaturedProperties';
import Services from '@/components/Services';
import About from '@/components/About';
import GoogleMaps from '@/components/GoogleMaps';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import QuickActions from '@/components/QuickActions';
import { supabase } from '@/integrations/supabase/client';

export async function getStaticProps() {
  const { data: properties, error } = await supabase
    .from('properties')
    .select('*')
    .eq('status', 'available')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching properties:', error);
  }

  return {
    props: {
      properties: properties || [],
    },
    revalidate: 60, // Re-generate the page every 60 seconds
  };
}

const Index = ({ properties }) => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <section id="home">
          <Hero />
        </section>
        <section id="properties">
          <FeaturedProperties initialProperties={properties} />
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
