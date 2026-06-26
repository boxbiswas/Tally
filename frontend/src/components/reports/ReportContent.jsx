import React from 'react';
import CustomerReport from './CustomerReport';
import SupplierReport from './SupplierReport';
import StockReport from './StockReport';
import SalesReport from './SalesReport';
import PurchaseReport from './PurchaseReport';

/**
 * Main Report Content Area - Renders the appropriate table based on active tab
 */
const ReportContent = ({ 
    activeTab, 
    reportData, 
    loading, 
    selectedRowIndex, 
    setSelectedRowIndex, 
    navigate 
}) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center h-full py-20 flex-1">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 rounded-full border-2 border-t-transparent animate-spin" 
                         style={{ borderColor: 'rgba(99,102,241,0.3)', borderTopColor: '#6366f1' }}></div>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                        Loading report...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar print:p-0 print:overflow-visible relative">
            {activeTab === 'customers' && (
                <CustomerReport 
                    data={reportData.customers || []} 
                    selectedRowIndex={selectedRowIndex} 
                    setSelectedRowIndex={setSelectedRowIndex} 
                />
            )}

            {activeTab === 'suppliers' && (
                <SupplierReport 
                    data={reportData.suppliers || []} 
                    selectedRowIndex={selectedRowIndex} 
                    setSelectedRowIndex={setSelectedRowIndex} 
                />
            )}

            {activeTab === 'stock' && (
                <StockReport 
                    data={reportData.stockItems || []} 
                    selectedRowIndex={selectedRowIndex} 
                    setSelectedRowIndex={setSelectedRowIndex} 
                />
            )}

            {activeTab === 'sales' && (
                <SalesReport 
                    data={reportData.salesVouchers || []} 
                    selectedRowIndex={selectedRowIndex} 
                    setSelectedRowIndex={setSelectedRowIndex}
                    navigate={navigate}
                />
            )}

            {activeTab === 'purchases' && (
                <PurchaseReport 
                    data={reportData.purchaseVouchers || []} 
                    selectedRowIndex={selectedRowIndex} 
                    setSelectedRowIndex={setSelectedRowIndex} 
                />
            )}
        </div>
    );
};

export default ReportContent;