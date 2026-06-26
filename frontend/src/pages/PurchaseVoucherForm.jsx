import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, Save, Plus, Trash2, Truck } from 'lucide-react';
import api from '../https/axios';

export default function PurchaseVoucherForm() {
    const navigate = useNavigate();
    const companyId = localStorage.getItem('activeCompanyId');

    // Master Data State
    const [suppliers, setSuppliers] = useState([]);
    const [stockItems, setStockItems] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        voucherNo: `PUR-${Math.floor(1000 + Math.random() * 9000)}`, // Auto-generate simple voucher number
        date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD
        supplierId: '',
        items: [
            { stockItemId: '', quantity: 1, rate: 0, amount: 0 } // Initial empty row
        ]
    });

    // Fetch Suppliers and Stock Items on load
    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                const [ledgerRes, itemRes] = await Promise.all([
                    api.get(`/company/${companyId}/ledger`),
                    api.get(`/company/${companyId}/item`)
                ]);

                // Filter ledgers to only show Suppliers
                const supplierList = ledgerRes.data.ledgers.filter(l => l.type === 'SUPPLIER');
                setSuppliers(supplierList);
                setStockItems(itemRes.data.items);
            } catch (error) {
                toast.error('Failed to load master data');
            } finally {
                setLoadingData(false);
            }
        };
        fetchMasterData();
    }, [companyId]);

    // Derived Grand Total
    const grandTotal = formData.items.reduce((sum, item) => sum + Number(item.amount || 0), 0);

    // Dynamic Row Handlers
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

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;

        // If the user selects an item, auto-fill the purchase rate from the item master
        if (field === 'stockItemId') {
            const selectedItem = stockItems.find(item => item.id === parseInt(value));
            if (selectedItem) {
                newItems[index].rate = selectedItem.purchasePrice;
            }
        }

        // Auto-calculate the amount for the row
        if (field === 'quantity' || field === 'rate' || field === 'stockItemId') {
            const qty = Number(newItems[index].quantity) || 0;
            const rate = Number(newItems[index].rate) || 0;
            newItems[index].amount = qty * rate;
        }

        setFormData({ ...formData, items: newItems });
    };

    // Submit Handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.supplierId) return toast.error('Please select a supplier');
        const invalidItems = formData.items.some(item => !item.stockItemId || item.quantity <= 0);
        if (invalidItems) return toast.error('Please ensure all rows have an item and valid quantity');

        setIsSubmitting(true);
        try {
            // Format payload to match backend requirements
            const payload = {
                voucherNo: formData.voucherNo,
                date: formData.date,
                supplierId: parseInt(formData.supplierId),
                items: formData.items.map(item => ({
                    stockItemId: parseInt(item.stockItemId),
                    quantity: Number(item.quantity),
                    rate: Number(item.rate)
                }))
            };

            await api.post(`/company/${companyId}/purchase`, payload);
            toast.success('Purchase Voucher saved successfully');
            navigate('/dashboard'); // Or navigate to a Purchase Voucher List page
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save voucher');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loadingData) return (
        <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'rgba(245,158,11,0.3)', borderTopColor: '#f59e0b' }}></div>
                <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Loading voucher form...</span>
            </div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(245,158,11,0.15)', boxShadow: '0 4px 32px rgba(0,0,0,0.4), 0 0 60px rgba(245,158,11,0.04)' }}>
            
            {/* Header */}
            <div className="p-5 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.1)' }}>
                <button
                    onClick={() => navigate(-1)}
                    className="h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-150 shrink-0"
                    style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                >
                    <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <Truck className="h-5 w-5" style={{ color: '#fbbf24' }} />
                </div>
                <div>
                    <h2 className="text-lg font-bold leading-none" style={{ color: 'var(--text-primary)' }}>Purchase Voucher (F9)</h2>
                    <p className="text-xs mt-0.5 font-medium" style={{ color: 'var(--text-muted)' }}>Record inward stock from suppliers</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-0">
                {/* Header Section */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Supplier Account *</label>
                        <select
                            required
                            value={formData.supplierId}
                            onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                            className="select-glass"
                        >
                            <option value="">-- Select Supplier --</option>
                            {suppliers.map(sup => (
                                <option key={sup.id} value={sup.id}>{sup.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Voucher Number *</label>
                        <input
                            type="text"
                            required
                            value={formData.voucherNo}
                            onChange={(e) => setFormData({ ...formData, voucherNo: e.target.value })}
                            className="input-glass font-mono uppercase"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Date *</label>
                        <input
                            type="date"
                            required
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="input-glass"
                        />
                    </div>
                </div>

                {/* Dynamic Table Section */}
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
                            {formData.items.map((row, index) => (
                                <tr key={index} className="table-row-hover" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td className="px-4 py-2.5 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{index + 1}</td>

                                    <td className="px-4 py-2.5">
                                        <select
                                            required
                                            value={row.stockItemId}
                                            onChange={(e) => handleItemChange(index, 'stockItemId', e.target.value)}
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
                                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
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
                                            onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                                            className="input-glass text-right"
                                        />
                                    </td>

                                    <td className="px-4 py-2.5 text-right font-semibold" style={{ color: '#fbbf24' }}>
                                        ₹{Number(row.amount || 0).toFixed(2)}
                                    </td>

                                    <td className="px-4 py-2.5 text-center">
                                        <button
                                            type="button"
                                            onClick={() => removeRow(index)}
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
                            style={{ color: '#60a5fa', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.15)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.08)'; }}
                        >
                            <Plus className="h-3.5 w-3.5" /> Add Row
                        </button>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Grand Total</p>
                        <p className="text-2xl font-bold" style={{ color: '#fbbf24' }}>₹{grandTotal.toFixed(2)}</p>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full sm:w-auto"
                        style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)', borderColor: 'rgba(245,158,11,0.3)', boxShadow: '0 0 16px rgba(245,158,11,0.25)' }}
                    >
                        <Save className="h-4 w-4" />
                        {isSubmitting ? 'Saving Voucher...' : 'Save Voucher'}
                    </button>
                </div>
            </form>
        </div>
    );
}