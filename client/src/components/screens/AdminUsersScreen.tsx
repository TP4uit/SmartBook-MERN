import React from 'react';
import { AdminSidebar } from '../layout/AdminSidebar';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Search, Lock, Unlock, MoreVertical, Eye, Trash2 } from 'lucide-react';
import { Input } from '../ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../ui/dropdown-menu';

interface AdminUsersScreenProps {
  onNavigate: (screen: string) => void;
}

export function AdminUsersScreen({ onNavigate }: AdminUsersScreenProps) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar onNavigate={onNavigate} activeScreen="admin-users" />

      <div className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-3xl font-bold text-slate-900">Quản lý User</h2>
           <div className="flex items-center gap-2">
              <div className="relative w-64">
                 <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                 <Input className="pl-9 bg-white" placeholder="Tìm kiếm user..." />
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
                {[
                  { id: 1, name: 'Nguyễn Văn A', email: 'vana@gmail.com', role: 'Buyer', date: '01/06/2026', status: 'active', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100' },
                  { id: 2, name: 'Trần Thị B', email: 'btran@yahoo.com', role: 'Seller', date: '15/05/2026', status: 'active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' },
                  { id: 3, name: 'Lê Văn C', email: 'cle@outlook.com', role: 'Buyer', date: '20/05/2026', status: 'banned', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100' },
                  { id: 4, name: 'Admin User', email: 'admin@smartbook.com', role: 'Admin', date: '01/01/2026', status: 'active', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100' },
                  { id: 5, name: 'Phạm Thị D', email: 'dpham@gmail.com', role: 'Seller', date: '10/06/2026', status: 'active', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100' },
                ].map((user) => (
                  <tr key={user.id} className="bg-white hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">#{user.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={user.avatar} className="w-8 h-8 rounded-full object-cover" alt={user.name} />
                        <span className="font-medium text-slate-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{user.email}</td>
                    <td className="px-6 py-4">
                       <Badge variant="outline" className={`
                         ${user.role === 'Admin' ? 'border-purple-200 text-purple-700 bg-purple-50' : 
                           user.role === 'Seller' ? 'border-orange-200 text-orange-700 bg-orange-50' : 
                           'border-blue-200 text-blue-700 bg-blue-50'}
                       `}>
                         {user.role}
                       </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{user.date}</td>
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
                             <Button size="icon" variant="ghost" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                             </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                             <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                             <DropdownMenuItem className="gap-2"><Eye className="h-4 w-4" /> Xem chi tiết</DropdownMenuItem>
                             {user.status === 'active' ? (
                                <DropdownMenuItem className="gap-2 text-red-600"><Lock className="h-4 w-4" /> Khóa tài khoản</DropdownMenuItem>
                             ) : (
                                <DropdownMenuItem className="gap-2 text-green-600"><Unlock className="h-4 w-4" /> Mở khóa</DropdownMenuItem>
                             )}
                             <DropdownMenuItem className="gap-2 text-red-600"><Trash2 className="h-4 w-4" /> Xóa vĩnh viễn</DropdownMenuItem>
                          </DropdownMenuContent>
                       </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
