// components/AddStaffModal.tsx
'use client';

import { useState, memo, useCallback } from 'react';
import { validator } from '@/utils/inputValidator';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { UserPlus, Loader2, CheckCircle2, AlertCircle, Check } from 'lucide-react';

interface AddStaffModalProps {
    isAdmin: boolean;
    branches: { branch_id: string; branch_name: string }[];
    defaultBranchId: string;
    defaultBranchName: string;
    onSubmit: (data: {
        name: string;
        email: string;
        password: string;
        role: UserRole;
        branchId: string;
    }) => Promise<{ success: boolean; error?: string }>;
}

export const AddStaffModal = memo(function AddStaffModal({
    isAdmin,
    branches,
    defaultBranchId,
    defaultBranchName,
    onSubmit
}: AddStaffModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    
    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>('staff');
    const [branchId, setBranchId] = useState(defaultBranchId);

    // Live validation - computed on every render
    const emailError = email ? validator("email", email).message : '';
    const passwordError = password ? validator("password", password).message : '';
    
    // Check if fields are valid
    const isEmailValid = email && !emailError;
    const isPasswordValid = password && !passwordError;

    const resetForm = useCallback(() => {
        setName('');
        setEmail('');
        setPassword('');
        setRole('staff');
        setBranchId(defaultBranchId);
        setError(null);
        setSuccess(false);
    }, [defaultBranchId]);

    const handleOpenChange = useCallback((open: boolean) => {
        setIsOpen(open);
        if (!open) {
            resetForm();
        }
    }, [resetForm]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check for validation errors
        if (emailError || passwordError) {
            return;
        }

        setError(null);
        setIsSubmitting(true);

        try {
            const result = await onSubmit({ name, email, password, role, branchId });
            
            if (result.error) {
                setError(result.error);
            } else {
                setSuccess(true);
                setTimeout(() => {
                    handleOpenChange(false);
                }, 2000);
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 py-6 px-6 rounded-xl shadow-lg shadow-emerald-900/10">
                    <UserPlus className="w-5 h-5" />
                    Add New Staff
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-2xl">
                <DialogHeader>
                    <DialogTitle>Add Staff Member</DialogTitle>
                    <DialogDescription>
                        Create a new account for your staff member. They can log in immediately.
                    </DialogDescription>
                </DialogHeader>

                {success ? (
                    <div className="py-10 flex flex-col items-center text-center">
                        <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900">Staff Added Successfully!</h3>
                        <p className="text-gray-500 mt-2">The account has been created.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                        </div>
                        
                        {/* Email Field - Live Validation */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className={`pr-10 ${
                                        email 
                                            ? emailError 
                                                ? 'border-red-500 focus-visible:ring-red-500' 
                                                : 'border-emerald-500 focus-visible:ring-emerald-500'
                                            : ''
                                    }`}
                                    required
                                />
                                {email && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {emailError ? (
                                            <AlertCircle className="w-5 h-5 text-red-500" />
                                        ) : (
                                            <Check className="w-5 h-5 text-emerald-500" />
                                        )}
                                    </div>
                                )}
                            </div>
                            {email && emailError && (
                                <p className="text-red-500 text-sm flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {emailError}
                                </p>
                            )}
                            {isEmailValid && (
                                <p className="text-emerald-600 text-sm flex items-center gap-1">
                                    <Check className="w-3 h-3" />
                                    Valid email address
                                </p>
                            )}
                        </div>
                        
                        {/* Password Field - Live Validation */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Initial Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className={`pr-10 ${
                                        password 
                                            ? passwordError 
                                                ? 'border-red-500 focus-visible:ring-red-500' 
                                                : 'border-emerald-500 focus-visible:ring-emerald-500'
                                            : ''
                                    }`}
                                    required
                                />
                                {password && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {passwordError ? (
                                            <AlertCircle className="w-5 h-5 text-red-500" />
                                        ) : (
                                            <Check className="w-5 h-5 text-emerald-500" />
                                        )}
                                    </div>
                                )}
                            </div>
                            {password && passwordError && (
                                <p className="text-red-500 text-sm flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {passwordError}
                                </p>
                            )}
                            {isPasswordValid && (
                                <p className="text-emerald-600 text-sm flex items-center gap-1">
                                    <Check className="w-3 h-3" />
                                    Password meets all requirements
                                </p>
                            )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Role</Label>
                                <Select value={role} onValueChange={(v: UserRole) => setRole(v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="staff">Staff</SelectItem>
                                        <SelectItem value="manager">Manager</SelectItem>
                                        {isAdmin && <SelectItem value="owner">Owner</SelectItem>}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Branch</Label>
                                {isAdmin ? (
                                    <Select value={branchId} onValueChange={setBranchId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Branch" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {branches.map(b => (
                                                <SelectItem key={b.branch_id} value={b.branch_id}>
                                                    {b.branch_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Input value={defaultBranchName} disabled readOnly />
                                )}
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-100 font-medium">
                                {error}
                            </div>
                        )}

                        <DialogFooter>
                            <Button
                                type="submit"
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 mt-4 disabled:opacity-50"
                                disabled={isSubmitting || !name || !isEmailValid || !isPasswordValid}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Creating Account...
                                    </>
                                ) : 'Create Staff Member'}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
});