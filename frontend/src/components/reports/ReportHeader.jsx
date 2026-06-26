import React from 'react';
import { FileBarChart, Printer } from 'lucide-react';

const ReportHeader = ({ onPrint }) => {
    return (
        <div className="p-5 flex justify-between items-center print:hidden"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
            <h2 className="text-lg font-bold flex items-center gap-2.5" style={{ color: 'var(--text-primary)' }}>
                <div className="h-8 w-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
                    <FileBarChart className="h-4 w-4 text-indigo-400" />
                </div>
                Display More Reports
            </h2>

            <div
                role="button"
                tabIndex={-1}
                onClick={onPrint}
                className="btn-secondary print:hidden cursor-pointer flex items-center gap-2"
            >
                <Printer className="h-4 w-4" /> Print Report
            </div>
        </div>
    );
};

export default ReportHeader;