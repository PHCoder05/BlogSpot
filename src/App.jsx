import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./pages/home/Home";
import Blog from "./pages/blog/Blog";
import AllBlogs from "./pages/allBlogs/AllBlogs";
import NoPage from "./pages/nopage/NoPage";
import BlogInfo from "./pages/blogInfo/BlogInfo";
import AdminLogin from "./pages/admin/adminLogin/AdminLogin";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import MyState from "./context/data/myState";
import { Toaster } from "react-hot-toast";
import CreateBlog from "./pages/admin/createBlog/CreateBlog";
import EditBlog from "./pages/admin/editBlog/Editblog";

function App() {
  return (
    <MyState>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/allblogs" element={<AllBlogs />} />
          <Route path="/bloginfo/:id" element={<BlogInfo />} />
          <Route path="/admin" element={<AdminLogin />} />
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

          <Route path="/*" element={<NoPage />} />
        </Routes>
        <Toaster />
      </Router>
    </MyState>
  );
}

export default App;

export const ProtectedRouteForAdmin = ({ children }) => {
  const admin = JSON.parse(localStorage.getItem("admin"));
  if (admin?.user?.email === "pankajhadole4@gmail.com") {
    return children;
  } else {
    return <Navigate to={"/admin"} />;
  }
};
