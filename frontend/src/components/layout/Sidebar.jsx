import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Database, 
  ArrowLeftRight, 
  FileBarChart, 
  ChevronDown, 
  ChevronRight,
  Users,
  Package,
  ShoppingCart,
  Truck
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, to, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isActive = to ? location.pathname === to : location.pathname.startsWith(`/${label.toLowerCase()}`);

  if (children) {
    return (
      <div className="mb-1">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
            isActive || isOpen ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5" />
            <span className="font-medium">{label}</span>
          </div>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        {isOpen && (
          <div className="ml-4 pl-4 border-l border-slate-700 mt-1 space-y-1">
            {children}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink 
      to={to}
      className={({ isActive }) => `
        w-full flex items-center gap-3 p-3 rounded-lg transition-colors mb-1
        ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
      `}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </NavLink>
  );
};

export default function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 h-screen flex flex-col text-white shadow-xl flex-shrink-0">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-wider text-blue-400">Smart<span className="text-white">ERP</span></h1>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" />
        
        <SidebarItem icon={Database} label="Masters">
          <SidebarItem icon={Users} label="Ledger" to="/ledgers" />
          <SidebarItem icon={Package} label="Stock Items" to="/inventory" />
        </SidebarItem>

        <SidebarItem icon={ArrowLeftRight} label="Transactions">
          <SidebarItem icon={Truck} label="Purchase" to="/vouchers/purchase" />
          <SidebarItem icon={ShoppingCart} label="Sales" to="/vouchers/sales" />
        </SidebarItem>

        <SidebarItem icon={FileBarChart} label="Reports" to="/reports" />
      </div>
    </div>
  );
}