import React, { useContext } from 'react';
import { Typography, Button } from '@material-tailwind/react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaHeart, FaCode, FaRocket, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import myContext from '../../context/data/myContext';

function Footer() {
  const context = useContext(myContext);
  const { mode } = context;
  
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { icon: FaGithub, url: 'https://github.com/phcoder05', label: 'GitHub' },
    { icon: FaLinkedin, url: 'https://linkedin.com/in/pankaj-hadole', label: 'LinkedIn' },
    { icon: FaTwitter, url: 'https://twitter.com/phcoder05', label: 'Twitter' },
    { icon: FaEnvelope, url: 'mailto:pankajhadole24@gmail.com', label: 'Email' }
  ];

            const quickLinks = [
            { label: 'Home', path: '/' },
            { label: 'About Blog', path: '/about' },
            { label: 'All Articles', path: '/allblogs' },
            { label: 'Categories', path: '/allblogs' }
          ];

  return (
    <footer className={`relative ${
      mode === 'dark' 
        ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800'
    } text-white`}>
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <Typography variant="h4" className="text-white font-bold">
                PHcoder05
              </Typography>
        </div>

            <Typography variant="paragraph" className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Your go-to destination for insightful technology articles, programming tutorials, 
              and the latest trends in software development. Join our community of learners 
              and tech enthusiasts!
            </Typography>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <FaMapMarkerAlt className="text-teal-400" />
                <span>India</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <FaEnvelope className="text-teal-400" />
                <a href="mailto:pankajhadole24@gmail.com" className="hover:text-teal-400 transition-colors">
                  pankajhadole24@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <Typography variant="h6" className="text-white font-semibold mb-6">
              Quick Links
            </Typography>
            <div className="space-y-3">
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="block text-gray-300 hover:text-teal-400 transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Skills & Technologies */}
          <div>
            <Typography variant="h6" className="text-white font-semibold mb-6">
              Technologies
            </Typography>
            <div className="space-y-2">
              {['React.js', 'Node.js', 'Python', 'MongoDB', 'AWS', 'Docker'].map((tech, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <FaCode className="text-teal-400 w-3 h-3" />
                  <span className="text-gray-300 text-sm">{tech}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 p-8 bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-2xl border border-teal-500/20">
          <div className="text-center">
            <Typography variant="h5" className="text-white font-bold mb-4">
              Never Miss an Article!
            </Typography>
            <Typography variant="paragraph" className="text-gray-300 mb-6">
              Subscribe to our blog newsletter and get the latest programming tutorials and tech insights delivered straight to your inbox.
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-teal-500"
              />
              <Button className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 px-6 py-3 rounded-lg">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-gray-300">
              <span>© {currentYear} PHcoder05. Made with</span>
              <FaHeart className="text-red-500 animate-pulse" />
              <span>by Pankaj Hadole</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-teal-500 hover:to-blue-500 text-gray-300 hover:text-white transition-all duration-300 transform hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* Blog Badge */}
            <div className="flex items-center space-x-2 text-gray-300">
              <FaRocket className="text-teal-400" />
              <span className="text-sm">New articles weekly</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;