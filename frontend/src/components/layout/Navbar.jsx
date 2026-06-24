import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut, Building, UserCircle } from 'lucide-react';
import { logoutUser } from '../../redux/slices/authSlice';

export default function Navbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = async () => {
        await dispatch(logoutUser());
        localStorage.removeItem('activeCompanyId');
        navigate('/login');
    };

    return (
        <header className="h-16 bg-white shadow-sm border-b px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-slate-600">
                <Building className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-sm">Active Context</span>
            </div>

            <div className="flex items-center gap-6">
                <button
                    onClick={() => navigate('/companies')}
                    className="text-sm font-medium text-slate-600 hover:text-blue-600 bg-slate-100 px-3 py-1.5 rounded-md transition"
                >
                    Change Company (F1)
                </button>

                <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <UserCircle className="h-6 w-6 text-slate-400" />
                        {user?.name || 'Admin'}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                        title="Logout"
                    >
                        <LogOut className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </header>
    );
}