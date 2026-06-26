import React from 'react';
import { useNavigate } from 'react-router-dom';

import VoucherCard from '../components/voucherSelection/VoucherCard';
import VoucherSelectionHeader from '../components/voucherSelection/VoucherSelectionHeader';

export default function VoucherSelection() {
    const navigate = useNavigate();

    return (
        <div className="max-w-4xl mx-auto">
            <VoucherSelectionHeader onBack={() => navigate('/dashboard')} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Purchase Voucher */}
                <VoucherCard
                    to="/vouchers/purchase"
                    icon="Truck"
                    title="Purchase (F9)"
                    description="Record inward stock from suppliers."
                    accentColor="#fbbf24"
                    borderColor="rgba(245,158,11,0.15)"
                    glowColor="rgba(245,158,11,0.04)"
                />

                {/* Sales Voucher */}
                <VoucherCard
                    to="/vouchers/sales"
                    icon="ShoppingCart"
                    title="Sales (F8)"
                    description="Record outward stock to customers."
                    accentColor="#34d399"
                    borderColor="rgba(16,185,129,0.15)"
                    glowColor="rgba(16,185,129,0.04)"
                />
            </div>
        </div>
    );
}