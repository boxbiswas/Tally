import React from 'react';
import { ArrowLeft } from 'lucide-react';

const CompanyFormHeader = ({ isEdit, onBack }) => {
    return (
        <div className="p-6 border-b border-white/10 bg-white/5 flex items-center gap-4">
            <button
                onClick={onBack}
                className="h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-white/10 text-neutral-400 hover:text-white"
            >
                <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="flex-1">
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                    {isEdit ? 'Edit Company' : 'Create New Company'}
                </h2>
                <p className="text-sm text-neutral-400 mt-0.5">
                    {isEdit ? 'Update company information' : 'Enter company details'}
                </p>
            </div>

            {/* ESC hint */}
            <div className="hidden sm:block text-[10px] font-mono text-neutral-500 bg-white/10 px-2 py-1 rounded border border-white/10">
                ESC
            </div>
        </div>
    );
};

export default CompanyFormHeader;