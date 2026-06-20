import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CtaBanner = () => {
  return (
    <section className="bg-gradient-to-r from-primary to-secondary py-20 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight shadow-sm drop-shadow-sm">
          Find Your Dream Home in Nepal Today
        </h2>
        <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
          Whether you're looking to buy, rent, or invest, our experts are here to guide you every step of the way.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-accent hover:bg-accent-hover text-white font-bold text-lg px-8 py-6 rounded-xl shadow-lg hover:-translate-y-1 transition-all"
            onClick={() => window.location.href = '#properties'}
          >
            Browse Properties
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white/10 font-bold text-lg px-8 py-6 rounded-xl"
            onClick={() => window.location.href = '#contact'}
          >
            Contact an Agent
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaBanner;
