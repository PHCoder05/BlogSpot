import React, { useContext } from 'react';
import { Typography, Button, Card, CardBody } from '@material-tailwind/react';
import myContext from '../../context/data/myContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import { 
  FaBookOpen, FaCode, FaCloud, FaServer, FaGraduationCap, FaPen, 
  FaHeart, FaUsers, FaCalendarAlt, FaGithub, FaLinkedin, FaTwitter, 
  FaEnvelope, FaRocket, FaLightbulb, FaStar, FaAward
} from 'react-icons/fa';
import './AboutPage.css';

function AboutPage() {
  const context = useContext(myContext);
  const { mode, getAllBlog } = context;
  const navigate = useNavigate();

  const handleBackToHomeClick = () => {
    navigate('/');
  };

  const handleExploreBlogsClick = () => {
    navigate('/allblogs');
  };

  const socialLinks = [
    { icon: FaGithub, url: 'https://github.com/phcoder05', label: 'GitHub' },
    { icon: FaLinkedin, url: 'https://linkedin.com/in/pankaj-hadole', label: 'LinkedIn' },
    { icon: FaTwitter, url: 'https://twitter.com/phcoder05', label: 'Twitter' },
    { icon: FaEnvelope, url: 'mailto:pankajhadole24@gmail.com', label: 'Email' }
  ];

  const blogTopics = [
    { icon: FaCode, title: 'Programming', description: 'JavaScript, Python, React, Node.js tutorials' },
    { icon: FaCloud, title: 'Cloud Computing', description: 'AWS, Azure, Docker, Kubernetes guides' },
    { icon: FaServer, title: 'DevOps', description: 'CI/CD, automation, deployment strategies' },
    { icon: FaGraduationCap, title: 'Learning', description: 'Career advice, skill development tips' }
  ];

  const achievements = [
    { icon: FaBookOpen, number: `${getAllBlog?.length || 0}+`, label: 'Published Articles' },
    { icon: FaUsers, number: '5K+', label: 'Monthly Readers' },
    { icon: FaHeart, number: '1K+', label: 'Likes & Shares' },
    { icon: FaAward, number: '2+', label: 'Years Writing' }
  ];

  return (
    <Layout>
      <section className={`relative min-h-screen py-20 ${
        mode === 'dark' ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-100'
      }`}>
        
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="bubbles-overlay"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 mb-6">
              <FaPen className="w-8 h-8 text-white" />
            </div>
            
            <Typography
              variant="h1"
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ color: mode === 'dark' ? 'white' : 'rgb(30, 41, 59)' }}
            >
              About{' '}
              <span className="bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                PHcoder05 Blog
              </span>
            </Typography>

            <Typography
              variant="paragraph"
              className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto"
              style={{ color: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(75, 85, 99)' }}
            >
              A passionate corner of the internet dedicated to sharing knowledge, insights, 
              and experiences in technology, programming, and software development.
            </Typography>
          </div>

          {/* Blog Mission Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <Card className={`p-8 ${
              mode === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'
            }`}>
              <CardBody className="p-0">
                <div className="flex items-center mb-6">
                  <FaLightbulb className="w-8 h-8 text-teal-500 mr-3" />
                  <Typography variant="h3" className={`text-2xl font-bold ${mode === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    Our Mission
                  </Typography>
                </div>
                <Typography
                  variant="paragraph"
                  className="text-lg leading-relaxed"
                  style={{ color: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(75, 85, 99)' }}
                >
                  To make complex technology concepts accessible to everyone. Whether you're a beginner 
                  taking your first steps in programming or an experienced developer looking to expand 
                  your skills, this blog aims to provide valuable insights and practical knowledge.
                </Typography>
              </CardBody>
            </Card>

            <Card className={`p-8 ${
              mode === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'
            }`}>
              <CardBody className="p-0">
                <div className="flex items-center mb-6">
                  <FaRocket className="w-8 h-8 text-blue-500 mr-3" />
                  <Typography variant="h3" className={`text-2xl font-bold ${mode === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    What You'll Find
                  </Typography>
                </div>
                <Typography
                  variant="paragraph"
                  className="text-lg leading-relaxed"
                  style={{ color: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(75, 85, 99)' }}
                >
                  In-depth tutorials, practical coding examples, technology reviews, career advice, 
                  and insights from real-world software development experiences. Each article is 
                  crafted with care to provide genuine value to the tech community.
                </Typography>
              </CardBody>
            </Card>
          </div>

          {/* About the Author Section */}
          <div className="mb-16">
            <Card className={`p-8 ${
              mode === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'
            }`}>
              <CardBody className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                  <div className="text-center lg:text-left">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 mx-auto lg:mx-0 mb-4 flex items-center justify-center">
                      <img
                        className="w-28 h-28 object-cover rounded-full"
                        src="https://cdn-icons-png.flaticon.com/128/2921/2921222.png"
                        alt="Pankaj Hadole"
                      />
                    </div>
                  </div>
                  
                  <div className="lg:col-span-2">
                    <Typography variant="h3" className={`text-2xl font-bold mb-4 ${mode === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                      Meet Pankaj Hadole
                    </Typography>
                    <Typography
                      variant="paragraph"
                      className="text-lg leading-relaxed mb-6"
                      style={{ color: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(75, 85, 99)' }}
                    >
                      A passionate software developer and tech enthusiast with expertise in full-stack development, 
                      cloud technologies, and modern web frameworks. With years of hands-on experience in the 
                      industry, I love sharing knowledge and helping others grow in their tech journey.
                    </Typography>
                    
                    <div className="flex flex-wrap gap-4">
                      {socialLinks.map((social, index) => (
                        <a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                            mode === 'dark' 
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <social.icon className="w-5 h-5" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Blog Topics Section */}
          <div className="mb-16">
            <Typography
              variant="h2"
              className="text-3xl md:text-4xl font-bold text-center mb-12"
              style={{ color: mode === 'dark' ? 'white' : 'rgb(30, 41, 59)' }}
            >
              What We Cover
            </Typography>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {blogTopics.map((topic, index) => (
                <Card 
                  key={index}
                  className={`p-6 text-center transition-all duration-300 hover:scale-105 ${
                    mode === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'
                  }`}
                >
                  <CardBody className="p-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 mx-auto mb-4 flex items-center justify-center">
                      <topic.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className={`text-xl font-bold mb-3 ${mode === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                      {topic.title}
                    </h3>
                    <p className={`${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {topic.description}
                    </p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>

          {/* Blog Stats Section */}
          <div className="mb-16">
            <Typography
              variant="h2"
              className="text-3xl md:text-4xl font-bold text-center mb-12"
              style={{ color: mode === 'dark' ? 'white' : 'rgb(30, 41, 59)' }}
            >
              Blog Statistics
            </Typography>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => (
                <Card 
                  key={index}
                  className={`p-6 text-center transition-all duration-300 hover:scale-105 ${
                    mode === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'
                  }`}
                >
                  <CardBody className="p-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 mx-auto mb-3 flex items-center justify-center">
                      <achievement.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">
                      {achievement.number}
                    </div>
                    <div className={`text-sm font-medium ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {achievement.label}
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Card className={`p-12 ${
              mode === 'dark' 
                ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700' 
                : 'bg-gradient-to-r from-teal-50 to-blue-50 border-gray-200'
            }`}>
              <CardBody className="p-0">
                <Typography
                  variant="h2"
                  className="text-3xl md:text-4xl font-bold mb-6"
                  style={{ color: mode === 'dark' ? 'white' : 'rgb(30, 41, 59)' }}
                >
                  Ready to Start Learning?
                </Typography>
                <Typography
                  variant="paragraph"
                  className="text-xl mb-8"
                  style={{ color: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(75, 85, 99)' }}
                >
                  Dive into our collection of articles and start your journey of continuous learning and growth.
                </Typography>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handleExploreBlogsClick}
                    size="lg"
                    className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <FaBookOpen className="mr-2" />
                    Explore All Articles
                  </Button>
                  <Button
                    onClick={handleBackToHomeClick}
                    variant="outlined"
                    size="lg"
                    className="border-2 border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Back to Home
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default AboutPage;