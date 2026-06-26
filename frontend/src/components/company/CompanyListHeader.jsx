import React from 'react';
import { Building, Plus, LogOut } from 'lucide-react';

const CompanyListHeader = ({ onCreate, onLogout }) => {
    return (
        <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-semibold text-white tracking-tight flex items-center gap-3">
                <div className="p-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                    <Building className="h-7 w-7 text-neutral-300" />
                </div>
                Select Company
            </h1>

            <div className="flex items-center gap-4">
                <button
                    onClick={onCreate}
                    className="bg-white text-neutral-950 px-5 py-3 rounded-2xl hover:bg-neutral-100 transition-all duration-300 flex items-center gap-2 font-medium shadow-xl shadow-white/10 hover:shadow-2xl"
                >
                    <Plus className="h-4 w-4" />
                    Create Company
                    <kbd className="ml-2 px-2 py-1 rounded bg-neutral-200 text-neutral-700 text-xs font-mono border border-neutral-300">Alt + C</kbd>
                </button>

                <button
                    onClick={onLogout}
                    className="text-sm font-medium text-red-400 hover:text-red-300 bg-red-500/10 border border-red-500/30 px-5 py-3 rounded-2xl flex items-center gap-2 transition-all hover:bg-red-500/20"
                >
                    <LogOut className="h-4 w-4" /> Logout
                    <kbd className="ml-2 px-2 py-1 rounded bg-red-900/40 text-red-300 text-xs font-mono border border-red-500/30">Alt + Q</kbd>
                </button>
            </div>
        </div>
    );
};

export default CompanyListHeader;