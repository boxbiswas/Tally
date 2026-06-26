import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../https/axios';

// Sub-components
import SalesVoucherHeader from '../components/salesVoucherForm/SalesVoucherHeader';
import SalesVoucherFormHeader from '../components/salesVoucherForm/SalesVoucherFormHeader';
import SalesVoucherItemsTable from '../components/salesVoucherForm/SalesVoucherItemsTable';
import SalesVoucherFooter from '../components/salesVoucherForm/SalesVoucherFooter';

export default function SalesVoucherForm() {
    const navigate = useNavigate();
    const companyId = localStorage.getItem('activeCompanyId');

    // Master Data State
    const [customers, setCustomers] = useState([]);
    const [stockItems, setStockItems] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        voucherNo: `SAL-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        customerId: '',
        items: [{ stockItemId: '', quantity: 1, rate: 0, amount: 0 }]
    });

    /** 
     * Fetch Customers and Stock Items on component mount 
     */
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

    /** 
     * Calculate Grand Total dynamically 
     */
    const grandTotal = formData.items.reduce((sum, item) => sum + Number(item.amount || 0), 0);

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

        if (field === 'stockItemId') {
            const item = stockItems.find(i => i.id === parseInt(value));
            if (item) {
                newItems[index].rate = item.sellingPrice;
                newItems[index].maxQty = item.quantity;
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

        // Client-side validation
        for (const item of formData.items) {
            if (item.quantity > (item.maxQty || 0)) {
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
                    quantity: Number(i.quantity),
                    rate: Number(i.rate),
                    amount: Number(i.amount)
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
        <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(16,185,129,0.15)', boxShadow: '0 4px 32px rgba(0,0,0,0.4), 0 0 60px rgba(16,185,129,0.04)' }}>

            <SalesVoucherHeader onBack={() => navigate(-1)} />

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <SalesVoucherFormHeader
                    formData={formData}
                    customers={customers}
                    onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                />

                <SalesVoucherItemsTable
                    items={formData.items}
                    stockItems={stockItems}
                    onItemChange={handleItemChange}
                    onAddRow={addRow}
                    onRemoveRow={removeRow}
                />

                <SalesVoucherFooter
                    grandTotal={grandTotal}
                    isSubmitting={isSubmitting}
                />
            </form>
        </div>
    );
}