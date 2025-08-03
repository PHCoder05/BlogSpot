import React, { useState, useEffect, useContext } from "react";
import { Typography, Button, Card, CardBody } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaArrowRight, 
  FaGithub, 
  FaLinkedin, 
  FaTwitter, 
  FaEnvelope, 
  FaRss 
} from "react-icons/fa";
import myContext from "../../context/data/myContext";
import NewsletterSubscription from "../NewsletterSubscription";

function HeroSection() {
  const { mode } = useContext(myContext);
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleExploreBlogsClick = () => {
    navigate("/allblogs");
  };

  const handleSubscribeClick = () => {
    // Scroll to newsletter section
    document.getElementById("newsletter-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSearchClick = () => {
    // Implement search functionality
    console.log("Search clicked");
  };

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  const socialLinks = [
    {
      label: "GitHub",
      url: "https://github.com/PHCoder05",
      icon: FaGithub,
      color: "hover:text-gray-900",
    },
    {
      label: "LinkedIn",
      url: "https://linkedin.com/in/pankaj-hadole",
      icon: FaLinkedin,
      color: "hover:text-blue-600",
    },
    {
      label: "Twitter",
      url: "https://twitter.com/phcoder05",
      icon: FaTwitter,
      color: "hover:text-blue-400",
    },
    {
      label: "Email",
      url: "mailto:pankajhadole24@gmail.com",
      icon: FaEnvelope,
      color: "hover:text-red-500",
    },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 via-blue-500/20 to-purple-500/20 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="max-w-4xl mx-auto px-6 text-center">
          
          {/* Animated Logo */}
          <div className="mb-8 flex justify-center">
            <div className={`w-24 h-24 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center shadow-2xl ${
              isAnimating ? 'animate-bounce' : ''
            }`}>
              <span className="text-white font-bold text-3xl">P</span>
            </div>
          </div>

          {/* Main Heading */}
          <Typography
            variant="h1"
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent"
          >
            Welcome to TechCraft Hub
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="h2"
            className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300"
          >
            Dive into insightful articles about programming, technology, cloud computing, and software development
          </Typography>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={handleExploreBlogsClick}
              size="lg"
              className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Explore Articles
              <FaArrowRight className="ml-2" />
            </Button>
            
            <Button
              onClick={handleSubscribeClick}
              variant="outlined"
              size="lg"
              className="border-2 border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Subscribe to Newsletter
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <Typography variant="h3" className="text-3xl font-bold text-teal-500 mb-2">
                50+
              </Typography>
              <Typography variant="paragraph" className="text-gray-600 dark:text-gray-300">
                Articles Published
              </Typography>
            </div>
            <div className="text-center">
              <Typography variant="h3" className="text-3xl font-bold text-blue-500 mb-2">
                10K+
              </Typography>
              <Typography variant="paragraph" className="text-gray-600 dark:text-gray-300">
                Readers Worldwide
              </Typography>
            </div>
            <div className="text-center">
              <Typography variant="h3" className="text-3xl font-bold text-purple-500 mb-2">
                24/7
              </Typography>
              <Typography variant="paragraph" className="text-gray-600 dark:text-gray-300">
                Learning Available
              </Typography>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button
              onClick={handleExploreBlogsClick}
              variant="outlined"
              size="lg"
              className="border-2 border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white py-3 px-6 rounded-xl transition-all duration-300 group"
            >
              View All Posts
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Newsletter Section */}
      <section id="newsletter-section" className="relative z-10 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <Card className={`p-12 text-center ${
            mode === 'dark' 
              ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700' 
              : 'bg-gradient-to-r from-teal-50 to-blue-50 border-gray-200'
          }`}>
            <CardBody className="p-0">
              <div className="mb-6">
                <FaRss className={`w-12 h-12 mx-auto mb-4 ${mode === 'dark' ? 'text-teal-400' : 'text-teal-500'} animate-pulse`} />
              </div>
              <NewsletterSubscription 
                title="Never Miss a Post!"
                description="Subscribe to our newsletter and get the latest blog posts delivered straight to your inbox."
                className="text-center"
              />
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Enhanced Social Links */}
      <section className="relative z-10 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Typography
            variant="h6"
            className="mb-6"
            style={{ color: mode === 'dark' ? 'white' : 'rgb(30, 41, 59)' }}
          >
            Follow for Updates
          </Typography>
          <div className="flex justify-center gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 hover:rotate-12 ${
                  mode === 'dark' 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                } shadow-lg hover:shadow-xl ${social.color}`}
                aria-label={`Follow us on ${social.label}`}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HeroSection;