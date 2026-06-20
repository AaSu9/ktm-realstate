import { ArrowRight } from 'lucide-react';

const locationsData = [
  {
    name: 'Kathmandu',
    properties: '120+',
    image: 'https://images.unsplash.com/photo-1542868727-463870104692?w=800'
  },
  {
    name: 'Lalitpur',
    properties: '85+',
    image: 'https://images.unsplash.com/photo-1590483863484-9dbb5514f7b6?w=800'
  },
  {
    name: 'Bhaktapur',
    properties: '40+',
    image: 'https://images.unsplash.com/photo-1510255877840-7ec87b7a1188?w=800'
  },
  {
    name: 'Pokhara',
    properties: '60+',
    image: 'https://images.unsplash.com/photo-1627828063852-c0e5a6fc5740?w=800'
  }
];

const Locations = () => {
  return (
    <section className="py-20 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12 animate-fade-in">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-4">Explore Neighborhoods</h2>
            <p className="text-xl text-muted-foreground">Find properties in the most desirable areas across Nepal.</p>
          </div>
          <button className="hidden md:flex items-center text-primary font-semibold hover:text-primary-hover transition-colors">
            View All Locations <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {locationsData.map((location, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 h-80 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img 
                src={location.image} 
                alt={location.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-2xl font-bold text-white mb-1">{location.name}</h3>
                <p className="text-white/80">{location.properties} Properties</p>
              </div>
            </div>
          ))}
        </div>
        
        <button className="mt-8 md:hidden w-full flex items-center justify-center text-primary font-semibold hover:text-primary-hover transition-colors">
          View All Locations <ArrowRight className="ml-2 h-5 w-5" />
        </button>
      </div>
    </section>
  );
};

export default Locations;
