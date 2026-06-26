import React from 'react';
import { Building, Calendar, Hash } from 'lucide-react';

const CompanyFormFields = ({ formData, isEdit, onSubmit, loading }) => {
    return (
        <form onSubmit={onSubmit} className="p-8 space-y-6">
            <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5 ml-1">Company Name *</label>
                <div className="relative">
                    <Building className="absolute left-4 top-3 h-5 w-5 text-neutral-500" />
                    <input
                        type="text"
                        required
                        autoFocus
                        className="pl-12 w-full p-3 bg-white/3 border border-white/8 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20 focus:bg-white/6 transition-all duration-300"
                        value={formData.name}
                        onChange={(e) => {/* Handled in parent */ }}
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
                        onChange={(e) => {/* Handled in parent */ }}
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
                        onChange={(e) => {/* Handled in parent */ }}
                    >
                        <option value="2023-24" className="bg-neutral-900 text-white">2023-24</option>
                        <option value="2024-25" className="bg-neutral-900 text-white">2024-25</option>
                        <option value="2025-26" className="bg-neutral-900 text-white">2025-26</option>
                        <option value="2026-27" className="bg-neutral-900 text-white">2026-27</option>
                    </select>
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
    );
};

export default CompanyFormFields;