import React from 'react';
import { Edit, Trash2, ArrowRight } from 'lucide-react';

const CompanyCard = ({
    company,
    isSelected,
    focusedAction,
    onSelect,
    onEdit,
    onDelete
}) => {
    return (
        <div
            onClick={() => onSelect(company.id)}
            className={`
                p-6 rounded-3xl backdrop-blur-2xl transition-all duration-300 flex justify-between items-center group border cursor-pointer
                ${isSelected
                    ? 'border-white/30 bg-white/10 shadow-2xl shadow-black/60 scale-[1.01]'
                    : 'border-white/8 bg-white/5 hover:border-white/20 hover:bg-white/8'
                }
            `}
        >
            <div>
                <h3 className={`text-lg font-semibold tracking-wide transition-colors ${isSelected ? 'text-white' : 'text-neutral-200 group-hover:text-white'}`}>
                    {company.name}
                </h3>
                <div className="text-sm text-neutral-500 flex gap-6 mt-1.5 font-medium">
                    <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                        FY: {company.financialYear}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                        GST: {company.gstNo || 'N/A'}
                    </span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex items-center gap-2 transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                {/* Edit */}
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(company.id); }}
                    className={`p-3 rounded-2xl transition-all ${isSelected && focusedAction === 1
                        ? 'bg-blue-500/30 text-blue-400 ring-2 ring-blue-400'
                        : 'text-neutral-400 hover:text-white hover:bg-white/10'
                        }`}
                >
                    <Edit className="h-4 w-4" />
                </button>

                {/* Delete */}
                <button
                    onClick={(e) => onDelete(company.id, e)}
                    className={`p-3 rounded-2xl transition-all ${isSelected && focusedAction === 2
                        ? 'bg-red-500/30 text-red-400 ring-2 ring-red-400'
                        : 'text-red-400/80 hover:text-red-400 hover:bg-red-500/20'
                        }`}
                >
                    <Trash2 className="h-4 w-4" />
                </button>

                {/* Select */}
                <div className={`p-3 rounded-2xl ml-2 transition-all ${isSelected && focusedAction === 0
                    ? 'bg-indigo-500/30 text-indigo-400 ring-2 ring-indigo-400'
                    : isSelected
                        ? 'bg-white/10 text-white'
                        : 'text-neutral-500 bg-white/5'
                    }`}>
                    <ArrowRight className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
};

export default CompanyCard;