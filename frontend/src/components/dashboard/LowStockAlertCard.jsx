import React from 'react';
import { AlertTriangle } from 'lucide-react';


const LowStockAlertCard = ({ lowStockItems }) => {
    return (
        <div
            className="relative p-5 rounded-2xl flex items-center justify-between"
            style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: lowStockItems.length > 0 ? '1px solid rgba(239,68,68,0.25)' : '1px solid rgba(255,255,255,0.08)',
                boxShadow: lowStockItems.length > 0 ? '0 4px 24px rgba(0,0,0,0.3), 0 0 40px rgba(239,68,68,0.08)' : '0 4px 24px rgba(0,0,0,0.3)',
            }}
        >
            <div className="absolute top-0 left-6 right-6 h-px rounded-full"
                style={{ 
                    background: lowStockItems.length > 0 
                        ? 'linear-gradient(90deg,transparent,rgba(239,68,68,0.5),transparent)' 
                        : 'linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)' 
                }} 
            />
            
            <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                    Low Stock Alerts
                </p>
                <p className="text-2xl font-bold leading-none" 
                   style={{ color: lowStockItems.length > 0 ? '#f87171' : 'var(--text-primary)' }}>
                    {lowStockItems.length} Items
                </p>
            </div>

            <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${lowStockItems.length > 0 ? 'animate-pulse' : ''}`}
                style={{ 
                    background: lowStockItems.length > 0 ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.05)', 
                    border: lowStockItems.length > 0 ? '1px solid rgba(239,68,68,0.25)' : '1px solid rgba(255,255,255,0.08)' 
                }}>
                <AlertTriangle className="h-5 w-5" 
                    style={{ color: lowStockItems.length > 0 ? '#f87171' : 'var(--text-muted)' }} 
                />
            </div>
        </div>
    );
};

export default LowStockAlertCard;