import React, { useContext } from 'react';
import { Typography, Button } from '@material-tailwind/react';
import myContext from '../../context/data/myContext';
import { useNavigate } from 'react-router-dom';
import './AboutPage.css'; // Import custom CSS for styling

function AboutPage() {
  const context = useContext(myContext);
  const { mode } = context;
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Handler function for Back to Home button
  const handleBackToHomeClick = () => {
    navigate('/'); // Navigate back to the home page
  };

  return (
    <section
      className={`relative flex flex-col items-center justify-center min-h-screen ${mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-blue-100'}`}
    >
      <div className="relative max-w-4xl px-6 py-12 sm:py-16 mx-auto text-center bg-opacity-90 rounded-lg shadow-2xl z-10">
        {/* Header */}
        <Typography
          variant="h1"
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6"
          style={{ color: mode === 'dark' ? 'white' : 'black' }}
        >
          About Us
        </Typography>

        {/* Description */}
        <Typography
          variant="paragraph"
          className="text-base sm:text-lg md:text-xl font-light mb-6"
          style={{ color: mode === 'dark' ? 'white' : 'black' }}
        >
          Welcome to PHcoder Blogs, a hub for insightful articles and tutorials on technology, programming, farming, sports, and more. Our mission is to provide valuable content that educates and inspires our readers. Our team is passionate about sharing knowledge and fostering a community of learning and growth.
        </Typography>

        {/* Team Section */}
        <div className="mb-8">
          <Typography
            variant="h2"
            className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4"
            style={{ color: mode === 'dark' ? 'white' : 'black' }}
          >
            Meet the Team
          </Typography>
          <Typography
            variant="paragraph"
            className="text-base sm:text-lg mb-6"
            style={{ color: mode === 'dark' ? 'white' : 'black' }}
          >
            Our team consists of dedicated professionals with expertise in various fields. We work together to bring you high-quality content and ensure a seamless user experience.
          </Typography>
        </div>

        {/* Call to Action Button */}
        <Button
          onClick={handleBackToHomeClick} // Attach click handler
          color="teal"
          className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 sm:py-3 sm:px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          Back to Home
        </Button>
      </div>
    </section>
  );
}

export default AboutPage;
