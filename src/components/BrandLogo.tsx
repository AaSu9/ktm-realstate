import React from 'react';

export const BrandLogo = () => {
  return (
    <div className="flex items-center gap-2">
      <img src="/logo.png" alt="KTM Real Estate Nepal Logo" className="h-12 w-auto object-contain" />
      
      {/* Text Elements */}
      <div className="flex flex-col justify-center leading-tight">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-destructive tracking-tight uppercase">KTM</span>
          <span className="text-xl font-bold text-secondary tracking-tight uppercase">REAL ESTATE</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm font-bold text-primary">नेपाल</span>
          <span className="text-sm">🇳🇵</span>
        </div>
      </div>
    </div>
  );
};
