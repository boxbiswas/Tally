import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Breadcrumb from './Breadcrumb';
import ShortcutSidebar from './ShortcutSidebar';
import { useShortcuts } from '../../hooks/useShortcuts';
import { useFormNavigation } from '../../hooks/useFormNavigation';

export default function MainLayout() {
    const navigate = useNavigate();
    const companyId = localStorage.getItem('activeCompanyId');

    // Activate hooks
    useShortcuts();
    useFormNavigation();

    useEffect(() => {
        if (!companyId) {
            navigate('/companies');
        }
    }, [companyId, navigate]);

    if (!companyId) return null;

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden print:bg-white print:h-auto print:overflow-visible">
            <Sidebar />

            <div className="flex-1 flex flex-col h-full w-full print:block print:h-auto overflow-hidden">
                <div className="print:hidden">
                    <Navbar />
                </div>

                <div className="flex flex-1 overflow-hidden bg-slate-50">
                    <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 print:p-0 print:overflow-visible print:block">
                        <div className="max-w-7xl mx-auto print:max-w-none print:m-0">
                            <div className="print:hidden mb-4">
                                <Breadcrumb />
                            </div>
                            <Outlet />
                        </div>
                    </main>
                    {/* 3. Drop the right-side shortcut bar here */}
                    <ShortcutSidebar />
                </div>
            </div>
        </div>
    );
}