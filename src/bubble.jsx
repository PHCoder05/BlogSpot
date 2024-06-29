// src/components/BubbleCursor.js
import React, { useEffect } from 'react';
import './BubbleCursor.css';

const BubbleCursor = () => {
  useEffect(() => {
    const handleMouseMove = (event) => {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      document.body.appendChild(bubble);

      const size = Math.random() * 10 + 5 + 'px';
      bubble.style.width = size;
      bubble.style.height = size;

      const left = event.pageX + Math.random() * 20 - 10 + 'px';
      const top = event.pageY + Math.random() * 20 - 10 + 'px';
      bubble.style.left = left;
      bubble.style.top = top;

      setTimeout(() => {
        bubble.remove();
      }, 4000);
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return null; // This component does not render anything itself
};

export default BubbleCursor;
