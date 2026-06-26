import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Plus, Trash2, Edit, ArrowRight, LogOut } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../https/axios';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';

const CompanyList = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);

    // NEW: 0 = Enter/Select, 1 = Edit, 2 = Delete
    const [focusedAction, setFocusedAction] = useState(0);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        await dispatch(logoutUser());
        localStorage.removeItem('activeCompanyId');
        navigate('/login');
    };

    const fetchCompanies = async () => {
        try {
            const response = await api.get('/company');
            setCompanies(response.data.companies);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch companies');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    // 2D Navigation Engine
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (companies.length === 0) return;

            // Global Actions mapped directly to the screen
            if (e.key.toLowerCase() === 'c' && e.altKey) {
                e.preventDefault();
                navigate('/company/create');
                return;
            }
            if (e.key.toLowerCase() === 'q' && e.altKey) {
                e.preventDefault();
                handleLogout();
                return;
            }

            // Up / Down (Cycles Rows, Resets Horizontal position)
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % companies.length);
                setFocusedAction(0);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + companies.length) % companies.length);
                setFocusedAction(0);
            }
            // Left / Right (Cycles inside the row)
            else if (e.key === 'ArrowRight') {
                e.preventDefault();
                setFocusedAction((prev) => Math.min(prev + 1, 2));
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                setFocusedAction((prev) => Math.max(prev - 1, 0));
            }
            // Execute Action
            else if (e.key === 'Enter') {
                e.preventDefault();
                const company = companies[selectedIndex];
                if (focusedAction === 0) {
                    handleSelect(company.id);
                } else if (focusedAction === 1) {
                    navigate(`/company/edit/${company.id}`);
                } else if (focusedAction === 2) {
                    // Mock event object for stopPropagation requirement
                    handleDelete(company.id, { stopPropagation: () => { } });
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [companies, selectedIndex, focusedAction, navigate, dispatch]);

    const handleSelect = (id) => {
        localStorage.setItem('activeCompanyId', id);
        toast.success('Company selected');
        navigate('/dashboard');
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this company?')) return;
        try {
            await api.delete(`/company/${id}`);
            toast.success('Company deleted successfully');
            setCompanies(companies.filter(c => c.id !== id));
            if (localStorage.getItem('activeCompanyId') == id) {
                localStorage.removeItem('activeCompanyId');
            }
            // Reset state if we delete the last focused item
            setSelectedIndex(0);
            setFocusedAction(0);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete company');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <div className="text-neutral-400 font-medium tracking-wide">Loading companies...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050505] relative p-8 overflow-hidden selection:bg-white/20">
            <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-500/10 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-500/10 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-2xl font-semibold text-white tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-white/5 border border-white/10 rounded-lg backdrop-blur-md">
                            <Building className="h-6 w-6 text-neutral-300" />
                        </div>
                        Select Company
                    </h1>

                    {/* Header Buttons with Shortcuts embedded */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/company/create')}
                            className="bg-white text-neutral-950 px-4 py-2.5 rounded-xl hover:bg-neutral-200 transition-all duration-300 flex items-center gap-2 font-medium shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                        >
                            <Plus className="h-4 w-4" /> Create Company
                            <kbd className="ml-1 px-1.5 py-0.5 rounded bg-neutral-200 text-neutral-600 text-[10px] font-mono border border-neutral-300">Alt+C</kbd>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="text-sm font-medium text-red-400 hover:text-red-300 bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all hover:bg-red-500/20"
                        >
                            <LogOut className="h-4 w-4" /> Logout
                            <kbd className="ml-1 px-1.5 py-0.5 rounded bg-red-900/30 text-red-300 text-[10px] font-mono border border-red-500/30">Alt+Q</kbd>
                        </button>
                    </div>
                </div>

                {companies.length === 0 ? (
                    <div className="bg-white/3 backdrop-blur-2xl border border-white/8 p-12 rounded-4xl shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] text-center text-neutral-400 font-medium">
                        No companies found. Create one to get started.
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {companies.map((company, index) => {
                            const isSelected = index === selectedIndex;
                            return (
                                <div
                                    key={company.id}
                                    onClick={() => handleSelect(company.id)}
                                    className={`
                                        p-6 rounded-2xl backdrop-blur-xl transition-all duration-300 flex justify-between items-center group border cursor-pointer
                                        ${isSelected
                                            ? 'border-white/30 bg-white/10 transform scale-[1.01] shadow-[0_8px_32px_0_rgba(255,255,255,0.05)]'
                                            : 'border-white/8 bg-white/3 hover:border-white/20 hover:bg-white/6'
                                        }
                                    `}
                                >
                                    <div>
                                        <h3 className={`text-lg font-semibold tracking-wide transition-colors ${isSelected ? 'text-white' : 'text-neutral-200 group-hover:text-white'}`}>
                                            {company.name}
                                        </h3>
                                        <div className="text-sm text-neutral-500 flex gap-6 mt-1.5 font-medium">
                                            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400/50"></span>FY: {company.financialYear}</span>
                                            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-400/50"></span>GST: {company.gstNo || 'N/A'}</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons Container */}
                                    <div className={`flex items-center gap-2 transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>

                                        {/* Edit Button (Focused Action = 1) */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); navigate(`/company/edit/${company.id}`); }}
                                            className={`p-2.5 rounded-xl transition-all ${isSelected && focusedAction === 1
                                                    ? 'bg-blue-500/20 text-blue-400 ring-2 ring-blue-400'
                                                    : 'text-neutral-400 hover:text-white hover:bg-white/10'
                                                }`}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>

                                        {/* Delete Button (Focused Action = 2) */}
                                        <button
                                            onClick={(e) => handleDelete(company.id, e)}
                                            className={`p-2.5 rounded-xl transition-all ${isSelected && focusedAction === 2
                                                    ? 'bg-red-500/20 text-red-400 ring-2 ring-red-400'
                                                    : 'text-red-400/80 hover:text-red-400 hover:bg-red-500/20'
                                                }`}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>

                                        {/* Enter/Select Icon (Focused Action = 0) */}
                                        <div className={`p-2.5 rounded-xl ml-2 transition-all ${isSelected && focusedAction === 0
                                                ? 'bg-indigo-500/20 text-indigo-400 ring-2 ring-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                                                : (isSelected ? 'text-white bg-white/10' : 'text-neutral-500 bg-white/5')
                                            }`}>
                                            <ArrowRight className="h-5 w-5" />
                                        </div>

                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyList;