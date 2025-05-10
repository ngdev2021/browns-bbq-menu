import React, { ReactNode } from 'react';

interface HeroBackgroundProps {
  videoSrc?: string;
  children: ReactNode;
}

const HeroBackground: React.FC<HeroBackgroundProps> = ({ videoSrc, children }) => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Video Background */}
      {videoSrc && (
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 object-cover w-full h-full"
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900/40 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

export default HeroBackground;