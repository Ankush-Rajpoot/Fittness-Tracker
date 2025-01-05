import React, { useState } from 'react';
import { userStore } from '../store/APIStore.js';
import { useNavigate } from "react-router-dom";


const EmailVerification = () => {
  const [code, setCode] = useState('');
  const { verifyEmail, isLoading, error, message } = userStore();
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
     try {
      await verifyEmail(code);
      navigate("/dashboard"); 
    } catch (err) {
      console.error(err.message || "Error verifying email");
    }
  };

  return (
    <div className="form-container">
      <h2>Email Verification</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="code">Verification Code</label>
        <input
          type="text"
          id="code"
          name="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <input type="submit" value="Verify" disabled={isLoading} />
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  );
};

export default EmailVerification;
