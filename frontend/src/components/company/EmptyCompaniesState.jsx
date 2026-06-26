import React from 'react';

const EmptyCompaniesState = () => {
    return (
        <div className="bg-white/3 backdrop-blur-2xl border border-white/8 p-12 rounded-4xl shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] text-center text-neutral-400 font-medium">
            No companies found. Create one to get started.
        </div>
    );
};

export default EmptyCompaniesState;