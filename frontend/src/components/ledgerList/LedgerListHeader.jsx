import React from 'react';
import { Plus, Search, Users } from 'lucide-react';

/**
 * LedgerList Header
 */
const LedgerListHeader = ({ searchQuery, onSearchChange, onCreate }) => {
    return (
        <div className="px-5 py-4 flex items-center justify-between gap-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>

            {/* Title Area */}
            <h2 className="text-lg font-bold flex items-center gap-2.5 shrink-0"
                style={{ color: 'var(--text-primary)' }}>
                <div className="h-8 w-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}>
                    <Users className="h-4 w-4 text-blue-400" />
                </div>
                Ledgers Master
            </h2>

            {/* Search and Action Buttons */}
            <div className="flex items-center gap-3">
                <div className="relative w-52">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none z-10"
                        style={{ color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search ledgers..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="input-search"
                    />
                </div>

                <button
                    onClick={onCreate}
                    className="btn-primary text-sm shrink-0"
                >
                    <Plus className="h-4 w-4" /> Create Ledger (Alt+L)
                </button>
            </div>
        </div>
    );
};

export default LedgerListHeader;