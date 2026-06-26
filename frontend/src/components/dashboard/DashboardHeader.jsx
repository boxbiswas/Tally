import React from 'react';

/**
 * Dashboard Header with title and company switcher
 */
const DashboardHeader = ({ onChangeCompany }) => {
    return (
        <header className="flex justify-between items-end pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div>
                <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    Gateway of SmartERP
                </h1>
                <p className="text-sm mt-1 font-medium" style={{ color: 'var(--text-muted)' }}>
                    Financial &amp; Inventory Overview
                </p>
            </div>
            <button
                onClick={onChangeCompany}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200"
                style={{
                    color: '#93c5fd',
                    background: 'rgba(59,130,246,0.1)',
                    border: '1px solid rgba(59,130,246,0.2)'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.18)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.1)'; }}
            >
                Change Company (F1)
            </button>
        </header>
    );
};

export default DashboardHeader;