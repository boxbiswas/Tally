import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const SalesVoucherItemsTable = ({ items, stockItems, onItemChange, onAddRow, onRemoveRow }) => {
    return (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <table className="w-full text-sm">
                <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Item</th>
                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider w-28" style={{ color: 'var(--text-muted)' }}>Qty</th>
                        <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider w-32" style={{ color: 'var(--text-muted)' }}>Rate</th>
                        <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider w-32" style={{ color: 'var(--text-muted)' }}>Amount</th>
                        <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider w-14" style={{ color: 'var(--text-muted)' }}>Del</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td className="px-4 py-2.5">
                                <select
                                    className="select-glass"
                                    value={row.stockItemId}
                                    onChange={(e) => onItemChange(i, 'stockItemId', e.target.value)}
                                >
                                    <option value="">Select...</option>
                                    {stockItems.map(item => (
                                        <option key={item.id} value={item.id}>
                                            {item.name} ({item.quantity} in stock)
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td className="px-4 py-2.5">
                                <input
                                    type="number"
                                    className="input-glass"
                                    value={row.quantity}
                                    onChange={(e) => onItemChange(i, 'quantity', e.target.value)}
                                />
                            </td>
                            <td className="px-4 py-2.5">
                                <input
                                    type="number"
                                    className="input-glass"
                                    value={row.rate}
                                    onChange={(e) => onItemChange(i, 'rate', e.target.value)}
                                />
                            </td>
                            <td className="px-4 py-2.5 text-right font-semibold" style={{ color: '#34d399' }}>
                                ₹{Number(row.amount || 0).toFixed(2)}
                            </td>
                            <td className="px-4 py-2.5 text-center">
                                <button
                                    type="button"
                                    onClick={() => onRemoveRow(i)}
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
                    style={{ color: '#34d399', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.15)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(52,211,153,0.15)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(52,211,153,0.08)'; }}
                >
                    <Plus className="h-3.5 w-3.5" /> Add Row
                </button>
            </div>
        </div>
    );
};

export default SalesVoucherItemsTable;