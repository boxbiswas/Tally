import React from 'react';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

const SalesVoucherHeader = ({ onBack }) => {
    return (
        <div className="p-5 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.1)' }}>
            <button
                onClick={onBack}
                className="h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-150 shrink-0"
                style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            >
                <ArrowLeft className="h-4 w-4" />
            </button>

            <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <ShoppingCart className="h-5 w-5" style={{ color: '#34d399' }} />
            </div>

            <div>
                <h2 className="text-lg font-bold leading-none" style={{ color: 'var(--text-primary)' }}>Sales Voucher (F8)</h2>
                <p className="text-xs mt-0.5 font-medium" style={{ color: 'var(--text-muted)' }}>Record outward stock to customers</p>
            </div>
        </div>
    );
};

export default SalesVoucherHeader;