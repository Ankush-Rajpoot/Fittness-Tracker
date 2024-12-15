import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { userStore } from "../store/APIStore.js";
import login_signup from "../assets/login_signup.json";
import Lottie from "lottie-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginUser = userStore((state) => state.loginUser);
  const error = userStore((state) => state.error);
  const isAuthenticated = userStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  const signInWithGoogle = ()=>{
    window.open("http://localhost:5000/auth/google/callback","_self")
}

  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginUser({ email, password });
    
  };

  useEffect(()=>{
    if(isAuthenticated){
      navigate("/dashboard")
    }
  },[isAuthenticated,navigate])

  return (
    <div className="bg-[#111111]">
      <div className="min-h-screen flex items-center justify-center" >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-black p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h1 className="login">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-500">{error}</p>}
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
            Login
          </motion.button>
        </form>
        <div  className="flex justify-center"> 
          <p className="switch">
        Don't have an account? <Link to="/signup" className="switch-btn">Sign Up</Link>
      </p>
        </div>
      <div className="flex justify-center">
        <button className='login-with-google-btn' onClick={signInWithGoogle}>Sign In With Google</button>
      </div>
      </motion.div>
      </div>
    </div>
  );
};

export default Login;
