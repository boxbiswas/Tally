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
        <div className="flex items-center gap-2 px-3 py-2 text-slate-400/80 mb-1">
          <Icon className="h-4 w-4" />
          <span className="text-[11px] font-bold uppercase tracking-wider">{label}</span>
        </div>

        {/* Children Container - Indented with a vertical line to show hierarchy */}
        <div className="ml-5 pl-2 border-l border-slate-700/50 space-y-1">
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
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive
          ? 'bg-blue-600 text-white shadow-md'
          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`${isActive ? 'text-white' : 'text-slate-400'} h-4 w-4`} />
        <span className="font-medium text-sm">{label}</span>
      </div>

      {/* Dynamic Shortcut Styling based on active state */}
      {shortcut && (
        <kbd
          className={`text-[10px] font-mono px-1.5 py-0.5 rounded border shadow-sm ${isActive
              ? 'text-blue-100 bg-blue-700 border-blue-500'
              : 'text-slate-400 bg-slate-800/50 border-slate-700'
            }`}
        >
          {shortcut}
        </kbd>
      )}
    </NavLink>
  );
};

export default function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 h-screen flex flex-col text-white shadow-xl shrink-0 print:hidden select-none">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-wider text-blue-400">
          Smart<span className="text-white">ERP</span>
        </h1>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">

        <div className="mb-5">
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

        <div className="mt-5 border-t border-slate-800 pt-5">
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