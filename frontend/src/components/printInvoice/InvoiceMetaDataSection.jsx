import React from 'react';

const InvoiceMetaDataSection = ({ sale }) => {
    return (
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
    );
};

export default InvoiceMetaDataSection;