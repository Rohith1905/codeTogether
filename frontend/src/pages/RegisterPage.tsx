import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCredentials, setLoading } from '../features/auth/authSlice';
import { authApi } from '../api';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        dispatch(setLoading(true));

        try {
            const response = await authApi.register({
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });

            // Store token and user in localStorage
            localStorage.setItem('token', response.accessToken);
            localStorage.setItem('user', JSON.stringify({
                id: response.userId,
                username: response.username,
                email: response.email,
            }));

            // Update Redux state
            dispatch(setCredentials({
                user: {
                    id: response.userId,
                    username: response.username,
                    email: response.email,
                },
                token: response.accessToken,
            }));

            // Navigate to dashboard
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100">
            <div className="w-full max-w-md">
                <div className="rounded-lg bg-white p-8 shadow-xl">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-900">CodeTogether</h1>
                        <p className="mt-2 text-gray-600">Create your account</p>
                    </div>

                    {error && (
                        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                                placeholder="Choose a username"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                                placeholder="Create a password"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                                placeholder="Confirm your password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            {loading ? 'Creating account...' : 'Sign up'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
