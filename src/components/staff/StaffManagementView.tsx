'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { User, UserRole } from '@/types';
import { getStaffMembers, addStaffMember } from '@/lib/services/staffService';
import { getAdminBranches } from '@/lib/services/storeManagementService';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Users, UserPlus, Search, Filter, Loader2, CheckCircle2 } from 'lucide-react';

export function StaffManagementView() {
    const { profile } = useAuthStore();
    const [staff, setStaff] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [branches, setBranches] = useState<{ branch_id: string, branch_name: string }[]>([]);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('all');

    // Add Staff Modal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'staff' as UserRole,
        branchId: ''
    });

    const isAdmin = profile?.role === 'admin';
    const isOwnerOrManager = profile?.role === 'owner' || profile?.role === 'manager';

    useEffect(() => {
        loadInitialData();
    }, [profile]);

    const loadInitialData = async () => {
        if (!profile?.branch?.store_id) return;

        setLoading(true);
        const storeId = profile.branch.store_id;

        // Load staff
        const staffRes = await getStaffMembers(storeId);
        if (staffRes.data) setStaff(staffRes.data);

        // Load branches if admin
        if (isAdmin) {
            const branchesRes = await getAdminBranches(storeId);
            if (branchesRes.data) {
                setBranches(branchesRes.data.map(b => ({
                    branch_id: b.branch_id,
                    branch_name: b.branch_name
                })));
            }
        } else if (profile.branch_id) {
            // Pre-select branch for owners/managers
            setFormData(prev => ({ ...prev, branchId: profile.branch_id }));
        }

        setLoading(false);
    };

    const handleAddStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile?.branch?.store_id) return;

        setError(null);
        setSuccess(false);
        setIsSubmitting(true);

        try {
            const res = await addStaffMember(
                formData.email,
                formData.password,
                formData.name,
                formData.role,
                // profile.branch.store_id,
                formData.branchId
            );

            if (res.error) {
                setError(res.error);
            } else {
                setSuccess(true);
                // Refresh list
                const staffRes = await getStaffMembers(profile.branch.store_id);
                if (staffRes.data) setStaff(staffRes.data);

                // Reset form after a delay or success state
                setTimeout(() => {
                    setIsAddModalOpen(false);
                    setSuccess(false);
                    setFormData({
                        name: '',
                        email: '',
                        password: '',
                        role: 'staff',
                        branchId: isAdmin ? '' : (profile.branch_id || '')
                    });
                }, 2000);
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredStaff = staff.filter(member => {
        const matchesSearch = member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.role.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBranch = selectedBranchFilter === 'all' || member.branch_id === selectedBranchFilter;
        return matchesSearch && matchesBranch;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Users className="w-6 h-6 text-emerald-600" />
                        Staff Management
                    </h2>
                    <p className="text-gray-500">Manage your store team and permissions</p>
                </div>

                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
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
                            <form onSubmit={handleAddStaff} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Initial Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Role</Label>
                                        <Select
                                            value={formData.role}
                                            onValueChange={(v: UserRole) => setFormData({ ...formData, role: v })}
                                        >
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
                                            <Select
                                                value={formData.branchId}
                                                onValueChange={v => setFormData({ ...formData, branchId: v })}
                                            >
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
                                            <Input value={profile?.branch?.name || ''} disabled readOnly />
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
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 mt-4"
                                        disabled={isSubmitting}
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
            </div>

            <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle className="text-lg font-bold text-gray-800">Team Members</CardTitle>
                        <div className="flex items-center gap-3">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Search staff..."
                                    className="pl-10 h-10 rounded-xl"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                            {isAdmin && (
                                <Select value={selectedBranchFilter} onValueChange={setSelectedBranchFilter}>
                                    <SelectTrigger className="w-[180px] h-10 rounded-xl">
                                        <Filter className="w-4 h-4 mr-2 text-gray-400" />
                                        <SelectValue placeholder="All Branches" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Branches</SelectItem>
                                        {branches.map(b => (
                                            <SelectItem key={b.branch_id} value={b.branch_id}>
                                                {b.branch_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/30 hover:bg-gray-50/30 border-b border-gray-100">
                                <TableHead className="py-4 pl-6">Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Branch</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="pr-6 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-20 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
                                        <p className="text-gray-500 mt-2">Loading staff members...</p>
                                    </TableCell>
                                </TableRow>
                            ) : filteredStaff.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-20 text-center text-gray-500">
                                        No staff members found matching your filters.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredStaff.map((member) => (
                                    <TableRow key={member.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <TableCell className="py-4 pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                                                    {member.username.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-semibold text-gray-900">{member.username}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                ${member.role === 'owner' ? 'bg-purple-100 text-purple-700' :
                                                    member.role === 'manager' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-gray-100 text-gray-700'}`}>
                                                {member.role}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-gray-600">
                                            {member.branch?.name || 'Central'}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center gap-1.5 ${member.is_active ? 'text-emerald-600' : 'text-red-500'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${member.is_active ? 'bg-emerald-600' : 'bg-red-500'}`} />
                                                {member.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="pr-6 text-right">
                                            <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg">
                                                Edit
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
