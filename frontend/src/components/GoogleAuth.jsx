import React from "react";
import axios from "axios";

const GoogleAuth = ({ onAuthenticated }) => {
  const signInWithGoogle = async () => {
    try {
      // Open the Google login endpoint
      window.open("http://localhost:5000/auth/google/callback", "_self");

      // After redirection, fetch the user's session state
      const response = await axios.get(
        "http://localhost:5000/auth/google/callback/login/success",
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log("Google login successful:", response.data);
        onAuthenticated(response.data); // Notify parent about successful login
      } else {
        console.error("Google login failed:", response.data);
      }
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  return (
    <button
      className="google-auth-button bg-purple-600 text-white py-3 px-6 rounded-lg"
      onClick={signInWithGoogle}
    >
      Sign In With Google
    </button>
  );
};

export default GoogleAuth;
