import React from 'react';

const InvoicePartiesSection = ({ sale, company }) => {
    return (
        <div className="w-1/2 flex flex-col border-r border-black">
            <div className="p-2 border-b border-black flex-1">
                <p className="font-bold text-[14px]">{company.name}</p>
                <p>{company.address || 'Address'}</p>
                <p>GSTIN/UIN: {company.gstNo || 'N/A'}</p>
                <p>State Name: Local</p>
            </div>

            <div className="p-2 border-b border-black flex-1">
                <p className="text-gray-600 text-[10px]">Consignee (Ship to)</p>
                <p className="font-bold">{sale.customer.name}</p>
                <p>{sale.customer.address || 'Address not provided'}</p>
                {sale.customer.gstNo && <p>GSTIN/UIN: {sale.customer.gstNo}</p>}
                <p>State Name: Local</p>
            </div>

            <div className="p-2 flex-1">
                <p className="text-gray-600 text-[10px]">Buyer (Bill to)</p>
                <p className="font-bold">{sale.customer.name}</p>
                <p>{sale.customer.address || 'Address not provided'}</p>
                {sale.customer.gstNo && <p>GSTIN/UIN: {sale.customer.gstNo}</p>}
                <p>State Name: Local</p>
            </div>
        </div>
    );
};

export default InvoicePartiesSection;