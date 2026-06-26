import React from 'react';

const InvoiceItemsTable = ({ sale }) => {
    return (
        <table className="w-full text-left border-collapse table-fixed">
            <thead>
                <tr className="border-b border-black font-normal align-top h-10">
                    <th className="w-[8%] border-r border-black p-1 text-center font-normal text-[11px]">Sl<br />No.</th>
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
    );
};

export default InvoiceItemsTable;