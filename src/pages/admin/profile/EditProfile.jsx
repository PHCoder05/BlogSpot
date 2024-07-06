import React, { useState, useContext, useEffect } from "react";
import myContext from "../../../context/data/myContext";
import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const context = useContext(myContext);
  const { mode, updateProfile } = context;
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    // Add other profile fields as needed
  });

  useEffect(() => {
    // Assuming you have a function to get profile data
    const fetchProfile = async () => {
      const data = await getProfile(); // Implement this function to get profile data
      setProfile(data);
    };
    
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(profile); // Implement this function to update profile data
    navigate("/dashboard");
  };

  return (
    <div className="container mx-auto px-4 max-w-7xl my-5">
      <h1 className="text-center text-2xl font-bold mb-4">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        {/* Add other profile fields here */}
        <Button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Save Changes
        </Button>
      </form>
    </div>
  );
}

export default EditProfile;
