import React from 'react';
import { ArrowLeft } from 'lucide-react';

const VoucherSelectionHeader = ({ onBack }) => {
    return (
        <div className="mb-8 flex items-center gap-4">
            <button
                onClick={onBack}
                className="h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-150"
                style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            >
                <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
                <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    Accounting Vouchers
                </h2>
                <p className="text-sm mt-1 font-medium" style={{ color: 'var(--text-muted)' }}>
                    Select the type of transaction you want to record.
                </p>
            </div>
        </div>
    );
};

export default VoucherSelectionHeader;