'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { APP_NAME } from '@/config/constants';
import { validator } from '@/utils/inputValidator';
import { LoginFormData } from '@/types';
import { loginUser } from '@/lib/services/authServices';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const [errors, setErrors] = useState<LoginFormData>({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (email) {
            const validationResult = validator("email", email);
            setErrors(prev => ({
                ...prev,
                email: validationResult?.message || ""
            }));
        } else {
            setErrors(prev => ({ ...prev, email: "" }));
        }
    }, [email]);

    useEffect(() => {
        if (password) {
            const validationResult = validator("password", password);
            setErrors(prev => ({
                ...prev,
                password: validationResult?.message || ""
            }));
        } else {
            setErrors(prev => ({ ...prev, password: "" }));
        }
    }, [password]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Final validation before submission
        const emailValidation = validator("email", email);
        const passValidation = validator("password", password);

        if (emailValidation.error || passValidation.error) {
            return;
        }

        setLoading(true);

        try {
            await loginUser(email, password);
            // Redirect to dashboard on successful login
            router.push('/dashboard');
        } catch (error) {
            console.error("Login failed", error);
            // TODO: Show error message to user
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 px-4 py-12">
            <Card className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    
                    <h1 className="text-3xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">
                        Login to your account
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Welcome back!{APP_NAME} Please enter your details.
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <Label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                        >
                            Email or Username
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className={`transition-all ${errors.email ? 'border-red-500' : ''}`}
                            placeholder="you@example.com"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <Label
                                htmlFor="password"
                                className="text-sm font-medium text-gray-700 dark:text-gray-200"
                            >
                                Password
                            </Label>
                            <Link
                                href="/forgot-password"
                                className="text-sm text-emerald-700 hover:text-green-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className={`transition-all ${errors.password ? 'border-red-500' : ''}`}
                            placeholder="••••••••"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                        )}
                    </div>

                    
                    <Button type="submit" className="w-full bg-emerald-700 text-white hover:bg-emerald-800" disabled={loading || !!errors.email || !!errors.password}>
                        {loading ? 'Signing In...' : 'Login'}
                    </Button>
                </form>
            
            <div>
                <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-4">
                    Don't have an account?{' '}
                    <Link
                        href="/register"
                        className="text-emerald-700 hover:text-green-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                        Sign Up
                    </Link>
                </p>
            </div>
                
            </Card>
        </div>
    );
}
