import { Box } from '@mui/material';
import React, { useState } from 'react';
import './global.css'

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswords()) return;

    if (email && password) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5001/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
          alert('Registration successful!');
        } else {
          setPasswordError(data.error || 'Registration failed');
        }
      } catch (error) {
        setPasswordError('An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container background">
      <h1 className='news-cycle-regular'>NameUp</h1>
      <Box
      sx={{
        backgroundColor: 'white',
        p: 2,
        m: 'auto',
        display: 'flex',
        flexDirection: 'column', // to stack inputs vertically
        alignItems: 'stretch',   // ensure inputs take full width of box
        justifyContent: 'center',
        borderRadius: 10,
        boxShadow: 3,
        width: 'fit-content',    // or 'auto'
        height: 'fit-content',   // or 'auto'
      }}>
      <form onSubmit={handleSubmit} className="register">
        <h2 className="news-cycle-regular">Register</h2>

        <div className="myBox">
          <input
            className="myInput2"
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="myBox">
          <input
            className="myInput2"
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="myBox">
          <input
            className="myInput2"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            required
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (passwordError) validatePasswords();
            }}
          />
        </div>

        {passwordError && (
          <p style={{ color: 'red', fontWeight: 'bold' }}>{passwordError}</p>
        )}

        <button type="submit" disabled={loading} style={{
          padding: '10px 20px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: 'black',
          color: 'white',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      </Box>
    </div>
  );
};

export default Register;
