import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

/**
 * Individual Ledger Table Row
 */
const LedgerTableRow = ({ ledger, idx, onEdit, onDelete }) => {
    return (
        <tr
            className="table-row-hover"
            style={{
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)'
            }}
        >
            {/* Ledger Name */}
            <td className="px-5 py-3.5 font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                {ledger.name}
            </td>

            {/* Group/Type */}
            <td className="px-5 py-3.5">
                <span className={ledger.type === 'CUSTOMER' ? 'badge-blue' : 'badge-purple'}>
                    {ledger.type}
                </span>
            </td>

            {/* Contact */}
            <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {ledger.mobile || '—'}
            </td>

            {/* GST No */}
            <td className="px-5 py-3.5 text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
                {ledger.gstNo || '—'}
            </td>

            {/* Opening Balance */}
            <td className="px-5 py-3.5 text-right font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                ₹{ledger.openingBalance.toFixed(2)}
            </td>

            {/* Action Buttons */}
            <td className="px-5 py-3.5">
                <div className="flex justify-center gap-2">
                    {/* Edit Button */}
                    <button
                        onClick={() => onEdit(ledger.id)}
                        className="h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-150"
                        style={{
                            color: '#60a5fa',
                            background: 'rgba(59,130,246,0.08)',
                            border: '1px solid rgba(59,130,246,0.15)'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.18)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.08)'; }}
                        title="Alter Ledger"
                    >
                        <Edit className="h-3.5 w-3.5" />
                    </button>

                    {/* Delete Button */}
                    <button
                        onClick={() => onDelete(ledger.id)}
                        className="h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-150"
                        style={{
                            color: '#f87171',
                            background: 'rgba(239,68,68,0.08)',
                            border: '1px solid rgba(239,68,68,0.15)'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                        title="Delete Ledger"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default LedgerTableRow;