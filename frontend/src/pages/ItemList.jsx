import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../https/axios';

export default function ItemList() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const companyId = localStorage.getItem('activeCompanyId');

    const fetchItems = async (search = '') => {
        try {
            setLoading(true);
            const url = search
                ? `/company/${companyId}/item?search=${search}`
                : `/company/${companyId}/item`;
            const response = await api.get(url);
            setItems(response.data.items);
        } catch (error) {
            toast.error('Failed to fetch stock items');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [companyId]);

    // Debounced search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchItems(searchQuery);
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            await api.delete(`/company/${companyId}/item/${id}`);
            toast.success('Item deleted successfully');
            setItems(items.filter(item => item.id !== id));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete item');
        }
    };

    return (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 32px rgba(0,0,0,0.4)' }}>

            {/* Header */}
            <div className="px-5 py-4 flex items-center justify-between gap-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <h2 className="text-lg font-bold flex items-center gap-2.5 shrink-0" style={{ color: 'var(--text-primary)' }}>
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
                        <Package className="h-4 w-4 text-indigo-400" />
                    </div>
                    Stock Items Master
                </h2>

                <div className="flex items-center gap-3">
                    <div className="relative w-52">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none z-10" style={{ color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-search"
                        />
                    </div>
                    <button
                        onClick={() => navigate('/inventory/create')}
                        className="btn-primary text-sm shrink-0"
                    >
                        <Plus className="h-4 w-4" /> Create Item (Alt+S)
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                            {['SKU','Item Name','Purchase Price','Selling Price','Current Stock','Actions'].map((h, i) => (
                                <th key={h} className={`px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider ${i >= 2 && i <= 4 ? 'text-right' : i === 5 ? 'text-center' : ''}`} style={{ color: 'var(--text-muted)' }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="px-5 py-12 text-center text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Loading...</td></tr>
                        ) : items.length === 0 ? (
                            <tr><td colSpan="6" className="px-5 py-12 text-center text-sm font-medium" style={{ color: 'var(--text-muted)' }}>No items found.</td></tr>
                        ) : (
                            items.map((item, idx) => (
                                <tr
                                    key={item.id}
                                    className="table-row-hover"
                                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}
                                >
                                    <td className="px-5 py-3.5 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{item.sku}</td>
                                    <td className="px-5 py-3.5 font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{item.name}</td>
                                    <td className="px-5 py-3.5 text-right text-sm" style={{ color: 'var(--text-secondary)' }}>₹{item.purchasePrice.toFixed(2)}</td>
                                    <td className="px-5 py-3.5 text-right text-sm" style={{ color: 'var(--text-secondary)' }}>₹{item.sellingPrice.toFixed(2)}</td>
                                    <td className="px-5 py-3.5 text-right">
                                        <span className={item.quantity <= 10 ? 'badge-orange' : 'badge-green'}>
                                            {item.quantity} {item.unit}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => navigate(`/inventory/edit/${item.id}`)}
                                                className="h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-150"
                                                style={{ color: '#60a5fa', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.18)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.08)'; }}
                                                title="Alter Item"
                                            >
                                                <Edit className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-150"
                                                style={{ color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                                                title="Delete Item"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}