import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Truck, ArrowRight, ArrowLeft } from 'lucide-react';

export default function VoucherSelection() {
    const navigate = useNavigate();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center gap-4">
                <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-slate-800">
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Accounting Vouchers</h2>
                    <p className="text-sm text-gray-500 mt-1">Select the type of transaction you want to record.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Purchase Voucher Card */}
                <Link
                    to="/vouchers/purchase"
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-orange-500 hover:shadow-md transition-all group"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-orange-50 p-3 rounded-lg text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                <Truck className="h-8 w-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                                    Purchase (F9)
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">Record inward stock from suppliers.</p>
                            </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-orange-500 transition-colors" />
                    </div>
                </Link>

                {/* Sales Voucher Card */}
                <Link
                    to="/vouchers/sales"
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-green-500 hover:shadow-md transition-all group"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-green-50 p-3 rounded-lg text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                <ShoppingCart className="h-8 w-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 group-hover:text-green-600 transition-colors">
                                    Sales (F8)
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">Record outward stock to customers.</p>
                            </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-green-500 transition-colors" />
                    </div>
                </Link>
            </div>
        </div>
    );
}