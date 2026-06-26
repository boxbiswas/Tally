import React from 'react';
import { ArrowLeft } from 'lucide-react';

const LedgerFormHeader = ({ isEdit, onBack }) => {
    return (
        <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-150"
                    style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                >
                    <ArrowLeft className="h-4 w-4" />
                </button>
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                    {isEdit ? 'Alter Ledger' : 'Ledger Creation'}
                </h2>
            </div>
        </div>
    );
};

export default LedgerFormHeader;