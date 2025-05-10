import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ConfettiProps {
  duration?: number;
}

const Confetti: React.FC<ConfettiProps> = ({ duration = 8000 }) => {
  const [pieces, setPieces] = useState<JSX.Element[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    // Generate random confetti pieces
    const colors = ['#FFA726', '#29B6F6', '#8E24AA', '#66BB6A', '#EF5350', '#FFEE58'];
    const totalPieces = 100;
    const newPieces = [];
    
    for (let i = 0; i < totalPieces; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const x = Math.random() * 100; // random position
      const delay = Math.random() * 5; // random delay
      const size = Math.random() * 10 + 5; // random size between 5-15px
      const duration = Math.random() * 10 + 10; // random duration between 10-20s
      
      newPieces.push(
        <motion.div
          key={i}
          className="absolute rounded-sm"
          initial={{ 
            top: -20, 
            left: `${x}vw`,
            width: size,
            height: size,
            backgroundColor: color,
            rotate: 0
          }}
          animate={{ 
            top: '100vh',
            rotate: 360,
            opacity: [1, 1, 0]
          }}
          transition={{ 
            duration: duration,
            delay: delay,
            ease: 'linear'
          }}
        />
      );
    }
    
    setPieces(newPieces);
    
    // Hide confetti after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration]);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces}
    </div>
  );
};

export default Confetti;
