import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface BottomSheetProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialDetent?: 'medium' | 'large';
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  id,
  isOpen,
  onClose,
  title,
  initialDetent = 'medium',
  children,
}) => {
  const [detent, setDetent] = useState<'medium' | 'large'>(initialDetent);
  const [dragY, setDragY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const isDragging = useRef(false);
  const startY = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setDetent(initialDetent);
    setDragY(0);
  }, [isOpen, initialDetent]);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted || typeof document === 'undefined') return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    if (diff > 0) {
      setDragY(diff);
    } else if (diff < -40 && detent === 'medium') {
      setDetent('large');
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (dragY > 100) {
      onClose();
    }
    setDragY(0);
  };

  const heightClass = detent === 'large' ? 'h-[90svh] max-h-[90svh] md:max-h-[85svh]' : 'h-[55svh] max-h-[70svh]';

  const sheetContent = (
    <div
      id={id}
      className="fixed inset-0 z-[1080] flex flex-col justify-end md:justify-center md:items-center p-0 md:p-4 pointer-events-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${id}-title`}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet / Form Sheet Modal Container */}
      <div
        className={`relative z-[1090] w-full max-w-2xl md:max-w-xl mx-auto bg-white/98 backdrop-blur-xl rounded-t-2xl md:rounded-2xl border border-b-0 md:border-b border-black/15 shadow-[0_-8px_32px_rgba(0,0,0,0.12)] md:shadow-xl flex flex-col transition-all duration-300 animate-in slide-in-from-bottom md:zoom-in-95 ease-out ${heightClass}`}
        style={{
          transform: `translateY(${dragY}px)`,
          paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))',
        }}
      >
        {/* Grabber Area (Mobile only) */}
        <div
          className="w-full h-8 flex md:hidden items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none shrink-0"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={() => setDetent(detent === 'medium' ? 'large' : 'medium')}
          aria-label="Alternar altura da gaveta"
        >
          <div className="w-9 h-1.5 bg-[#DFDBD2] rounded-full hover:bg-gray-400 transition-colors" />
        </div>

        {/* Sheet Topbar */}
        <div className="flex items-center justify-between px-4 pt-2 md:pt-4 pb-2 border-b border-[#DFDBD2] shrink-0">
          <h2 id={`${id}-title`} className="font-['Oswald'] text-lg md:text-xl font-bold text-[#0A0A0A] uppercase tracking-wide">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-[#F7F5F0] hover:bg-[#DFDBD2] text-[#0A0A0A] font-bold text-base cursor-pointer transition-colors active:scale-95"
            aria-label="Fechar gaveta"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3 touch-pan-y">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(sheetContent, document.body);
};
