import { ShieldCheck, CheckCircle, Map, CreditCard } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: "Trusted Agents",
      description: "Our team of verified professionals ensures a secure and transparent property transaction."
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-secondary" />,
      title: "Verified Listings",
      description: "Every property goes through a strict verification process for your peace of mind."
    },
    {
      icon: <Map className="h-8 w-8 text-primary" />,
      title: "Local Expertise",
      description: "Deep understanding of the local market in Kathmandu, Lalitpur, Pokhara and beyond."
    },
    {
      icon: <CreditCard className="h-8 w-8 text-secondary" />,
      title: "Easy Financing",
      description: "We help you connect with top banks for hassle-free home loans and financing."
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose Us</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We bring trust, transparency, and expertise to the real estate market in Nepal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="text-center p-6 rounded-2xl bg-background border border-border/50 shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-2 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
