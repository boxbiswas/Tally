import React from 'react';
import { AlertTriangle, Package, ArrowRight } from 'lucide-react';

/**
 * Low Stock Items Detailed List Sidebar
 */
const LowStockItemsList = ({ lowStockItems, onManageInventory }) => {
    return (
        <div className="rounded-2xl p-6 flex flex-col" 
             style={{ 
                 background: 'rgba(255,255,255,0.04)', 
                 backdropFilter: 'blur(16px)', 
                 WebkitBackdropFilter: 'blur(16px)', 
                 border: '1px solid rgba(255,255,255,0.08)', 
                 boxShadow: '0 4px 24px rgba(0,0,0,0.3)' 
             }}>
            
            <h2 className="text-base font-bold mb-4 flex items-center gap-2 pb-3" 
                style={{ color: 'var(--text-primary)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <AlertTriangle className="h-4 w-4 text-red-400" /> 
                Items to Reorder
            </h2>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar max-h-52 space-y-2">
                {lowStockItems.length > 0 ? (
                    lowStockItems.map(item => (
                        <div key={item.id} className="flex justify-between items-center p-3 rounded-xl" 
                             style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                            <div>
                                <p className="font-semibold text-sm leading-none" style={{ color: 'var(--text-primary)' }}>
                                    {item.name}
                                </p>
                                <p className="text-[11px] mt-1 font-medium" style={{ color: '#f87171' }}>
                                    ⚠ Critical Level
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="block text-lg font-bold" style={{ color: '#f87171' }}>
                                    {item.quantity}
                                </span>
                                <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
                                    Left in stock
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center py-10 gap-3">
                        <div className="h-12 w-12 rounded-xl flex items-center justify-center" 
                             style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.15)' }}>
                            <Package className="h-5 w-5" style={{ color: '#34d399' }} />
                        </div>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                            Inventory levels are healthy
                        </p>
                    </div>
                )}
            </div>
            
            <button 
                onClick={onManageInventory}
                className="mt-4 w-full py-2.5 text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200"
                style={{ 
                    color: 'var(--text-secondary)', 
                    background: 'rgba(255,255,255,0.04)', 
                    border: '1px solid rgba(255,255,255,0.08)' 
                }}
                onMouseEnter={e => { 
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; 
                    e.currentTarget.style.color = 'var(--text-primary)'; 
                }}
                onMouseLeave={e => { 
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; 
                    e.currentTarget.style.color = 'var(--text-secondary)'; 
                }}
            >
                Manage Inventory <ArrowRight className="h-4 w-4" />
            </button>
        </div>
    );
};

export default LowStockItemsList;