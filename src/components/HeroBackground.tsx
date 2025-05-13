import React, { ReactNode, useEffect, useState } from 'react';

interface HeroBackgroundProps {
  videoSrc?: string;
  children: ReactNode;
}

const HeroBackground: React.FC<HeroBackgroundProps> = ({ videoSrc, children }) => {
  const [fullVideoSrc, setFullVideoSrc] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    if (videoSrc) {
      // Use window.location.origin to ensure we're using the correct port
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      setFullVideoSrc(`${baseUrl}${videoSrc}`);
    }
  }, [videoSrc]);
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Video Background - only render on client side */}
      {isMounted && fullVideoSrc && (
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 object-cover w-full h-full"
        >
          <source src={fullVideoSrc} type="video/mp4" />
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