import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, Save, Plus, Trash2, ShoppingCart } from 'lucide-react';
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

    if (loadingData) return <div className="p-8 text-center">Loading voucher form...</div>;

    return (
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-slate-50 rounded-t-lg">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-slate-800">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <ShoppingCart className="h-6 w-6 text-orange-600" />
                        Purchase Voucher (F9)
                    </h2>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-0">
                {/* Header Section */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-white">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Supplier Account *</label>
                        <select
                            required
                            value={formData.supplierId}
                            onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                            className="w-full p-2.5 border rounded-md focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                        >
                            <option value="">-- Select Supplier --</option>
                            {suppliers.map(sup => (
                                <option key={sup.id} value={sup.id}>{sup.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Voucher Number *</label>
                        <input
                            type="text"
                            required
                            value={formData.voucherNo}
                            onChange={(e) => setFormData({ ...formData, voucherNo: e.target.value })}
                            className="w-full p-2.5 border rounded-md focus:ring-2 focus:ring-orange-500 outline-none font-mono uppercase"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Date *</label>
                        <input
                            type="date"
                            required
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full p-2.5 border rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                    </div>
                </div>

                {/* Dynamic Table Section */}
                <div className="overflow-x-auto border-t border-b border-gray-200">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-800 text-white">
                            <tr>
                                <th className="p-3 w-12 text-center">#</th>
                                <th className="p-3">Name of Item</th>
                                <th className="p-3 w-32">Quantity</th>
                                <th className="p-3 w-40">Rate (₹)</th>
                                <th className="p-3 w-40 text-right">Amount (₹)</th>
                                <th className="p-3 w-16 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData.items.map((row, index) => (
                                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="p-3 text-center text-gray-500 font-medium">{index + 1}</td>

                                    <td className="p-2">
                                        <select
                                            required
                                            value={row.stockItemId}
                                            onChange={(e) => handleItemChange(index, 'stockItemId', e.target.value)}
                                            className="w-full p-2 border rounded focus:ring-1 focus:ring-orange-500 outline-none bg-white"
                                        >
                                            <option value="">Select Item...</option>
                                            {stockItems.map(item => (
                                                <option key={item.id} value={item.id}>{item.name}</option>
                                            ))}
                                        </select>
                                    </td>

                                    <td className="p-2">
                                        <input
                                            type="number"
                                            required
                                            min="0.01"
                                            step="0.01"
                                            value={row.quantity}
                                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                            className="w-full p-2 border rounded focus:ring-1 focus:ring-orange-500 outline-none text-center"
                                        />
                                    </td>

                                    <td className="p-2">
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            step="0.01"
                                            value={row.rate}
                                            onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                                            className="w-full p-2 border rounded focus:ring-1 focus:ring-orange-500 outline-none text-right"
                                        />
                                    </td>

                                    <td className="p-3 text-right font-semibold text-slate-800 bg-gray-50">
                                        {row.amount.toFixed(2)}
                                    </td>

                                    <td className="p-2 text-center">
                                        <button
                                            type="button"
                                            onClick={() => removeRow(index)}
                                            className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                                            title="Remove Row"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Add Row Button */}
                    <div className="p-3 bg-white">
                        <button
                            type="button"
                            onClick={addRow}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 transition"
                        >
                            <Plus className="h-4 w-4" /> Add Row
                        </button>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="p-6 bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 rounded-b-lg">
                    <div className="text-xl font-bold text-slate-800">
                        Grand Total: <span className="text-orange-600 ml-2">₹{grandTotal.toFixed(2)}</span>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto bg-slate-800 text-white px-8 py-3 rounded-md hover:bg-slate-700 transition disabled:opacity-70 flex items-center justify-center gap-2 font-medium"
                    >
                        <Save className="h-5 w-5" />
                        {isSubmitting ? 'Saving Voucher...' : 'Save Voucher'}
                    </button>
                </div>
            </form>
        </div>
    );
}