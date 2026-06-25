// import React from 'react';
// import { useLocation } from 'react-router-dom';
// import { Command, ChevronDown, ChevronRight } from 'lucide-react';

// export default function ShortcutSidebar() {
//     const location = useLocation();
//     const path = location.pathname;

//     // Determine active context based on URL
//     const isInventory = path.includes('/inventory') || path.includes('/item');
//     const isSales = path.includes('/vouchers/sales');
//     const isMasters = path.includes('/ledgers') || path.includes('/company/create');
//     const isReports = path.includes('/reports');

//     // Define shortcut groups based on the PDF documentation
//     const shortcutGroups = [
//         {
//             title: 'Global Shortcuts',
//             active: !isInventory && !isSales && !isMasters && !isReports,
//             items: [
//                 { key: 'F1', label: 'Company Selection' },
//                 { key: 'F4', label: 'Calculator' },
//                 { key: 'Ctrl+H', label: 'Home' },
//                 { key: 'Ctrl+K', label: 'Command Search' },
//                 { key: 'Esc', label: 'Previous Screen' },
//             ]
//         },
//         {
//             title: 'Masters Shortcuts',
//             active: isMasters,
//             items: [
//                 { key: 'Alt+L', label: 'Create Ledger' },
//                 { key: 'Alt+A', label: 'Alter Ledger' },
//                 { key: 'Alt+G', label: 'Create Group' },
//                 { key: 'Alt+S', label: 'Create Stock Item' },
//                 { key: 'Alt+U', label: 'Unit Creation' },
//             ]
//         },
//         {
//             title: 'Inventory Shortcuts',
//             active: isInventory,
//             items: [
//                 { key: 'Ctrl+I', label: 'Inventory Dashboard' },
//                 { key: 'Ctrl+N', label: 'New Item' },
//                 { key: 'Ctrl+E', label: 'Edit Item' },
//                 { key: 'Ctrl+D', label: 'Delete Item' },
//                 { key: 'Ctrl+T', label: 'Stock Transfer' },
//                 { key: 'Ctrl+R', label: 'Stock Report' },
//             ]
//         },
//         {
//             title: 'Billing Shortcuts',
//             active: isSales,
//             items: [
//                 { key: 'Ctrl+B', label: 'New Invoice' },
//                 { key: 'Ctrl+P', label: 'Print Invoice' },
//                 { key: 'Ctrl+Shift+P', label: 'PDF Download' },
//                 { key: 'Ctrl+M', label: 'Email Invoice' },
//             ]
//         }
//     ];

//     return (
//         <div className="hidden xl:flex w-64 bg-slate-50 border-l border-slate-200 h-full flex-col shadow-sm print:hidden z-10 select-none">
//             <div className="p-4 border-b border-slate-200 flex items-center gap-2 bg-white">
//                 <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
//                     <Command className="h-4 w-4" />
//                 </div>
//                 <div>
//                     <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Active Shortcuts</h3>
//                 </div>
//             </div>

//             <div className="flex-1 py-4 px-3 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
//                 {shortcutGroups.map((group, idx) => (
//                     <div key={idx} className="flex flex-col gap-1">
//                         <div className={`flex items-center gap-1 px-2 py-1 text-xs font-bold uppercase tracking-wide ${group.active ? 'text-blue-700' : 'text-slate-400'}`}>
//                             {group.active ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
//                             {group.title}
//                         </div>

//                         {/* Only show the items if this group is active */}
//                         {group.active && (
//                             <div className="flex flex-col gap-1 mt-1 pl-1">
//                                 {group.items.map((shortcut, sIdx) => (
//                                     <div key={sIdx} className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-slate-200/50 transition-colors">
//                                         <span className="text-[13px] font-medium text-slate-700">{shortcut.label}</span>
//                                         <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded bg-white border border-slate-300 text-slate-500 shadow-sm">
//                                             {shortcut.key}
//                                         </kbd>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }


import React from 'react';
import { useLocation } from 'react-router-dom';
import { Command, ChevronDown, ChevronRight } from 'lucide-react';

export default function ShortcutSidebar() {
    const { pathname } = useLocation();

    // Logic to determine active section
    const isInventory = pathname.includes('/inventory') || pathname.includes('/item');
    const isSales = pathname.includes('/vouchers/sales');
    const isPurchase = pathname.includes('/vouchers/purchase');
    const isMasters = pathname.includes('/ledgers') || pathname.includes('/company');
    const isReports = pathname.includes('/reports');

    const shortcutGroups = [
        {
            title: 'Global Shortcuts',
            active: !isInventory && !isSales && !isPurchase && !isMasters && !isReports,
            items: [
                { key: 'F1', label: 'Company Selection' },
                { key: 'F4', label: 'Calculator' },
                { key: 'Ctrl+H', label: 'Home' },
                { key: 'Ctrl+K', label: 'Command Search' },
            ]
        },
        {
            title: 'Masters Shortcuts',
            active: isMasters,
            items: [
                { key: 'Alt+L', label: 'Create Ledger' },
                { key: 'Alt+A', label: 'Alter Ledger' },
                { key: 'Alt+S', label: 'Create Stock Item' },
                { key: 'Alt+U', label: 'Unit Creation' },
            ]
        },
        {
            title: 'Inventory Shortcuts',
            active: isInventory,
            items: [
                { key: 'Ctrl+I', label: 'Dashboard' },
                { key: 'Ctrl+N', label: 'New Item' },
                { key: 'Ctrl+D', label: 'Delete Item' },
                { key: 'Ctrl+T', label: 'Stock Transfer' },
                { key: 'Ctrl+R', label: 'Stock Report' },
            ]
        },
        {
            title: 'Billing Shortcuts',
            active: isSales || isPurchase,
            items: [
                { key: 'Ctrl+B', label: 'New Invoice' },
                { key: 'Ctrl+P', label: 'Print Invoice' },
                { key: 'Ctrl+M', label: 'Email Invoice' },
            ]
        }
    ];

    return (
        <div className="hidden xl:flex w-64 bg-slate-50 border-l border-slate-200 h-full flex-col shadow-sm print:hidden select-none">
            <div className="p-4 border-b border-slate-200 flex items-center gap-2 bg-white">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                    <Command className="h-4 w-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Quick Actions</h3>
            </div>

            <div className="flex-1 py-4 px-3 flex flex-col gap-4 overflow-y-auto">
                {shortcutGroups.map((group, idx) => (
                    <div key={idx} className={`flex flex-col gap-1 transition-opacity duration-300 ${group.active ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}>
                        <div className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                            {group.active ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                            {group.title}
                        </div>

                        {group.active && (
                            <div className="flex flex-col gap-1 mt-1 pl-1">
                                {group.items.map((shortcut, sIdx) => (
                                    <div key={sIdx} className="flex items-center justify-between px-2 py-1.5 rounded-md bg-white border border-slate-200 shadow-sm transition-all">
                                        <span className="text-[12px] font-medium text-slate-700">{shortcut.label}</span>
                                        <kbd className="px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-slate-100 border border-slate-300 text-slate-600">
                                            {shortcut.key}
                                        </kbd>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}