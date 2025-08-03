import React, { useState, useContext, useEffect } from 'react';
import myContext from '../../context/data/myContext';
import { verifyAccessCode, isAccessCodeVerified } from '../../utils/accessCodeUtils';
import { FaKey, FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AccessCodeModal = ({ isOpen, onClose, onSuccess }) => {
    const context = useContext(myContext);
    const { mode } = context;

    const [accessCode, setAccessCode] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    // Handle already verified access code
    useEffect(() => {
        if (isOpen && isAccessCodeVerified()) {
            onSuccess();
            onClose();
        }
    }, [isOpen, onSuccess, onClose]);

    const handleClose = () => {
        setAccessCode('');
        setShowPassword(false);
        setIsVerifying(false);
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!accessCode.trim()) {
            toast.error('Please enter an access code');
            return;
        }

        setIsVerifying(true);

        try {
            const result = await verifyAccessCode(accessCode.trim());

            if (result.success) {
                toast.success(result.message);
                onSuccess();
                onClose();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('An error occurred while verifying the access code');
        } finally {
            setIsVerifying(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`relative w-full max-w-md ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl p-6`}>
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className={`absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200`}
                >
                    <FaTimes className={`w-5 h-5 ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="mx-auto w-16 h-16 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mb-4">
                        <FaKey className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                    </div>
                    <h2 className={`text-2xl font-bold mb-2 ${mode === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                        Personal Blog Access
                    </h2>
                    <p className={`text-sm ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Enter your access code to view personal thoughts and reflections
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <label className={`block text-sm font-medium mb-2 ${mode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Access Code
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={accessCode}
                                onChange={(e) => setAccessCode(e.target.value)}
                                placeholder="Enter your access code"
                                className={`w-full px-4 py-3 pr-12 rounded-lg border-2 focus:ring-2 focus:ring-teal-500 transition-all duration-200 ${
                                    mode === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                }`}
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded ${
                                    mode === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isVerifying || !accessCode.trim()}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                            isVerifying || !accessCode.trim()
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-teal-500 text-white hover:bg-teal-600 active:bg-teal-700'
                        }`}
                    >
                        {isVerifying ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Verifying...
                            </div>
                        ) : (
                            'Access Personal Blog'
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className={`text-xs ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        This area contains personal thoughts and reflections
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AccessCodeModal; 