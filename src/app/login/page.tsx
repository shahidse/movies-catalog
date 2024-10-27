"use client";

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from '../styles/LoginForm.module.css'; // Keep your existing styles if needed
import Link from 'next/link';

const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: email, password }),
            });
            console.log('data', response)

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            const accessToken = data.access_token; // Assuming the token is returned in this format

            // Call the login method from Auth context
            login({ email, token: accessToken, id: data.id, name: data.name, dob: data.dob, address: data.address, categories: data.categories });
            // Store the access token in localStorage or state
            localStorage.setItem('accessToken', accessToken);

            // Redirect to the home page
            router.push('/home');
        } catch (error: any) {
            setError(error.message); // Handle any errors
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2 className='text-black text-lg font-bold mb-4'>Login</h2>
                {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`${styles.input} border border-gray-300 rounded p-2`} // Tailwind classes for styling
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`${styles.input} border border-gray-300 rounded p-2`} // Tailwind classes for styling
                />
                <button
                    type="submit"
                    className={`${styles.button} flex items-center justify-center`}
                    disabled={loading}
                >
                    {loading ? (
                        <div className="animate-spin h-5 w-5 border-4 border-t-transparent border-white rounded-full"></div> // Tailwind loader
                    ) : (
                        'Login'
                    )}
                </button>
                <p className="mt-4 text-black">
                    Don’t have an account?
                    <Link href="/signup" className="text-blue-500 hover:underline">
                        Sign up here
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default LoginPage;
