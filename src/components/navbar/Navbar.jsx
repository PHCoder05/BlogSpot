import React, { useContext, useState, useEffect } from "react";
import {
    Navbar,
    Typography,
    IconButton,
    Avatar,
    Collapse,
    Button,
} from "@material-tailwind/react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { AiOutlineShareAlt, AiOutlineSearch } from 'react-icons/ai';
import myContext from "../../context/data/myContext";
import SearchDialog from "../searchDialog/SearchDialog";
import ShareDialogBox from "../shareDialogBox/ShareDialogBox";
import { auth } from "../../firebase/FirebaseConfig";
import { signOut } from "firebase/auth";

export default function Nav() {
    const [openNav, setOpenNav] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const context = useContext(myContext);
    const { mode, toggleMode, user } = context;

    useEffect(() => {
        setOpenNav(false);
    }, [location]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };
    
    const navList = (
        <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
            <Typography as="li" variant="small" className="p-1 font-normal" style={{ color: mode === 'dark' ? 'white' : 'white' }}>
                <Link to={'/'} className={`hover:text-teal-300 ${location.pathname === '/' ? 'text-teal-300' : ''}`}>Home</Link>
            </Typography>
            <Typography as="li" variant="small" className="p-1 font-normal" style={{ color: mode === 'dark' ? 'white' : 'white' }}>
                <Link to={'/allblogs'} className={`hover:text-teal-300 ${location.pathname === '/allblogs' ? 'text-teal-300' : ''}`}>All Articles</Link>
            </Typography>
            <Typography as="li" variant="small" className="p-1 font-normal" style={{ color: mode === 'dark' ? 'white' : 'white' }}>
                <Link to={'/about'} className={`hover:text-teal-300 ${location.pathname === '/about' ? 'text-teal-300' : ''}`}>About</Link>
            </Typography>
            {user?.email === "pankajhadole4@gmail.com" &&
                <Typography as="li" variant="small" className="p-1 font-normal" style={{ color: mode === 'dark' ? 'white' : 'white' }}>
                    <Link to={'/dashboard'} className={`hover:text-teal-300 ${location.pathname === '/dashboard' ? 'text-teal-300' : ''}`}>Admin</Link>
                </Typography>
            }
        </ul>
    );

    return (
        <>
            <Navbar
                className="inset-0 z-20 h-max max-w-full border-none rounded-none py-2 px-4 lg:px-8 lg:py-2 backdrop-blur-md"
                style={{ background: mode === 'dark' ? 'rgba(30, 41, 59, 0.95)' : 'rgba(48, 51, 107, 0.95)' }}
            >
                <div className="flex items-center justify-between text-blue-gray-900">
                    <Link to={'/'} className="mr-4 cursor-pointer py-1.5 text-xl font-bold flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center shadow-lg">
                           <span className="text-white font-bold text-lg">P</span>
                        </div>
                        <span className="bg-gradient-to-r from-teal-300 to-blue-300 bg-clip-text text-transparent">
                           PHcoder05
                        </span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="hidden lg:block">{navList}</div>
                        
                        <div className="flex items-center gap-2">
                            <SearchDialog />
                            <div className="hidden lg:block"><ShareDialogBox /></div>
                        </div>

                        {user ? (
                            <div className="flex items-center gap-4">
                               <Avatar src={user.photoURL || 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png'} alt={user.displayName || "User"} size="sm" withBorder={true} className="p-0.5" />
                                <Button onClick={handleLogout} size="sm" variant="gradient" color="red">Logout</Button>
                            </div>
                        ) : (
                            <div className="hidden lg:flex items-center gap-2">
                                <Link to="/login">
                                    <Button size="sm" variant="text" style={{ color: 'white' }}>Login</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button size="sm" variant="gradient" color="light-blue">Sign Up</Button>
                                </Link>
                            </div>
                        )}

                        <IconButton onClick={toggleMode} className="lg:inline-block rounded-full" style={{ background: mode === 'light' ? '#ced6e0' : '#57606f', color: mode === 'dark' ? 'white' : 'black' }}>
                            {mode === 'light' ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>}
                        </IconButton>

                        <IconButton className="ml-auto h-10 w-10 text-inherit lg:hidden" ripple={false} onClick={() => setOpenNav(!openNav)} style={{ background: mode === 'light' ? '#ced6e0' : '#57606f', color: mode === 'dark' ? 'white' : 'black' }}>
                            {openNav ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>}
                        </IconButton>
                    </div>
                </div>

                <Collapse open={openNav}>
                    <div className="pt-4 pb-2">
                        {navList}
                        <div className="flex flex-col gap-2 lg:hidden">
                           {user ? (
                               <Button onClick={handleLogout} size="sm" variant="gradient" color="red" fullWidth>Logout</Button>
                           ) : (
                               <>
                                   <Link to="/login"><Button size="sm" variant="outlined" fullWidth>Login</Button></Link>
                                   <Link to="/signup"><Button size="sm" variant="gradient" fullWidth>Sign Up</Button></Link>
                               </>
                           )}
                        </div>
                    </div>
                </Collapse>
            </Navbar>
        </>
    );
}