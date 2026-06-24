import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb() {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    // Don't show breadcrumbs on the dashboard itself to keep it clean
    if (location.pathname === '/dashboard') return null;

    return (
        <nav className="flex items-center text-sm text-slate-500 mb-6">
            <Link to="/dashboard" className="hover:text-blue-600 flex items-center gap-1">
                <Home className="h-4 w-4" />
            </Link>

            {pathnames.map((name, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;
                // Basic capitalization for breadcrumb labels
                const label = name.charAt(0).toUpperCase() + name.slice(1);

                return (
                    <React.Fragment key={name}>
                        <ChevronRight className="h-4 w-4 mx-2 shrink-0" />
                        {isLast ? (
                            <span className="font-medium text-slate-800">{label}</span>
                        ) : (
                            <Link to={routeTo} className="hover:text-blue-600">
                                {label}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
}