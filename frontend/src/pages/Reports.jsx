import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FileBarChart, Printer, Users, Truck, Package, ShoppingCart } from 'lucide-react';
import api from '../https/axios';

export default function Reports() {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('customers');
    const navigate = useNavigate();
    const companyId = localStorage.getItem('activeCompanyId');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await api.get(`/company/${companyId}/reports`);
                setReportData(response.data);
            } catch (error) {
                toast.error('Failed to load reports');
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, [companyId]);

    if (loading) return <div className="p-8 text-center text-slate-500">Generating Reports...</div>;
    if (!reportData) {
        return (
            <div className="p-8 text-center text-red-500">
                <h2 className="text-xl font-bold">No Data Available</h2>
                <p>Could not load the reports. Please check your backend connection.</p>
            </div>
        );
    }

    const handlePrint = () => {
        window.print();
    };

    const tabs = [
        { id: 'customers', label: 'Customer Outstanding', icon: Users },
        { id: 'suppliers', label: 'Supplier Outstanding', icon: Truck },
        { id: 'stock', label: 'Stock Summary', icon: Package },
        { id: 'sales', label: 'Sales Register', icon: ShoppingCart },
        { id: 'purchases', label: 'Purchase Register', icon: Truck },
    ];

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
                {/* Sidebar Tabs (Hidden on Print) */}
                <div className="w-full md:w-64 border-r border-gray-200 bg-white print:hidden overflow-y-auto">
                    <nav className="p-4 space-y-1">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
                                        ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                        : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    <Icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Report Content Area */}
                <div className="flex-1 p-6 overflow-y-auto bg-white print:p-0 print:overflow-visible">

                    <div className="print:block mb-6 hidden">
                        <h1 className="text-2xl font-bold text-slate-800 text-center uppercase tracking-wider">
                            {tabs.find(t => t.id === activeTab)?.label}
                        </h1>
                        <p className="text-center text-sm text-gray-500">As of {new Date().toLocaleDateString()}</p>
                    </div>

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
                                {reportData.customers.map((c, i) => (
                                    <tr key={i} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-semibold text-slate-800">{c.name}</td>
                                        <td className="p-3 text-gray-600">{c.mobile || '-'}</td>
                                        <td className={`p-3 text-right font-medium ${c.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                            {c.balance.toFixed(2)} {c.balance > 0 ? 'Dr' : ''}
                                        </td>
                                    </tr>
                                ))}
                                {reportData.customers.length === 0 && <tr><td colSpan="3" className="p-4 text-center">No customers found.</td></tr>}
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
                                {reportData.suppliers.map((s, i) => (
                                    <tr key={i} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-semibold text-slate-800">{s.name}</td>
                                        <td className="p-3 text-gray-600">{s.mobile || '-'}</td>
                                        <td className={`p-3 text-right font-medium ${s.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                            {s.balance.toFixed(2)} {s.balance > 0 ? 'Cr' : ''}
                                        </td>
                                    </tr>
                                ))}
                                {reportData.suppliers.length === 0 && <tr><td colSpan="3" className="p-4 text-center">No suppliers found.</td></tr>}
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
                                {reportData.stockItems.map((item, i) => (
                                    <tr key={i} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-semibold text-slate-800">{item.name}</td>
                                        <td className="p-3 text-right font-medium">{item.quantity} {item.unit}</td>
                                        <td className="p-3 text-right text-gray-600">{item.purchasePrice.toFixed(2)}</td>
                                        <td className="p-3 text-right font-bold text-slate-800">{item.stockValue.toFixed(2)}</td>
                                    </tr>
                                ))}
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
                                {reportData.salesVouchers.map((v, i) => (
                                    <tr key={i} className="border-b hover:bg-gray-50">
                                        <td className="p-3 text-gray-600">{new Date(v.date).toLocaleDateString()}</td>
                                        <td
                                            className="p-3 font-mono text-xs text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-bold"
                                            onClick={() => navigate(`/vouchers/sales/print/${v.id}`)}
                                            title="Click to Generate Invoice PDF"
                                        >
                                            {v.voucherNo} 🖨️
                                        </td>
                                        <td className="p-3 font-medium text-slate-800">{v.customer.name}</td>
                                        <td className="p-3 text-right font-bold text-green-600">{v.total.toFixed(2)}</td>
                                    </tr>
                                ))}
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
                                {reportData.purchaseVouchers.map((v, i) => (
                                    <tr key={i} className="border-b hover:bg-gray-50">
                                        <td className="p-3 text-gray-600">{new Date(v.date).toLocaleDateString()}</td>
                                        <td className="p-3 font-mono text-xs">{v.voucherNo}</td>
                                        <td className="p-3 font-medium text-slate-800">{v.supplier.name}</td>
                                        <td className="p-3 text-right font-bold text-orange-600">{v.total.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                </div>
            </div>
        </div>
    );
}