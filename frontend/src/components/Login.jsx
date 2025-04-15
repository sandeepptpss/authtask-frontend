import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import '../assets/login.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const loginUser = async () => {
    try {
      const response = await fetch('http://localhost:8002/api/auth/login', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password }),
      });
      const responseData = await response.json();
      console.log('responseData:', responseData);

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(responseData.user));
        localStorage.setItem('token', responseData.token);
        setSuccessMessage("Login successful!");
        setErrorMessage('');
        const role = responseData.user.role;
        if (role === 'admin') {
          console.log('admin')
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }

      } else {
        setErrorMessage(responseData?.message || 'Authentication failed');
        setSuccessMessage('');
      }

    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Network error. Please try again.');
      setSuccessMessage('');
    }
  };
  return (
    <div className="main-login-page">
      <div className="login-page">
        <h2>Login</h2>
        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="main-login-input-page">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control inputBox"
            placeholder="Enter email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control inputBox"
            placeholder="Enter Password"
            required
          />
        </div>

        <button onClick={loginUser} className="btn btn-primary">
          Login
        </button>

        <div className="login-links">
          <Link to="/forgot-password">Forgot password?</Link>
          <Link to="/signup">Create account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
