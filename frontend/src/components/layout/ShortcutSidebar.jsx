import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Command, ChevronDown, ChevronRight, Keyboard } from 'lucide-react';

export default function ShortcutSidebar() {
    const { pathname } = useLocation();

    const isInventory = pathname.includes('/inventory') || pathname.includes('/item');
    const isVoucher = pathname.includes('/vouchers');
    const isMasters = pathname.includes('/ledgers') || pathname.includes('/company/create');
    const isReports = pathname.includes('/reports');

    const defaultActive = isInventory ? 'inventory' : isVoucher ? 'vouchers' : isMasters ? 'masters' : isReports ? 'reports' : 'global';
    const [openGroup, setOpenGroup] = useState(defaultActive);

    useEffect(() => {
        setOpenGroup(defaultActive);
    }, [defaultActive]);

    const toggleGroup = (groupId) => setOpenGroup(openGroup === groupId ? null : groupId);

    const shortcutGroups = [
        {
            id: 'global', title: 'Global Shortcuts',
            items: [
                { key: 'F1', label: 'Company Selection' },
                { key: 'Esc', label: 'Previous Screen' },
                { key: 'Ctrl+H', label: 'Dashboard' },
                { key: 'Alt+Q', label: 'Logout' },        // was Ctrl+Q (unkillable)
            ]
        },
        {
            id: 'masters', title: 'Masters Shortcuts',
            items: [
                { key: 'Alt+L', label: 'Create Ledger' },
                { key: 'Alt+S', label: 'Create Stock Item' },
                { key: 'Alt+C', label: 'New Customer' },   // was Ctrl+C (unkillable)
                { key: 'Alt+U', label: 'New Supplier' },
            ]
        },
        {
            id: 'vouchers', title: 'Billing Shortcuts',
            items: [
                { key: 'F8', label: 'Sales Voucher' },
                { key: 'F9', label: 'Purchase Voucher' },
                { key: 'Ctrl+B', label: 'Select Invoice' },
                { key: 'Ctrl+P', label: 'Print Invoice' },
            ]
        },
        {
            id: 'inventory', title: 'Inventory Shortcuts',
            items: [
                { key: 'Ctrl+I', label: 'Inventory Dashboard' },
                { key: 'Alt+N', label: 'New Item' },        // was Ctrl+N (unkillable)
                { key: 'Ctrl+E', label: 'Edit Item' },
                { key: 'Alt+D', label: 'Delete Item' },     // was Ctrl+D (unkillable)
            ]
        },
        {
            id: 'reports', title: 'Reports Shortcuts',
            items: [
                { key: 'Alt+1', label: 'Customer Out.' },
                { key: 'Alt+2', label: 'Supplier Out.' },
                { key: 'Alt+3', label: 'Stock Summary' },
                { key: 'Alt+4', label: 'Sales Register' },
                { key: 'Alt+5', label: 'Purchase Reg.' },
            ]
        }
    ];

    return (
        <div className="hidden xl:flex w-64 bg-white border-l border-slate-200 h-full flex-col shadow-sm print:hidden select-none">
            <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
                <div className="p-1.5 bg-blue-100 text-blue-700 rounded-md"><Command className="h-4 w-4" /></div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Quick Actions</h3>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pb-4">
                {shortcutGroups.map((group) => {
                    const isOpen = openGroup === group.id;
                    return (
                        <div key={group.id} className="border-b border-slate-100">
                            <button
                                onClick={() => toggleGroup(group.id)}
                                className={`w-full flex items-center gap-2 px-4 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors outline-none ${isOpen ? 'text-blue-700 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
                            >
                                {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                                {group.title}
                            </button>

                            {isOpen && (
                                <div className="flex flex-col gap-0.5 px-2 pb-3 pt-1 bg-white">
                                    {group.items.map((shortcut, sIdx) => (
                                        <div key={sIdx} className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-slate-50 transition-colors">
                                            <span className="text-[12.5px] font-medium text-slate-700">{shortcut.label}</span>
                                            <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded bg-white border border-slate-300 text-slate-500 shadow-sm">{shortcut.key}</kbd>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}

                <div className="mt-6 px-4">
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                        <div className="flex items-center gap-2 mb-2 text-slate-600">
                            <Keyboard className="h-4 w-4" />
                            <span className="text-[11px] font-bold uppercase tracking-wider">Navigation</span>
                        </div>
                        <ul className="text-[12px] text-slate-500 space-y-2 font-medium">
                            <li className="flex justify-between items-center">
                                <span>Next Field</span>
                                <kbd className="font-mono bg-white border rounded px-1 shadow-sm text-[10px]">Enter / ➡</kbd>
                            </li>
                            <li className="flex justify-between items-center">
                                <span>Prev Field</span>
                                <kbd className="font-mono bg-white border rounded px-1 shadow-sm text-[10px]">⬅ / ⬆</kbd>
                            </li>
                            <li className="flex justify-between items-center pt-2 mt-1 border-t border-slate-200">
                                <span>Open Dropdown</span>
                                <div className="flex items-center gap-1">
                                    <kbd className="font-mono bg-white border rounded px-1 shadow-sm text-[10px]">Space</kbd>
                                    <span className="text-[9px] text-slate-400">or</span>
                                    <kbd className="font-mono bg-white border rounded px-1 shadow-sm text-[10px]">Alt+⬇</kbd>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}