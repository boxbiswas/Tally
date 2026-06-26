import React from 'react';
import ItemTableRow from './ItemTableRow';


const ItemTable = ({ items, loading, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                        {['SKU', 'Item Name', 'Purchase Price', 'Selling Price', 'Current Stock', 'Actions'].map((h, i) => (
                            <th
                                key={h}
                                className={`px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider 
                                    ${i >= 2 && i <= 4 ? 'text-right' : i === 5 ? 'text-center' : ''}`}
                                style={{ color: 'var(--text-muted)' }}
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="6" className="px-5 py-12 text-center text-sm font-medium"
                                style={{ color: 'var(--text-muted)' }}>
                                Loading...
                            </td>
                        </tr>
                    ) : items.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="px-5 py-12 text-center text-sm font-medium"
                                style={{ color: 'var(--text-muted)' }}>
                                No items found.
                            </td>
                        </tr>
                    ) : (
                        items.map((item, idx) => (
                            <ItemTableRow
                                key={item.id}
                                item={item}
                                idx={idx}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ItemTable;