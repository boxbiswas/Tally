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
                items: formData.items.map(i => ({ ...i, stockItemId: parseInt(i.stockItemId) }))
            });
            toast.success('Sales Voucher saved and stock updated');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save sale');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loadingData) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <ShoppingCart className="text-green-600" /> Sales Voucher (F8)
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <select required className="p-2 border rounded" onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}>
                        <option value="">-- Select Customer --</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <input type="text" className="p-2 border rounded" value={formData.voucherNo} onChange={(e) => setFormData({ ...formData, voucherNo: e.target.value })} />
                    <input type="date" className="p-2 border rounded" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                </div>

                <table className="w-full border-t">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2">Item</th>
                            <th className="p-2 w-24">Qty</th>
                            <th className="p-2 w-32">Rate</th>
                            <th className="p-2 w-32 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formData.items.map((row, i) => (
                            <tr key={i}>
                                <td className="p-2">
                                    <select className="w-full p-2 border rounded" onChange={(e) => handleItemChange(i, 'stockItemId', e.target.value)}>
                                        <option value="">Select...</option>
                                        {stockItems.map(item => (
                                            <option key={item.id} value={item.id}>{item.name} ({item.quantity} in stock)</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="p-2">
                                    <input type="number" className="w-full p-2 border rounded" value={row.quantity} onChange={(e) => handleItemChange(i, 'quantity', e.target.value)} />
                                </td>
                                <td className="p-2"><input type="number" className="w-full p-2 border rounded" value={row.rate} onChange={(e) => handleItemChange(i, 'rate', e.target.value)} /></td>
                                <td className="p-2 text-right">{row.amount.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-xl font-bold">Total: ₹{grandTotal.toFixed(2)}</div>
                    <button type="submit" disabled={isSubmitting} className="bg-green-600 text-white px-6 py-2 rounded">
                        {isSubmitting ? 'Processing...' : 'Save Sale'}
                    </button>
                </div>
            </form>
        </div>
    );
}