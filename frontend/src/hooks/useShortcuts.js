// INDRASISH BISWAS, 24E102B91
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// 1. Import the logoutUser thunk from your auth slice
// (Make sure this path matches where your authSlice.js is located!)
import { logoutUser } from '../redux/slices/authSlice';

export const useShortcuts = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const handleKeyDown = (e) => {
            // 1. GLOBAL FUNCTION KEYS
            if (e.key === 'F1') {
                e.preventDefault();
                navigate('/companies'); // Company Selection
            }
            if (e.key === 'F8') {
                e.preventDefault();
                navigate('/vouchers/sales'); // Sales Voucher
            }
            if (e.key === 'F9') {
                e.preventDefault();
                navigate('/vouchers/purchase'); // Purchase Voucher
            }

            // 2. ESCAPE KEY
            if (e.key === 'Escape') {
                e.preventDefault();
                navigate(-1); // Previous Screen
            }

            // 3. CTRL COMBINATIONS
            if (e.ctrlKey && !e.shiftKey && !e.altKey) {
                switch (e.key.toLowerCase()) {
                    case 'q':
                        e.preventDefault();
                        // 2. Dispatch the logout action and wait for it to finish before navigating
                        dispatch(logoutUser()).then(() => {
                            navigate('/login');
                        });
                        break;
                    case 'h':
                        e.preventDefault();
                        navigate('/dashboard'); // Home
                        break;
                    case 'i':
                        e.preventDefault();
                        navigate('/inventory'); // Inventory Dashboard
                        break;
                    case 'b':
                        e.preventDefault();
                        navigate('/vouchers/sales'); // New Invoice
                        break;
                }
            }

            // 4. ALT COMBINATIONS
            if (e.altKey && !e.shiftKey && !e.ctrlKey) {
                switch (e.key.toLowerCase()) {
                    case 'l':
                        e.preventDefault();
                        navigate('/ledgers/create'); // Create Ledger
                        break;
                    case 's':
                        e.preventDefault();
                        navigate('/inventory/create'); // Create Stock Item
                        break;
                    case 'r':
                        e.preventDefault();
                        navigate('/reports'); // Stock Summary / Reports
                        break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Cleanup the event listener on unmount
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navigate, dispatch]);
};