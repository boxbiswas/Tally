import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, ShoppingCart, ArrowRight } from 'lucide-react';

const VoucherCard = ({
    to,
    icon,
    title,
    description,
    accentColor,
    borderColor,
    glowColor
}) => {
    const IconComponent = icon === 'Truck' ? Truck : ShoppingCart;

    return (
        <Link
            to={to}
            className="group relative p-6 rounded-2xl flex items-start justify-between transition-all duration-300 no-underline"
            style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: `1px solid ${borderColor}`,
                boxShadow: `0 4px 24px rgba(0,0,0,0.3), 0 0 40px ${glowColor}`,
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.4), 0 0 60px ${glowColor.replace('0.04', '0.1')}`;
                e.currentTarget.style.borderColor = borderColor.replace('0.15', '0.35');
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 4px 24px rgba(0,0,0,0.3), 0 0 40px ${glowColor}`;
                e.currentTarget.style.borderColor = borderColor;
            }}
        >
            {/* Top accent line */}
            <div className="absolute top-0 left-6 right-6 h-px rounded-full"
                style={{ background: `linear-gradient(90deg,transparent,${accentColor}40,transparent)` }} />

            <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105"
                    style={{
                        background: accentColor + '12',
                        border: `1px solid ${accentColor}20`,
                        boxShadow: `0 0 20px ${accentColor}10`
                    }}>
                    <IconComponent className="h-7 w-7" style={{ color: accentColor }} />
                </div>
                <div>
                    <h3 className="text-xl font-bold transition-colors" style={{ color: 'var(--text-primary)' }}>
                        {title}
                    </h3>
                    <p className="text-sm mt-1 font-medium" style={{ color: 'var(--text-muted)' }}>
                        {description}
                    </p>
                </div>
            </div>

            <ArrowRight className="h-5 w-5 shrink-0 mt-1 transition-transform duration-300 group-hover:translate-x-1"
                style={{ color: accentColor }} />
        </Link>
    );
};

export default VoucherCard;