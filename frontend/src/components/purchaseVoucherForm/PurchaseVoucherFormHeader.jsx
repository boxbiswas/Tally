import React from 'react';

const PurchaseVoucherFormHeader = ({ formData, suppliers, onChange }) => {
    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                    Supplier Account *
                </label>
                <select
                    required
                    value={formData.supplierId}
                    onChange={onChange}
                    name="supplierId"
                    className="select-glass"
                >
                    <option value="">-- Select Supplier --</option>
                    {suppliers.map(sup => (
                        <option key={sup.id} value={sup.id}>{sup.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                    Voucher Number *
                </label>
                <input
                    type="text"
                    required
                    value={formData.voucherNo}
                    onChange={onChange}
                    name="voucherNo"
                    className="input-glass font-mono uppercase"
                />
            </div>

            <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                    Date *
                </label>
                <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={onChange}
                    name="date"
                    className="input-glass"
                />
            </div>
        </div>
    );
};

export default PurchaseVoucherFormHeader;