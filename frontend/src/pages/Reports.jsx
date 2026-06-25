import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FileBarChart, Printer, Users, Truck, Package, ShoppingCart } from 'lucide-react';
import api from '../https/axios';

const TABS = [
    { id: 'customers', label: 'Customer Outstanding', icon: Users },
    { id: 'suppliers', label: 'Supplier Outstanding', icon: Truck },
    { id: 'stock', label: 'Stock Summary', icon: Package },
    { id: 'sales', label: 'Sales Register', icon: ShoppingCart },
    { id: 'purchases', label: 'Purchase Register', icon: Truck },
];

export default function Reports() {
    const location = useLocation();
    const [reportData, setReportData] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(location.state?.tab || 'customers');

    // NEW: State to track which row in the table is currently highlighted
    const [selectedRowIndex, setSelectedRowIndex] = useState(0);

    const navigate = useNavigate();
    const companyId = localStorage.getItem('activeCompanyId');

    // Fetching Logic
    useEffect(() => {
        const fetchActiveReport = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/company/${companyId}/reports/${activeTab}`);
                setReportData(prevData => ({
                    ...prevData,
                    ...response.data
                }));
            } catch (error) {
                toast.error(`Failed to load ${activeTab} report`);
            } finally {
                setLoading(false);
            }
        };

        if (companyId) {
            fetchActiveReport();
        }
    }, [activeTab, companyId]);

    // Sync tab from router state and reset row index when tab changes
    useEffect(() => {
        if (location.state?.tab) {
            setActiveTab(location.state.tab);
        }
        setSelectedRowIndex(0); // Reset selection to top row when switching tabs
    }, [location.state, activeTab]);

    // KEYBOARD NAVIGATION LOGIC
    useEffect(() => {
        const handleKeyDown = (e) => {
            const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);
            if (isTyping) return;

            const currentIndex = TABS.findIndex(t => t.id === activeTab);

            // 1. Cycle Tabs using Alt + Arrows
            if (e.altKey && (e.key === 'ArrowDown' || e.key === 'ArrowRight')) {
                e.preventDefault();
                setActiveTab(TABS[(currentIndex + 1) % TABS.length].id);
            }
            else if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowLeft')) {
                e.preventDefault();
                setActiveTab(TABS[(currentIndex - 1 + TABS.length) % TABS.length].id);
            }
            // 2. Jump directly using Alt + 1, 2, 3, 4, 5
            else if (e.altKey && ['1', '2', '3', '4', '5'].includes(e.key)) {
                e.preventDefault();
                const index = parseInt(e.key) - 1;
                if (TABS[index]) setActiveTab(TABS[index].id);
            }
            // 3. NEW: Row Navigation within the active table (ArrowUp, ArrowDown, Enter)
            else if (!e.altKey && !e.ctrlKey) {
                // Determine which array of data we are currently looking at
                let currentDataList = [];
                if (activeTab === 'customers') currentDataList = reportData.customers || [];
                if (activeTab === 'suppliers') currentDataList = reportData.suppliers || [];
                if (activeTab === 'stock') currentDataList = reportData.stockItems || [];
                if (activeTab === 'sales') currentDataList = reportData.salesVouchers || [];
                if (activeTab === 'purchases') currentDataList = reportData.purchaseVouchers || [];

                if (currentDataList.length > 0) {
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        setSelectedRowIndex(prev => (prev + 1) % currentDataList.length);
                    }
                    else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        setSelectedRowIndex(prev => (prev - 1 + currentDataList.length) % currentDataList.length);
                    }
                    else if (e.key === 'Enter') {
                        e.preventDefault();
                        const selectedItem = currentDataList[selectedRowIndex];
                        if (selectedItem) {
                            // If we hit enter on a Sales Voucher, jump to print!
                            if (activeTab === 'sales') {
                                navigate(`/vouchers/sales/print/${selectedItem.id}`);
                            }
                            // Optional: If you ever make a purchase print route, uncomment below:
                            /* else if (activeTab === 'purchases') {
                                navigate(`/vouchers/purchase/print/${selectedItem.id}`);
                            } */
                        }
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeTab, reportData, selectedRowIndex, navigate]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[80vh] flex flex-col print:border-none print:shadow-none print:m-0">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-slate-50 rounded-t-lg print:hidden">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <FileBarChart className="h-6 w-6 text-blue-600" />
                    Display More Reports
                </h2>
                <button
                    onClick={handlePrint}
                    className="print:hidden bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-700 flex items-center gap-2 text-sm"
                >
                    <Printer className="h-4 w-4" /> Print Report
                </button>
            </div>

            <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
                {/* Sidebar Tabs */}
                <div className="w-full md:w-64 border-r border-gray-200 bg-white print:hidden overflow-y-auto">
                    <nav className="p-4 space-y-1">
                        {TABS.map((tab, index) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${isActive
                                        ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                        : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                                    {tab.label}
                                    <span className={`ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded border ${isActive ? 'bg-blue-100 border-blue-200 text-blue-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                                        Alt+{index + 1}
                                    </span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Report Content Area */}
                <div className="flex-1 p-6 overflow-y-auto bg-white print:p-0 print:overflow-visible relative">
                    <div className="print:block mb-6 hidden">
                        <h1 className="text-2xl font-bold text-slate-800 text-center uppercase tracking-wider">
                            {TABS.find(t => t.id === activeTab)?.label}
                        </h1>
                        <p className="text-center text-sm text-gray-500">As of {new Date().toLocaleDateString()}</p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-full text-slate-500">
                            Loading {TABS.find(t => t.id === activeTab)?.label}...
                        </div>
                    ) : (
                        <>
                            {/* 1. Customer Report */}
                            {activeTab === 'customers' && (
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-800 text-white">
                                        <tr>
                                            <th className="p-3">Customer Name</th>
                                            <th className="p-3">Contact</th>
                                            <th className="p-3 text-right">Closing Balance (₹)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.customers?.map((c, i) => {
                                            const isSelected = i === selectedRowIndex;
                                            return (
                                                <tr key={i} className={`border-b transition-colors ${isSelected ? 'bg-blue-100 border-blue-300 shadow-sm' : 'hover:bg-gray-50'}`}>
                                                    <td className="p-3 font-semibold text-slate-800">{c.name}</td>
                                                    <td className="p-3 text-gray-600">{c.mobile || '-'}</td>
                                                    <td className={`p-3 text-right font-medium ${c.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                        {c.balance.toFixed(2)} {c.balance > 0 ? 'Dr' : ''}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {reportData.customers?.length === 0 && <tr><td colSpan="3" className="p-4 text-center">No customers found.</td></tr>}
                                    </tbody>
                                </table>
                            )}

                            {/* 2. Supplier Report */}
                            {activeTab === 'suppliers' && (
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-800 text-white">
                                        <tr>
                                            <th className="p-3">Supplier Name</th>
                                            <th className="p-3">Contact</th>
                                            <th className="p-3 text-right">Closing Balance (₹)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.suppliers?.map((s, i) => {
                                            const isSelected = i === selectedRowIndex;
                                            return (
                                                <tr key={i} className={`border-b transition-colors ${isSelected ? 'bg-blue-100 border-blue-300 shadow-sm' : 'hover:bg-gray-50'}`}>
                                                    <td className="p-3 font-semibold text-slate-800">{s.name}</td>
                                                    <td className="p-3 text-gray-600">{s.mobile || '-'}</td>
                                                    <td className={`p-3 text-right font-medium ${s.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                        {s.balance.toFixed(2)} {s.balance > 0 ? 'Cr' : ''}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {reportData.suppliers?.length === 0 && <tr><td colSpan="3" className="p-4 text-center">No suppliers found.</td></tr>}
                                    </tbody>
                                </table>
                            )}

                            {/* 3. Stock Summary */}
                            {activeTab === 'stock' && (
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-800 text-white">
                                        <tr>
                                            <th className="p-3">Item Name</th>
                                            <th className="p-3 text-right">Closing Qty</th>
                                            <th className="p-3 text-right">Avg Rate (₹)</th>
                                            <th className="p-3 text-right">Total Value (₹)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.stockItems?.map((item, i) => {
                                            const isSelected = i === selectedRowIndex;
                                            return (
                                                <tr key={i} className={`border-b transition-colors ${isSelected ? 'bg-blue-100 border-blue-300 shadow-sm' : 'hover:bg-gray-50'}`}>
                                                    <td className="p-3 font-semibold text-slate-800">{item.name}</td>
                                                    <td className="p-3 text-right font-medium">{item.quantity} {item.unit}</td>
                                                    <td className="p-3 text-right text-gray-600">{item.purchasePrice.toFixed(2)}</td>
                                                    <td className="p-3 text-right font-bold text-slate-800">{item.stockValue.toFixed(2)}</td>
                                                </tr>
                                            );
                                        })}
                                        {reportData.stockItems?.length === 0 && <tr><td colSpan="4" className="p-4 text-center">No stock items found.</td></tr>}
                                    </tbody>
                                </table>
                            )}

                            {/* 4. Sales Register */}
                            {activeTab === 'sales' && (
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-800 text-white">
                                        <tr>
                                            <th className="p-3">Date</th>
                                            <th className="p-3">Voucher No.</th>
                                            <th className="p-3">Customer Account</th>
                                            <th className="p-3 text-right">Amount (₹)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.salesVouchers?.map((v, i) => {
                                            const isSelected = i === selectedRowIndex;
                                            return (
                                                <tr
                                                    key={i}
                                                    onClick={() => {
                                                        setSelectedRowIndex(i);
                                                        navigate(`/vouchers/sales/print/${v.id}`);
                                                    }}
                                                    className={`border-b cursor-pointer transition-colors ${isSelected ? 'bg-blue-100 border-blue-300 shadow-sm' : 'hover:bg-gray-50'}`}
                                                >
                                                    <td className="p-3 text-gray-600">{new Date(v.date).toLocaleDateString()}</td>
                                                    <td className="p-3 font-mono text-xs text-blue-600 font-bold" title="Press Enter or Click to Print">
                                                        {v.voucherNo} 🖨️
                                                    </td>
                                                    <td className="p-3 font-medium text-slate-800">{v.customer.name}</td>
                                                    <td className="p-3 text-right font-bold text-green-600">{v.total.toFixed(2)}</td>
                                                </tr>
                                            );
                                        })}
                                        {reportData.salesVouchers?.length === 0 && <tr><td colSpan="4" className="p-4 text-center">No sales records found.</td></tr>}
                                    </tbody>
                                </table>
                            )}

                            {/* 5. Purchase Register */}
                            {activeTab === 'purchases' && (
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-800 text-white">
                                        <tr>
                                            <th className="p-3">Date</th>
                                            <th className="p-3">Voucher No.</th>
                                            <th className="p-3">Supplier Account</th>
                                            <th className="p-3 text-right">Amount (₹)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.purchaseVouchers?.map((v, i) => {
                                            const isSelected = i === selectedRowIndex;
                                            return (
                                                <tr key={i} className={`border-b transition-colors ${isSelected ? 'bg-blue-100 border-blue-300 shadow-sm' : 'hover:bg-gray-50'}`}>
                                                    <td className="p-3 text-gray-600">{new Date(v.date).toLocaleDateString()}</td>
                                                    <td className="p-3 font-mono text-xs">{v.voucherNo}</td>
                                                    <td className="p-3 font-medium text-slate-800">{v.supplier.name}</td>
                                                    <td className="p-3 text-right font-bold text-orange-600">{v.total.toFixed(2)}</td>
                                                </tr>
                                            );
                                        })}
                                        {reportData.purchaseVouchers?.length === 0 && <tr><td colSpan="4" className="p-4 text-center">No purchase records found.</td></tr>}
                                    </tbody>
                                </table>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}