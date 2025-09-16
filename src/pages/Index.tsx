import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import FeaturedProperties from '@/components/FeaturedProperties';
import Services from '@/components/Services';
import About from '@/components/About';
import Maps from '@/components/Maps';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import QuickActions from '@/components/QuickActions';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <FeaturedProperties />
        <Services />
        <About />
        <Maps />
        <Contact />
      </main>
      <Footer />
      <QuickActions />
    </div>
  );
};

export default Index;
