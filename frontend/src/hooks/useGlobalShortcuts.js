import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useGlobalShortcuts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleGlobalKeys = (e) => {
      // F-Key Navigation [cite: 277, 295, 296]
      if (e.key === 'F1') { e.preventDefault(); navigate('/companies'); }
      if (e.key === 'F8') { e.preventDefault(); navigate('/vouchers/sales'); }
      if (e.key === 'F9') { e.preventDefault(); navigate('/vouchers/purchase'); }
      
      // Ctrl Shortcuts [cite: 283, 284, 302, 310]
      if (e.ctrlKey) {
        if (e.key === 'h') { e.preventDefault(); navigate('/dashboard'); }
        if (e.key === 'i') { e.preventDefault(); navigate('/inventory'); }
        if (e.key === 'b') { e.preventDefault(); navigate('/vouchers/sales'); }
      }
    };

    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, [navigate]);
};