import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, Save, Plus, Trash2, ShoppingCart } from 'lucide-react';
import api from '../https/axios';

export default function SalesVoucherForm() {
    const navigate = useNavigate();
    const companyId = localStorage.getItem('activeCompanyId');

    const [customers, setCustomers] = useState([]);
    const [stockItems, setStockItems] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        voucherNo: `SAL-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        customerId: '',
        items: [{ stockItemId: '', quantity: 1, rate: 0, amount: 0 }]
    });

    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                const [ledgerRes, itemRes] = await Promise.all([
                    api.get(`/company/${companyId}/ledger`),
                    api.get(`/company/${companyId}/item`)
                ]);
                setCustomers(ledgerRes.data.ledgers.filter(l => l.type === 'CUSTOMER'));
                setStockItems(itemRes.data.items);
            } catch (error) {
                toast.error('Failed to load master data');
            } finally {
                setLoadingData(false);
            }
        };
        fetchMasterData();
    }, [companyId]);

    const grandTotal = formData.items.reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;

        if (field === 'stockItemId') {
            const item = stockItems.find(i => i.id === parseInt(value));
            if (item) {
                newItems[index].rate = item.sellingPrice; // Use selling price
                newItems[index].maxQty = item.quantity; // Store for validation
            }
        }

        if (field === 'quantity' || field === 'rate' || field === 'stockItemId') {
            const qty = Number(newItems[index].quantity) || 0;
            const rate = Number(newItems[index].rate) || 0;
            newItems[index].amount = qty * rate;
        }

        setFormData({ ...formData, items: newItems });
    };

    const addRow = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { stockItemId: '', quantity: 1, rate: 0, amount: 0 }]
        }));
    };

    const removeRow = (index) => {
        if (formData.items.length === 1) {
            toast.warning('Voucher must have at least one item');
            return;
        }
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Client-side Stock Validation
        for (const item of formData.items) {
            if (item.quantity > item.maxQty) {
                toast.error(`Insufficient stock for item. Available: ${item.maxQty}`);
                return;
            }
        }
        setIsSubmitting(true);
        try {
            await api.post(`/company/${companyId}/sales`, {
                ...formData,
                customerId: parseInt(formData.customerId),
                items: formData.items.map(i => ({
                    stockItemId: parseInt(i.stockItemId),
                    quantity: Number(i.quantity), // Forces it to be a Float/Number
                    rate: Number(i.rate),         // Forces it to be a Float/Number
                    amount: Number(i.amount)      // Forces it to be a Float/Number
                }))
            });
            toast.success('Sales Voucher saved and stock updated');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save sale');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loadingData) return (
        <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'rgba(16,185,129,0.3)', borderTopColor: '#10b981' }}></div>
                <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Loading voucher data...</span>
            </div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(16,185,129,0.15)', boxShadow: '0 4px 32px rgba(0,0,0,0.4), 0 0 60px rgba(16,185,129,0.04)' }}>
            
            {/* Header */}
            <div className="p-5 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.1)' }}>
                <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <ShoppingCart className="h-5 w-5" style={{ color: '#34d399' }} />
                </div>
                <div>
                    <h2 className="text-lg font-bold leading-none" style={{ color: 'var(--text-primary)' }}>Sales Voucher (F8)</h2>
                    <p className="text-xs mt-0.5 font-medium" style={{ color: 'var(--text-muted)' }}>Record outward stock to customers</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Header fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Customer *</label>
                        <select
                            required
                            className="select-glass"
                            onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                        >
                            <option value="">-- Select Customer --</option>
                            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Voucher No.</label>
                        <input
                            type="text"
                            className="input-glass"
                            value={formData.voucherNo}
                            onChange={(e) => setFormData({ ...formData, voucherNo: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Date</label>
                        <input
                            type="date"
                            className="input-glass"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>
                </div>

                {/* Line items table */}
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
                            {formData.items.map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td className="px-4 py-2.5">
                                        <select
                                            className="select-glass"
                                            onChange={(e) => handleItemChange(i, 'stockItemId', e.target.value)}
                                        >
                                            <option value="">Select...</option>
                                            {stockItems.map(item => (
                                                <option key={item.id} value={item.id}>{item.name} ({item.quantity} in stock)</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-4 py-2.5">
                                        <input
                                            type="number"
                                            className="input-glass"
                                            value={row.quantity}
                                            onChange={(e) => handleItemChange(i, 'quantity', e.target.value)}
                                        />
                                    </td>
                                    <td className="px-4 py-2.5">
                                        <input
                                            type="number"
                                            className="input-glass"
                                            value={row.rate}
                                            onChange={(e) => handleItemChange(i, 'rate', e.target.value)}
                                        />
                                    </td>
                                    <td className="px-4 py-2.5 text-right font-semibold" style={{ color: '#34d399' }}>
                                        ₹{Number(row.amount || 0).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-2.5 text-center">
                                        <button
                                            type="button"
                                            onClick={() => removeRow(i)}
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
                    
                    {/* Add Row Button */}
                    <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <button
                            type="button"
                            onClick={addRow}
                            className="text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150"
                            style={{ color: '#34d399', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.15)' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(52,211,153,0.15)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(52,211,153,0.08)'; }}
                        >
                            <Plus className="h-3.5 w-3.5" /> Add Row
                        </button>
                    </div>
                </div>

                {/* Footer: total + submit */}
                <div className="flex justify-between items-center pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Grand Total</p>
                        <p className="text-2xl font-bold" style={{ color: '#34d399' }}>₹{grandTotal.toFixed(2)}</p>
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary"
                        style={{ background: 'linear-gradient(135deg, #059669, #10b981)', borderColor: 'rgba(16,185,129,0.3)', boxShadow: '0 0 16px rgba(16,185,129,0.25)' }}
                    >
                        <Save className="h-4 w-4" />
                        {isSubmitting ? 'Processing...' : 'Save Sale'}
                    </button>
                </div>
            </form>
        </div>
    );
}