import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useFormNavigation = () => {
    const location = useLocation();

    // 1. SMART AUTO-FOCUS ON PAGE LOAD 
    useEffect(() => {
        let attempts = 0;
        let timeoutId;

        const attemptFocus = () => {
            const mainArea = document.querySelector('main');
            if (mainArea) {
                const firstFocusable = mainArea.querySelector('input:not([disabled]), select:not([disabled])');
                if (firstFocusable && firstFocusable.offsetWidth > 0) {
                    firstFocusable.focus();
                    return; 
                }
            }
            
            attempts++;
            if (attempts < 40) { 
                timeoutId = setTimeout(attemptFocus, 50);
            }
        };

        attemptFocus();

        return () => clearTimeout(timeoutId);
    }, [location.pathname]);

    // 2. ARROW KEY NAVIGATION
    useEffect(() => {
        const handleKeyDown = (e) => {
            const activeEl = document.activeElement;
            const isInput = activeEl.tagName === 'INPUT' && (activeEl.type === 'text' || activeEl.type === 'number' || activeEl.type === 'date');
            const isSelect = activeEl.tagName === 'SELECT';

            if (!['Enter', 'ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', ' '].includes(e.key)) return;
            if (activeEl.tagName === 'TEXTAREA') return;

            const mainArea = document.querySelector('main');
            if (!mainArea) return;

            const focusableElements = Array.from(
                mainArea.querySelectorAll('input:not([disabled]), select:not([disabled]), button:not([disabled])')
            ).filter(el => el.offsetWidth > 0 || el.offsetHeight > 0);

            const currentIndex = focusableElements.indexOf(activeEl);

            if (currentIndex === -1) {
                if (['Enter', 'ArrowDown', 'ArrowRight'].includes(e.key)) {
                    e.preventDefault();
                    if (focusableElements.length > 0) {
                        focusableElements[0].focus();
                    }
                }
                return; 
            }

            let nextIndex = currentIndex;

            // --- DROPDOWN (SELECT) LOGIC ---
            if (isSelect) {
                // Let browser naturally handle Up, Down, and Space to change items in the list
                if (['ArrowUp', 'ArrowDown', ' '].includes(e.key)) return;
                
                // FIX: Allow Left and Right arrows to safely escape the dropdown!
                if (e.key === 'Enter' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    nextIndex = currentIndex + 1;
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    nextIndex = currentIndex - 1;
                }
            } 
            // --- TEXT INPUT / BUTTON LOGIC ---
            else {
                if (isInput && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
                    // Bypass selection check for date inputs to prevent getting stuck
                    if (activeEl.type !== 'date') {
                        if (e.key === 'ArrowLeft' && activeEl.selectionStart > 0) return;
                        if (e.key === 'ArrowRight' && activeEl.selectionEnd < activeEl.value.length) return;
                    }
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