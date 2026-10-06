import { Outlet, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  Users,
  Activity,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  FileText,
  CheckSquare,
  MessageSquare,
  Shield
} from 'lucide-react';
import { useState } from 'react';
import { cn } from './ui/utils';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'staff', 'engineer', 'manager'] },
    { path: '/inventory', label: 'Inventory', icon: Package, roles: ['admin', 'staff', 'engineer', 'manager'] },
    { path: '/requests', label: 'Material Requests', icon: FileText, roles: ['admin', 'manager'] },
    { path: '/approvals', label: 'Approvals', icon: CheckSquare, roles: ['admin'] },
    { path: '/user-approvals', label: 'User Approvals', icon: Users, roles: ['admin'] },
    { path: '/messages', label: 'Messages', icon: MessageSquare, roles: ['engineer', 'manager'] },
    { path: '/inout', label: 'IN/OUT Tracking', icon: ArrowLeftRight, roles: ['admin', 'staff'] },
    { path: '/users', label: 'User Management', icon: Users, roles: ['admin'] },
    { path: '/logs', label: 'Activity Logs', icon: Activity, roles: ['admin', 'staff'] },
    { path: '/security', label: 'Security Center', icon: Shield, roles: ['admin'] },
    { path: '/settings', label: 'Settings', icon: Settings, roles: ['admin', 'staff', 'engineer', 'manager'] }
  ];

  const filteredNavItems = navItems.filter(item =>
    user && item.roles.includes(user.role)
  );

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-600 hover:bg-red-600';
      case 'staff':
        return 'bg-blue-600 hover:bg-blue-600';
      case 'engineer':
        return 'bg-green-600 hover:bg-green-600';
      case 'manager':
        return 'bg-purple-600 hover:bg-purple-600';
      default:
        return 'bg-slate-600 hover:bg-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between px-4 lg:px-6 h-16">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div>
              <h1 className="font-semibold text-lg text-slate-900">HVL Engineering Services</h1>
              <p className="text-xs text-slate-600 hidden sm:block">Construction Materials Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-500 rounded-full"></span>
            </Button>
            <div className="flex items-center gap-3 pl-3 border-l">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-900">{user?.fullName}</p>
                <p className="text-xs text-slate-600">{user?.email}</p>
              </div>
              <Badge className={getRoleBadgeClass(user?.role || 'viewer')}>
                {user?.role?.toUpperCase()}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 transition-transform duration-200 z-40",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <nav className="p-4 space-y-2">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 hover:bg-yellow-50 hover:text-yellow-700",
                    isActive && "bg-yellow-100 text-yellow-700 font-medium"
                  )}
                  onClick={() => {
                    navigate(item.path);
                    setIsSidebarOpen(false);
                  }}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}