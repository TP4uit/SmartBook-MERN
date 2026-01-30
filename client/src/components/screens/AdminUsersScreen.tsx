import React, { useEffect, useState } from 'react';
import { AdminSidebar } from '../layout/AdminSidebar';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Search, Lock, Unlock, MoreVertical, Eye, Trash2, Loader2 } from 'lucide-react';
import { Input } from '../ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../ui/dropdown-menu';
import api from '../../services/api';

interface AdminUsersScreenProps {
  onNavigate: (screen: string) => void;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar?: string;
  createdAt: string;
}

export function AdminUsersScreen({ onNavigate }: AdminUsersScreenProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<User[]>('/admin/users');
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch users error:', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId: string) => {
    setActionLoading(userId);
    try {
      await api.put(`/admin/users/${userId}/status`);
      await fetchUsers();
    } catch (err) {
      console.error('Toggle status error:', err);
      alert('Cập nhật trạng thái thất bại');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Bạn có chắc muốn xóa user này?')) return;
    setActionLoading(userId);
    try {
      await api.delete(`/admin/users/${userId}`);
      await fetchUsers();
    } catch (err) {
      console.error('Delete user error:', err);
      alert('Xóa user thất bại');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  const getRoleBadge = (role: string) => {
    if (role === 'admin') return 'border-purple-200 text-purple-700 bg-purple-50';
    if (role === 'seller') return 'border-orange-200 text-orange-700 bg-orange-50';
    return 'border-blue-200 text-blue-700 bg-blue-50';
  };

  const getRoleLabel = (role: string) => {
    if (role === 'admin') return 'Admin';
    if (role === 'seller') return 'Seller';
    return 'Buyer';
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar onNavigate={onNavigate} activeScreen="admin-users" />

      <div className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-3xl font-bold text-slate-900">Quản lý User</h2>
           <div className="flex items-center gap-2">
              <div className="relative w-64">
                 <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                 <Input className="pl-9 bg-white" placeholder="Tìm kiếm user..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <Button>Thêm mới</Button>
           </div>
        </div>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Danh sách người dùng</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Vai trò</th>
                  <th className="px-6 py-4">Ngày đăng ký</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-[#008080] mx-auto" />
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">Không tìm thấy user nào</td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="bg-white hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">#{user._id.slice(-6).toUpperCase()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=008080&color=fff`} className="w-8 h-8 rounded-full object-cover" alt={user.name} />
                          <span className="font-medium text-slate-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{user.email}</td>
                      <td className="px-6 py-4">
                         <Badge variant="outline" className={getRoleBadge(user.role)}>
                           {getRoleLabel(user.role)}
                         </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{formatDate(user.createdAt)}</td>
                      <td className="px-6 py-4">
                        {user.status === 'active' ? (
                          <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                            <span className="w-2 h-2 rounded-full bg-green-500" /> Active
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
                             <span className="w-2 h-2 rounded-full bg-red-500" /> Banned
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                               <Button size="icon" variant="ghost" className="h-8 w-8" disabled={actionLoading === user._id}>
                                  {actionLoading === user._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
                               </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                               <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                               <DropdownMenuItem className="gap-2"><Eye className="h-4 w-4" /> Xem chi tiết</DropdownMenuItem>
                               {user.role !== 'admin' && (
                                 <>
                                   {user.status === 'active' ? (
                                      <DropdownMenuItem className="gap-2 text-red-600" onClick={() => handleToggleStatus(user._id)}><Lock className="h-4 w-4" /> Khóa tài khoản</DropdownMenuItem>
                                   ) : (
                                      <DropdownMenuItem className="gap-2 text-green-600" onClick={() => handleToggleStatus(user._id)}><Unlock className="h-4 w-4" /> Mở khóa</DropdownMenuItem>
                                   )}
                                   <DropdownMenuItem className="gap-2 text-red-600" onClick={() => handleDeleteUser(user._id)}><Trash2 className="h-4 w-4" /> Xóa vĩnh viễn</DropdownMenuItem>
                                 </>
                               )}
                            </DropdownMenuContent>
                         </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
