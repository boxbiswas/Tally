// import React from 'react';
// import { useEffect } from 'react';

// export const useFormNavigation = () => {
//     useEffect(() => {
//         const handleKeyDown = (e) => {
//             // Only intercept Enter, ArrowDown, and ArrowUp
//             if (!['Enter', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;

//             // Do not intercept if user is interacting with a complex widget or multi-line text
//             if (document.activeElement.tagName === 'TEXTAREA') return;

//             // Get all focusable elements on the screen in DOM order
//             const focusableElements = Array.from(
//                 document.querySelectorAll(
//                     'input:not([disabled]), select:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
//                 )
//             );

//             const currentIndex = focusableElements.indexOf(document.activeElement);
//             if (currentIndex === -1) return; // Not currently focused on a form element

//             let nextIndex;

//             if (e.key === 'Enter' || e.key === 'ArrowDown') {
//                 // Prevent default form submission on Enter unless it's a submit button
//                 if (e.key === 'Enter' && document.activeElement.type !== 'submit') {
//                     e.preventDefault();
//                 } else if (e.key === 'ArrowDown' && document.activeElement.tagName === 'SELECT') {
//                     // Let native dropdowns use ArrowDown
//                     return;
//                 }

//                 nextIndex = currentIndex + 1;
//                 if (nextIndex < focusableElements.length) {
//                     focusableElements[nextIndex].focus();
//                     e.preventDefault();
//                 }
//             } else if (e.key === 'ArrowUp') {
//                 if (document.activeElement.tagName === 'SELECT') return; // Let native dropdowns use ArrowUp

//                 nextIndex = currentIndex - 1;
//                 if (nextIndex >= 0) {
//                     focusableElements[nextIndex].focus();
//                     e.preventDefault();
//                 }
//             }
//         };

//         window.addEventListener('keydown', handleKeyDown);
//         return () => window.removeEventListener('keydown', handleKeyDown);
//     }, []);
// };

import { useEffect } from 'react';

export const useFormNavigation = () => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Only intercept navigation keys for form fields
            if (!['Enter', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;

            // Do not intercept if user is interacting with text areas or specific UI widgets
            if (document.activeElement.tagName === 'TEXTAREA') return;

            // Get all focusable elements
            const focusableElements = Array.from(
                document.querySelectorAll(
                    'input:not([disabled]), select:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
                )
            );

            const currentIndex = focusableElements.indexOf(document.activeElement);
            if (currentIndex === -1) return;

            if (e.key === 'Enter' || e.key === 'ArrowDown') {
                // Prevent form submission on Enter, except for actual 'Submit' buttons
                if (e.key === 'Enter' && document.activeElement.type !== 'submit') {
                    e.preventDefault();
                }

                // Select next element
                const nextIndex = currentIndex + 1;
                if (nextIndex < focusableElements.length) {
                    focusableElements[nextIndex].focus();
                    e.preventDefault();
                }
            } else if (e.key === 'ArrowUp') {
                // Select previous element
                const prevIndex = currentIndex - 1;
                if (prevIndex >= 0) {
                    focusableElements[prevIndex].focus();
                    e.preventDefault();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
};