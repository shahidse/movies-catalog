"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const HomePage: React.FC = () => {
    const { user, logout } = useAuth();
    const router = useRouter();

    const [recommendedMovies, setRecommendedMovies] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [categoryName, setCategoryName] = useState<string>("Recommended Movies");
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [showMenu, setShowMenu] = useState(false); // State for user menu visibility

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        const fetchRecommendedMovies = async () => {
            const response = await fetch(`${process.env.movieBaseUrl}movies/recommended`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            const data = await response.json();
            setRecommendedMovies(data);
        };

        const fetchCategories = async () => {
            const response = await fetch(`${process.env.movieBaseUrl}categories`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            const data = await response.json();
            setCategories(data);
        };

        fetchRecommendedMovies();
        fetchCategories();
    }, [user, router]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch(`${process.env.movieBaseUrl}movies/search?query=${searchQuery}`, {
            headers: {
                Authorization: `Bearer ${user?.token}`,
            },
        });
        const data = await response.json();
        setSearchResults(data);
        setShowSearchResults(true);
    };

    const handleCategoryClick = async (categoryId: string, name: string) => {
        const response = await fetch(`${process.env.movieBaseUrl}movies/${categoryId}`, {
            headers: {
                Authorization: `Bearer ${user?.token}`,
            },
        });
        const data = await response.json();
        setRecommendedMovies(data);
        setCategoryName(name)
    };

    const toggleMenu = () => setShowMenu(!showMenu); // Toggle user menu

    const handleLogout = () => {
        logout(); // Call logout function
        router.push('/login'); // Redirect to login after logout
    };

    return (
        <div className="p-4">
            <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
                <div className="flex items-center">
                    <h1 className="text-xl font-bold">App Logo</h1>
                    <ul className="flex space-x-4 ml-6">
                        {categories.map((category) => (
                            <li key={category.id}>
                                <button
                                    onClick={() => handleCategoryClick(category.id, category.name)}
                                    className="hover:underline"
                                >
                                    {category.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex items-center">
                    <form onSubmit={handleSearch} className="mr-4">
                        <input
                            type="text"
                            placeholder="Search movies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="border border-gray-300 rounded p-2 text-black"
                        />
                        <button type="submit" className="ml-2 bg-blue-500 text-white rounded p-2">Search</button>
                    </form>
                    <div className="relative">
                        <button className="flex items-center" onClick={toggleMenu}>
                            <Image
                                src="/next.svg"
                                alt="User"
                                className="h-8 w-8 rounded-full m-2 border"
                                width={32}
                                height={32}
                            />
                        </button>
                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded">
                                <button
                                    onClick={() => router.push('/edit-profile')}
                                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                                >
                                    Edit Profile
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                                >
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <h1 className="text-2xl font-bold mb-4">Welcome, {user?.email}!</h1>
            <h2 className="text-xl mb-2">{categoryName}:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 m-2">
                {recommendedMovies.map((movie) => (
                    <div key={movie.id} className="border rounded p-2">
                        <Image
                            src={`${process.env.movieBaseUrl}${movie.image}`}
                            alt={movie.title}
                            width={200}
                            height={300}
                            className="rounded mb-2"
                        />
                        <h3 className="font-semibold">{movie.title}</h3>
                        <p>{movie.description}</p>
                    </div>
                ))}
            </div>

            {showSearchResults && (
                <div className="mt-4">
                    <h2 className="text-xl mb-2">Search Results:</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 m2">
                        {searchResults.map((result) => (
                            <div key={result.id} className="border rounded p-2">
                                <Image
                                    src={`${process.env.movieBaseUrl}${result.image}`}
                                    alt={result.title}
                                    width={200}
                                    height={300}
                                    className="rounded mb-2"
                                />
                                <h3 className="font-semibold">{result.title}</h3>
                                <p>{result.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
