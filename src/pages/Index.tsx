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

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <section id="home">
          <Hero />
        </section>
        <section id="properties">
          <FeaturedProperties initialProperties={undefined} />
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
