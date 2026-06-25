import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useFormNavigation = () => {
    const location = useLocation();

    // 1. AUTO-FOCUS ON PAGE LOAD
    useEffect(() => {
        const timer = setTimeout(() => {
            const mainArea = document.querySelector('main');
            if (mainArea) {
                const firstFocusable = mainArea.querySelector('input:not([disabled]), select:not([disabled])');
                if (firstFocusable) firstFocusable.focus();
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [location.pathname]);

    // 2. ARROW KEY NAVIGATION
    useEffect(() => {
        const handleKeyDown = (e) => {
            const activeEl = document.activeElement;
            const isInput = activeEl.tagName === 'INPUT' && (activeEl.type === 'text' || activeEl.type === 'number');
            const isSelect = activeEl.tagName === 'SELECT';

            // Added ' ' (Spacebar) to the allowed list for dropdowns
            if (!['Enter', 'ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', ' '].includes(e.key)) return;
            if (activeEl.tagName === 'TEXTAREA') return;

            const mainArea = document.querySelector('main');
            if (!mainArea) return;

            const focusableElements = Array.from(
                mainArea.querySelectorAll('input:not([disabled]), select:not([disabled]), button:not([disabled])')
            ).filter(el => el.offsetWidth > 0 || el.offsetHeight > 0);

            const currentIndex = focusableElements.indexOf(activeEl);
            if (currentIndex === -1) return;

            let nextIndex = currentIndex;

            // --- DROPDOWN (SELECT) LOGIC ---
            if (isSelect) {
                // DO NOT intercept Up, Down, or Space. Let the browser open and navigate the list naturally!
                if (['ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
                    return;
                }
                // If the user hits Enter, confirm the selection and jump to the next field
                if (e.key === 'Enter') {
                    e.preventDefault();
                    nextIndex = currentIndex + 1;
                }
            }
            // --- TEXT INPUT / BUTTON LOGIC ---
            else {
                if (isInput && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
                    if (e.key === 'ArrowLeft' && activeEl.selectionStart > 0) return;
                    if (e.key === 'ArrowRight' && activeEl.selectionEnd < activeEl.value.length) return;
                }

                if (e.key === 'Enter' && activeEl.type !== 'submit') {
                    e.preventDefault();
                    nextIndex = currentIndex + 1;
                } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    nextIndex = currentIndex + 1;
                } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    nextIndex = currentIndex - 1;
                }
            }

            // --- APPLY FOCUS ---
            if (nextIndex !== currentIndex && nextIndex >= 0 && nextIndex < focusableElements.length) {
                const nextEl = focusableElements[nextIndex];
                nextEl.focus();

                if (nextEl.tagName === 'INPUT' && (nextEl.type === 'text' || nextEl.type === 'number')) {
                    setTimeout(() => nextEl.select(), 10);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
};