'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Call backend login endpoint
      const res = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password
      });

      // Store JWT token in localStorage for authenticated requests
      localStorage.setItem('token', res.data.token);
      alert('Login successful!');
      router.push('/dashboard'); // redirect to dashboard page
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'response' in err 
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Login failed';
      alert(errorMessage);
    }
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-5">Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="p-2 border"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="p-2 border"
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white p-2 mt-2"
        >
          Login
        </button>
      </form>
    </div>
  );
}
