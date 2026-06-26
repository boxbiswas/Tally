import React from 'react';
import { Building, Plus, LogOut } from 'lucide-react';

const CompanyListHeader = ({ onCreate, onLogout }) => {
    return (
        <div className="flex justify-between items-center mb-10">
            <h1 className="text-2xl font-semibold text-white tracking-tight flex items-center gap-3">
                <div className="p-2 bg-white/5 border border-white/10 rounded-lg backdrop-blur-md">
                    <Building className="h-6 w-6 text-neutral-300" />
                </div>
                Select Company
            </h1>

            <div className="flex items-center gap-4">
                <button
                    onClick={onCreate}
                    className="bg-white text-neutral-950 px-4 py-2.5 rounded-xl hover:bg-neutral-200 transition-all duration-300 flex items-center gap-2 font-medium shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                >
                    <Plus className="h-4 w-4" /> Create Company
                    <kbd className="ml-1 px-1.5 py-0.5 rounded bg-neutral-200 text-neutral-600 text-[10px] font-mono border border-neutral-300">Alt+C</kbd>
                </button>
                <button
                    onClick={onLogout}
                    className="text-sm font-medium text-red-400 hover:text-red-300 bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all hover:bg-red-500/20"
                >
                    <LogOut className="h-4 w-4" /> Logout
                    <kbd className="ml-1 px-1.5 py-0.5 rounded bg-red-900/30 text-red-300 text-[10px] font-mono border border-red-500/30">Alt+Q</kbd>
                </button>
            </div>
        </div>
    );
};

export default CompanyListHeader;