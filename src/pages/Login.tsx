import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('https://api.escuelajs.co/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error Response:', errorData); // Log error data from API
        setError(errorData.message || 'Login failed');
        throw new Error(errorData.message || 'Login failed');
      }
  
      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
  
      const userResponse = await fetch('https://api.escuelajs.co/api/v1/auth/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      });
      const userData = await userResponse.json();
      localStorage.setItem('user_email', userData.email);
      localStorage.setItem('user_name', userData.name);
      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Login failed:', error.message);
        setError('An error occurred while logging in. Please check the credentials.');
      } else {
        console.error('Unexpected error', error);
        setError('An unexpected error occurred.');
      }
    }
  };
  

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 shadow-md rounded-md max-w-sm w-full">
        <h1 className="text-xl font-bold mb-4">Login</h1>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
