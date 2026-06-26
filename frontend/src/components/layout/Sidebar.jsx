import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Database, ArrowLeftRight, FileBarChart, Users, Package, ShoppingCart, Truck } from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, to, shortcut, children }) => {
  const location = useLocation();

  // --- PARENT CATEGORY HEADER (e.g., "Masters", "Transactions") ---
  if (children) {
    return (
      <div className="mb-5">
        {/* Header Styling - No hover, muted text, uppercase */}
        <div className="flex items-center gap-2 px-3 py-2 mb-1" style={{ color: 'var(--text-muted)' }}>
          <Icon className="h-3.5 w-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
        </div>

        {/* Children Container - Indented with a vertical line to show hierarchy */}
        <div className="ml-4 pl-3 space-y-0.5" style={{ borderLeft: '1px solid rgba(255,255,255,0.07)' }}>
          {children}
        </div>
      </div>
    );
  }

  // --- NORMAL CLICKABLE LINK ---
  const isActive = location.pathname === to;

  return (
    <NavLink
      to={to}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group`}
      style={{
        background: isActive ? 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(99,102,241,0.15))' : 'transparent',
        border: isActive ? '1px solid rgba(99,102,241,0.25)' : '1px solid transparent',
        boxShadow: isActive ? '0 0 20px rgba(59,130,246,0.1)' : 'none',
        color: isActive ? '#e0e7ff' : 'var(--text-secondary)',
      }}
      onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-primary)'; }}}
      onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
    >
      <div className="flex items-center gap-3">
        <Icon
          className="h-4 w-4 shrink-0 transition-colors"
          style={{ color: isActive ? '#93c5fd' : 'var(--text-muted)' }}
        />
        <span className="font-medium text-sm leading-none">{label}</span>
      </div>

      {/* Dynamic Shortcut Styling based on active state */}
      {shortcut && (
        <kbd className={isActive ? 'kbd-dark kbd-active' : 'kbd-dark'}>
          {shortcut}
        </kbd>
      )}
    </NavLink>
  );
};

export default function Sidebar() {
  return (
    <div
      className="w-60 h-screen flex flex-col shrink-0 print:hidden select-none"
      style={{
        background: 'rgba(5,8,15,0.9)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Logo Section */}
      <div className="p-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', boxShadow: '0 0 16px rgba(99,102,241,0.4)' }}>
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight leading-none" style={{ color: 'var(--text-primary)' }}>
              Smart<span style={{ background: 'linear-gradient(135deg,#60a5fa,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ERP</span>
            </h1>
            <p className="text-[10px] mt-0.5 font-medium" style={{ color: 'var(--text-muted)' }}>Business Suite</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto p-3 pt-4 custom-scrollbar space-y-1">

        <div className="mb-4">
          <SidebarItem
            icon={LayoutDashboard}
            label="Dashboard"
            to="/dashboard"
            shortcut="Ctrl+H"
          />
        </div>

        {/* Masters Hierarchy */}
        <SidebarItem icon={Database} label="Masters">
          <SidebarItem
            icon={Users}
            label="Ledgers"
            to="/ledgers"
            shortcut="Alt+Y"
          />
          <SidebarItem
            icon={Package}
            label="Stock Items"
            to="/inventory"
            shortcut="Ctrl+I"
          />
        </SidebarItem>

        {/* Transactions Hierarchy */}
        <SidebarItem icon={ArrowLeftRight} label="Transactions">
          <SidebarItem
            icon={Truck}
            label="Purchase"
            to="/vouchers/purchase"
            shortcut="F9"
          />
          <SidebarItem
            icon={ShoppingCart}
            label="Sales"
            to="/vouchers/sales"
            shortcut="F8"
          />
        </SidebarItem>

        <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <SidebarItem
            icon={FileBarChart}
            label="Reports"
            to="/reports"
            shortcut="Alt+R"
          />
        </div>

      </div>
    </div>
  );
}