import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Typography, Button, Card, CardBody } from '@material-tailwind/react';
import { FaEnvelope, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import NewsletterService from '../utils/newsletterService';
import myContext from '../context/data/myContext';
import SEOComponent from '../components/SEOComponent';

function Unsubscribe() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { mode } = useContext(myContext);
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleUnsubscribe = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      showMessage('Please enter your email address.', 'error');
      return;
    }

    if (!NewsletterService.isValidEmail(email)) {
      showMessage('Please enter a valid email address.', 'error');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const result = await NewsletterService.unsubscribeFromNewsletter(email);
      
      if (result.success) {
        setIsUnsubscribed(true);
        showMessage(result.message, 'success');
      } else {
        showMessage(result.message, 'error');
      }
    } catch (error) {
      showMessage('An unexpected error occurred. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
  };

  const handleResubscribe = () => {
    navigate('/');
  };

  return (
    <>
      <SEOComponent 
        type="unsubscribe"
        currentUrl={window.location.href}
      />
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" 
           style={{ background: mode === 'dark' ? 'linear-gradient(135deg, #1e293b, #334155)' : 'linear-gradient(135deg, #f8fafc, #e2e8f0)' }}>
        
        <div className="max-w-md w-full space-y-8">
          <Card className={mode === 'dark' ? 'bg-gray-800' : 'bg-white'}>
            <CardBody className="p-8">
              
              {/* Header */}
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center mb-4">
                  <FaEnvelope className="text-white text-2xl" />
                </div>
                
                {!isUnsubscribed ? (
                  <>
                    <Typography variant="h4" className={`font-bold mb-2 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Unsubscribe from Newsletter
                    </Typography>
                    <Typography variant="paragraph" className={`${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      We're sorry to see you go! Enter your email to unsubscribe from our newsletter.
                    </Typography>
                  </>
                ) : (
                  <>
                    <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center mb-4">
                      <FaCheck className="text-white text-2xl" />
                    </div>
                    <Typography variant="h4" className={`font-bold mb-2 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Successfully Unsubscribed
                    </Typography>
                    <Typography variant="paragraph" className={`${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      You've been removed from our newsletter. You won't receive any more emails from us.
                    </Typography>
                  </>
                )}
              </div>

              {/* Message Display */}
              {message && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                  messageType === 'success' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                }`}>
                  {messageType === 'success' ? (
                    <FaCheck className="w-5 h-5" />
                  ) : (
                    <FaTimes className="w-5 h-5" />
                  )}
                  <span>{message}</span>
                </div>
              )}

              {/* Unsubscribe Form */}
              {!isUnsubscribed && (
                <form onSubmit={handleUnsubscribe} className="space-y-6">
                  <div>
                    <label htmlFor="email" className={`block text-sm font-medium mb-2 ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        mode === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                      placeholder="Enter your email address"
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    size="lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <FaSpinner className="w-5 h-5 animate-spin" />
                        <span>Unsubscribing...</span>
                      </div>
                    ) : (
                      'Unsubscribe'
                    )}
                  </Button>
                </form>
              )}

              {/* Resubscribe Option */}
              {isUnsubscribed && (
                <div className="space-y-4">
                  <Button
                    onClick={handleResubscribe}
                    className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
                    size="lg"
                  >
                    Resubscribe to Newsletter
                  </Button>
                  
                  <Typography variant="small" className={`text-center ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Changed your mind? You can always resubscribe later by visiting our website.
                  </Typography>
                </div>
              )}

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Typography variant="small" className={`text-center ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  © 2025 PHcoder05. Made with ❤️ by Pankaj Hadole
                </Typography>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}

export default Unsubscribe; 