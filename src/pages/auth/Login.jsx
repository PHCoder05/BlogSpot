import React, { useContext, useState } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { auth, googleAuthProvider } from '../../firebase/FirebaseConfig';
import toast from 'react-hot-toast';
import myContext from '../../context/data/myContext';
import { FaGoogle } from 'react-icons/fa';
import SEOComponent from '../../components/SEOComponent';

function Login() {
    const context = useContext(myContext);
    const { mode } = context;
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            return toast.error("Email and password are required.");
        }
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Login Successful");
            navigate('/');
        } catch (error) {
            toast.error("Invalid credentials. Please try again.");
            console.error(error);
        }
    };
    
    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleAuthProvider);
            toast.success("Google Login Successful");
            navigate('/');
        } catch (error) {
            toast.error("Google login failed.");
            console.error(error);
        }
    };

    const handlePasswordReset = async () => {
        if (!resetEmail) {
            return toast.error("Please enter your email address.");
        }
        try {
            await sendPasswordResetEmail(auth, resetEmail);
            toast.success("Password reset email sent. Check your inbox.");
            setShowForgotPassword(false);
            setResetEmail('');
        } catch (error) {
            toast.error("Failed to send password reset email.");
            console.error(error);
        }
    };

    return (
        <>
            <SEOComponent 
                type="login"
                currentUrl={window.location.href}
            />
            <div className="flex justify-center items-center h-screen">
            <Card className="w-full max-w-[24rem]" style={{ background: mode === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(226, 232, 240)' }}>
                <CardHeader
                    floated={false}
                    shadow={false}
                    className="m-0 grid place-items-center rounded-b-none py-8 px-4 text-center"
                    style={{ background: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(30, 41, 59)' }}
                >
                    <Typography variant="h4" style={{ color: mode === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(226, 232, 240)' }}>
                        {showForgotPassword ? 'Reset Password' : 'User Login'}
                    </Typography>
                </CardHeader>
                <CardBody>
                    {showForgotPassword ? (
                        <div className="flex flex-col gap-4">
                            <Input type="email" label="Email Address" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
                            <Button onClick={handlePasswordReset} fullWidth>Send Reset Link</Button>
                            <Button onClick={() => setShowForgotPassword(false)} fullWidth variant="text">Back to Login</Button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <Input type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <Input type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <Button onClick={handleLogin} fullWidth>
                                Log In
                            </Button>
                            <Button onClick={handleGoogleLogin} fullWidth className="flex items-center justify-center gap-3 bg-red-500">
                                <FaGoogle/> Log In with Google
                            </Button>
                            <Typography variant="small" className="mt-4 flex justify-between">
                                <span onClick={() => setShowForgotPassword(true)} className="text-blue-500 hover:underline cursor-pointer">
                                    Forgot Password?
                                </span>
                                <Link to="/signup" className="text-blue-500 hover:underline">
                                    Create an account
                                </Link>
                            </Typography>
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
        </>
    );
}

export default Login;
