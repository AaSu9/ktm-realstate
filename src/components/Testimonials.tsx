import { Quote } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback } from 'react';

const testimonialsData = [
  {
    name: 'Rajesh Shrestha',
    role: 'Homeowner, Lalitpur',
    content: 'KTM Real Estate made buying our first home incredibly easy. Their agents are professional, know the local market perfectly, and handled everything transparently.',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150'
  },
  {
    name: 'Anjali Thapa',
    role: 'Investor, Kathmandu',
    content: 'I have purchased multiple commercial properties through them. Their verified listings and market insights gave me the confidence to invest heavily in the valley.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
  },
  {
    name: 'Sunil Gurung',
    role: 'Landlord, Pokhara',
    content: 'Listing my property with KTM Real Estate was the best decision. They found great tenants quickly, and the entire process was seamless and stress-free.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  }
];

const Testimonials = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold text-foreground mb-4">What Our Clients Say</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real stories from people who found their dream homes with us.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonialsData.map((testimonial, index) => (
                <div className="flex-[0_0_100%] min-w-0 pl-4 pr-4" key={index}>
                  <div className="bg-card border border-border shadow-md rounded-2xl p-8 md:p-12 text-center relative">
                    <Quote className="absolute top-6 left-6 h-12 w-12 text-secondary opacity-20" />
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-20 h-20 rounded-full mx-auto mb-6 object-cover border-4 border-primary/20"
                    />
                    <p className="text-lg md:text-xl text-muted-foreground italic mb-8 relative z-10">
                      "{testimonial.content}"
                    </p>
                    <h4 className="font-bold text-foreground text-lg">{testimonial.name}</h4>
                    <p className="text-sm text-secondary font-medium">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md border text-foreground hover:bg-muted transition-colors"
            onClick={scrollPrev}
          >
            &#8592;
          </button>
          <button 
            className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md border text-foreground hover:bg-muted transition-colors"
            onClick={scrollNext}
          >
            &#8594;
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
