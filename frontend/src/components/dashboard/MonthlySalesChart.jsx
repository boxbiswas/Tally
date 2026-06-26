import React from 'react';


const MonthlySalesChart = ({ dynamicMonthlyData, validMaxChartValue }) => {
    return (
        <div className="lg:col-span-2 rounded-2xl p-6 flex flex-col" 
             style={{ 
                 background: 'rgba(255,255,255,0.04)', 
                 backdropFilter: 'blur(16px)', 
                 WebkitBackdropFilter: 'blur(16px)', 
                 border: '1px solid rgba(255,255,255,0.08)', 
                 boxShadow: '0 4px 24px rgba(0,0,0,0.3)' 
             }}>
            
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                        Monthly Sales vs Purchases
                    </h2>
                    <p className="text-xs mt-0.5 font-medium" style={{ color: 'var(--text-muted)' }}>
                        Revenue performance overview
                    </p>
                </div>
                <div className="flex gap-4 text-xs font-semibold">
                    <span className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                        <span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#10b981' }}></span> Sales
                    </span>
                    <span className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                        <span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#f59e0b' }}></span> Purchase
                    </span>
                </div>
            </div>
            
            {/* Chart Container */}
            <div className="flex-1 flex items-end justify-between gap-2 sm:gap-4 h-52 pb-2 relative">
                {/* Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-2">
                    {[0,1,2,3,4].map(i => (
                        <div key={i} className="w-full h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
                    ))}
                </div>

                {dynamicMonthlyData.map((dataPoint, idx) => (
                    <div key={idx} className="flex-1 flex flex-col justify-end items-center gap-1 h-full relative group">
                        {/* Hover Tooltip */}
                        <div className="absolute -top-14 left-1/2 -translate-x-1/2 text-xs p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-10 whitespace-nowrap"
                            style={{ 
                                background: 'rgba(15,20,40,0.95)', 
                                border: '1px solid rgba(255,255,255,0.1)', 
                                boxShadow: '0 8px 24px rgba(0,0,0,0.5)', 
                                color: 'var(--text-secondary)' 
                            }}>
                            <p style={{ color: '#34d399' }}>Sales: ₹{dataPoint.sales.toLocaleString('en-IN')}</p>
                            <p style={{ color: '#fbbf24' }}>Purch: ₹{dataPoint.purchase.toLocaleString('en-IN')}</p>
                        </div>
                        
                        <div className="w-full flex justify-center items-end gap-1 h-full pt-10">
                            {/* Sales Bar */}
                            <div 
                                className="w-1/2 rounded-t-md transition-all duration-500 hover:opacity-90" 
                                style={{ 
                                    height: `${(dataPoint.sales / validMaxChartValue) * 100}%`, 
                                    minHeight: dataPoint.sales > 0 ? '4px' : '0px',
                                    background: 'linear-gradient(to top, #059669, #10b981)',
                                    boxShadow: '0 -2px 12px rgba(16,185,129,0.3)',
                                }}
                            />
                            {/* Purchase Bar */}
                            <div 
                                className="w-1/2 rounded-t-md transition-all duration-500 hover:opacity-90" 
                                style={{ 
                                    height: `${(dataPoint.purchase / validMaxChartValue) * 100}%`, 
                                    minHeight: dataPoint.purchase > 0 ? '4px' : '0px',
                                    background: 'linear-gradient(to top, #d97706, #f59e0b)',
                                    boxShadow: '0 -2px 12px rgba(245,158,11,0.3)',
                                }}
                            />
                        </div>
                        <span className="text-[10px] font-semibold mt-1" style={{ color: 'var(--text-muted)' }}>
                            {dataPoint.month}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MonthlySalesChart;