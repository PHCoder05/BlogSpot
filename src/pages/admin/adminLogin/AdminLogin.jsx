import React, { useContext, useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Input,
    Button,
    Typography
} from "@material-tailwind/react";
import myContext from "../../../context/data/myContext";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import {
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithPopup
} from "firebase/auth";
import { auth, googleAuthProvider } from "../../../firebase/FirebaseConfig";
import { FaGoogle } from "react-icons/fa";
import SEOComponent from "../../../components/SEOComponent";

export default function AdminLogin() {
    const context = useContext(myContext);
    const { mode } = context;
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');

    const login = async () => {
        if (!email || !password) {
            return toast.error("All fields are required");
        }

        // Only allow specific admin email
        if (email !== "pankajhadole4@gmail.com") {
            return toast.error("Access Denied. Only authorized admins can log in here.");
        }

        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            console.log('Login successful - user:', result.user);
            toast.success("Admin Login successful");
            localStorage.setItem("admin", JSON.stringify(result.user));
            
            console.log('Admin data stored in localStorage');
            
            // Add a small delay to ensure localStorage is set before navigation
            setTimeout(() => {
                console.log('Navigating to dashboard...');
                navigate('/dashboard');
            }, 100);
        } catch (error) {
            console.error(error);
            if (error.code === 'auth/user-not-found') {
                toast.error("Admin account not found.");
            } else if (error.code === 'auth/wrong-password') {
                toast.error("Incorrect password.");
            } else {
                toast.error("Login failed. Please check your credentials.");
            }
        }
    };

    const handleForgotPassword = async () => {
        if (!resetEmail) {
            return toast.error("Email is required");
        }
        try {
            await sendPasswordResetEmail(auth, resetEmail);
            toast.success("Password reset email sent");
            setShowForgotPassword(false);
        } catch (error) {
            toast.error("Failed to send password reset email.");
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleAuthProvider);
            if (result.user.email === "pankajhadole4@gmail.com") {
                toast.success("Google Login successful");
                localStorage.setItem("admin", JSON.stringify(result.user));
                
                // Add a small delay to ensure localStorage is set before navigation
                setTimeout(() => {
                    navigate('/dashboard');
                }, 100);
            } else {
                await auth.signOut();
                toast.error("Access Denied. Only authorized admins can log in via Google here.");
            }
        } catch (error) {
            toast.error("Google login failed.");
        }
    };

    return (
        <>
            <SEOComponent 
                type="admin"
                currentUrl={window.location.href}
                pageType="login"
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
                       {showForgotPassword ? 'Reset Password' : 'Admin Login'}
                    </Typography>
                    <Typography variant="small" style={{ color: mode === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(226, 232, 240)' }} className="mt-2">
                       Authorized administrators only
                    </Typography>
                </CardHeader>
                <CardBody>
                {showForgotPassword ? (
                    <div className="flex flex-col gap-4">
                        <Input type="email" label="Email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
                        <Button onClick={handleForgotPassword}>Reset Password</Button>
                        <Button onClick={() => setShowForgotPassword(false)} variant="text">Back to Login</Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <Input type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <Input type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <Button onClick={login}>Login</Button>
                        <Button onClick={handleGoogleLogin} className="flex items-center justify-center bg-black text-white">
                            <FaGoogle className="mr-2" /> Login with Google
                        </Button>
                        <Button onClick={() => setShowForgotPassword(true)} variant="text">Forgot Password?</Button>
                    </div>
                )}
                </CardBody>
            </Card>
        </div>
        </>
    );
}
