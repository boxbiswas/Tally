import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Building, Calendar, Hash, ArrowLeft } from 'lucide-react';
import api from '../https/axios';

const CompanyForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({ name: '', gstNo: '', financialYear: '2023-24' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEdit) {
            const fetchCompany = async () => {
                try {
                    const response = await api.get(`/company/${id}`);
                    setFormData({
                        name: response.data.company.name,
                        gstNo: response.data.company.gstNo || '',
                        financialYear: response.data.company.financialYear
                    });
                } catch (error) {
                    toast.error('Failed to load company details');
                    navigate('/companies');
                }
            };
            fetchCompany();
        }
    }, [id, isEdit, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit) {
                await api.put(`/company/${id}`, formData);
                toast.success('Company updated successfully');
            } else {
                await api.post('/company', formData);
                toast.success('Company created successfully');
            }
            navigate('/companies');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] relative flex items-center justify-center p-8 overflow-hidden selection:bg-white/20">
            {/* Ambient Background Glows to emphasize the glass effect */}
            <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-500/10 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-500/10 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"></div>

            {/* Glass Card */}
            <div className="relative z-10 w-full max-w-md bg-white/3 backdrop-blur-2xl border border-white/8 rounded-4xl shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] p-8">
                <button 
                    onClick={() => navigate('/companies')} 
                    className="text-neutral-400 hover:text-white mb-8 flex items-center gap-2 transition-colors font-medium group w-fit"
                >
                    <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" /> Back to Companies
                </button>

                <h2 className="text-2xl font-semibold tracking-tight text-white mb-8">
                    {isEdit ? 'Edit Company' : 'Create New Company'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-1.5 ml-1">Company Name *</label>
                        <div className="relative">
                            <Building className="absolute left-4 top-3 h-5 w-5 text-neutral-500" />
                            <input
                                type="text"
                                required
                                className="pl-12 w-full p-3 bg-white/3 border border-white/8 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20 focus:bg-white/6 transition-all duration-300"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Acme Corp"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-1.5 ml-1">GST Number (Optional)</label>
                        <div className="relative">
                            <Hash className="absolute left-4 top-3 h-5 w-5 text-neutral-500" />
                            <input
                                type="text"
                                className="pl-12 w-full p-3 bg-white/3 border border-white/8 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20 focus:bg-white/6 transition-all duration-300"
                                value={formData.gstNo}
                                onChange={(e) => setFormData({ ...formData, gstNo: e.target.value })}
                                placeholder="22AAAAA0000A1Z5"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-1.5 ml-1">Financial Year *</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-3 h-5 w-5 text-neutral-500 pointer-events-none" />
                            <select
                                required
                                className="pl-12 w-full p-3 bg-white/3 border border-white/8 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20 focus:bg-white/6 transition-all duration-300 appearance-none cursor-pointer"
                                value={formData.financialYear}
                                onChange={(e) => setFormData({ ...formData, financialYear: e.target.value })}
                            >
                                <option value="2023-24" className="bg-neutral-900 text-white">2023-24</option>
                                <option value="2024-25" className="bg-neutral-900 text-white">2024-25</option>
                                <option value="2025-26" className="bg-neutral-900 text-white">2025-26</option>
                                <option value="2026-27" className="bg-neutral-900 text-white">2026-27</option>
                            </select>
                            {/* Custom dropdown arrow for webkit/firefox since appearance is none */}
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-neutral-950 p-3 rounded-xl hover:bg-neutral-200 transition-all duration-300 flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-8 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                    >
                        {loading ? 'Saving...' : (isEdit ? 'Update Company' : 'Create Company')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CompanyForm;