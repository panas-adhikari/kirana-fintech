'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { APP_NAME } from '@/config/constants';
import { validator } from '@/utils/inputValidator';
import { RegisterFormData } from '@/types';

export default function RegisterPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [storeName, setStoreName] = useState("");

    const [errors, setErrors] = useState<RegisterFormData>({
        password: "",
        confirmPassword: "",
        email: "",
        name: "",
        phone: "",
        store_name: ""
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Only validate password if it's not empty to avoid initial error
        if (password) {
            const validationResult = validator("password", password);
            const errorString = typeof validationResult === "string"
                ? validationResult
                : validationResult?.message ?? "";

            setErrors(prev => ({
                ...prev,
                password: errorString
            }));
        } else {
            setErrors(prev => ({ ...prev, password: "" }));
        }
    }, [password]);

     // Confirm Password validation
     useEffect(() =>{
        if (confirmPassword) {
           const validationResult = validator("confirmPassword",confirmPassword, password);
           setErrors(prev => ({
                ...prev,
                confirmPassword: validationResult?.message || ""
            }));
        } else {
            setErrors(prev => ({ ...prev, confirmPassword: "" }));
        }
    }, [confirmPassword, password]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Final validation before submission
        const passValidation = validator("password", password);
        const emailValidation = validator("email", email);

        if (passValidation.error || emailValidation.error) {
            return;
        }

        if (!name || !storeName || !phone) {
            // Simple check for required fields
            return;
        }

        setLoading(true);

        try {
            // TODO: Implement actual registration API call here
            console.log("Registering with:", { name, email, phone, storeName, password });

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Redirect to login or dashboard
            router.push('/login');
        } catch (error) {
            console.error("Registration failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 px-4 py-12">
            <Card className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Create Account
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Start managing your kirana store with {APP_NAME}
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>

                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                            Store Name
                        </label>
                        <input
                            type="text"
                            value={storeName}
                            onChange={e => setStoreName(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                            placeholder="My Kirana Store"
                        />
                    </div> */}

                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                            Your Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                            placeholder="John Doe"
                        />
                    </div> */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className={`w-full px-4 py-2 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                            placeholder="you@example.com"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                            placeholder="+977 98XXXXXXXX"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className={`w-full px-4 py-2 border rounded-lg ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                            placeholder="••••••••"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                        )}
                    </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                            className={`w-full px-4 py-2 border rounded-lg ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                            placeholder="••••••••"
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={loading || !!errors.password || !!errors.email || !!errors.confirmPassword}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link href="/login" className="font-medium text-blue-600 dark:text-blue-400">
                            Sign in
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
}
