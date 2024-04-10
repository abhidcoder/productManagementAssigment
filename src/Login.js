import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './login.css'

function Login() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // Here you can implement your login logic
    // For simplicity, let's just display the entered values
    setMessage(`Wrong Credentials : Logging in with userId: ${userId} and password: ${password}`);
    
    // Check if login is successful (dummy condition for demonstration)
    if (userId === 'admin' && password === 'password') {
      // Redirect to /app
      Cookies.set('isLoggedIn', true, { expires: 1}); // Expires in 7 days
      navigate('/app');
    }
  };

  

  return (
    <div className="container">
      <h2>Login</h2>
      <div>
        <label htmlFor="userId">User ID:</label>
        <input
          type="text"
          id="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
      </div>
      <button onClick={handleLogin} className="login-btn">Login</button>
      {message && <p className="success-msg">{message}</p>}
    </div>
  );
}

export default Login;
