import React from 'react';
import InvoicePartiesSection from './InvoicePartiesSection';
import InvoiceMetaDataSection from './InvoiceMetaDataSection';
import InvoiceItemsTable from './InvoiceItemsTable';
import InvoiceFooter from './InvoiceFooter';

const InvoiceDocument = ({ sale, company, numberToWords }) => {
    return (
        <div className="w-full max-w-[800px] bg-white text-black font-sans text-[12px] leading-snug print:w-full print:max-w-none overflow-hidden print:rounded-none shadow-2xl print:shadow-none"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)' }}>

            <div className="text-center font-bold text-lg border border-black border-b-0 py-1 uppercase bg-white text-black">
                Tax Invoice
            </div>

            <div className="border border-black flex flex-col w-full bg-white text-black">
                <div className="flex border-b border-black w-full h-[280px]">
                    <InvoicePartiesSection sale={sale} company={company} />
                    <InvoiceMetaDataSection sale={sale} />
                </div>

                <InvoiceItemsTable sale={sale} />

                <InvoiceFooter sale={sale} company={company} numberToWords={numberToWords} />
            </div>

            <p className="text-center text-[9px] text-gray-500 mt-1 italic font-medium bg-white">
                SUBJECT TO LOCAL JURISDICTION. E. &amp; O.E
            </p>
        </div>
    );
};

export default InvoiceDocument;