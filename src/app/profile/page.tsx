"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { useRouter } from 'next/navigation';

const EditUserProfile = () => {
    const { user, updateUser } = useAuth();
    const userId = user?.id;
    const router = useRouter();
    const [userData, setUserData] = useState({
        name: '',
        address: '',
        image: 'www.example.com/john.png',
        dob: '',
        categories: [''],
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (userId) {
            setUserData((prevStates) => {
                return {
                    ...prevStates,
                    name: user.name,
                    address: user.address,
                    dob: user.dob,
                    categories: user.categories
                }
            })
        }
    }, []);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`${process.env.movieBaseUrl}users/${user?.id}/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`,
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            // Update user in Auth context
            updateUser({ email: userData.name });

            setSuccess('Profile updated successfully!');
            router.push('/'); // Redirect to home page
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCategoryChange = (index: number, value: string) => {
        const newCategories = [...userData.categories];
        newCategories[index] = value;
        setUserData((prevData) => ({
            ...prevData,
            categories: newCategories,
        }));
    };

    const handleAddCategory = () => {
        setUserData((prevData) => ({
            ...prevData,
            categories: [...prevData.categories, ''],
        }));
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 m-4">
            <div className="bg-white shadow-md rounded px-8 py-6 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4 text-center">Edit Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-2">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={userData.name}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded p-2 w-full"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={userData.address}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded p-2 w-full"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Image URL</label>
                        <input
                            type="text"
                            name="image"
                            value={userData.image}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded p-2 w-full"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Date of Birth</label>
                        <input
                            type="date"
                            name="dob"
                            value={userData.dob}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded p-2 w-full"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Categories</label>
                        {userData.categories.map((category, index) => (
                            <div key={index} className="flex items-center space-x-2 mb-2">
                                <input
                                    type="text"
                                    value={category}
                                    onChange={(e) => handleCategoryChange(index, e.target.value)}
                                    className="border border-gray-300 rounded p-2 w-full"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddCategory}
                                    className="bg-blue-500 text-white rounded p-2"
                                >
                                    Add Category
                                </button>
                            </div>
                        ))}
                    </div>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    {success && <p className="text-green-500 text-center">{success}</p>}
                    <button
                        type="submit"
                        className="bg-blue-500 text-white rounded p-2 w-full"
                    >
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditUserProfile;
