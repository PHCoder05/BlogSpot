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
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, fireDb, googleAuthProvider } from '../../firebase/FirebaseConfig';
import toast from 'react-hot-toast';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import myContext from '../../context/data/myContext';
import { FaGoogle } from 'react-icons/fa';
import SEOComponent from '../../components/SEOComponent';

function Signup() {
    const context = useContext(myContext);
    const { mode } = context;
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        if (!name || !email || !password) {
            return toast.error("All fields are required");
        }

        try {
            const users = await createUserWithEmailAndPassword(auth, email, password);

            const user = {
                name: name,
                uid: users.user.uid,
                email: users.user.email,
                time: Timestamp.now(),
                role: 'user' // Default role
            };

            const userRef = doc(fireDb, "users", users.user.uid);
            await setDoc(userRef, user);

            toast.success("Signup Successful");
            setName("");
            setEmail("");
            setPassword("");
            navigate("/login");
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                toast.error("Email is already in use.");
            } else {
                toast.error("An error occurred during signup.");
            }
            console.error(error);
        }
    };

    const handleGoogleSignup = async () => {
        try {
            const result = await signInWithPopup(auth, googleAuthProvider);
            const user = {
                name: result.user.displayName,
                uid: result.user.uid,
                email: result.user.email,
                time: Timestamp.now(),
                role: 'user'
            };
            const userRef = doc(fireDb, "users", result.user.uid);
            await setDoc(userRef, user, { merge: true }); // Merge to avoid overwriting existing data
            
            toast.success("Google Signup Successful");
            navigate('/');
        } catch (error) {
            toast.error("Google signup failed.");
            console.error(error);
        }
    };

    return (
        <>
            <SEOComponent 
                type="signup"
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
                        Create an Account
                    </Typography>
                </CardHeader>
                <CardBody>
                    <div className="flex flex-col gap-4">
                        <Input type="text" label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                        <Input type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <Input type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <Button onClick={handleSignup} fullWidth>
                            Sign Up
                        </Button>
                        <Button onClick={handleGoogleSignup} fullWidth className="flex items-center justify-center gap-3 bg-red-500">
                           <FaGoogle/> Sign Up with Google
                        </Button>
                        <Typography variant="small" className="mt-4 text-center">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-500 hover:underline">
                                Log in
                            </Link>
                        </Typography>
                    </div>
                </CardBody>
            </Card>
        </div>
        </>
    );
}

export default Signup;
