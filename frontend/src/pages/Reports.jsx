import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../https/axios';

// Sub-components
import ReportHeader from '../components/reports/ReportHeader';
import ReportTabs from '../components/reports/ReportTabs';
import ReportContent from '../components/reports/ReportContent';

const TABS = [
    { id: 'customers', label: 'Customer Outstanding', icon: 'Users' },
    { id: 'suppliers', label: 'Supplier Outstanding', icon: 'Truck' },
    { id: 'stock', label: 'Stock Summary', icon: 'Package' },
    { id: 'sales', label: 'Sales Register', icon: 'ShoppingCart' },
    { id: 'purchases', label: 'Purchase Register', icon: 'Truck' },
];

export default function Reports() {
    const location = useLocation();
    const [reportData, setReportData] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(location.state?.tab || 'customers');
    const [selectedRowIndex, setSelectedRowIndex] = useState(0);

    const navigate = useNavigate();
    const companyId = localStorage.getItem('activeCompanyId');

    // Fetch report data when tab changes
    useEffect(() => {
        const fetchActiveReport = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/company/${companyId}/reports/${activeTab}`);
                setReportData(prevData => ({
                    ...prevData,
                    ...response.data
                }));
            } catch (error) {
                toast.error(`Failed to load ${activeTab} report`);
            } finally {
                setLoading(false);
            }
        };

        if (companyId) {
            fetchActiveReport();
        }
    }, [activeTab, companyId]);

    // Sync tab from navigation state
    useEffect(() => {
        if (location.state?.tab) {
            setActiveTab(location.state.tab);
        }
        setSelectedRowIndex(0);
    }, [location.state, activeTab]);

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);
            if (isTyping) return;

            const currentIndex = TABS.findIndex(t => t.id === activeTab);

            // Alt + Arrow navigation between tabs
            if (e.altKey && (e.key === 'ArrowDown' || e.key === 'ArrowRight')) {
                e.preventDefault();
                setActiveTab(TABS[(currentIndex + 1) % TABS.length].id);
                return;
            }
            if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowLeft')) {
                e.preventDefault();
                setActiveTab(TABS[(currentIndex - 1 + TABS.length) % TABS.length].id);
                return;
            }

            // Alt + Number direct jump
            if (e.altKey) {
                const keyMap = {
                    '1': 0, 'Digit1': 0, 'Numpad1': 0,
                    '2': 1, 'Digit2': 1, 'Numpad2': 1,
                    '3': 2, 'Digit3': 2, 'Numpad3': 2,
                    '4': 3, 'Digit4': 3, 'Numpad4': 3,
                    '5': 4, 'Digit5': 4, 'Numpad5': 4
                };
                const tabIndex = keyMap[e.key] ?? keyMap[e.code];
                if (tabIndex !== undefined && TABS[tabIndex]) {
                    e.preventDefault();
                    setActiveTab(TABS[tabIndex].id);
                    return;
                }
            }

            // Row navigation inside table
            if (!e.altKey && !e.ctrlKey && !e.shiftKey) {
                let currentDataList = [];
                if (activeTab === 'customers') currentDataList = reportData.customers || [];
                if (activeTab === 'suppliers') currentDataList = reportData.suppliers || [];
                if (activeTab === 'stock') currentDataList = reportData.stockItems || [];
                if (activeTab === 'sales') currentDataList = reportData.salesVouchers || [];
                if (activeTab === 'purchases') currentDataList = reportData.purchaseVouchers || [];

                if (currentDataList.length > 0) {
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        setSelectedRowIndex(prev => (prev + 1) % currentDataList.length);
                    } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        setSelectedRowIndex(prev => (prev - 1 + currentDataList.length) % currentDataList.length);
                    } else if (e.key === 'Enter') {
                        e.preventDefault();
                        const selectedItem = currentDataList[selectedRowIndex];
                        if (selectedItem && activeTab === 'sales') {
                            navigate(`/vouchers/sales/print/${selectedItem.id}`);
                        }
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeTab, reportData, selectedRowIndex, navigate]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="rounded-2xl overflow-hidden min-h-[80vh] flex flex-col print:border-none print:shadow-none print:m-0"
            style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 32px rgba(0,0,0,0.4)' }}>

            <ReportHeader onPrint={handlePrint} />

            <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
                <ReportTabs
                    tabs={TABS}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                <ReportContent
                    activeTab={activeTab}
                    reportData={reportData}
                    loading={loading}
                    selectedRowIndex={selectedRowIndex}
                    setSelectedRowIndex={setSelectedRowIndex}
                    navigate={navigate}
                />
            </div>
        </div>
    );
}