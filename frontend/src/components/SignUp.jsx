import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { userStore } from "../store/APIStore.js";
import { useNavigate } from "react-router-dom";
import * as THREE from 'three';
import VANTA from 'vanta/dist/vanta.rings.min.js';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const registerUser = userStore((state) => state.registerUser);
  const error = userStore((state) => state.error);
  const isAuthenticated = userStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const vantaRef = useRef(null);

  const signUpWithGoogle = () => {
    window.open("http://localhost:5000/auth/google/callback", "_self");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser({ fullName, email, password });
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const setVanta = () => {
      if (window.VANTA) {
        window.VANTA.RINGS({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          backgroundColor: 0x0,
          color: 0xc019d1
        });
      }
    };

    setVanta();
    window.addEventListener("resize", setVanta);

    return () => {
      window.removeEventListener("resize", setVanta);
      if (window.VANTA && window.VANTA.current) {
        window.VANTA.current.destroy();
      }
    };
  }, []);

  return (
    <div ref={vantaRef} className="min-h-screen flex items-center justify-center bg-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-black border border-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h1 className="signUp">Sign Up</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-500">{error}</p>}
          <div>
            <label htmlFor="fullName" className="block text-gray-400 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#222222] text-white p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-400 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#222222] text-white p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-400 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#222222] text-white p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            className="w-full bg-purple-600 text-white py-3 rounded-lg"
          >
            Sign Up
          </motion.button>
        </form>
        <div className="flex justify-center mt-1">
          <p className="switch">
            Already have an account? <Link to="/login" className="switch-btn">Login</Link>
          </p>
        </div>
        <div className="flex justify-center mt-1">
          <button className='login-with-google-btn shine border border-gray-700' onClick={signUpWithGoogle}>Sign In With Google
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-30 transition-opacity duration-500"></div>
          </button>
          
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;