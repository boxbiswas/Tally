import React from 'react';

/**
 * Stock Summary Report Table
 */
const StockReport = ({ data, selectedRowIndex, setSelectedRowIndex }) => {
    return (
        <table className="w-full text-left text-sm">
            <thead>
                <tr style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider">Item Name</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-right">Closing Qty</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-right">Avg Rate (₹)</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-right">Total Value (₹)</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, i) => {
                    const isSelected = i === selectedRowIndex;
                    return (
                        <tr 
                            key={i} 
                            className="table-row-hover cursor-pointer" 
                            style={{ 
                                borderBottom: '1px solid rgba(255,255,255,0.04)', 
                                background: isSelected ? 'rgba(59,130,246,0.1)' : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', 
                                transition: 'background 0.15s' 
                            }}
                            onClick={() => setSelectedRowIndex(i)}
                        >
                            <td className="px-5 py-3.5 font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{item.name}</td>
                            <td className="px-5 py-3.5 text-right font-medium text-sm" style={{ color: 'var(--text-secondary)' }}>
                                {item.quantity} {item.unit}
                            </td>
                            <td className="px-5 py-3.5 text-right text-sm" style={{ color: 'var(--text-muted)' }}>
                                {item.purchasePrice.toFixed(2)}
                            </td>
                            <td className="px-5 py-3.5 text-right font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                                {item.stockValue.toFixed(2)}
                            </td>
                        </tr>
                    );
                })}
                {data.length === 0 && (
                    <tr>
                        <td colSpan="4" className="px-5 py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                            No stock items found.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default StockReport;