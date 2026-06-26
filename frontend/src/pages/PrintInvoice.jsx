import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Printer, ArrowLeft, FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../https/axios';

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

    // Helper to convert numbers to words (Basic implementation for the invoice footer)
    const numberToWords = (num) => {
        return `INR ${num.toLocaleString('en-IN')} Only`; // Can be expanded to actual word conversion if needed
    };

    return (
        /* ── Screen wrapper: dark canvas ── */
        <div className="min-h-screen p-4 md:p-8 print:p-0 print:bg-white flex flex-col items-center"
            style={{ background: 'var(--bg-base)' }}>

            {/* ── Action Bar — dark glass, hidden during print ── */}
            <div className="w-full max-w-[800px] flex justify-between items-center mb-5 p-3 px-4 rounded-2xl print:hidden"
                style={{
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                }}>

                {/* Left: back + invoice badge */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-150"
                        style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </button>

                    <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-lg flex items-center justify-center"
                            style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
                            <FileText className="h-3.5 w-3.5 text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-sm font-bold leading-none" style={{ color: 'var(--text-primary)' }}>
                                Tax Invoice
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                {sale.voucherNo} · {new Date(sale.date).toLocaleDateString('en-GB')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right: KPIs + print button */}
                <div className="flex items-center gap-4">
                    {/* Quick stats */}
                    <div className="hidden sm:flex items-center gap-4 pr-4"
                        style={{ borderRight: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="text-center">
                            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Customer</p>
                            <p className="text-xs font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>{sale.customer.name}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Total</p>
                            <p className="text-xs font-bold mt-0.5" style={{ color: '#34d399' }}>
                                ₹{sale.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200"
                        style={{
                            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                            color: '#fff',
                            border: '1px solid rgba(99,102,241,0.4)',
                            boxShadow: '0 0 16px rgba(99,102,241,0.25)',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.boxShadow = '0 0 24px rgba(99,102,241,0.4)'; }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.boxShadow = '0 0 16px rgba(99,102,241,0.25)'; }}
                    >
                        <Printer className="h-4 w-4" /> Print Invoice
                    </button>
                </div>
            </div>

            {/* ── Printable A4 Canvas ──
                IMPORTANT: This section is intentionally kept white/black for clean paper printing.
                Only the outer wrapper and action bar are styled for dark glass. ── */}
            <div className="w-full max-w-[800px] bg-white text-black font-sans text-[12px] leading-snug print:w-full print:max-w-none
                            print:hidden-none overflow-hidden print:rounded-none
                            shadow-2xl print:shadow-none"
                style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)' }}>

                {/* Invoice Header */}
                <div className="text-center font-bold text-lg border border-black border-b-0 py-1 uppercase bg-white text-black">
                    Tax Invoice
                </div>

                {/* Main Grid Wrapper */}
                <div className="border border-black flex flex-col w-full bg-white text-black">

                    {/* Top Section: Split Left/Right */}
                    <div className="flex border-b border-black w-full h-[280px]">

                        {/* Left Column (Company & Parties) */}
                        <div className="w-1/2 flex flex-col border-r border-black">
                            {/* Seller (Company) */}
                            <div className="p-2 border-b border-black flex-1">
                                <p className="font-bold text-[14px]">{company.name}</p>
                                <p>{company.address || 'Address'}</p>
                                <p>GSTIN/UIN: {company.gstNo || 'N/A'}</p>
                                <p>State Name: Local</p>
                            </div>

                            {/* Consignee */}
                            <div className="p-2 border-b border-black flex-1">
                                <p className="text-gray-600 text-[10px]">Consignee (Ship to)</p>
                                <p className="font-bold">{sale.customer.name}</p>
                                <p>{sale.customer.address || 'Address not provided'}</p>
                                {sale.customer.gstNo && <p>GSTIN/UIN: {sale.customer.gstNo}</p>}
                                <p>State Name: Local</p>
                            </div>

                            {/* Buyer */}
                            <div className="p-2 flex-1">
                                <p className="text-gray-600 text-[10px]">Buyer (Bill to)</p>
                                <p className="font-bold">{sale.customer.name}</p>
                                <p>{sale.customer.address || 'Address not provided'}</p>
                                {sale.customer.gstNo && <p>GSTIN/UIN: {sale.customer.gstNo}</p>}
                                <p>State Name: Local</p>
                            </div>
                        </div>

                        {/* Right Column (Meta Data Grid) */}
                        <div className="w-1/2 flex flex-col">
                            <div className="flex border-b border-black h-1/5">
                                <div className="w-1/2 border-r border-black p-1.5">
                                    <p className="text-gray-600 text-[10px]">Invoice No.</p>
                                    <p className="font-bold">{sale.voucherNo}</p>
                                </div>
                                <div className="w-1/2 p-1.5">
                                    <p className="text-gray-600 text-[10px]">Dated</p>
                                    <p className="font-bold">{new Date(sale.date).toLocaleDateString('en-GB')}</p>
                                </div>
                            </div>
                            <div className="flex border-b border-black h-1/5">
                                <div className="w-1/2 border-r border-black p-1.5">
                                    <p className="text-gray-600 text-[10px]">Delivery Note</p>
                                </div>
                                <div className="w-1/2 p-1.5">
                                    <p className="text-gray-600 text-[10px]">Mode/Terms of Payment</p>
                                </div>
                            </div>
                            <div className="flex border-b border-black h-1/5">
                                <div className="w-1/2 border-r border-black p-1.5">
                                    <p className="text-gray-600 text-[10px]">Reference No. &amp; Date.</p>
                                </div>
                                <div className="w-1/2 p-1.5">
                                    <p className="text-gray-600 text-[10px]">Other References</p>
                                </div>
                            </div>
                            <div className="flex border-b border-black h-1/5">
                                <div className="w-1/2 border-r border-black p-1.5">
                                    <p className="text-gray-600 text-[10px]">Buyer's Order No.</p>
                                </div>
                                <div className="w-1/2 p-1.5">
                                    <p className="text-gray-600 text-[10px]">Dated</p>
                                </div>
                            </div>
                            <div className="flex border-b border-black h-1/5">
                                <div className="w-1/2 border-r border-black p-1.5">
                                    <p className="text-gray-600 text-[10px]">Dispatch Doc No.</p>
                                </div>
                                <div className="w-1/2 p-1.5">
                                    <p className="text-gray-600 text-[10px]">Delivery Note Date</p>
                                </div>
                            </div>
                            <div className="flex border-b border-black h-1/5">
                                <div className="w-1/2 border-r border-black p-1.5">
                                    <p className="text-gray-600 text-[10px]">Dispatched through</p>
                                </div>
                                <div className="w-1/2 p-1.5">
                                    <p className="text-gray-600 text-[10px]">Destination</p>
                                </div>
                            </div>
                            <div className="h-1/5 p-1.5">
                                <p className="text-gray-600 text-[10px]">Terms of Delivery</p>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <table className="w-full text-left border-collapse table-fixed">
                        <thead>
                            <tr className="border-b border-black font-normal align-top h-10">
                                <th className="w-[8%] border-r border-black p-1 text-center font-normal text-[11px]">Sl<br/>No.</th>
                                <th className="w-[35%] border-r border-black p-1 text-center font-normal text-[11px]">Description of Goods</th>
                                <th className="w-[12%] border-r border-black p-1 text-center font-normal text-[11px]">HSN/SAC</th>
                                <th className="w-[12%] border-r border-black p-1 text-center font-normal text-[11px]">Quantity</th>
                                <th className="w-[10%] border-r border-black p-1 text-center font-normal text-[11px]">Rate</th>
                                <th className="w-[8%] border-r border-black p-1 text-center font-normal text-[11px]">per</th>
                                <th className="w-[15%] p-1 text-center font-normal text-[11px]">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sale.items.map((item, index) => (
                                <tr key={item.id} className="align-top">
                                    <td className="border-r border-black p-1 text-center">{index + 1}</td>
                                    <td className="border-r border-black p-1 font-bold">{item.stockItem.name}</td>
                                    <td className="border-r border-black p-1 text-center"></td>
                                    <td className="border-r border-black p-1 text-right font-bold">
                                        {item.qty} <span className="font-normal text-[10px]">{item.stockItem.unit}</span>
                                    </td>
                                    <td className="border-r border-black p-1 text-right">{item.rate.toFixed(2)}</td>
                                    <td className="border-r border-black p-1 text-center text-[10px]">{item.stockItem.unit}</td>
                                    <td className="p-1 text-right font-bold">{item.amount.toFixed(2)}</td>
                                </tr>
                            ))}
                            {/* Empty space filler to push the total row down, mimicking physical paper invoices */}
                            <tr className="h-[250px]">
                                <td className="border-r border-black"></td>
                                <td className="border-r border-black"></td>
                                <td className="border-r border-black"></td>
                                <td className="border-r border-black"></td>
                                <td className="border-r border-black"></td>
                                <td className="border-r border-black"></td>
                                <td></td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr className="border-t border-b border-black font-bold">
                                <td colSpan="3" className="border-r border-black p-1 text-right pr-4">Total</td>
                                <td className="border-r border-black p-1 text-right">
                                    {sale.items.reduce((sum, item) => sum + item.qty, 0)} <span className="font-normal text-[10px]">pcs</span>
                                </td>
                                <td className="border-r border-black"></td>
                                <td className="border-r border-black"></td>
                                <td className="p-1 text-right">₹ {sale.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            </tr>
                        </tfoot>
                    </table>

                    {/* Footer Section */}
                    <div className="flex border-black">
                        <div className="w-2/3 border-r border-black p-2 flex flex-col justify-between">
                            <div>
                                <p className="text-[10px] text-gray-600">Amount Chargeable (in words)</p>
                                <p className="font-bold italic">{numberToWords(sale.total)}</p>
                            </div>
                            <div className="mt-8">
                                <p className="text-[10px] underline mb-1">Declaration</p>
                                <p className="text-[10px]">We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
                            </div>
                        </div>

                        <div className="w-1/3 flex flex-col justify-between p-2">
                            <div className="text-right">
                                <p className="font-bold text-[11px]">for {company.name}</p>
                            </div>
                            <div className="mt-16 text-right">
                                <p className="text-[10px] text-gray-600">Authorized Signatory</p>
                            </div>
                        </div>
                    </div>

                </div>

                <p className="text-center text-[9px] text-gray-500 mt-1 italic font-medium bg-white">
                    SUBJECT TO LOCAL JURISDICTION. E. &amp; O.E
                </p>
            </div>
        </div>
    );
}