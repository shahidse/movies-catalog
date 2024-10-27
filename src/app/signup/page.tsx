"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SignupPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [dob, setDob] = useState('');
    const [categories, setCategories] = useState<string[]>([]);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // State for loading
    const [error, setError] = useState<string | null>(null); // State for error messages
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true); // Start loading

        try {
            const response = await fetch('http://localhost:3000/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, address, dob, categories, password }),
            });

            if (!response.ok) {
                throw new Error('Signup failed');
            }

            // Redirect to login page on successful signup
            router.push('/login');
        } catch (error: any) {
            setError(error.message); // Handle any errors
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black">
            <form
                className="bg-white shadow-md rounded px-8 py-6 mb-4 w-80"
                onSubmit={handleSubmit}
            >
                <h2 className="text-lg font-bold mb-4">Signup</h2>
                {error && <p className="text-red-500 mb-2">{error}</p>} {/* Display error message */}
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="border border-gray-300 rounded p-2 mb-4 w-full"
                />
                {/* <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border border-gray-300 rounded p-2 mb-4 w-full"
                /> */}
                <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="border border-gray-300 rounded p-2 mb-4 w-full"
                />
                <input
                    type="date"
                    placeholder="Date of Birth"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                    className="border border-gray-300 rounded p-2 mb-4 w-full"
                />
                <input
                    type="text"
                    placeholder="Categories (comma separated)"
                    value={categories.join(', ')} // Display as comma-separated
                    onChange={(e) => setCategories(e.target.value.split(',').map(cat => cat.trim()))}
                    required
                    className="border border-gray-300 rounded p-2 mb-4 w-full"
                />
                <p className="text-gray-500 mb-4">Available categories: <strong>Action, Horror, Comedy, Animated</strong></p>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border border-gray-300 rounded p-2 mb-4 w-full"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white rounded py-2 px-4 w-full flex items-center justify-center"
                    disabled={loading}
                >
                    {loading ? (
                        <div className="animate-spin h-5 w-5 border-4 border-t-transparent border-white rounded-full"></div> // Tailwind loader
                    ) : (
                        'Signup'
                    )}
                </button>
                <p className="mt-4">
                    Already have an account?
                    <Link href="/login" className="text-blue-500 hover:underline">
                        Log in here
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default SignupPage;
