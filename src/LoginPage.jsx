"use client";
import './styles/styles.css'; // adjust path as needed
import { useState } from 'react';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email && password) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5001/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          alert('Login successful!');
          // TODO: save token or redirect as needed
        } else {
          alert(data.error || 'Login failed');
        }
      } catch (error) {
        console.error('Login failed:', error);
        alert('An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section: Logo + Form */}
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-200">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-start p-10 space-y-8">
          {/* Form Card */}
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Welcome</h3>
            <form onSubmit={handleSubmit} className="flex flex-col">
              <label htmlFor="email" className="text-gray-700 font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />

              <label htmlFor="password" className="text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
              />

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-black text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-1 font-semibold shadow-md transition duration-300"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Right Section (empty visual space) */}
      <div className="w-full min-h-screen flex items-center justify-center bg-white" />
    </div>
  );
}

export default LoginPage;
