import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Printer, ArrowLeft, FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../https/axios';
import PrintActionBar from '../components/printInvoice/PrintActionBar';
import InvoiceDocument from '../components/printInvoice/InvoiceDocument';


export default function PrintInvoice() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [sale, setSale] = useState(null);
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const companyId = localStorage.getItem('activeCompanyId');

    useEffect(() => {
        const fetchInvoiceData = async () => {
            try {
                const [saleRes, companyRes] = await Promise.all([
                    api.get(`/company/${companyId}/sales/${id}`),
                    api.get(`/company/${companyId}`)
                ]);
                setSale(saleRes.data.sale);
                setCompany(companyRes.data.company);
            } catch (error) {
                toast.error('Failed to load invoice data');
            } finally {
                setLoading(false);
            }
        };
        fetchInvoiceData();
    }, [id, companyId]);

    const handlePrint = () => {
        document.title = `Invoice_${sale?.voucherNo || 'Doc'}`;
        window.print();
    };

    if (loading) return (
        <div className="flex items-center justify-center h-[70vh] print:hidden">
            <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: 'rgba(99,102,241,0.3)', borderTopColor: '#6366f1' }}></div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Loading Invoice...</p>
            </div>
        </div>
    );

    if (!sale || !company) return (
        <div className="flex items-center justify-center h-[70vh] print:hidden">
            <p className="text-sm font-medium" style={{ color: '#f87171' }}>Invoice not found.</p>
        </div>
    );

    const numberToWords = (num) => {
        return `INR ${num.toLocaleString('en-IN')} Only`;
    };

    return (
        <div className="min-h-screen p-4 md:p-8 print:p-0 print:bg-white flex flex-col items-center bg-[#050505]">
            <PrintActionBar
                sale={sale}
                onBack={() => navigate(-1)}
                onPrint={handlePrint}
            />

            <InvoiceDocument
                sale={sale}
                company={company}
                numberToWords={numberToWords}
            />
        </div>
    );
}