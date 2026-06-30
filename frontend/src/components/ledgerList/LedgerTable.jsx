import React from 'react';
import LedgerTableRow from './LedgerTableRow';

/**
 * Ledger Table Container
 */
const LedgerTable = ({ ledgers, loading, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                        {['Ledger Name', 'Group/Type', 'Contact', 'GST No.', 'Opening Bal.', 'Actions'].map((h, i) => (
                            <th
                                key={h}
                                className={`px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider 
                                    ${i === 4 ? 'text-right' : i === 5 ? 'text-center' : ''}`}
                                style={{ color: 'var(--text-muted)' }}
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {/* Loading State */}
                    {loading ? (
                        <tr>
                            <td colSpan="6" className="px-5 py-12 text-center text-sm font-medium"
                                style={{ color: 'var(--text-muted)' }}>
                                Loading...
                            </td>
                        </tr>
                    ) :
                        /* Empty State */
                        ledgers.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-5 py-12 text-center text-sm font-medium"
                                    style={{ color: 'var(--text-muted)' }}>
                                    No ledgers found.
                                </td>
                            </tr>
                        ) :
                            /* Ledger Rows */
                            ledgers.map((ledger, idx) => (
                                <LedgerTableRow
                                    key={ledger.id}
                                    ledger={ledger}
                                    idx={idx}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            ))}
                </tbody>
            </table>
        </div>
    );
};

export default LedgerTable;