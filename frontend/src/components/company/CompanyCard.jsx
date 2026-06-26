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
                p-6 rounded-2xl backdrop-blur-xl transition-all duration-300 flex justify-between items-center group border cursor-pointer
                ${isSelected
                    ? 'border-white/30 bg-white/10 transform scale-[1.01] shadow-[0_8px_32px_0_rgba(255,255,255,0.05)]'
                    : 'border-white/8 bg-white/3 hover:border-white/20 hover:bg-white/6'
                }
            `}
        >
            <div>
                <h3 className={`text-lg font-semibold tracking-wide transition-colors ${isSelected ? 'text-white' : 'text-neutral-200 group-hover:text-white'}`}>
                    {company.name}
                </h3>
                <div className="text-sm text-neutral-500 flex gap-6 mt-1.5 font-medium">
                    <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/50"></span>
                        FY: {company.financialYear}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400/50"></span>
                        GST: {company.gstNo || 'N/A'}
                    </span>
                </div>
            </div>

            {/* Action Buttons Container */}
            <div className={`flex items-center gap-2 transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>

                {/* Edit Button */}
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(company.id); }}
                    className={`p-2.5 rounded-xl transition-all ${isSelected && focusedAction === 1
                            ? 'bg-blue-500/20 text-blue-400 ring-2 ring-blue-400'
                            : 'text-neutral-400 hover:text-white hover:bg-white/10'
                        }`}
                >
                    <Edit className="h-4 w-4" />
                </button>

                {/* Delete Button */}
                <button
                    onClick={(e) => onDelete(company.id, e)}
                    className={`p-2.5 rounded-xl transition-all ${isSelected && focusedAction === 2
                            ? 'bg-red-500/20 text-red-400 ring-2 ring-red-400'
                            : 'text-red-400/80 hover:text-red-400 hover:bg-red-500/20'
                        }`}
                >
                    <Trash2 className="h-4 w-4" />
                </button>

                {/* Select Icon */}
                <div className={`p-2.5 rounded-xl ml-2 transition-all ${isSelected && focusedAction === 0
                        ? 'bg-indigo-500/20 text-indigo-400 ring-2 ring-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                        : (isSelected ? 'text-white bg-white/10' : 'text-neutral-500 bg-white/5')
                    }`}>
                    <ArrowRight className="h-5 w-5" />
                </div>

            </div>
        </div>
    );
};

export default CompanyCard;