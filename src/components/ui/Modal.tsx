import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  id?: string;
  isOpen: boolean;
  onClose: () => void;
  /** Accessible name for the dialog */
  ariaLabel: string;
  /** Tailwind max-width class for the panel */
  maxWidth?: string;
  children: React.ReactNode;
}

/**
 * Shared modal scaffolding: backdrop, centered panel, Escape-to-close,
 * focus capture/restore, Tab trap, body scroll lock. All four sheets
 * in the app previously re-implemented this by hand.
 */
export const Modal: React.FC<ModalProps> = ({
  id,
  isOpen,
  onClose,
  ariaLabel,
  maxWidth = 'max-w-2xl',
  children,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    previouslyFocused.current = document.activeElement as HTMLElement;
    panelRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-ink/50 transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
        className={`relative w-full ${maxWidth} bg-raised border border-hairline shadow-overlay rounded-t-2xl sm:rounded-xl my-0 sm:my-auto z-10 max-h-[92vh] flex flex-col transition-transform duration-200 ease-out`}
      >
        {children}
      </div>
    </div>
  );
};

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  closeLabel?: string;
  children?: React.ReactNode;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose, closeLabel = 'Close', children }) => (
  <div className="flex items-center justify-between gap-4 p-5 border-b border-hairline">
    <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
    {children}
    <button
      onClick={onClose}
      aria-label={closeLabel}
      className="p-1.5 rounded-md text-ink-3 hover:text-ink hover:bg-surface transition-colors duration-150"
    >
      <X className="w-5 h-5" />
    </button>
  </div>
);
