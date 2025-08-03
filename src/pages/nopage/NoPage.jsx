import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography } from '@material-tailwind/react';
import SEOComponent from '../../components/SEOComponent';
import './NoPage.css'; // Import custom CSS for additional styling

// Helper function to shuffle an array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const generateCards = () => {
  const values = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const cards = [...values, ...values];
  return shuffleArray(cards);
};

const MemoryGame = () => {
  const [cards, setCards] = useState(generateCards());
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      if (cards[firstIndex] === cards[secondIndex]) {
        setMatchedCards((prev) => [...prev, cards[firstIndex]]);
      }
      setTimeout(() => setFlippedIndices([]), 1000);
    }
  }, [flippedIndices]);

  const handleCardClick = (index) => {
    if (flippedIndices.length < 2 && !flippedIndices.includes(index)) {
      setFlippedIndices((prev) => [...prev, index]);
      setMoves((prev) => prev + 1);
    }
  };

  return (
    <div>
      <Typography variant="h6" color="gray-900" className="text-xl font-semibold dark:text-white">
        Memory Game - Moves: {moves}
      </Typography>
      <div className="grid grid-cols-4 gap-2 mt-4">
        {cards.map((value, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(index)}
            className={`w-16 h-16 flex items-center justify-center border border-gray-300 rounded cursor-pointer transition transform hover:scale-105 ${
              flippedIndices.includes(index) || matchedCards.includes(value)
                ? 'bg-white dark:bg-gray-700'
                : 'bg-gray-200 dark:bg-gray-600'
            }`}
          >
            {(flippedIndices.includes(index) || matchedCards.includes(value)) && (
              <Typography variant="h4" color="gray-900" className="dark:text-white">
                {value}
              </Typography>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const NoPage = () => {
  return (
    <>
      <SEOComponent type="404" currentUrl={window.location.href} />
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-800 text-center px-4">
      <div className="animated-container">
        <Typography variant="h1" color="gray-900" className="text-6xl font-bold dark:text-white animate-bounce">
          404
        </Typography>
        <Typography variant="h5" color="gray-600" className="mt-4 mb-6 dark:text-gray-400">
          Oops! The page you are looking for does not exist.
        </Typography>

        {/* Game Section */}
        <div className="mb-6">
          <Typography variant="h4" color="gray-900" className="text-2xl font-bold mb-4 dark:text-white">
            Memory Game
          </Typography>
          <MemoryGame /> {/* Display Memory Game */}
        </div>

        {/* Link Back Home */}
        <Link to="/">
          <Button
            color="blue"
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Go Back Home
          </Button>
        </Link>
      </div>
    </div>
    </>
  );
};

export default NoPage; // Ensure only one default export
