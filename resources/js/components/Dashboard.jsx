import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/api/auth/me', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setUser(response.data);
        } catch (err) {
            console.error('Failed to fetch user:', err);
            handleLogout();
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/auth/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('token_type');
            navigate('/login');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome, {user?.name}!</h2>
                        <div className="space-y-2">
                            <p className="text-gray-600">
                                <span className="font-semibold">Email:</span> {user?.email}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-semibold">User ID:</span> {user?.id}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
