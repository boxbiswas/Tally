import React from 'react';
import { Users, Truck, Package, TrendingUp, IndianRupee } from 'lucide-react';

/**
 * Reusable KPI Card Component
 * Displays key metrics with colored icons and hover effects
 */
const KpiCard = ({ label, value, icon, color, onClick }) => {
    const colorMap = {
        blue:   { iconBg: 'rgba(59,130,246,0.12)',  iconClr: '#60a5fa', border: 'rgba(59,130,246,0.15)',  glow: 'rgba(59,130,246,0.08)'  },
        purple: { iconBg: 'rgba(139,92,246,0.12)', iconClr: '#a78bfa', border: 'rgba(139,92,246,0.15)', glow: 'rgba(139,92,246,0.08)' },
        indigo: { iconBg: 'rgba(99,102,241,0.12)',  iconClr: '#818cf8', border: 'rgba(99,102,241,0.15)',  glow: 'rgba(99,102,241,0.08)'  },
        green:  { iconBg: 'rgba(16,185,129,0.12)',  iconClr: '#34d399', border: 'rgba(16,185,129,0.15)',  glow: 'rgba(16,185,129,0.08)'  },
        orange: { iconBg: 'rgba(245,158,11,0.12)',  iconClr: '#fbbf24', border: 'rgba(245,158,11,0.15)',  glow: 'rgba(245,158,11,0.08)'  },
        red:    { iconBg: 'rgba(239,68,68,0.12)',   iconClr: '#f87171', border: 'rgba(239,68,68,0.15)',   glow: 'rgba(239,68,68,0.08)'   },
    };

    const c = colorMap[color] || colorMap.blue;

    const IconComponent = {
        Users: Users,
        Truck: Truck,
        Package: Package,
        TrendingUp: TrendingUp,
        IndianRupee: IndianRupee,
    }[icon] || Users;

    return (
        <div
            onClick={onClick}
            className={`relative p-5 rounded-2xl flex items-center justify-between transition-all duration-300 ${onClick ? 'cursor-pointer' : ''}`}
            style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: `1px solid ${c.border}`,
                boxShadow: `0 4px 24px rgba(0,0,0,0.3), 0 0 40px ${c.glow}`,
            }}
            onMouseEnter={e => { if (onClick) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.4), 0 0 60px ${c.glow}`; }}}
            onMouseLeave={e => { if (onClick) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 24px rgba(0,0,0,0.3), 0 0 40px ${c.glow}`; }}}
        >
            {/* Accent line */}
            <div className="absolute top-0 left-6 right-6 h-px rounded-full" 
                 style={{ background: `linear-gradient(90deg, transparent, ${c.iconClr}40, transparent)` }} />
            
            <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                    {label}
                </p>
                <p className="text-2xl font-bold leading-none" style={{ color: 'var(--text-primary)' }}>
                    {value}
                </p>
            </div>

            <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                 style={{ background: c.iconBg, border: `1px solid ${c.border}` }}>
                <IconComponent className="h-5 w-5" style={{ color: c.iconClr }} />
            </div>
        </div>
    );
};

export default KpiCard;