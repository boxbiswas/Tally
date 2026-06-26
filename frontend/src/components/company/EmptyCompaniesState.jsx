import React from 'react';

const EmptyCompaniesState = () => {
    return (
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-16 rounded-3xl shadow-2xl text-center">
            <div className="mx-auto w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-4xl">🏢</span>
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No Companies Yet</h3>
            <p className="text-neutral-400 max-w-xs mx-auto">
                Create your first company to get started with the ERP system.
            </p>
        </div>
    );
};

export default EmptyCompaniesState;