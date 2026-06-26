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
import MonthlySalesChart from '../components/dashboard/MonthlySalesChart';
import LowStockAlertCard from '../components/dashboard/LowStockAlertCard';
import LowStockItemsList from '../components/dashboard/LowStockItemsList';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import KpiCard from '../components/dashboard/KpiCard';



export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const companyId = localStorage.getItem('activeCompanyId');

  // Fetch dashboard metrics on mount
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

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'rgba(99,102,241,0.3)', borderTopColor: '#6366f1' }}>
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Loading dashboard…</p>
        </div>
      </div>
    );
  }

  // Fallback data structure
  const data = metrics || {
    totalCustomers: 0,
    totalSuppliers: 0,
    totalProducts: 0,
    totalSalesAmount: 0,
    totalPurchaseAmount: 0,
    lowStockItems: [],
    monthlyData: []
  };

  // Chart calculations
  const dynamicMonthlyData = data.monthlyData || [];
  const maxChartValue = dynamicMonthlyData.length > 0
    ? Math.max(...dynamicMonthlyData.map(d => Math.max(d.sales, d.purchase)))
    : 100;
  const validMaxChartValue = maxChartValue > 0 ? maxChartValue : 100;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <DashboardHeader onChangeCompany={() => navigate('/companies')} />

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard label="Total Customers" value={data.totalCustomers} icon="Users" color="blue" onClick={() => navigate('/ledgers')} />
        <KpiCard label="Total Suppliers" value={data.totalSuppliers} icon="Truck" color="purple" onClick={() => navigate('/ledgers')} />
        <KpiCard label="Total Products" value={data.totalProducts} icon="Package" color="indigo" onClick={() => navigate('/inventory')} />
        <KpiCard label="Total Sales Amount" value={`₹${data.totalSalesAmount.toLocaleString('en-IN')}`} icon="TrendingUp" color="green" onClick={() => navigate('/vouchers/sales')} />
        <KpiCard label="Total Purchase Amount" value={`₹${data.totalPurchaseAmount.toLocaleString('en-IN')}`} icon="IndianRupee" color="orange" onClick={() => navigate('/vouchers/purchase')} />

        <LowStockAlertCard lowStockItems={data.lowStockItems} />
      </div>

      {/* Charts and Detailed Lists Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-2">
        <MonthlySalesChart
          dynamicMonthlyData={dynamicMonthlyData}
          validMaxChartValue={validMaxChartValue}
        />
        <LowStockItemsList
          lowStockItems={data.lowStockItems}
          onManageInventory={() => navigate('/inventory')}
        />
      </div>
    </div>
  );
}