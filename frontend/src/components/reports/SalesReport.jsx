import React from 'react';

/**
 * Sales Register Report Table
 */
const SalesReport = ({ data, selectedRowIndex, setSelectedRowIndex, navigate }) => {
    return (
        <table className="w-full text-left text-sm">
            <thead>
                <tr style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider">Date</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider">Voucher No.</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider">Customer Account</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-right">Amount (₹)</th>
                </tr>
            </thead>
            <tbody>
                {data.map((v, i) => {
                    const isSelected = i === selectedRowIndex;
                    return (
                        <tr
                            key={i}
                            onClick={() => {
                                setSelectedRowIndex(i);
                                navigate(`/vouchers/sales/print/${v.id}`);
                            }}
                            className="table-row-hover cursor-pointer"
                            style={{ 
                                borderBottom: '1px solid rgba(255,255,255,0.04)', 
                                background: isSelected ? 'rgba(59,130,246,0.1)' : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', 
                                transition: 'background 0.15s' 
                            }}
                        >
                            <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-muted)' }}>
                                {new Date(v.date).toLocaleDateString()}
                            </td>
                            <td className="px-5 py-3.5 font-mono text-xs font-bold" 
                                style={{ color: '#60a5fa' }} 
                                title="Press Enter or Click to Print">
                                {v.voucherNo} 🖨️
                            </td>
                            <td className="px-5 py-3.5 font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                                {v.customer.name}
                            </td>
                            <td className="px-5 py-3.5 text-right font-bold text-sm" style={{ color: '#34d399' }}>
                                {v.total.toFixed(2)}
                            </td>
                        </tr>
                    );
                })}
                {data.length === 0 && (
                    <tr>
                        <td colSpan="4" className="px-5 py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                            No sales records found.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default SalesReport;