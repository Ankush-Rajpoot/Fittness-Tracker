import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { userStore } from "../store/APIStore.js";
import loginVideo from "../assets/login.mp4"; // Import the login video
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const loginUser = userStore((state) => state.loginUser);
  const error = userStore((state) => state.error);
  const isAuthenticated = userStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  const signInWithGoogle = () => {
    window.open("http://localhost:5000/auth/google/callback", "_self");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginUser({ email, password });
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="bg-gradient-to-b from-gray-950 to-black">
      <div className="min-h-screen   flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-black border border-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md md:max-w-4xl md:flex md:flex-row"
        >
          <div  className="hidden md:flex w-full md:w-1/2 justify-center relative">
            <video 
              src={loginVideo} 
              autoPlay 
              loop 
              muted 
              className="rounded-lg" 
              style={{ height: "100%", width: "100%", maxHeight: "450px", objectFit: "cover" }} 
            />
            <div className="absolute  inset-0 bg-gradient-to-r from-black via-transparent to-black rounded-lg"></div>
            <div className="absolute  inset-0 bg-gradient-to-t from-black via-transparent to-black rounded-lg"></div>
          </div>
          <div className="w-full  md:w-1/2 p-4 md:p-8">
            <h1 className="login">Login</h1>
            <form onSubmit={handleSubmit} className=" space-y-6">
              {error && <p className="text-red-500">{error}</p>}
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
                Login
              </motion.button>
            </form>
            <div className="flex justify-center mt-2">
              <p className="switch">
                Don't have an account? <Link to="/signup" className="switch-btn">Sign Up</Link>
              </p>
            </div>
            <div className="flex justify-center mt-2 relative">
              <button className="login-with-google-btn border border-gray-700 relative overflow-hidden shine" onClick={signInWithGoogle}>
                Sign In With Google
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-30 transition-opacity duration-500"></div>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
