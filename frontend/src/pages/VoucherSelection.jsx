import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Truck, ArrowRight, ArrowLeft } from 'lucide-react';

export default function VoucherSelection() {
    const navigate = useNavigate();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center gap-4">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-150"
                    style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                >
                    <ArrowLeft className="h-4 w-4" />
                </button>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Accounting Vouchers</h2>
                    <p className="text-sm mt-1 font-medium" style={{ color: 'var(--text-muted)' }}>Select the type of transaction you want to record.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Purchase Voucher Card */}
                <Link
                    to="/vouchers/purchase"
                    className="group relative p-6 rounded-2xl flex items-start justify-between transition-all duration-300 no-underline"
                    style={{
                        background: 'rgba(255,255,255,0.04)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        border: '1px solid rgba(245,158,11,0.15)',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.3), 0 0 40px rgba(245,158,11,0.04)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4), 0 0 60px rgba(245,158,11,0.1)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.35)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3), 0 0 40px rgba(245,158,11,0.04)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.15)'; }}
                >
                    {/* Top accent line */}
                    <div className="absolute top-0 left-6 right-6 h-px rounded-full" style={{ background: 'linear-gradient(90deg,transparent,rgba(245,158,11,0.4),transparent)' }} />
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105"
                            style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)', boxShadow: '0 0 20px rgba(245,158,11,0.1)' }}>
                            <Truck className="h-7 w-7" style={{ color: '#fbbf24' }} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold transition-colors" style={{ color: 'var(--text-primary)' }}>
                                Purchase (F9)
                            </h3>
                            <p className="text-sm mt-1 font-medium" style={{ color: 'var(--text-muted)' }}>Record inward stock from suppliers.</p>
                        </div>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 mt-1 transition-transform duration-300 group-hover:translate-x-1" style={{ color: '#fbbf24' }} />
                </Link>

                {/* Sales Voucher Card */}
                <Link
                    to="/vouchers/sales"
                    className="group relative p-6 rounded-2xl flex items-start justify-between transition-all duration-300 no-underline"
                    style={{
                        background: 'rgba(255,255,255,0.04)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        border: '1px solid rgba(16,185,129,0.15)',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.3), 0 0 40px rgba(16,185,129,0.04)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4), 0 0 60px rgba(16,185,129,0.1)'; e.currentTarget.style.borderColor = 'rgba(16,185,129,0.35)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3), 0 0 40px rgba(16,185,129,0.04)'; e.currentTarget.style.borderColor = 'rgba(16,185,129,0.15)'; }}
                >
                    {/* Top accent line */}
                    <div className="absolute top-0 left-6 right-6 h-px rounded-full" style={{ background: 'linear-gradient(90deg,transparent,rgba(16,185,129,0.4),transparent)' }} />
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105"
                            style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)', boxShadow: '0 0 20px rgba(16,185,129,0.1)' }}>
                            <ShoppingCart className="h-7 w-7" style={{ color: '#34d399' }} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold transition-colors" style={{ color: 'var(--text-primary)' }}>
                                Sales (F8)
                            </h3>
                            <p className="text-sm mt-1 font-medium" style={{ color: 'var(--text-muted)' }}>Record outward stock to customers.</p>
                        </div>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 mt-1 transition-transform duration-300 group-hover:translate-x-1" style={{ color: '#34d399' }} />
                </Link>
            </div>
        </div>
    );
}