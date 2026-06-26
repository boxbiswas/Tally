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
                { key: 'Alt+Q', label: 'Logout' },
            ]
        },
        {
            id: 'masters', title: 'Masters Shortcuts',
            items: [
                { key: 'Alt+L', label: 'Create Ledger' },
                { key: 'Alt+S', label: 'Create Stock Item' },
                { key: 'Alt+C', label: 'New Customer' },
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
                { key: 'Alt+N', label: 'New Item' },
                { key: 'Ctrl+E', label: 'Edit Item' },
                { key: 'Alt+D', label: 'Delete Item' },
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
        <div
            className="hidden xl:flex w-60 h-full flex-col print:hidden select-none"
            style={{
                background: 'rgba(5,8,15,0.8)',
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                borderLeft: '1px solid rgba(255,255,255,0.07)',
            }}
        >
            {/* Header */}
            <div className="p-4 flex items-center gap-2.5 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="h-7 w-7 rounded-md flex items-center justify-center"
                    style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}>
                    <Command className="h-3.5 w-3.5 text-indigo-400" />
                </div>
                <h3 className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Quick Actions</h3>
            </div>

            {/* Groups */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pb-4">
                {shortcutGroups.map((group) => {
                    const isOpen = openGroup === group.id;
                    return (
                        <div key={group.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <button
                                onClick={() => toggleGroup(group.id)}
                                className="w-full flex items-center gap-2 px-4 py-3 text-[10px] font-bold uppercase tracking-widest outline-none transition-colors duration-150"
                                style={{
                                    color: isOpen ? '#93c5fd' : 'var(--text-muted)',
                                    background: isOpen ? 'rgba(59,130,246,0.06)' : 'transparent',
                                }}
                            >
                                {isOpen
                                    ? <ChevronDown className="h-3 w-3 shrink-0" />
                                    : <ChevronRight className="h-3 w-3 shrink-0" />
                                }
                                {group.title}
                            </button>

                            {isOpen && (
                                <div className="flex flex-col gap-0.5 px-2 pb-3 pt-1">
                                    {group.items.map((shortcut, sIdx) => (
                                        <div key={sIdx}
                                            className="flex items-center justify-between px-3 py-2 rounded-lg transition-colors duration-150"
                                            style={{ color: 'var(--text-secondary)' }}
                                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                                        >
                                            <span className="text-xs font-medium">{shortcut.label}</span>
                                            <kbd className="kbd-dark">{shortcut.key}</kbd>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Navigation Tips */}
                <div className="mt-5 px-3">
                    <div className="rounded-xl p-3.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <div className="flex items-center gap-2 mb-3">
                            <Keyboard className="h-3.5 w-3.5 text-indigo-400" />
                            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Navigation</span>
                        </div>
                        <ul className="space-y-2.5">
                            <li className="flex justify-between items-center">
                                <span className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>Next Field</span>
                                <kbd className="kbd-dark">Enter / →</kbd>
                            </li>
                            <li className="flex justify-between items-center">
                                <span className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>Prev Field</span>
                                <kbd className="kbd-dark">← / ↑</kbd>
                            </li>
                            <li className="flex justify-between items-center pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: '4px' }}>
                                <span className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>Open Dropdown</span>
                                <div className="flex items-center gap-1">
                                    <kbd className="kbd-dark">Space</kbd>
                                    <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>or</span>
                                    <kbd className="kbd-dark">Alt+↓</kbd>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}