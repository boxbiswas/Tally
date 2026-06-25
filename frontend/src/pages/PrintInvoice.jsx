import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Printer, ArrowLeft } from 'lucide-react';
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

    // Native print handler - simple and foolproof
    const handlePrint = () => {
        document.title = `Invoice_${sale?.voucherNo || 'Doc'}`;
        window.print();
    };

    if (loading) return <div className="p-8 text-center print:hidden">Loading Invoice...</div>;
    if (!sale || !company) return <div className="p-8 text-center text-red-500 print:hidden">Invoice not found.</div>;

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-6 print:p-0 print:m-0 print:max-w-none">

            {/* Action Bar - Hidden during print */}
            <div className="flex justify-between items-center mb-6 print:hidden">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
                    <ArrowLeft className="h-5 w-5" /> Back to Sales
                </button>
                <button
                    onClick={handlePrint}
                    className="bg-blue-600 text-white px-6 py-2 rounded flex items-center gap-2 hover:bg-blue-700 transition"
                >
                    <Printer className="h-5 w-5" /> Print / Save as PDF
                </button>
            </div>

            {/* Printable Area */}
            <div className="bg-white mx-auto text-sm font-sans text-black print:w-full">
                <h1 className="text-center text-xl font-bold mb-4 uppercase underline">Tax Invoice</h1>

                <div className="border border-black flex flex-col">
                    {/* Top Half: Details Section */}
                    <div className="flex border-b border-black h-48">

                        {/* Left Column: Consignee & Buyer */}
                        <div className="w-1/2 border-r border-black flex flex-col">
                            <div className="p-2 border-b border-black flex-1">
                                <p className="text-xs text-gray-600 mb-1">Consignee (Ship to)</p>
                                <p className="font-bold">{sale.customer.name}</p>
                                <p>{sale.customer.address || 'Address not provided'}</p>
                                {sale.customer.gstNo && <p>GSTIN/UIN: {sale.customer.gstNo}</p>}
                                <p>State Name: <span className="font-semibold">Local</span></p>
                            </div>
                            <div className="p-2 flex-1">
                                <p className="text-xs text-gray-600 mb-1">Buyer (Bill to)</p>
                                <p className="font-bold">{sale.customer.name}</p>
                                <p>{sale.customer.address || 'Address not provided'}</p>
                                {sale.customer.gstNo && <p>GSTIN/UIN: {sale.customer.gstNo}</p>}
                                <p>State Name: <span className="font-semibold">Local</span></p>
                            </div>
                        </div>

                        {/* Right Column: Invoice Meta Data */}
                        <div className="w-1/2 flex flex-col">
                            <div className="flex border-b border-black flex-1">
                                <div className="w-1/2 p-2 border-r border-black">
                                    <p className="text-xs text-gray-600">Invoice No.</p>
                                    <p className="font-bold">{sale.voucherNo}</p>
                                </div>
                                <div className="w-1/2 p-2">
                                    <p className="text-xs text-gray-600">Dated</p>
                                    <p className="font-bold">{new Date(sale.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex border-b border-black flex-1">
                                <div className="w-1/2 p-2 border-r border-black">
                                    <p className="text-xs text-gray-600">Delivery Note</p>
                                </div>
                                <div className="w-1/2 p-2">
                                    <p className="text-xs text-gray-600">Mode/Terms of Payment</p>
                                </div>
                            </div>
                            <div className="flex border-b border-black flex-1">
                                <div className="w-1/2 p-2 border-r border-black">
                                    <p className="text-xs text-gray-600">Supplier's Ref.</p>
                                </div>
                                <div className="w-1/2 p-2">
                                    <p className="text-xs text-gray-600">Other Reference(s)</p>
                                </div>
                            </div>
                            <div className="p-2 flex-1">
                                <p className="text-xs text-gray-600">Terms of Delivery</p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Half: Items Table */}
                    <table className="w-full text-left table-fixed border-collapse">
                        <thead>
                            <tr className="border-b border-black border-t">
                                <th className="w-10 p-2 border-r border-black text-center font-normal">Sl<br />No.</th>
                                <th className="p-2 border-r border-black font-normal">Description of Goods</th>
                                <th className="w-20 p-2 border-r border-black font-normal text-center">HSN/SAC</th>
                                <th className="w-24 p-2 border-r border-black font-normal text-right">Quantity</th>
                                <th className="w-24 p-2 border-r border-black font-normal text-right">Rate</th>
                                <th className="w-12 p-2 border-r border-black font-normal text-center">per</th>
                                <th className="w-32 p-2 font-normal text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sale.items.map((item, index) => (
                                <tr key={item.id} className="h-8 align-top">
                                    <td className="p-2 border-r border-black text-center">{index + 1}</td>
                                    <td className="p-2 border-r border-black font-semibold">{item.stockItem.name}</td>
                                    <td className="p-2 border-r border-black text-center"></td>
                                    <td className="p-2 border-r border-black text-right font-semibold">
                                        {item.qty} <span className="text-xs font-normal">{item.stockItem.unit}</span>
                                    </td>
                                    <td className="p-2 border-r border-black text-right">{item.rate.toFixed(2)}</td>
                                    <td className="p-2 border-r border-black text-center text-xs">{item.stockItem.unit}</td>
                                    <td className="p-2 text-right font-semibold">{item.amount.toFixed(2)}</td>
                                </tr>
                            ))}

                            {/* Empty Space filler to push total to bottom */}
                            <tr className="h-64 align-top">
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
                            <tr className="border-t border-black border-b font-bold">
                                <td colSpan="3" className="p-2 border-r border-black text-right">Total</td>
                                <td className="p-2 border-r border-black text-right">
                                    {sale.items.reduce((sum, item) => sum + item.qty, 0)} pcs
                                </td>
                                <td className="p-2 border-r border-black"></td>
                                <td className="p-2 border-r border-black"></td>
                                <td className="p-2 text-right">₹ {sale.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            </tr>
                        </tfoot>
                    </table>

                    {/* Footer Information */}
                    <div className="flex border-t border-black mt-auto">
                        <div className="w-2/3 p-2 border-r border-black">
                            <p className="text-xs text-gray-600">Amount Chargeable (in words)</p>
                            <p className="font-bold italic">INR {sale.total} Only</p>
                            <p className="text-xs mt-8">Declaration:</p>
                            <p className="text-xs">We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
                        </div>
                        <div className="w-1/3 flex flex-col justify-between p-2">
                            <p className="text-right text-xs font-semibold">for {company.name}</p>
                            <div className="mt-16 text-right">
                                <p className="text-xs text-gray-600 border-t border-black inline-block pt-1">Authorized Signatory</p>
                            </div>
                        </div>
                    </div>

                </div>
                <p className="text-center text-xs text-gray-500 mt-2">SUBJECT TO LOCAL JURISDICTION</p>
            </div>
        </div>
    );
}