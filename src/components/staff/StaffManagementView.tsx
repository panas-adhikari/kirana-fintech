// components/StaffManagementView.tsx
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { User, UserRole } from '@/types';
import { getStaffMembers, addStaffMember } from '@/lib/services/staffService';
import { getAdminBranches } from '@/lib/services/storeManagementService';
import { AddStaffModal } from '@/components/custom-components/AddStaffModal';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Users, Search, Filter, Loader2 } from 'lucide-react';

export function StaffManagementView() {
    const { profile } = useAuthStore();
    const [staff, setStaff] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [branches, setBranches] = useState<{ branch_id: string, branch_name: string }[]>([]);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('all');

    const isAdmin = profile?.role === 'admin';

    useEffect(() => {
        loadInitialData();
    }, [profile]);

    const loadInitialData = async () => {
        if (!profile?.branch?.store_id) return;

        setLoading(true);
        const storeId = profile.branch.store_id;

        const staffRes = await getStaffMembers(storeId);
        if (staffRes.data) setStaff(staffRes.data);

        if (isAdmin) {
            const branchesRes = await getAdminBranches(storeId);
            if (branchesRes.data) {
                setBranches(branchesRes.data.map(b => ({
                    branch_id: b.branch_id,
                    branch_name: b.branch_name
                })));
            }
        }

        setLoading(false);
    };

    // Memoize filtered staff to prevent recalculation on unrelated re-renders
    const filteredStaff = useMemo(() => {
        return staff.filter(member => {
            const matchesSearch = member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.role.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesBranch = selectedBranchFilter === 'all' || member.branch_id === selectedBranchFilter;
            return matchesSearch && matchesBranch;
        });
    }, [staff, searchTerm, selectedBranchFilter]);

    // Stable callback for adding staff
    const handleAddStaff = useCallback(async (data: {
        name: string;
        email: string;
        password: string;
        role: UserRole;
        branchId: string;
    }) => {
        if (!profile?.branch?.store_id) {
            return { success: false, error: 'No store found' };
        }

        try {
            const res = await addStaffMember(
                data.email,
                data.password,
                data.name,
                data.role,
                data.branchId
            );

            if (res.error) {
                return { success: false, error: res.error };
            }

            // Refresh list
            const staffRes = await getStaffMembers(profile.branch.store_id);
            if (staffRes.data) setStaff(staffRes.data);

            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message || 'An error occurred' };
        }
    }, [profile?.branch?.store_id]);

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

                <AddStaffModal
                    isAdmin={isAdmin}
                    branches={branches}
                    defaultBranchId={profile?.branch_id || ''}
                    defaultBranchName={profile?.branch?.name || ''}
                    onSubmit={handleAddStaff}
                />
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