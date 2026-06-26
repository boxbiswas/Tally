import React from 'react';
import { Save } from 'lucide-react';

const LedgerFormFields = ({ formData, isEdit, onChange, loading }) => {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Ledger Name */}
                <div className="md:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                        Ledger Name *
                    </label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={onChange}
                        className="input-glass"
                        placeholder="e.g. Rahul Traders"
                    />
                </div>

                {/* Under Group */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                        Under Group *
                    </label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={onChange}
                        className="select-glass"
                    >
                        <option value="CUSTOMER">Sundry Debtors (Customer)</option>
                        <option value="SUPPLIER">Sundry Creditors (Supplier)</option>
                    </select>
                </div>

                {/* Opening Balance */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                        Opening Balance (₹)
                    </label>
                    <input
                        type="number"
                        name="openingBalance"
                        step="0.01"
                        value={formData.openingBalance}
                        onChange={onChange}
                        className="input-glass"
                    />
                </div>

                {/* Mailing Details Divider */}
                <div className="md:col-span-2 pt-3 mt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                        Mailing Details
                    </h3>
                </div>

                {/* Mobile */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                        Mobile Number
                    </label>
                    <input
                        type="text"
                        name="mobile"
                        value={formData.mobile}
                        onChange={onChange}
                        className="input-glass"
                        placeholder="+91..."
                    />
                </div>

                {/* GST */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                        GSTIN / UIN
                    </label>
                    <input
                        type="text"
                        name="gstNo"
                        value={formData.gstNo}
                        onChange={onChange}
                        className="input-glass uppercase"
                        placeholder="22AAAAA0000A1Z5"
                    />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                        Address
                    </label>
                    <textarea
                        name="address"
                        rows="3"
                        value={formData.address}
                        onChange={onChange}
                        className="input-glass resize-none"
                        placeholder="Full billing address..."
                    />
                </div>

            </div>

            {/* Footer Submit Button */}
            <div className="mt-7 flex justify-end pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center gap-2"
                >
                    <Save className="h-4 w-4" />
                    {loading ? 'Saving...' : 'Accept & Save'}
                </button>
            </div>
        </>
    );
};

export default LedgerFormFields;