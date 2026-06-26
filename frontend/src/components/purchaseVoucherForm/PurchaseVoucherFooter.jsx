import React from 'react';
import { Save } from 'lucide-react';

const PurchaseVoucherFooter = ({ grandTotal, isSubmitting }) => {
    return (
        <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Grand Total</p>
                <p className="text-2xl font-bold" style={{ color: '#fbbf24' }}>₹{grandTotal.toFixed(2)}</p>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full sm:w-auto"
                style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)', borderColor: 'rgba(245,158,11,0.3)', boxShadow: '0 0 16px rgba(245,158,11,0.25)' }}
            >
                <Save className="h-4 w-4" />
                {isSubmitting ? 'Saving Voucher...' : 'Save Voucher'}
            </button>
        </div>
    );
};

export default PurchaseVoucherFooter;