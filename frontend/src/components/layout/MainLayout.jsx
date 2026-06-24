import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Breadcrumb from './Breadcrumb';

export default function MainLayout() {
    const navigate = useNavigate();
    const companyId = localStorage.getItem('activeCompanyId');

    // Safety check: If a user somehow hits a protected route inside the layout 
    // without selecting a company, kick them back to the company list.
    useEffect(() => {
        if (!companyId) {
            navigate('/companies');
        }
    }, [companyId, navigate]);

    if (!companyId) return null;

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col h-full w-full">
                <Navbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto">
                        <Breadcrumb />
                        {/* The active route component injects here */}
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}