import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const PurchaseVoucherItemsTable = ({ items, stockItems, onItemChange, onAddRow, onRemoveRow }) => {
    return (
        <div className="overflow-x-auto" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <table className="w-full text-left text-sm">
                <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                        <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider w-10" style={{ color: 'var(--text-muted)' }}>#</th>
                        <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Name of Item</th>
                        <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider w-32" style={{ color: 'var(--text-muted)' }}>Quantity</th>
                        <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider w-36" style={{ color: 'var(--text-muted)' }}>Rate (₹)</th>
                        <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider w-36" style={{ color: 'var(--text-muted)' }}>Amount (₹)</th>
                        <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider w-14" style={{ color: 'var(--text-muted)' }}>Del</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((row, index) => (
                        <tr key={index} className="table-row-hover" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td className="px-4 py-2.5 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{index + 1}</td>

                            <td className="px-4 py-2.5">
                                <select
                                    required
                                    value={row.stockItemId}
                                    onChange={(e) => onItemChange(index, 'stockItemId', e.target.value)}
                                    className="select-glass"
                                >
                                    <option value="">Select Item...</option>
                                    {stockItems.map(item => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))}
                                </select>
                            </td>

                            <td className="px-4 py-2.5">
                                <input
                                    type="number"
                                    required
                                    min="0.01"
                                    step="0.01"
                                    value={row.quantity}
                                    onChange={(e) => onItemChange(index, 'quantity', e.target.value)}
                                    className="input-glass text-center"
                                />
                            </td>

                            <td className="px-4 py-2.5">
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={row.rate}
                                    onChange={(e) => onItemChange(index, 'rate', e.target.value)}
                                    className="input-glass text-right"
                                />
                            </td>

                            <td className="px-4 py-2.5 text-right font-semibold" style={{ color: '#fbbf24' }}>
                                ₹{Number(row.amount || 0).toFixed(2)}
                            </td>

                            <td className="px-4 py-2.5 text-center">
                                <button
                                    type="button"
                                    onClick={() => onRemoveRow(index)}
                                    className="h-7 w-7 rounded-lg flex items-center justify-center mx-auto transition-all duration-150"
                                    style={{ color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                                    title="Remove Row"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <button
                    type="button"
                    onClick={onAddRow}
                    className="text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150"
                    style={{ color: '#60a5fa', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.15)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.08)'; }}
                >
                    <Plus className="h-3.5 w-3.5" /> Add Row
                </button>
            </div>
        </div>
    );
};

export default PurchaseVoucherItemsTable;