import React, { useContext, useEffect, useState } from "react";
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
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithPopup,
    signInWithPhoneNumber,
    RecaptchaVerifier,
    getAuth
} from "firebase/auth";
import { auth, googleAuthProvider } from "../../../firebase/FirebaseConfig";
import { FaGoogle, FaPhoneAlt } from "react-icons/fa"; // Import icons

export default function AdminLogin() {
    const context = useContext(myContext);
    const { mode } = context;
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [showPhoneAuth, setShowPhoneAuth] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    
        if (showPhoneAuth) {
            const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
                size: 'invisible',
                callback: (response) => {
                    // reCAPTCHA solved, allow sendOTP function
                }
            }, auth);
            window.recaptchaVerifier = recaptchaVerifier; // Store the verifier instance
        }
    }, [showPhoneAuth]);
    

    const login = async () => {
        if (!email || !password) {
            return toast.error("All fields are required");
        }

        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            toast.success("Login successful");
            localStorage.setItem("admin", JSON.stringify(result));
            navigate('/dashboard');
        } catch (error) {
            console.log(error);
            toast.error("Login failed. Please check your email and password.");
        }
    };

    const register = async () => {
        if (!email || !password) {
            return toast.error("All fields are required");
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            toast.success("Registration successful");
            setIsRegistering(false);
            setEmail('');
            setPassword('');
        } catch (error) {
            console.log(error);
            if (error.code === 'auth/email-already-in-use') {
                toast.error("Email is already in use. Please log in instead.");
            } else {
                toast.error("Registration failed. Please try again.");
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
            setResetEmail('');
            setShowForgotPassword(false);
        } catch (error) {
            console.log(error);
            toast.error("Failed to send password reset email. Please try again.");
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleAuthProvider);
            toast.success("Logged in with Google");
            localStorage.setItem("admin", JSON.stringify(result));
            navigate('/dashboard');
        } catch (error) {
            console.log(error);
            toast.error("Google login failed. Please try again.");
        }
    };

    const sendOtp = async () => {
        if (!phoneNumber) {
            return toast.error("Phone number is required");
        }

        const appVerifier = window.recaptchaVerifier;
        try {
            const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            setConfirmationResult(result);
            toast.success("OTP sent to your phone");
        } catch (error) {
            console.log(error);
            toast.error("Failed to send OTP. Please try again.");
        }
    };

    const verifyOtp = async () => {
        if (!otp) {
            return toast.error("OTP is required");
        }

        try {
            await confirmationResult.confirm(otp);
            toast.success("Phone number verified");
            localStorage.setItem("admin", JSON.stringify(confirmationResult));
            navigate('/dashboard');
        } catch (error) {
            console.log(error);
            toast.error("Failed to verify OTP. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <Card
                className="w-full max-w-[24rem]"
                style={{
                    background: mode === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(226, 232, 240)'
                }}
            >
                <CardHeader
                    color="blue"
                    floated={false}
                    shadow={false}
                    className="m-0 grid place-items-center rounded-b-none py-8 px-4 text-center"
                    style={{
                        background: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(30, 41, 59)'
                    }}
                >
                    <div className="mb-4 rounded-full border border-white/10 bg-white/10 p-2 text-white">
                        <div className="flex justify-center">
                            <img src="https://cdn-icons-png.flaticon.com/128/727/727399.png" className="h-20 w-20" alt="logo" />
                        </div>
                    </div>
                    <Typography variant="h4" style={{
                        color: mode === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(226, 232, 240)'
                    }}>
                        {isRegistering ? "Admin Register" : "Admin Login"}
                    </Typography>
                </CardHeader>
                <CardBody>
                    <div className="flex">
                        <div className={`w-full ${isRegistering ? "block" : "hidden"}`}>
                            {showPhoneAuth ? (
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <Input
                                            type="tel"
                                            label="Phone Number"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                        />
                                    </div>
                                    <div id="recaptcha-container"></div>
                                    <Button onClick={sendOtp}>Send OTP</Button>
                                    <div className="mt-4">
                                        <Input
                                            type="text"
                                            label="Enter OTP"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                        />
                                        <Button onClick={verifyOtp}>Verify OTP</Button>
                                    </div>
                                </div>
                            ) : (
                                <form className="flex flex-col gap-4">
                                    <div>
                                        <Input
                                            type="email"
                                            label="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            type="password"
                                            label="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    <Button
                                        onClick={register}
                                        style={{
                                            background: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(30, 41, 59)',
                                            color: mode === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(226, 232, 240)'
                                        }}
                                    >
                                        Register
                                    </Button>
                                    <Button
                                        onClick={() => setIsRegistering(false)}
                                        style={{
                                            background: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(30, 41, 59)',
                                            color: mode === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(226, 232, 240)'
                                        }}
                                    >
                                        Already have an account?
                                    </Button>
                                    <Button
                                        onClick={handleGoogleLogin}
                                        className="flex items-center justify-center bg-black text-white"
                                    >
                                        <FaGoogle className="mr-2" /> Register with Google
                                    </Button>
                                    {/* Removed GitHub Button */}
                                </form>
                            )}
                        </div>
                        <div className={`w-full ${!isRegistering ? "block" : "hidden"}`}>
                            {showForgotPassword ? (
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <Input
                                            type="email"
                                            label="Email"
                                            value={resetEmail}
                                            onChange={(e) => setResetEmail(e.target.value)}
                                        />
                                    </div>
                                    <Button onClick={handleForgotPassword}>Reset Password</Button>
                                    <Button onClick={() => setShowForgotPassword(false)}>Back to Login</Button>
                                </div>
                            ) : (
                                <form className="flex flex-col gap-4">
                                    <div>
                                        <Input
                                            type="email"
                                            label="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            type="password"
                                            label="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    <Button
                                        onClick={login}
                                        style={{
                                            background: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(30, 41, 59)',
                                            color: mode === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(226, 232, 240)'
                                        }}
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        onClick={() => setIsRegistering(true)}
                                        style={{
                                            background: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(30, 41, 59)',
                                            color: mode === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(226, 232, 240)'
                                        }}
                                    >
                                        Create an account
                                    </Button>
                                    <Button
                                        onClick={() => setShowForgotPassword(true)}
                                        style={{
                                            background: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(30, 41, 59)',
                                            color: mode === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(226, 232, 240)'
                                        }}
                                    >
                                        Forgot Password
                                    </Button>
                                    <Button
                                        onClick={handleGoogleLogin}
                                        className="flex items-center justify-center bg-black text-white"
                                    >
                                        <FaGoogle className="mr-2" /> Login with Google
                                    </Button>
                                    <Button
                                        onClick={() => setShowPhoneAuth(true)}
                                        className="flex items-center justify-center"
                                        style={{
                                            background: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(30, 41, 59)',
                                            color: mode === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(226, 232, 240)'
                                        }}
                                    >
                                        <FaPhoneAlt className="mr-2" /> Login with Mobile Number
                                    </Button>
                                </form>
                            )}
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
