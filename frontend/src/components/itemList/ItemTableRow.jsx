import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

/**
 * Individual Item Table Row
 * Displays item data and action buttons (Edit / Delete)
 */
const ItemTableRow = ({ item, idx, onEdit, onDelete }) => {
    return (
        <tr
            className="table-row-hover"
            style={{
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)'
            }}
        >
            {/* SKU */}
            <td className="px-5 py-3.5 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                {item.sku}
            </td>

            {/* Item Name */}
            <td className="px-5 py-3.5 font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                {item.name}
            </td>

            {/* Purchase Price */}
            <td className="px-5 py-3.5 text-right text-sm" style={{ color: 'var(--text-secondary)' }}>
                ₹{item.purchasePrice.toFixed(2)}
            </td>

            {/* Selling Price */}
            <td className="px-5 py-3.5 text-right text-sm" style={{ color: 'var(--text-secondary)' }}>
                ₹{item.sellingPrice.toFixed(2)}
            </td>

            {/* Current Stock */}
            <td className="px-5 py-3.5 text-right">
                <span className={item.quantity <= 10 ? 'badge-orange' : 'badge-green'}>
                    {item.quantity} {item.unit}
                </span>
            </td>

            {/* Actions */}
            <td className="px-5 py-3.5">
                <div className="flex justify-center gap-2">
                    {/* Edit Button */}
                    <button
                        onClick={() => onEdit(item.id)}
                        className="h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-150"
                        style={{
                            color: '#60a5fa',
                            background: 'rgba(59,130,246,0.08)',
                            border: '1px solid rgba(59,130,246,0.15)'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.18)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.08)'; }}
                        title="Alter Item"
                    >
                        <Edit className="h-3.5 w-3.5" />
                    </button>

                    {/* Delete Button */}
                    <button
                        onClick={() => onDelete(item.id)}
                        className="h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-150"
                        style={{
                            color: '#f87171',
                            background: 'rgba(239,68,68,0.08)',
                            border: '1px solid rgba(239,68,68,0.15)'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                        title="Delete Item"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default ItemTableRow;