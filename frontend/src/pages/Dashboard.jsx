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

/* ── Reusable KPI Card ── */
const KpiCard = ({ label, value, icon: Icon, color, accent, onClick }) => {
  const colorMap = {
    blue:   { iconBg: 'rgba(59,130,246,0.12)',  iconClr: '#60a5fa', border: 'rgba(59,130,246,0.15)',  glow: 'rgba(59,130,246,0.08)'  },
    purple: { iconBg: 'rgba(139,92,246,0.12)', iconClr: '#a78bfa', border: 'rgba(139,92,246,0.15)', glow: 'rgba(139,92,246,0.08)' },
    indigo: { iconBg: 'rgba(99,102,241,0.12)',  iconClr: '#818cf8', border: 'rgba(99,102,241,0.15)',  glow: 'rgba(99,102,241,0.08)'  },
    green:  { iconBg: 'rgba(16,185,129,0.12)',  iconClr: '#34d399', border: 'rgba(16,185,129,0.15)',  glow: 'rgba(16,185,129,0.08)'  },
    orange: { iconBg: 'rgba(245,158,11,0.12)',  iconClr: '#fbbf24', border: 'rgba(245,158,11,0.15)',  glow: 'rgba(245,158,11,0.08)'  },
    red:    { iconBg: 'rgba(239,68,68,0.12)',   iconClr: '#f87171', border: 'rgba(239,68,68,0.15)',   glow: 'rgba(239,68,68,0.08)'   },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <div
      onClick={onClick}
      className={`relative p-5 rounded-2xl flex items-center justify-between transition-all duration-300 ${onClick ? 'cursor-pointer' : ''}`}
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid ${c.border}`,
        boxShadow: `0 4px 24px rgba(0,0,0,0.3), 0 0 40px ${c.glow}`,
      }}
      onMouseEnter={e => { if (onClick) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.4), 0 0 60px ${c.glow}`; }}}
      onMouseLeave={e => { if (onClick) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 24px rgba(0,0,0,0.3), 0 0 40px ${c.glow}`; }}}
    >
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-6 right-6 h-px rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${c.iconClr}40, transparent)` }} />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>{label}</p>
        <p className="text-2xl font-bold leading-none" style={{ color: 'var(--text-primary)' }}>{value}</p>
      </div>
      <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
        style={{ background: c.iconBg, border: `1px solid ${c.border}` }}>
        <Icon className="h-5 w-5" style={{ color: c.iconClr }} />
      </div>
    </div>
  );
};

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
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'rgba(99,102,241,0.3)', borderTopColor: '#6366f1' }}></div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Loading dashboard…</p>
        </div>
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
      <header className="flex justify-between items-end pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Gateway of SmartERP</h1>
          <p className="text-sm mt-1 font-medium" style={{ color: 'var(--text-muted)' }}>Financial &amp; Inventory Overview</p>
        </div>
        <button 
          onClick={() => navigate('/companies')}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200"
          style={{ color: '#93c5fd', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.18)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.1)'; }}
        >
          Change Company (F1)
        </button>
      </header>

      {/* --- KPI CARDS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        <KpiCard label="Total Customers"     value={data.totalCustomers}                                       icon={Users}          color="blue"   onClick={() => navigate('/ledgers')} />
        <KpiCard label="Total Suppliers"     value={data.totalSuppliers}                                       icon={Truck}          color="purple" onClick={() => navigate('/ledgers')} />
        <KpiCard label="Total Products"      value={data.totalProducts}                                        icon={Package}        color="indigo" onClick={() => navigate('/inventory')} />
        <KpiCard label="Total Sales Amount"  value={`₹${data.totalSalesAmount.toLocaleString('en-IN')}`}      icon={TrendingUp}     color="green"  onClick={() => navigate('/vouchers/sales')} />
        <KpiCard label="Total Purchase Amount" value={`₹${data.totalPurchaseAmount.toLocaleString('en-IN')}`} icon={IndianRupee}    color="orange" onClick={() => navigate('/vouchers/purchase')} />

        {/* Low Stock Alert Card */}
        <div
          className="relative p-5 rounded-2xl flex items-center justify-between"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: data.lowStockItems.length > 0 ? '1px solid rgba(239,68,68,0.25)' : '1px solid rgba(255,255,255,0.08)',
            boxShadow: data.lowStockItems.length > 0 ? '0 4px 24px rgba(0,0,0,0.3), 0 0 40px rgba(239,68,68,0.08)' : '0 4px 24px rgba(0,0,0,0.3)',
          }}
        >
          <div className="absolute top-0 left-6 right-6 h-px rounded-full"
            style={{ background: data.lowStockItems.length > 0 ? 'linear-gradient(90deg,transparent,rgba(239,68,68,0.5),transparent)' : 'linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)' }} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Low Stock Alerts</p>
            <p className="text-2xl font-bold leading-none" style={{ color: data.lowStockItems.length > 0 ? '#f87171' : 'var(--text-primary)' }}>
              {data.lowStockItems.length} Items
            </p>
          </div>
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${data.lowStockItems.length > 0 ? 'animate-pulse' : ''}`}
            style={{ background: data.lowStockItems.length > 0 ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.05)', border: data.lowStockItems.length > 0 ? '1px solid rgba(239,68,68,0.25)' : '1px solid rgba(255,255,255,0.08)' }}>
            <AlertTriangle className="h-5 w-5" style={{ color: data.lowStockItems.length > 0 ? '#f87171' : 'var(--text-muted)' }} />
          </div>
        </div>

      </div>

      {/* --- CHARTS & ALERTS SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-2">
        
        {/* Dynamic Monthly Chart */}
        <div className="lg:col-span-2 rounded-2xl p-6 flex flex-col" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Monthly Sales vs Purchases</h2>
              <p className="text-xs mt-0.5 font-medium" style={{ color: 'var(--text-muted)' }}>Revenue performance overview</p>
            </div>
            <div className="flex gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#10b981' }}></span> Sales
              </span>
              <span className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#f59e0b' }}></span> Purchase
              </span>
            </div>
          </div>
          
          {/* Chart area */}
          <div className="flex-1 flex items-end justify-between gap-2 sm:gap-4 h-52 pb-2 relative">
            {/* Horizontal grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-2">
              {[0,1,2,3,4].map(i => (
                <div key={i} className="w-full h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
              ))}
            </div>

            {dynamicMonthlyData.map((dataPoint, idx) => (
              <div key={idx} className="flex-1 flex flex-col justify-end items-center gap-1 h-full relative group">
                
                {/* Tooltip on Hover */}
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 text-xs p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-10 whitespace-nowrap"
                  style={{ background: 'rgba(15,20,40,0.95)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)', color: 'var(--text-secondary)' }}>
                  <p style={{ color: '#34d399' }}>Sales: ₹{dataPoint.sales.toLocaleString('en-IN')}</p>
                  <p style={{ color: '#fbbf24' }}>Purch: ₹{dataPoint.purchase.toLocaleString('en-IN')}</p>
                </div>
                
                <div className="w-full flex justify-center items-end gap-1 h-full pt-10">
                  {/* Sales Bar */}
                  <div 
                    className="w-1/2 rounded-t-md transition-all duration-500 hover:opacity-90" 
                    style={{ 
                      height: `${(dataPoint.sales / validMaxChartValue) * 100}%`, 
                      minHeight: dataPoint.sales > 0 ? '4px' : '0px',
                      background: 'linear-gradient(to top, #059669, #10b981)',
                      boxShadow: '0 -2px 12px rgba(16,185,129,0.3)',
                    }}
                  ></div>
                  {/* Purchase Bar */}
                  <div 
                    className="w-1/2 rounded-t-md transition-all duration-500 hover:opacity-90" 
                    style={{ 
                      height: `${(dataPoint.purchase / validMaxChartValue) * 100}%`, 
                      minHeight: dataPoint.purchase > 0 ? '4px' : '0px',
                      background: 'linear-gradient(to top, #d97706, #f59e0b)',
                      boxShadow: '0 -2px 12px rgba(245,158,11,0.3)',
                    }}
                  ></div>
                </div>
                <span className="text-[10px] font-semibold mt-1" style={{ color: 'var(--text-muted)' }}>{dataPoint.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Detailed List */}
        <div className="rounded-2xl p-6 flex flex-col" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
          <h2 className="text-base font-bold mb-4 flex items-center gap-2 pb-3" style={{ color: 'var(--text-primary)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <AlertTriangle className="h-4 w-4 text-red-400" /> 
            Items to Reorder
          </h2>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar max-h-52 space-y-2">
            {data.lowStockItems.length > 0 ? (
              data.lowStockItems.map(item => (
                <div key={item.id} className="flex justify-between items-center p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                  <div>
                    <p className="font-semibold text-sm leading-none" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                    <p className="text-[11px] mt-1 font-medium" style={{ color: '#f87171' }}>⚠ Critical Level</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-lg font-bold" style={{ color: '#f87171' }}>{item.quantity}</span>
                    <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>Left in stock</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-10 gap-3">
                <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.15)' }}>
                  <Package className="h-5 w-5" style={{ color: '#34d399' }} />
                </div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Inventory levels are healthy</p>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => navigate('/inventory')}
            className="mt-4 w-full py-2.5 text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200"
            style={{ color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            Manage Inventory <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
}