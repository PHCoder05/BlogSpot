import React, { useState, useContext, useEffect } from 'react';
import { Card, CardBody, Typography, Button, Input } from '@material-tailwind/react';
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import { FaKey, FaPlus, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import myContext from '../../../context/data/myContext';
import { Link, useNavigate } from 'react-router-dom';
import { addAccessCode } from '../../../utils/accessCodeUtils';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { fireDb } from '../../../firebase/FirebaseConfig';
import toast from 'react-hot-toast';
import SEOComponent from '../../../components/SEOComponent';

function AccessCodeManager() {
    const context = useContext(myContext);
    const { mode } = context;
    const navigate = useNavigate();

    const [accessCodes, setAccessCodes] = useState([]);
    const [newCode, setNewCode] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [defaultCode, setDefaultCode] = useState('personal2024');

    // Load access codes from Firebase
    const loadAccessCodes = async () => {
        try {
            const accessCodeDoc = await getDoc(doc(fireDb, 'accessCodes', 'personal'));
            if (accessCodeDoc.exists()) {
                const codes = accessCodeDoc.data().codes || [];
                setAccessCodes(codes);
            }
        } catch (error) {
            console.error('Error loading access codes:', error);
            toast.error('Error loading access codes');
        }
    };

    useEffect(() => {
        loadAccessCodes();
    }, []);

    // Add new access code
    const handleAddCode = async () => {
        if (!newCode.trim()) {
            toast.error('Please enter an access code');
            return;
        }

        if (newCode.length < 4) {
            toast.error('Access code must be at least 4 characters long');
            return;
        }

        setLoading(true);
        try {
            const result = await addAccessCode(newCode.trim());
            if (result.success) {
                toast.success(result.message);
                setNewCode('');
                loadAccessCodes(); // Reload the list
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error adding access code:', error);
            toast.error('Error adding access code');
        } finally {
            setLoading(false);
        }
    };

    // Remove access code
    const handleRemoveCode = async (codeToRemove) => {
        try {
            const accessCodeDoc = await getDoc(doc(fireDb, 'accessCodes', 'personal'));
            if (accessCodeDoc.exists()) {
                const currentCodes = accessCodeDoc.data().codes || [];
                const updatedCodes = currentCodes.filter(code => code !== codeToRemove);
                
                await updateDoc(doc(fireDb, 'accessCodes', 'personal'), {
                    codes: updatedCodes,
                    updatedAt: new Date()
                });
                
                toast.success('Access code removed successfully');
                loadAccessCodes(); // Reload the list
            }
        } catch (error) {
            console.error('Error removing access code:', error);
            toast.error('Error removing access code');
        }
    };

    // Copy code to clipboard
    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        toast.success('Access code copied to clipboard');
    };

    return (
        <>
            <SEOComponent 
                type="admin"
                currentUrl={window.location.href}
                pageType="access-codes"
            />
            
            <div className={`min-h-screen ${mode === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className='container mx-auto max-w-4xl py-6 px-4'>
                    
                    {/* Header */}
                    <Card className={`mb-6 ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                        <CardBody className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex gap-3 items-center">
                                    <Link to={'/dashboard'}>
                                        <BsFillArrowLeftCircleFill 
                                            size={25} 
                                            className={`hover:scale-110 transition-transform ${
                                                mode === 'dark' ? 'text-white' : 'text-gray-800'
                                            }`}
                                        />
                                    </Link>
                                    <Typography
                                        variant="h4"
                                        className={`font-bold flex items-center gap-2 ${
                                            mode === 'dark' ? 'text-white' : 'text-gray-800'
                                        }`}
                                    >
                                        <FaKey className="w-6 h-6 text-teal-500" />
                                        Access Code Manager
                                    </Typography>
                                </div>
                            </div>
                            <p className={`text-sm ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                Manage access codes for personal blog entries
                            </p>
                        </CardBody>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        
                        {/* Add New Access Code */}
                        <Card className={mode === 'dark' ? 'bg-gray-800' : 'bg-white'}>
                            <CardBody className="p-6">
                                <Typography
                                    variant="h6"
                                    className="mb-4 font-semibold flex items-center gap-2"
                                    style={{ color: mode === 'dark' ? 'white' : 'black' }}
                                >
                                    <FaPlus className="w-5 h-5 text-teal-500" />
                                    Add New Access Code
                                </Typography>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: mode === 'dark' ? 'white' : 'black' }}>
                                            New Access Code
                                        </label>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? 'text' : 'password'}
                                                value={newCode}
                                                onChange={(e) => setNewCode(e.target.value)}
                                                placeholder="Enter new access code"
                                                className={`pr-12 ${
                                                    mode === 'dark' 
                                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                                }`}
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
                                    
                                    <Button
                                        onClick={handleAddCode}
                                        disabled={loading || !newCode.trim()}
                                        className="w-full"
                                        color="teal"
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Adding...
                                            </div>
                                        ) : (
                                            'Add Access Code'
                                        )}
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Default Access Code Info */}
                        <Card className={mode === 'dark' ? 'bg-gray-800' : 'bg-white'}>
                            <CardBody className="p-6">
                                <Typography
                                    variant="h6"
                                    className="mb-4 font-semibold flex items-center gap-2"
                                    style={{ color: mode === 'dark' ? 'white' : 'black' }}
                                >
                                    <FaKey className="w-5 h-5 text-blue-500" />
                                    Default Access Code
                                </Typography>
                                
                                <div className="space-y-4">
                                    <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                                        <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                                            The default access code is always available:
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <code className="text-lg font-mono bg-blue-100 dark:bg-blue-800 px-3 py-2 rounded">
                                                {defaultCode}
                                            </code>
                                            <Button
                                                size="sm"
                                                variant="outlined"
                                                onClick={() => copyToClipboard(defaultCode)}
                                                className="text-xs"
                                            >
                                                Copy
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    <div className="text-xs text-gray-600 dark:text-gray-400">
                                        <p>• This code is hardcoded and cannot be removed</p>
                                        <p>• Users can always access personal blogs with this code</p>
                                        <p>• You can add additional codes for different users</p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Current Access Codes */}
                    <Card className={`mt-6 ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                        <CardBody className="p-6">
                            <Typography
                                variant="h6"
                                className="mb-4 font-semibold"
                                style={{ color: mode === 'dark' ? 'white' : 'black' }}
                            >
                                Current Access Codes ({accessCodes.length + 1})
                            </Typography>
                            
                            <div className="space-y-3">
                                {/* Default code */}
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <FaKey className="w-4 h-4 text-blue-500" />
                                        <code className="font-mono">{defaultCode}</code>
                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                            Default
                                        </span>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outlined"
                                        onClick={() => copyToClipboard(defaultCode)}
                                        className="text-xs"
                                    >
                                        Copy
                                    </Button>
                                </div>
                                
                                {/* Custom codes */}
                                {accessCodes.map((code, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <FaKey className="w-4 h-4 text-teal-500" />
                                            <code className="font-mono">{code}</code>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outlined"
                                                onClick={() => copyToClipboard(code)}
                                                className="text-xs"
                                            >
                                                Copy
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outlined"
                                                color="red"
                                                onClick={() => handleRemoveCode(code)}
                                                className="text-xs"
                                            >
                                                <FaTrash className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                
                                {accessCodes.length === 0 && (
                                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        <FaKey className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                        <p>No custom access codes added yet.</p>
                                        <p className="text-sm">Add your first access code above.</p>
                                    </div>
                                )}
                            </div>
                        </CardBody>
                    </Card>

                    {/* Instructions */}
                    <Card className={`mt-6 ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                        <CardBody className="p-6">
                            <Typography
                                variant="h6"
                                className="mb-4 font-semibold"
                                style={{ color: mode === 'dark' ? 'white' : 'black' }}
                            >
                                How to Use Access Codes
                            </Typography>
                            
                            <div className="space-y-3 text-sm">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                                        1
                                    </div>
                                    <div>
                                        <p className="font-medium" style={{ color: mode === 'dark' ? 'white' : 'black' }}>
                                            Create Personal Blogs
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            When creating a blog post, toggle the "Personal Blog" option to make it access code protected.
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                                        2
                                    </div>
                                    <div>
                                        <p className="font-medium" style={{ color: mode === 'dark' ? 'white' : 'black' }}>
                                            Share Access Codes
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Share the access code with people who should have access to your personal thoughts.
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                                        3
                                    </div>
                                    <div>
                                        <p className="font-medium" style={{ color: mode === 'dark' ? 'white' : 'black' }}>
                                            Access Personal Blogs
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Users can visit the "Personal Thoughts" page and enter the access code to view personal blogs.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </>
    );
}

export default AccessCodeManager; 