import React from 'react';
import { Printer, ArrowLeft, FileText } from 'lucide-react';

const PrintActionBar = ({ sale, onBack, onPrint }) => {
    return (
        <div className="w-full max-w-[800px] flex justify-between items-center mb-5 p-3 px-4 rounded-2xl print:hidden"
            style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
            }}>

            <div className="flex items-center gap-3">
                <button
                    onClick={onBack}
                    className="h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-150"
                    style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                >
                    <ArrowLeft className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg flex items-center justify-center"
                        style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
                        <FileText className="h-3.5 w-3.5 text-indigo-400" />
                    </div>
                    <div>
                        <p className="text-sm font-bold leading-none" style={{ color: 'var(--text-primary)' }}>Tax Invoice</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            {sale.voucherNo} · {new Date(sale.date).toLocaleDateString('en-GB')}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-4 pr-4"
                    style={{ borderRight: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="text-center">
                        <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Customer</p>
                        <p className="text-xs font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>{sale.customer.name}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Total</p>
                        <p className="text-xs font-bold mt-0.5" style={{ color: '#34d399' }}>
                            ₹{sale.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>

                <button
                    onClick={onPrint}
                    className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200"
                    style={{
                        background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                        color: '#fff',
                        border: '1px solid rgba(99,102,241,0.4)',
                        boxShadow: '0 0 16px rgba(99,102,241,0.25)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.boxShadow = '0 0 24px rgba(99,102,241,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.boxShadow = '0 0 16px rgba(99,102,241,0.25)'; }}
                >
                    <Printer className="h-4 w-4" /> Print Invoice
                </button>
            </div>
        </div>
    );
};

export default PrintActionBar;