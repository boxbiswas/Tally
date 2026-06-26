import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut } from 'lucide-react';
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
        <header
            // Changed to h-16 to perfectly match your sidebars!
            className="h-16 px-5 flex items-center justify-end shrink-0 print:hidden"
            style={{
                background: 'rgba(8,12,20,0.85)',
                backdropFilter: 'blur(16px) saturate(180%)',
                WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}
        >
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate('/companies')}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-2"
                    style={{ color: '#93c5fd', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.18)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.1)'; }}
                >
                    Change Company <kbd className="font-mono text-[9px] px-1 py-0.5 rounded bg-blue-900/40 border border-blue-500/30">F1</kbd>
                </button>

                <div className="h-5 w-px" style={{ background: 'rgba(255,255,255,0.1)' }} />

                <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)', color: '#fff' }}>
                        {(user?.name || 'A').charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium hidden sm:block" style={{ color: 'var(--text-secondary)' }}>
                        {user?.name || 'Admin'}
                    </span>
                </div>

                <button
                    onClick={handleLogout}
                    className="h-8 w-auto px-2 rounded-lg flex items-center gap-1.5 transition-all duration-200"
                    style={{ color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                    title="Logout"
                >
                    <LogOut className="h-4 w-4" />
                    <kbd className="hidden sm:inline-block font-mono text-[9px] px-1 py-0.5 rounded bg-red-900/30 border border-red-500/30 text-red-300">Alt+Q</kbd>
                </button>
            </div>
        </header>
    );
}