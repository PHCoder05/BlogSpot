import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./pages/home/Home";
import Blog from "./pages/blog/Blog";
import AllBlogs from "./pages/allBlogs/AllBlogs";
import PersonalBlogs from "./pages/personalBlogs/PersonalBlogs";
import NoPage from "./pages/nopage/NoPage";
import BlogInfo from "./pages/blogInfo/BlogInfo";
import AdminLogin from "./pages/admin/adminLogin/AdminLogin";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import MyState from "./context/data/myState";
import { Toaster } from "react-hot-toast";
import CreateBlog from "./pages/admin/createBlog/CreateBlog";
import EditBlog from "./pages/admin/editBlog/Editblog";
import AccessCodeManager from "./pages/admin/accessCodes/AccessCodeManager";
import AboutPage from './components/aboutPage/AboutPage';
import ScrollToTop from './components/scrollToTop/ScrollToTop';
import ProgressBar from './components/progressBar/ProgressBar';
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Unsubscribe from "./pages/Unsubscribe";
import EmailTest from "./components/EmailTest";
import NewsletterTest from "./components/NewsletterTest";
import EmailTestAdvanced from "./components/EmailTestAdvanced";

import React, { useEffect } from "react";
import { suppressQuillWarnings } from "./utils/quillWarningSuppression";

const ProtectedRouteForAdmin = ({ children }) => {
  const admin = JSON.parse(localStorage.getItem('admin'));
  
  // Check if admin exists and has the correct email
  if (admin && admin.email === "pankajhadole4@gmail.com") {
    return children;
  }
  
  return <Navigate to="/admin" />;
};

function App() {
  // Suppress React Quill warnings globally
  useEffect(() => {
    const restore = suppressQuillWarnings();
    return restore;
  }, []);

  return (
    <MyState>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ProgressBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/allblogs" element={<AllBlogs />} />
          <Route path="/personal-blogs" element={<PersonalBlogs />} />
          <Route path="/bloginfo/:id" element={<BlogInfo />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/unsubscribe" element={<Unsubscribe />} />
          <Route path="/email-test" element={<EmailTest />} />

          <Route
            path="/dashboard"
            element={
                <ProtectedRouteForAdmin>
                    <Dashboard />
                </ProtectedRouteForAdmin>
            }
          />

          <Route
            path="/createblog"
            element={
              <ProtectedRouteForAdmin>
                <CreateBlog />
              </ProtectedRouteForAdmin>
            }
          />
          <Route
            path="/editblog/:id"
            element={
              <ProtectedRouteForAdmin>
                <EditBlog />
              </ProtectedRouteForAdmin>
            }
          />
          <Route
            path="/access-codes"
            element={
              <ProtectedRouteForAdmin>
                <AccessCodeManager />
              </ProtectedRouteForAdmin>
            }
          />
          <Route
            path="/newsletter-test"
            element={
              <ProtectedRouteForAdmin>
                <NewsletterTest />
              </ProtectedRouteForAdmin>
            }
          />
          <Route
            path="/email-test-advanced"
            element={
              <ProtectedRouteForAdmin>
                <EmailTestAdvanced />
              </ProtectedRouteForAdmin>
            }
          />
          <Route path="/*" element={<NoPage />} />
        </Routes>
        <ScrollToTop />
        <Toaster />
      </Router>
    </MyState>
  );
}

export default App;
