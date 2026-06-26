import React from 'react';
import { Users, Truck, Package, ShoppingCart } from 'lucide-react';

/**
 * Sidebar Tabs Navigation with Dynamic Icons
 */
const ReportTabs = ({ tabs, activeTab, onTabChange }) => {
    const getIcon = (iconName) => {
        const iconMap = {
            Users: Users,
            Truck: Truck,
            Package: Package,
            ShoppingCart: ShoppingCart,
        };
        return iconMap[iconName] || Users;
    };

    return (
        <div className="w-full md:w-56 print:hidden overflow-y-auto"
            style={{ borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.1)' }}>

            <nav className="p-3 space-y-0.5">
                {tabs.map((tab, index) => {
                    const isActive = activeTab === tab.id;
                    const IconComponent = getIcon(tab.icon);

                    return (
                        <div
                            key={tab.id}
                            role="button"
                            tabIndex={-1}
                            onClick={() => onTabChange(tab.id)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left cursor-pointer"
                            style={{
                                background: isActive ? 'linear-gradient(135deg,rgba(59,130,246,0.15),rgba(99,102,241,0.1))' : 'transparent',
                                border: isActive ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
                                color: isActive ? '#e0e7ff' : 'var(--text-secondary)',
                            }}
                            onMouseEnter={e => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                                    e.currentTarget.style.color = 'var(--text-primary)';
                                }
                            }}
                            onMouseLeave={e => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                }
                            }}
                        >
                            <IconComponent
                                className="h-4 w-4 shrink-0"
                                style={{ color: isActive ? '#93c5fd' : 'var(--text-muted)' }}
                            />
                            <span className="flex-1 text-xs">{tab.label}</span>
                            <kbd className={isActive ? 'kbd-dark kbd-active' : 'kbd-dark'}>
                                Alt+{index + 1}
                            </kbd>
                        </div>
                    );
                })}
            </nav>
        </div>
    );
};

export default ReportTabs;