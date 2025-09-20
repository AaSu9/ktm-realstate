
import React from 'react';

const YouTube = () => {
  return (
    <section id="youtube" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Our Projects on YouTube</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our properties and projects in detail through our YouTube channel.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              className="w-full h-full rounded-lg shadow-lg"
              src="https://youtube.com/shorts/70QDryckR_k?si=iek2WGk25A84ymE-"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
         
        </div>
      </div>
    </section>
  );
};

export default YouTube;
