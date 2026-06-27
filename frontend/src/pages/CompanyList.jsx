import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Building, Plus, Trash2, Edit, ArrowRight, LogOut, LayoutDashboard } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../https/axios';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import CompanyListHeader from '../components/company/CompanyListHeader';
import CompanyCard from '../components/company/CompanyCard';
import EmptyCompaniesState from '../components/company/EmptyCompaniesState';

const CompanyList = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [focusedAction, setFocusedAction] = useState(0);

    const navigate = useNavigate();
    const location = useLocation(); 
    const dispatch = useDispatch();

    const handleLogout = async () => {
        await dispatch(logoutUser());
        localStorage.removeItem('activeCompanyId');
        navigate('/login');
    };

    const fetchCompanies = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/company');
            setCompanies(response.data.companies || []);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch companies');
        } finally {
            setLoading(false);
        }
    }, []);

    // FIX: Re-fetch whenever the location key changes (e.g. coming back from /company/create)
    useEffect(() => {
        fetchCompanies();
    }, [fetchCompanies, location.key]);

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Global shortcuts
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

            if (companies.length === 0) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % companies.length);
                setFocusedAction(0);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + companies.length) % companies.length);
                setFocusedAction(0);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                setFocusedAction((prev) => Math.min(prev + 1, 2));
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                setFocusedAction((prev) => Math.max(prev - 1, 0));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const company = companies[selectedIndex];
                if (focusedAction === 0) {
                    handleSelect(company.id);
                } else if (focusedAction === 1) {
                    navigate(`/company/edit/${company.id}`);
                } else if (focusedAction === 2) {
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
        if (e?.stopPropagation) e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this company?')) return;

        try {
            await api.delete(`/company/${id}`);
            toast.success('Company deleted successfully');
            setCompanies(companies.filter(c => c.id !== id));
            if (localStorage.getItem('activeCompanyId') === id) {
                localStorage.removeItem('activeCompanyId');
            }
            setSelectedIndex(0);
            setFocusedAction(0);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete company');
        }
    };

    if (loading && companies.length === 0) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="text-neutral-400 font-medium tracking-wide">Loading companies...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] relative p-8 overflow-hidden selection:bg-white/20">
            {/* FIX: ADDED THE MISSING LOGO TO THE TOP LEFT */}
            <div className="absolute top-8 left-8 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
                    <span className="text-white font-bold text-lg">S</span>
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight leading-none" style={{ color: 'var(--text-primary)' }}>
                        Smart<span style={{ background: 'linear-gradient(135deg,#60a5fa,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ERP</span>
                    </h1>
                    <p className="text-xs mt-0.5 font-medium" style={{ color: 'var(--text-muted)' }}>Business Suite</p>
                </div>
            </div>

            {/* Ambient Background Glows */}
            <div className="fixed inset-0 bg-[radial-gradient(at_30%_20%,rgba(129,140,248,0.08)_0px,transparent_50%)] pointer-events-none"></div>
            <div className="fixed inset-0 bg-[radial-gradient(at_70%_80%,rgba(59,130,246,0.08)_0px,transparent_50%)] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto relative z-10 mt-16">
                <CompanyListHeader
                    onCreate={() => navigate('/company/create')}
                    onLogout={handleLogout}
                />

                {companies.length === 0 ? (
                    <EmptyCompaniesState />
                ) : (
                    <div className="grid gap-4">
                        {companies.map((company, index) => {
                            const isSelected = index === selectedIndex;
                            return (
                                <CompanyCard
                                    key={company.id}
                                    company={company}
                                    isSelected={isSelected}
                                    focusedAction={focusedAction}
                                    onSelect={handleSelect}
                                    onEdit={(id) => navigate(`/company/edit/${id}`)}
                                    onDelete={handleDelete}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyList;