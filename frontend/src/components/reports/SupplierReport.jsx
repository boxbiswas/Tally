import React from 'react';

/**
 * Supplier Outstanding Report Table
 */
const SupplierReport = ({ data, selectedRowIndex, setSelectedRowIndex }) => {
    return (
        <table className="w-full text-left text-sm">
            <thead>
                <tr style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider">Supplier Name</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider">Contact</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-right">Closing Balance (₹)</th>
                </tr>
            </thead>
            <tbody>
                {data.map((s, i) => {
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
                            <td className="px-5 py-3.5 font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{s.name}</td>
                            <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-secondary)' }}>{s.mobile || '—'}</td>
                            <td className="px-5 py-3.5 text-right font-semibold text-sm" style={{ color: s.balance > 0 ? '#f87171' : '#34d399' }}>
                                {s.balance.toFixed(2)} {s.balance > 0 ? 'Cr' : ''}
                            </td>
                        </tr>
                    );
                })}
                {data.length === 0 && (
                    <tr>
                        <td colSpan="3" className="px-5 py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                            No suppliers found.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default SupplierReport;