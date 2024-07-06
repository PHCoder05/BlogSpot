import React, { useContext, useEffect, useState } from 'react';
import { Typography, Button } from '@material-tailwind/react';
import myContext from '../../context/data/myContext';
import { useNavigate } from 'react-router-dom';
import './HeroSection.css'; // Import custom CSS for cursor effects and styling

function HeroSection() {
  const context = useContext(myContext);
  const { mode } = context;
  const navigate = useNavigate(); // Initialize useNavigate hook

  // State to track cursor position
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // Update cursor position
  useEffect(() => {
    const handleMouseMove = (event) => {
      setCursorPosition({
        x: event.clientX,
        y: event.clientY
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Handler function for the button click
  const handleExploreNowClick = () => {
    navigate('/allblogs'); // Navigate to the blogs page or any specific route
  };

  // Handler function for Learn More button
  const handleLearnMoreClick = () => {
    navigate('/about'); // Navigate to the About page or any specific route
  };

  return (
    <section
      className={`relative flex flex-col items-center justify-center min-h-screen overflow-hidden pt-20 sm:pt-24 ${mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-blue-200'}`}
    >
      {/* Animated Bubbles Overlay */}
      <div className="bubbles-overlay"></div>

      {/* Content Overlay */}
      <div
        className={`relative flex flex-col items-center justify-center text-center px-6 py-8 sm:py-12 ${mode === 'dark' ? 'bg-gray-800 bg-opacity-70' : 'bg-white bg-opacity-90'} rounded-xl shadow-2xl z-10`} // Added z-index
        style={{ maxWidth: '90%' }}
      >
        {/* Stickers */}
        <div className="absolute top-8 right-8 transform -rotate-12">
          <img
            className="w-16 h-16 sm:w-24 sm:h-24 animate-pulse"
            src="https://cdn-icons-png.flaticon.com/128/3340/3340453.png"
            alt="Sticker"
          />
        </div>

        {/* Hero Image */}
        <div className="mb-6 z-20">
          <img
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-cover rounded-full shadow-xl border-4 border-teal-500"
            src="https://cdn-icons-png.flaticon.com/128/2921/2921222.png"
            alt="Hero Icon"
          />
        </div>

        {/* Title */}
        <Typography
          variant="h1"
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4"
          style={{ color: mode === 'dark' ? 'white' : 'black' }}
        >
          Welcome to PHcoder05
        </Typography>

        {/* Description */}
        <Typography
          variant="paragraph"
          className="text-base sm:text-lg md:text-xl font-light mb-6"
          style={{ color: mode === 'dark' ? 'white' : 'black' }}
        >
          Dive into a collection of inspiring blogs and tutorials crafted by PHcoder05.
        </Typography>

        {/* Call to Action Button */}
        <Button
          onClick={handleExploreNowClick} // Attach click handler
          color="teal"
          className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 sm:py-3 sm:px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 mb-8"
        >
          Explore Now
        </Button>

        {/* Learn More Section */}
        <div className="relative bg-teal-100 bg-opacity-50 p-4 sm:p-8 rounded-lg shadow-lg mt-8">
          <Typography
            variant="h2"
            className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4"
            style={{ color: mode === 'dark' ? 'white' : 'black' }}
          >
            Learn More About Us
          </Typography>
          <Typography
            variant="paragraph"
            className="text-base sm:text-lg mb-4"
            style={{ color: mode === 'dark' ? 'white' : 'black' }}
          >
            Discover our journey, expertise, and what drives us to create valuable content. Explore our mission, meet the team, and understand how we can help you succeed.
          </Typography>
          <Button
            onClick={handleLearnMoreClick} // Attach click handler
            color="teal"
            className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            Learn More
          </Button>
        </div>

        {/* Interactive Link */}
        <div className="text-sm mt-4">
          <a href=" " className="text-teal-300 hover:underline">Explore More Features</a>
        </div>
      </div>

      {/* Custom Cursor with Bubble Effect */}
      <div
        className="custom-cursor"
        style={{ left: cursorPosition.x, top: cursorPosition.y }}
      ></div>
    </section>
  );
}

export default HeroSection;
