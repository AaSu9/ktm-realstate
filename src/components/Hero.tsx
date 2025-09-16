import { Button } from '@/components/ui/button';
import PropertySearch from '@/components/PropertySearch';
import heroImage from '@/assets/hero-property.jpg';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Find Your Perfect
              <span className="block bg-accent-gradient bg-clip-text text-transparent">
                Dream Home
              </span>
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Discover premium properties in Nepal's most desirable locations. From luxury homes to prime land investments, we make your real estate dreams a reality.
            </p>
          </div>

          {/* Search Form */}
          <PropertySearch className="animate-slide-up" />

          {/* Stats */}
          <div className="mt-12 animate-scale-in">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-white mb-2">500+</div>
                <div className="text-white/80">Properties Listed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">1000+</div>
                <div className="text-white/80">Happy Clients</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">15+</div>
                <div className="text-white/80">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-accent rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;