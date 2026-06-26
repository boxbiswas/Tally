import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb() {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    // Don't show breadcrumbs on the dashboard itself to keep it clean
    if (location.pathname === '/dashboard') return null;

    return (
        <nav className="flex items-center text-sm mb-6">
            <Link
                to="/dashboard"
                className="flex items-center gap-1 transition-colors duration-150"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#93c5fd'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
                <Home className="h-3.5 w-3.5" />
            </Link>

            {pathnames.map((name, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;
                // Basic capitalization for breadcrumb labels
                const label = name.charAt(0).toUpperCase() + name.slice(1);

                return (
                    <React.Fragment key={name}>
                        <ChevronRight className="h-3.5 w-3.5 mx-1.5 shrink-0" style={{ color: 'var(--text-muted)' }} />
                        {isLast ? (
                            <span className="font-medium text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</span>
                        ) : (
                            <Link
                                to={routeTo}
                                className="text-sm transition-colors duration-150"
                                style={{ color: 'var(--text-muted)' }}
                                onMouseEnter={e => { e.currentTarget.style.color = '#93c5fd'; }}
                                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                            >
                                {label}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
}