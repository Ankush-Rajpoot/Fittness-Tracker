import { useState,useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { userStore } from "../store/APIStore.js";
import { useNavigate } from "react-router-dom";


const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const registerUser = userStore((state) => state.registerUser);
  const error = userStore((state) => state.error);
  const isAuthenticated = userStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  const signUpWithGoogle = ()=>{
    window.open("http://localhost:5000/auth/google/callback","_self")
}

  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser({ fullName, email, password });
  };

  useEffect(()=>{
    if(isAuthenticated){
      navigate("/dashboard")
    }
  },[isAuthenticated,navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111111]">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-black p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h1 className="signUp">Sign Up</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-500">{error}</p>}
          <div>
            <label htmlFor="fullName" className="block text-gray-400 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#222222] text-white p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring focus:ring-purple-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-400 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#222222] text-white p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring focus:ring-purple-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-400 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#222222] text-white p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring focus:ring-purple-500"
            />
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            className="w-full bg-purple-600 text-white py-3 rounded-lg"
          >
            Sign Up
          </motion.button>
        </form>
        <div className="flex justify-center">
        <p className="switch">
        Already have an account? <Link to="/login" className="switch-btn">Login</Link>
      </p>
        </div>
      <div className="flex justify-center">
      <button className='login-with-google-btn' onClick={signUpWithGoogle}>Sign In With Google</button>
      </div>
      </motion.div>
    </div>
  );
};

export default Signup;
