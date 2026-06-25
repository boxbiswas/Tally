import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Users, 
  Truck, 
  Package, 
  IndianRupee, 
  AlertTriangle, 
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import api from '../https/axios';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const companyId = localStorage.getItem('activeCompanyId');

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  // Ensure default structure if backend response is empty or first-time load
  const data = metrics || {
    totalCustomers: 0, 
    totalSuppliers: 0, 
    totalProducts: 0,
    totalSalesAmount: 0, 
    totalPurchaseAmount: 0, 
    lowStockItems: [],
    monthlyData: []
  };

  // --- DYNAMIC CHART CALCULATION ---
  const dynamicMonthlyData = data.monthlyData || [];
  
  // Calculate max height for the chart bars dynamically to prevent UI breaking
  const maxChartValue = dynamicMonthlyData.length > 0 
    ? Math.max(...dynamicMonthlyData.map(d => Math.max(d.sales, d.purchase))) 
    : 100; // Fallback to 100 to prevent division by zero

  // Ensure we always have a valid number > 0 for calculating percentages
  const validMaxChartValue = maxChartValue > 0 ? maxChartValue : 100;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header Section */}
      <header className="flex justify-between items-end border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gateway of SmartERP</h1>
          <p className="text-sm text-gray-500 mt-1">Financial & Inventory Overview</p>
        </div>
        <button 
          onClick={() => navigate('/companies')}
          className="text-sm font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-md transition"
        >
          Change Company (F1)
        </button>
      </header>

      {/* --- KPI CARDS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between group cursor-pointer hover:border-blue-300 transition" onClick={() => navigate('/ledgers')}>
          <div>
            <p className="text-gray-500 text-sm font-semibold">Total Customers</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{data.totalCustomers}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-blue-600 group-hover:scale-110 transition"><Users className="h-6 w-6" /></div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between group cursor-pointer hover:border-purple-300 transition" onClick={() => navigate('/ledgers')}>
          <div>
            <p className="text-gray-500 text-sm font-semibold">Total Suppliers</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{data.totalSuppliers}</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg text-purple-600 group-hover:scale-110 transition"><Truck className="h-6 w-6" /></div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between group cursor-pointer hover:border-indigo-300 transition" onClick={() => navigate('/inventory')}>
          <div>
            <p className="text-gray-500 text-sm font-semibold">Total Products</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{data.totalProducts}</p>
          </div>
          <div className="bg-indigo-50 p-3 rounded-lg text-indigo-600 group-hover:scale-110 transition"><Package className="h-6 w-6" /></div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between group cursor-pointer hover:border-green-300 transition" onClick={() => navigate('/vouchers/sales')}>
          <div>
            <p className="text-gray-500 text-sm font-semibold">Total Sales Amount</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">₹{data.totalSalesAmount.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-green-600 group-hover:scale-110 transition"><TrendingUp className="h-6 w-6" /></div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between group cursor-pointer hover:border-orange-300 transition" onClick={() => navigate('/vouchers/purchase')}>
          <div>
            <p className="text-gray-500 text-sm font-semibold">Total Purchase Amount</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">₹{data.totalPurchaseAmount.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg text-orange-600 group-hover:scale-110 transition"><IndianRupee className="h-6 w-6" /></div>
        </div>

        <div className={`bg-white p-5 rounded-lg shadow-sm border flex items-center justify-between ${data.lowStockItems.length > 0 ? 'border-red-200' : 'border-gray-100'}`}>
          <div>
            <p className="text-gray-500 text-sm font-semibold">Low Stock Alerts</p>
            <p className={`text-2xl font-bold mt-1 ${data.lowStockItems.length > 0 ? 'text-red-600' : 'text-slate-800'}`}>
              {data.lowStockItems.length} Items
            </p>
          </div>
          <div className={`p-3 rounded-lg ${data.lowStockItems.length > 0 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-gray-50 text-gray-400'}`}>
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* --- CHARTS & ALERTS SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Dynamic Monthly Chart (Tailwind Native) */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">Monthly Sales vs Purchases</h2>
            <div className="flex gap-4 text-sm font-medium">
              <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500"></div> Sales</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-orange-500"></div> Purchase</span>
            </div>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-2 sm:gap-6 mt-4 h-64 border-b border-gray-200 pb-2">
            {dynamicMonthlyData.map((dataPoint, idx) => (
              <div key={idx} className="flex-1 flex flex-col justify-end items-center gap-1 h-full relative group">
                
                {/* Tooltip on Hover */}
                <div className="absolute -top-12 bg-slate-800 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none z-10 whitespace-nowrap">
                  Sales: ₹{dataPoint.sales.toLocaleString('en-IN')}<br/>
                  Purch: ₹{dataPoint.purchase.toLocaleString('en-IN')}
                </div>
                
                <div className="w-full flex justify-center items-end gap-1 h-full pt-10">
                  {/* Sales Bar */}
                  <div 
                    className="w-1/2 bg-green-500 rounded-t-sm hover:bg-green-600 transition-all duration-500" 
                    style={{ 
                      height: `${(dataPoint.sales / validMaxChartValue) * 100}%`, 
                      minHeight: dataPoint.sales > 0 ? '4px' : '0px' 
                    }}
                  ></div>
                  {/* Purchase Bar */}
                  <div 
                    className="w-1/2 bg-orange-500 rounded-t-sm hover:bg-orange-600 transition-all duration-500" 
                    style={{ 
                      height: `${(dataPoint.purchase / validMaxChartValue) * 100}%`, 
                      minHeight: dataPoint.purchase > 0 ? '4px' : '0px' 
                    }}
                  ></div>
                </div>
                <span className="text-xs font-semibold text-gray-500 mt-2">{dataPoint.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Detailed List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
            <AlertTriangle className="h-5 w-5 text-red-500" /> 
            Items to Reorder
          </h2>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar max-h-64">
            {data.lowStockItems.length > 0 ? (
              <ul className="space-y-3 pr-2">
                {data.lowStockItems.map(item => (
                  <li key={item.id} className="flex justify-between items-center p-3 bg-red-50 rounded-md border border-red-100">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{item.name}</p>
                      <p className="text-xs text-red-600 font-medium">Critical Level</p>
                    </div>
                    <div className="text-right">
                      <span className="block text-lg font-bold text-red-700">{item.quantity}</span>
                      <span className="text-xs text-slate-500">Left in stock</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 py-10">
                <Package className="h-12 w-12 mb-2 opacity-30" />
                <p className="text-sm font-medium">Inventory levels are healthy</p>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => navigate('/inventory')}
            className="mt-4 w-full py-2.5 text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md flex items-center justify-center gap-1 transition"
          >
            Manage Inventory <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
}