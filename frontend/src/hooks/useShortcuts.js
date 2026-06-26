import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';

export const useShortcuts = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = typeof e.key === 'string' ? e.key : '';
            if (!key) return;

            const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);
            const isFKeyOrEsc = key.startsWith('F') || key === 'Escape';

            if (isTyping && !isFKeyOrEsc && !e.ctrlKey && !e.altKey) return;

            // 1. GLOBAL FUNCTION KEYS
            if (key === 'F1') {
                e.preventDefault();
                navigate('/companies');
            }

            if (key === 'F8') {
                e.preventDefault();
                navigate('/vouchers/sales');
            }

            if (key === 'F9') {
                e.preventDefault();
                navigate('/vouchers/purchase');
            }

            if (key === 'Escape') {
                e.preventDefault();
                navigate(-1);
            }

            // 2. CTRL COMBINATIONS (only keys where e.preventDefault() actually works in browser)
            if (e.ctrlKey && !e.shiftKey && !e.altKey) {
                switch (key.toLowerCase()) {
                    case 'h':
                        e.preventDefault();
                        navigate('/dashboard');
                        break;

                    case 'i':
                        e.preventDefault();
                        navigate('/inventory');
                        break;

                    case 'b':
                        e.preventDefault();
                        // Navigate to Reports and tell it to automatically open the Sales tab
                        navigate('/reports', { state: { tab: 'sales' } });
                        break;

                    case 'p':
                        e.preventDefault();
                        // Instantly trigger the browser's native print dialog
                        window.print();
                        break;

                    default:
                        break;
                }
            }

            // 3. ALT COMBINATIONS
            if (e.altKey && !e.shiftKey && !e.ctrlKey) {
                const key = e.key.toLowerCase();
                const code = e.code; // Reliable detection for Number Pad and top-row numbers

                switch (key) {
                    case 'q':
                        e.preventDefault();
                        dispatch(logoutUser()).then(() => navigate('/login'));
                        break;

                    case 'c':
                        e.preventDefault();
                        navigate('/ledgers/create');
                        break; // New Customer

                    case 'n':
                        e.preventDefault();
                        navigate('/inventory/create');
                        break; // New Item

                    // Masters
                    case 'y':
                        e.preventDefault();
                        navigate('/ledgers');
                        break; // Ledger List

                    case 'l':
                        e.preventDefault();
                        navigate('/ledgers/create');
                        break; // Create Ledger

                    case 's':
                        e.preventDefault();
                        navigate('/inventory/create');
                        break; // Create Stock Item

                    case 'u':
                        e.preventDefault();
                        navigate('/ledgers/create');
                        break; // New Supplier

                    // Reports
                    case 'r':
                    case 'b':
                    case 'p':
                    case 't':
                    case 'x':
                        e.preventDefault();
                        navigate('/reports');
                        break;

                    default:
                        break;
                }

                // --- GLOBAL REPORT TAB NAVIGATION (Alt + 1 to 5) ---
                if (key === '1' || code === 'Digit1' || code === 'Numpad1') {
                    e.preventDefault(); navigate('/reports', { state: { tab: 'customers' } });
                }
                if (key === '2' || code === 'Digit2' || code === 'Numpad2') {
                    e.preventDefault(); navigate('/reports', { state: { tab: 'suppliers' } });
                }
                if (key === '3' || code === 'Digit3' || code === 'Numpad3') {
                    e.preventDefault(); navigate('/reports', { state: { tab: 'stock' } });
                }
                if (key === '4' || code === 'Digit4' || code === 'Numpad4') {
                    e.preventDefault(); navigate('/reports', { state: { tab: 'sales' } });
                }
                if (key === '5' || code === 'Digit5' || code === 'Numpad5') {
                    e.preventDefault(); navigate('/reports', { state: { tab: 'purchases' } });
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [navigate, dispatch]);
};
