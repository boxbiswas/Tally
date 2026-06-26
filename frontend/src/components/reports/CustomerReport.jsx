import React from 'react';

/**
 * Customer Outstanding Report Table
 */
const CustomerReport = ({ data, selectedRowIndex, setSelectedRowIndex }) => {
    return (
        <table className="w-full text-left text-sm">
            <thead>
                <tr style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider">Customer Name</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider">Contact</th>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-right">Closing Balance (₹)</th>
                </tr>
            </thead>
            <tbody>
                {data.map((c, i) => {
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
                            <td className="px-5 py-3.5 font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{c.name}</td>
                            <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-secondary)' }}>{c.mobile || '—'}</td>
                            <td className={`px-5 py-3.5 text-right font-semibold text-sm`} style={{ color: c.balance > 0 ? '#f87171' : '#34d399' }}>
                                {c.balance.toFixed(2)} {c.balance > 0 ? 'Dr' : ''}
                            </td>
                        </tr>
                    );
                })}
                {data.length === 0 && (
                    <tr>
                        <td colSpan="3" className="px-5 py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                            No customers found.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default CustomerReport;