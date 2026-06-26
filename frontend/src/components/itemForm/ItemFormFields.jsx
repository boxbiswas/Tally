import React from 'react';
import { Save } from 'lucide-react';

const ItemFormFields = ({ formData, isEdit, onChange, loading }) => {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* General Details */}
                <div className="space-y-5">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest pb-2.5" 
                        style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                        General Details
                    </h3>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                            Item Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={onChange}
                            className="input-glass"
                            placeholder="e.g. Wireless Mouse"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                                SKU Code *
                            </label>
                            <input
                                type="text"
                                name="sku"
                                required
                                value={formData.sku}
                                onChange={onChange}
                                className="input-glass uppercase font-mono"
                                placeholder="MOU-001"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                                Unit of Measure *
                            </label>
                            <select
                                name="unit"
                                value={formData.unit}
                                onChange={onChange}
                                className="select-glass uppercase"
                            >
                                <option value="PCS">Pieces (PCS)</option>
                                <option value="KG">Kilograms (KG)</option>
                                <option value="BOX">Boxes (BOX)</option>
                                <option value="LTR">Liters (LTR)</option>
                                <option value="PACK">Packs (PACK)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                            GST Percentage (%)
                        </label>
                        <select
                            name="gstRate"
                            value={formData.gstRate}
                            onChange={onChange}
                            className="select-glass"
                        >
                            <option value={0}>0% - Exempt</option>
                            <option value={5}>5%</option>
                            <option value={12}>12%</option>
                            <option value={18}>18%</option>
                            <option value={28}>28%</option>
                        </select>
                    </div>
                </div>

                {/* Pricing & Inventory */}
                <div className="space-y-5">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest pb-2.5" 
                        style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                        Pricing &amp; Inventory
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                                Purchase Rate (₹)
                            </label>
                            <input
                                type="number"
                                name="purchasePrice"
                                step="0.01"
                                min="0"
                                value={formData.purchasePrice}
                                onChange={onChange}
                                className="input-glass"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                                Selling Rate (₹)
                            </label>
                            <input
                                type="number"
                                name="sellingPrice"
                                step="0.01"
                                min="0"
                                value={formData.sellingPrice}
                                onChange={onChange}
                                className="input-glass"
                            />
                        </div>
                    </div>

                    {/* Opening Balance */}
                    <div className="p-4 rounded-xl mt-2" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#a5b4fc' }}>
                            Opening Balance (Quantity)
                        </label>
                        <p className="text-xs mb-3 font-medium" style={{ color: 'var(--text-muted)' }}>
                            Set this only if you already have stock on hand.
                        </p>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                name="openingQty"
                                step="0.01"
                                min="0"
                                disabled={isEdit}
                                value={formData.openingQty}
                                onChange={onChange}
                                className={`input-glass flex-1 ${isEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
                                style={isEdit ? { background: 'rgba(255,255,255,0.02)' } : {}}
                            />
                            <span className="text-xs font-bold uppercase px-3 py-2.5 rounded-lg shrink-0"
                                style={{ color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                {formData.unit}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
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

export default ItemFormFields;