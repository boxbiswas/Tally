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

    /* ── Shared table head styles ── */
    const thStyle = { color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' };

    return (
        <div className="rounded-2xl overflow-hidden min-h-[80vh] flex flex-col print:border-none print:shadow-none print:m-0"
            style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 32px rgba(0,0,0,0.4)' }}>

            {/* Header */}
            <div className="p-5 flex justify-between items-center print:hidden" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
                <h2 className="text-lg font-bold flex items-center gap-2.5" style={{ color: 'var(--text-primary)' }}>
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
                        <FileBarChart className="h-4 w-4 text-indigo-400" />
                    </div>
                    Display More Reports
                </h2>
                <button
                    onClick={handlePrint}
                    className="btn-secondary print:hidden"
                >
                    <Printer className="h-4 w-4" /> Print Report
                </button>
            </div>

            <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
                {/* Sidebar Tabs */}
                <div className="w-full md:w-56 print:hidden overflow-y-auto" style={{ borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.1)' }}>
                    <nav className="p-3 space-y-0.5">
                        {TABS.map((tab, index) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left"
                                    style={{
                                        background: isActive ? 'linear-gradient(135deg,rgba(59,130,246,0.15),rgba(99,102,241,0.1))' : 'transparent',
                                        border: isActive ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
                                        color: isActive ? '#e0e7ff' : 'var(--text-secondary)',
                                    }}
                                    onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--text-primary)'; }}}
                                    onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
                                >
                                    <Icon className="h-4 w-4 shrink-0" style={{ color: isActive ? '#93c5fd' : 'var(--text-muted)' }} />
                                    <span className="flex-1 text-xs">{tab.label}</span>
                                    <kbd className={isActive ? 'kbd-dark kbd-active' : 'kbd-dark'}>
                                        Alt+{index + 1}
                                    </kbd>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Report Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar print:p-0 print:overflow-visible relative">
                    {/* Print heading (hidden on screen) */}
                    <div className="print:block mb-6 hidden">
                        <h1 className="text-2xl font-bold text-slate-800 text-center uppercase tracking-wider">
                            {TABS.find(t => t.id === activeTab)?.label}
                        </h1>
                        <p className="text-center text-sm text-gray-500">As of {new Date().toLocaleDateString()}</p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-full py-20">
                            <div className="flex flex-col items-center gap-3">
                                <div className="h-8 w-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'rgba(99,102,241,0.3)', borderTopColor: '#6366f1' }}></div>
                                <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Loading {TABS.find(t => t.id === activeTab)?.label}...</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* 1. Customer Report */}
                            {activeTab === 'customers' && (
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr style={thStyle}>
                                            <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider">Customer Name</th>
                                            <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider">Contact</th>
                                            <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-right">Closing Balance (₹)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.customers?.map((c, i) => {
                                            const isSelected = i === selectedRowIndex;
                                            return (
                                                <tr key={i} className="table-row-hover" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: isSelected ? 'rgba(59,130,246,0.1)' : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', transition: 'background 0.15s' }}>
                                                    <td className="px-5 py-3.5 font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{c.name}</td>
                                                    <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-secondary)' }}>{c.mobile || '—'}</td>
                                                    <td className={`px-5 py-3.5 text-right font-semibold text-sm`} style={{ color: c.balance > 0 ? '#f87171' : '#34d399' }}>
                                                        {c.balance.toFixed(2)} {c.balance > 0 ? 'Dr' : ''}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {reportData.customers?.length === 0 && <tr><td colSpan="3" className="px-5 py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No customers found.</td></tr>}
                                    </tbody>
                                </table>
                            )}

                            {/* 2. Supplier Report */}
                            {activeTab === 'suppliers' && (
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr style={thStyle}>
                                            <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider">Supplier Name</th>
                                            <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider">Contact</th>
                                            <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-right">Closing Balance (₹)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.suppliers?.map((s, i) => {
                                            const isSelected = i === selectedRowIndex;
                                            return (
                                                <tr key={i} className="table-row-hover" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: isSelected ? 'rgba(59,130,246,0.1)' : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', transition: 'background 0.15s' }}>
                                                    <td className="px-5 py-3.5 font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{s.name}</td>
                                                    <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-secondary)' }}>{s.mobile || '—'}</td>
                                                    <td className="px-5 py-3.5 text-right font-semibold text-sm" style={{ color: s.balance > 0 ? '#f87171' : '#34d399' }}>
                                                        {s.balance.toFixed(2)} {s.balance > 0 ? 'Cr' : ''}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {reportData.suppliers?.length === 0 && <tr><td colSpan="3" className="px-5 py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No suppliers found.</td></tr>}
                                    </tbody>
                                </table>
                            )}

                            {/* 3. Stock Summary */}
                            {activeTab === 'stock' && (
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr style={thStyle}>
                                            <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider">Item Name</th>
                                            <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-right">Closing Qty</th>
                                            <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-right">Avg Rate (₹)</th>
                                            <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-right">Total Value (₹)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.stockItems?.map((item, i) => {
                                            const isSelected = i === selectedRowIndex;
                                            return (
                                                <tr key={i} className="table-row-hover" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: isSelected ? 'rgba(59,130,246,0.1)' : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', transition: 'background 0.15s' }}>
                                                    <td className="px-5 py-3.5 font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{item.name}</td>
                                                    <td className="px-5 py-3.5 text-right font-medium text-sm" style={{ color: 'var(--text-secondary)' }}>{item.quantity} {item.unit}</td>
                                                    <td className="px-5 py-3.5 text-right text-sm" style={{ color: 'var(--text-muted)' }}>{item.purchasePrice.toFixed(2)}</td>
                                                    <td className="px-5 py-3.5 text-right font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{item.stockValue.toFixed(2)}</td>
                                                </tr>
                                            );
                                        })}
                                        {reportData.stockItems?.length === 0 && <tr><td colSpan="4" className="px-5 py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No stock items found.</td></tr>}
                                    </tbody>
                                </table>
                            )}

                            {/* 4. Sales Register */}
                            {activeTab === 'sales' && (
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr style={thStyle}>
                                            <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider">Date</th>
                                            <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider">Voucher No.</th>
                                            <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider">Customer Account</th>
                                            <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-right">Amount (₹)</th>
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
                                                    className="table-row-hover cursor-pointer"
                                                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: isSelected ? 'rgba(59,130,246,0.1)' : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', transition: 'background 0.15s' }}
                                                >
                                                    <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-muted)' }}>{new Date(v.date).toLocaleDateString()}</td>
                                                    <td className="px-5 py-3.5 font-mono text-xs font-bold" style={{ color: '#60a5fa' }} title="Press Enter or Click to Print">
                                                        {v.voucherNo} 🖨️
                                                    </td>
                                                    <td className="px-5 py-3.5 font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{v.customer.name}</td>
                                                    <td className="px-5 py-3.5 text-right font-bold text-sm" style={{ color: '#34d399' }}>{v.total.toFixed(2)}</td>
                                                </tr>
                                            );
                                        })}
                                        {reportData.salesVouchers?.length === 0 && <tr><td colSpan="4" className="px-5 py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No sales records found.</td></tr>}
                                    </tbody>
                                </table>
                            )}

                            {/* 5. Purchase Register */}
                            {activeTab === 'purchases' && (
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr style={thStyle}>
                                            <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider">Date</th>
                                            <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider">Voucher No.</th>
                                            <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider">Supplier Account</th>
                                            <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-right">Amount (₹)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.purchaseVouchers?.map((v, i) => {
                                            const isSelected = i === selectedRowIndex;
                                            return (
                                                <tr key={i} className="table-row-hover" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: isSelected ? 'rgba(59,130,246,0.1)' : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', transition: 'background 0.15s' }}>
                                                    <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-muted)' }}>{new Date(v.date).toLocaleDateString()}</td>
                                                    <td className="px-5 py-3.5 font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>{v.voucherNo}</td>
                                                    <td className="px-5 py-3.5 font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{v.supplier.name}</td>
                                                    <td className="px-5 py-3.5 text-right font-bold text-sm" style={{ color: '#fbbf24' }}>{v.total.toFixed(2)}</td>
                                                </tr>
                                            );
                                        })}
                                        {reportData.purchaseVouchers?.length === 0 && <tr><td colSpan="4" className="px-5 py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No purchase records found.</td></tr>}
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