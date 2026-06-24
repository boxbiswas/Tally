import React from 'react'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Plus, Trash2, Edit, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../https/axios';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { LogOut } from 'lucide-react';

const CompanyList = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const handleLogout = async () => {
        await dispatch(logoutUser());
        localStorage.removeItem('activeCompanyId'); // Clean up company context
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
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete company');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading companies...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Building className="h-6 w-6" /> Select Company
                    </h1>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/company/create')}
                            className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-700 flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" /> Create Company
                        </button>
                        <button
                            onClick={handleLogout}
                            className="text-sm font-semibold text-red-600 hover:text-red-800 bg-red-50 px-3 py-2 rounded-md flex items-center gap-1 transition"
                        >
                            <LogOut className="h-4 w-4" /> Logout
                        </button>
                    </div>
                </div>

                {companies.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
                        No companies found. Create one to get started.
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {companies.map((company) => (
                            <div
                                key={company.id}
                                onClick={() => handleSelect(company.id)}
                                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-slate-800 cursor-pointer transition-all flex justify-between items-center group"
                            >
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800">{company.name}</h3>
                                    <div className="text-sm text-gray-500 flex gap-4 mt-1">
                                        <span>FY: {company.financialYear}</span>
                                        <span>GST: {company.gstNo || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); navigate(`/company/edit/${company.id}`); }}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(company.id, e)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                    <div className="p-2 text-slate-800">
                                        <ArrowRight className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyList;