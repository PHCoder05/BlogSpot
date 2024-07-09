import React, { useContext } from 'react';
import myContext from '../../context/data/myContext';

function Footer() {
  const context = useContext(myContext);
  const { mode } = context;

  return (
    <footer
      className={`bg-gray-900 dark:bg-gray-800 text-white ${mode === 'dark' ? 'bg-gray-900' : 'bg-gray-800'}`}
    >
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center">
        {/* Left Content: Logo */}
        <div className="flex items-center space-x-4">
          <img
            className="w-12 h-12 rounded-full"
            src="src/Screenshot_5.jpg"
            alt="logo"
          />
          <span className="text-xl font-semibold md:text-2xl">PHCoder05</span>
        </div>

        {/* Center Content: Copyright */}
        <p className="text-sm mt-4 md:mt-0 text-center md:text-center flex-grow">
          © 2024 PHcoder05 —
          <a
            href="https://www.linkedin.com/in/pankaj-hadole-722476232/"
            className="text-blue-400 hover:text-blue-600 ml-1"
            rel="noopener noreferrer"
            target="_blank"
          >
            Pankaj Hadole
          </a>
        </p>

        {/* Right Content: Social Media Icons */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a
            href="https://www.facebook.com/"
            className="text-gray-400 hover:text-white transition-colors duration-300"
            aria-label="Facebook"
          >
            <svg
              fill="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              className="w-6 h-6"
              viewBox="0 0 24 24"
            >
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
            </svg>
          </a>

          <a
            href="https://twitter.com/pankaj_hadole"
            className="text-gray-400 hover:text-white transition-colors duration-300"
            aria-label="Twitter"
          >
            <svg
              fill="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              className="w-6 h-6"
              viewBox="0 0 24 24"
            >
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
            </svg>
          </a>

          <a
            href="https://www.instagram.com/krish_0512_"
            className="text-gray-400 hover:text-white transition-colors duration-300"
            aria-label="Instagram"
          >
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              className="w-6 h-6"
              viewBox="0 0 24 24"
            >
              <rect width={20} height={20} x={2} y={2} rx={5} ry={5} />
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01" />
            </svg>
          </a>

          <a
            href="https://www.linkedin.com/in/pankaj-hadole-722476232/"
            className="text-gray-400 hover:text-white transition-colors duration-300"
            aria-label="LinkedIn"
          >
            <svg
              fill="currentColor"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={0}
              className="w-6 h-6"
              viewBox="0 0 24 24"
            >
              <path
                stroke="none"
                d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
              />
              <circle cx={4} cy={4} r={2} stroke="none" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
