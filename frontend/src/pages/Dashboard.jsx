import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Users, Truck, Package, IndianRupee, AlertTriangle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { LogOut } from 'lucide-react';
import api from '../https/axios';

const Dashboard = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const companyId = localStorage.getItem('activeCompanyId');
    const dispatch = useDispatch();

    useEffect(() => {
        if (!companyId) {
            navigate('/companies');
            return;
        }

        const fetchMetrics = async () => {
            try {
                const response = await api.get(`/company/${companyId}/dashboard`);
                setMetrics(response.data.metrics);
            } catch (error) {
                toast.error('Failed to fetch dashboard metrics');
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, [companyId, navigate]);

    if (loading) return <div className="p-8 text-center">Loading Gateway...</div>;

    const handleLogout = async () => {
        await dispatch(logoutUser());
        localStorage.removeItem('activeCompanyId'); // Clean up company context
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8 flex justify-between items-end border-b pb-4 border-gray-300">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Gateway of SmartERP</h1>
                        <p className="text-gray-500 mt-1">Company Dashboard overview</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/companies')}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded"
                        >
                            Change Company (F1)
                        </button>
                        <button
                            onClick={handleLogout}
                            className="text-sm font-semibold text-red-600 hover:text-red-800 bg-red-50 px-3 py-1 rounded flex items-center gap-1"
                        >
                            <LogOut className="h-4 w-4" /> Logout
                        </button>
                    </div>
                </header>

                {/* Top Level Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-blue-500 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Customers</p>
                            <p className="text-2xl font-bold text-slate-800">{metrics?.totalCustomers || 0}</p>
                        </div>
                        <Users className="h-8 w-8 text-blue-200" />
                    </div>

                    <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-purple-500 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Suppliers</p>
                            <p className="text-2xl font-bold text-slate-800">{metrics?.totalSuppliers || 0}</p>
                        </div>
                        <Truck className="h-8 w-8 text-purple-200" />
                    </div>

                    <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-green-500 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Sales</p>
                            <p className="text-2xl font-bold text-slate-800">₹{metrics?.totalSalesAmount || 0}</p>
                        </div>
                        <IndianRupee className="h-8 w-8 text-green-200" />
                    </div>

                    <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-orange-500 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Purchases</p>
                            <p className="text-2xl font-bold text-slate-800">₹{metrics?.totalPurchaseAmount || 0}</p>
                        </div>
                        <IndianRupee className="h-8 w-8 text-orange-200" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Menu Actions */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Masters & Transactions</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="text-left p-4 hover:bg-slate-50 border rounded-lg transition group">
                                <span className="block font-semibold text-slate-800 group-hover:text-blue-600">Ledgers</span>
                                <span className="text-sm text-gray-500">Manage Customers & Suppliers</span>
                            </button>
                            <button className="text-left p-4 hover:bg-slate-50 border rounded-lg transition group">
                                <span className="block font-semibold text-slate-800 group-hover:text-blue-600">Inventory</span>
                                <span className="text-sm text-gray-500">Manage Stock Items</span>
                            </button>
                            <button className="text-left p-4 hover:bg-slate-50 border rounded-lg transition group">
                                <span className="block font-semibold text-slate-800 group-hover:text-blue-600">Sales Voucher</span>
                                <span className="text-sm text-gray-500">Create new bill (F8)</span>
                            </button>
                            <button className="text-left p-4 hover:bg-slate-50 border rounded-lg transition group">
                                <span className="block font-semibold text-slate-800 group-hover:text-blue-600">Purchase Voucher</span>
                                <span className="text-sm text-gray-500">Record stock entry (F9)</span>
                            </button>
                        </div>
                    </div>

                    {/* Low Stock Alerts */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                            Low Stock Alerts
                        </h2>
                        {metrics?.lowStockItems?.length > 0 ? (
                            <ul className="space-y-3">
                                {metrics.lowStockItems.map(item => (
                                    <li key={item.id} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                                        <span className="font-medium text-slate-700">{item.name}</span>
                                        <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs font-bold">
                                            {item.quantity} left
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">Stock levels are healthy.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;