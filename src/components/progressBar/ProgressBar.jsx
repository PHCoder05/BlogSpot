import React, { useState, useEffect, useContext } from 'react';
import myContext from '../../context/data/myContext';

function ProgressBar() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const context = useContext(myContext);
  const { mode } = context;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.offsetHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      setProgress(scrollPercent);
      setIsVisible(scrollPercent > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {isVisible && (
        <div className="fixed top-0 left-0 w-full h-1 z-50">
          <div 
            className={`h-full transition-all duration-300 ease-out ${
              mode === 'dark' ? 'bg-gradient-to-r from-teal-500 to-blue-500' : 'bg-gradient-to-r from-teal-500 to-blue-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </>
  );
}

export default ProgressBar; 