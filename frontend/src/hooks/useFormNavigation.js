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
                const firstFocusable = mainArea.querySelector('input:not([disabled]), select:not([disabled]), textarea:not([disabled])');
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
            const key = typeof e.key === 'string' ? e.key : '';
            if (!key) return;

            const isInput = activeEl.tagName === 'INPUT' && (activeEl.type === 'text' || activeEl.type === 'number' || activeEl.type === 'date');
            const isSelect = activeEl.tagName === 'SELECT';
            const isTextarea = activeEl.tagName === 'TEXTAREA';
            const isButton = activeEl.tagName === 'BUTTON';

            if (!['Enter', 'ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', ' '].includes(key)) return;

            if ((isInput || isTextarea) && key === ' ') return;
            if (isButton && (key === 'Enter' || key === ' ')) return;

            const mainArea = document.querySelector('main');
            if (!mainArea) return;

            const focusableElements = Array.from(
                mainArea.querySelectorAll('input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])')
            ).filter(el => el.offsetWidth > 0 || el.offsetHeight > 0);

            const currentIndex = focusableElements.indexOf(activeEl);

            if (currentIndex === -1) {
                if (['Enter', 'ArrowDown', 'ArrowRight'].includes(key)) {
                    e.preventDefault();
                    if (focusableElements.length > 0) focusableElements[0].focus();
                }
                return;
            }

            let nextIndex = currentIndex;

            // --- TEXTAREA LOGIC (Now with Edge Escape!) ---
            if (isTextarea) {
                if (key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    nextIndex = currentIndex + 1; // Enter jumps to save
                } else if (key === 'ArrowUp' && activeEl.selectionStart === 0) {
                    e.preventDefault();
                    nextIndex = currentIndex - 1; // Escape Up!
                } else if (key === 'ArrowDown' && activeEl.selectionEnd === activeEl.value.length) {
                    e.preventDefault();
                    nextIndex = currentIndex + 1; // Escape Down!
                } else {
                    return; // Let user navigate text natively
                }
            }
            // --- DROPDOWN (SELECT) LOGIC ---
            else if (isSelect) {
                if (['ArrowUp', 'ArrowDown', ' '].includes(key)) return;

                if (key === 'Enter' || key === 'ArrowRight') {
                    e.preventDefault();
                    nextIndex = currentIndex + 1;
                } else if (key === 'ArrowLeft') {
                    e.preventDefault();
                    nextIndex = currentIndex - 1;
                }
            }
            // --- TEXT INPUT / BUTTON LOGIC ---
            else {
                if (isInput && (key === 'ArrowLeft' || key === 'ArrowRight')) {
                    if (activeEl.type !== 'date') {
                        if (key === 'ArrowLeft' && activeEl.selectionStart > 0) return;
                        if (key === 'ArrowRight' && activeEl.selectionEnd < activeEl.value.length) return;
                    }
                }

                if (key === 'Enter' && activeEl.type !== 'submit') {
                    e.preventDefault();
                    nextIndex = currentIndex + 1;
                } else if (key === 'ArrowDown' || key === 'ArrowRight') {
                    e.preventDefault();
                    nextIndex = currentIndex + 1;
                } else if (key === 'ArrowUp' || key === 'ArrowLeft') {
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