import React from 'react';

const InvoiceFooter = ({ sale, company, numberToWords }) => {
    return (
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
    );
};

export default InvoiceFooter;