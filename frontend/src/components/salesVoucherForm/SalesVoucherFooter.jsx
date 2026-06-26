import React from 'react';
import { Save } from 'lucide-react';

const SalesVoucherFooter = ({ grandTotal, isSubmitting }) => {
    return (
        <div className="flex justify-between items-center pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Grand Total</p>
                <p className="text-2xl font-bold" style={{ color: '#34d399' }}>₹{grandTotal.toFixed(2)}</p>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{ background: 'linear-gradient(135deg, #059669, #10b981)', borderColor: 'rgba(16,185,129,0.3)', boxShadow: '0 0 16px rgba(16,185,129,0.25)' }}
            >
                <Save className="h-4 w-4" />
                {isSubmitting ? 'Processing...' : 'Save Sale'}
            </button>
        </div>
    );
};

export default SalesVoucherFooter;