'use client'; // Tells Next.js this is a client-side component

import { useState } from 'react'; // React state for form inputs
import axios from 'axios';         // HTTP client to call backend
import { useRouter } from 'next/navigation'; // Navigate to other pages

export default function Signup() {
  const [name, setName] = useState('');       // store name input
  const [email, setEmail] = useState('');     // store email input
  const [password, setPassword] = useState(''); // store password input
  const router = useRouter();                 // router to redirect after signup

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent page reload on form submit
    try {
      // Call backend signup endpoint
      await axios.post('http://localhost:5000/api/users/signup', {
        name,
        email,
        password
      });
      alert('Signup successful!');
      router.push('/login'); // redirect to login page
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'response' in err 
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Signup failed';
      alert(errorMessage);
    }
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-5">Signup</h1>
      <form onSubmit={handleSignup} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="p-2 border"
          required
        />
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
          className="bg-blue-500 text-white p-2 mt-2"
        >
          Signup
        </button>
      </form>
    </div>
  );
}
