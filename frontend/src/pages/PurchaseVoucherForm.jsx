import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../https/axios';

// Sub-components
import PurchaseVoucherHeader from '../components/purchaseVoucherForm/PurchaseVoucherHeader';
import PurchaseVoucherFormHeader from '../components/purchaseVoucherForm/PurchaseVoucherFormHeader';
import PurchaseVoucherItemsTable from '../components/purchaseVoucherForm/PurchaseVoucherItemsTable';
import PurchaseVoucherFooter from '../components/purchaseVoucherForm/PurchaseVoucherFooter';

export default function PurchaseVoucherForm() {
    const navigate = useNavigate();
    const companyId = localStorage.getItem('activeCompanyId');

    // Master Data
    const [suppliers, setSuppliers] = useState([]);
    const [stockItems, setStockItems] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        voucherNo: `PUR-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        supplierId: '',
        items: [
            { stockItemId: '', quantity: 1, rate: 0, amount: 0 }
        ]
    });

    // Fetch Suppliers and Stock Items
    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                const [ledgerRes, itemRes] = await Promise.all([
                    api.get(`/company/${companyId}/ledger`),
                    api.get(`/company/${companyId}/item`)
                ]);

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
            const selectedItem = stockItems.find(item => item.id === parseInt(value));
            if (selectedItem) {
                newItems[index].rate = selectedItem.purchasePrice;
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

        if (!formData.supplierId) return toast.error('Please select a supplier');
        const invalidItems = formData.items.some(item => !item.stockItemId || item.quantity <= 0);
        if (invalidItems) return toast.error('Please ensure all rows have an item and valid quantity');

        setIsSubmitting(true);
        try {
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
            navigate('/dashboard');
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
        <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden" 
             style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(245,158,11,0.15)', boxShadow: '0 4px 32px rgba(0,0,0,0.4), 0 0 60px rgba(245,158,11,0.04)' }}>
            
            <PurchaseVoucherHeader onBack={() => navigate(-1)} />

            <form onSubmit={handleSubmit}>
                <PurchaseVoucherFormHeader 
                    formData={formData}
                    suppliers={suppliers}
                    onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                />

                <PurchaseVoucherItemsTable 
                    items={formData.items}
                    stockItems={stockItems}
                    onItemChange={handleItemChange}
                    onAddRow={addRow}
                    onRemoveRow={removeRow}
                />

                <PurchaseVoucherFooter 
                    grandTotal={grandTotal}
                    isSubmitting={isSubmitting}
                />
            </form>
        </div>
    );
}