import React from 'react';
import { Button } from '../ui/button';
import { Activity, Store, Users, LogOut } from 'lucide-react';

interface AdminSidebarProps {
  onNavigate: (screen: string) => void;
  activeScreen: string;
}

export function AdminSidebar({ onNavigate, activeScreen }: AdminSidebarProps) {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight text-white">SmartAdmin</h1>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        <Button 
          variant={activeScreen === 'admin-dashboard' ? 'secondary' : 'ghost'} 
          className={`w-full justify-start ${activeScreen === 'admin-dashboard' ? 'bg-slate-800 text-white' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
          onClick={() => onNavigate('admin-dashboard')}
        >
          <Activity className="mr-2 h-4 w-4" /> Tổng quan
        </Button>
        <Button 
          variant={activeScreen === 'admin-users' ? 'secondary' : 'ghost'}
          className={`w-full justify-start ${activeScreen === 'admin-users' ? 'bg-slate-800 text-white' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
          onClick={() => onNavigate('admin-users')}
        >
          <Users className="mr-2 h-4 w-4" /> Quản lý User
        </Button>
        <Button 
          variant={activeScreen === 'admin-shops' ? 'secondary' : 'ghost'}
          className={`w-full justify-start ${activeScreen === 'admin-shops' ? 'bg-slate-800 text-white' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
          onClick={() => onNavigate('admin-shops')}
        >
          <Store className="mr-2 h-4 w-4" /> Quản lý Shop
        </Button>
      </nav>
      <div className="p-4 border-t border-white/10">
         <button onClick={() => onNavigate('home')} className="flex items-center gap-2 text-sm text-white/50 hover:text-white w-full px-2 py-2 rounded-md hover:bg-white/5 transition-colors">
           <LogOut className="h-4 w-4" /> Đăng xuất
         </button>
      </div>
    </aside>
  );
}
