import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, BookOpen, ArrowLeftRight, LogOut } from 'lucide-react';
import DashboardHome from './DashboardHome';
import Books from './Books';
import Transactions from './Transactions';
import api from '@/utils/axios';

type NavItem = 'dashboard' | 'books' | 'transactions';

export default function Dashboard() {
    const [activeNav, setActiveNav] = useState<NavItem>('dashboard');
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Get user data from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
    };

    const navItems = [
        { id: 'dashboard' as NavItem, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'books' as NavItem, label: 'Books', icon: BookOpen },
        { id: 'transactions' as NavItem, label: 'Transactions', icon: ArrowLeftRight },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 p-2 rounded-lg">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-semibold text-gray-900">Library System</span>
                    </div>
                    {user && (
                        <div className="mt-2 text-sm text-gray-600">
                            Welcome, {user.username}
                        </div>
                    )}
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveNav(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeNav === item.id
                                    ? 'bg-indigo-50 text-indigo-600'
                                    : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-5 h-5 mr-2" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {activeNav === 'dashboard' && <DashboardHome />}
                {activeNav === 'books' && <Books />}
                {activeNav === 'transactions' && <Transactions />}
            </main>
        </div>
    );
}