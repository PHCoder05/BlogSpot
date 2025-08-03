import React from "react";
import { Link } from "react-router-dom";
import { Typography, Button } from "@material-tailwind/react";
import { 
  FaGithub, 
  FaLinkedin, 
  FaTwitter, 
  FaEnvelope, 
  FaHeart, 
  FaRocket, 
  FaCode 
} from "react-icons/fa";
import NewsletterSubscription from "../NewsletterSubscription";

function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "About Blog", path: "/about" },
    { label: "All Articles", path: "/allblogs" },
    { label: "Categories", path: "/categories" },
  ];

  const socialLinks = [
    {
      label: "GitHub",
      url: "https://github.com/PHCoder05",
      icon: FaGithub,
    },
    {
      label: "LinkedIn",
      url: "https://linkedin.com/in/pankaj-hadole",
      icon: FaLinkedin,
    },
    {
      label: "Twitter",
      url: "https://twitter.com/phcoder05",
      icon: FaTwitter,
    },
    {
      label: "Email",
      url: "mailto:pankajhadole24@gmail.com",
      icon: FaEnvelope,
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* About Section */}
          <div>
            <Typography variant="h6" className="text-white font-semibold mb-6">
              About PHcoder05
            </Typography>
            <Typography variant="paragraph" className="text-gray-300 mb-4">
              Your go-to destination for insightful technology articles, programming tutorials, and the latest trends in software development. Join our community of learners and tech enthusiasts!
            </Typography>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FaCode className="text-teal-400 w-4 h-4" />
                <span className="text-gray-300 text-sm">India</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaEnvelope className="text-teal-400 w-4 h-4" />
                <span className="text-gray-300 text-sm">pankajhadole24@gmail.com</span>
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
          <NewsletterSubscription 
            title="Never Miss an Article!"
            description="Subscribe to our blog newsletter and get the latest programming tutorials and tech insights delivered straight to your inbox."
            className="text-center"
          />
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