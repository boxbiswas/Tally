import React from 'react';

const SalesVoucherFormHeader = ({ formData, customers, onChange }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Customer *</label>
                <select
                    required
                    className="select-glass"
                    value={formData.customerId}
                    onChange={onChange}
                    name="customerId"
                >
                    <option value="">-- Select Customer --</option>
                    {customers.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Voucher No.</label>
                <input
                    type="text"
                    className="input-glass"
                    value={formData.voucherNo}
                    onChange={onChange}
                    name="voucherNo"
                />
            </div>

            <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Date</label>
                <input
                    type="date"
                    className="input-glass"
                    value={formData.date}
                    onChange={onChange}
                    name="date"
                />
            </div>
        </div>
    );
};

export default SalesVoucherFormHeader;