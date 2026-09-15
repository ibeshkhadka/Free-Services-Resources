import React, { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'primary' | 'quiet' | 'danger';
};
export function Button({ variant = 'default', className = '', type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={`button button--${variant} ${className}`} {...props} />;
}
export function IconButton({ label, className = '', children, ...props }: ButtonProps & { label: string }) {
  return <Button variant="quiet" className={`icon-button ${className}`} aria-label={label} title={label} {...props}>{children}</Button>;
}
export function Field({ label, help, className = '', children }: {
  label: string; help?: string; className?: string; children: React.ReactElement<any>;
}) {
  const generatedId = useId();
  const id = children.props.id || generatedId;
  return <div className={`field ${className}`}>
    <label className="field-label" htmlFor={id}>{label}</label>
    {React.cloneElement(children, { id, className: `field-input ${children.props.className || ''}`, 'aria-describedby': help ? `${id}-help` : undefined })}
    {help && <p id={`${id}-help`} className="field-help">{help}</p>}
  </div>;
}
export function FilterChip({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return <span className="filter-chip"><span>{children}</span><IconButton label={`Remove ${children}`} onClick={onRemove}><X aria-hidden="true" /></IconButton></span>;
}
export function Modal({ isOpen, onClose, title, subtitle, children, footer, id, size = '', className = '', bodyClassName = '', bodyProps = {} }: {
  isOpen: boolean; onClose: () => void; title: React.ReactNode; subtitle?: string;
  children: React.ReactNode; footer?: React.ReactNode; id: string;
  size?: '' | 'small' | 'wide'; className?: string; bodyClassName?: string;
  bodyProps?: React.HTMLAttributes<HTMLDivElement>;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef(onClose);
  const pointerStartedOutside = useRef(false);
  closeRef.current = onClose;
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !isOpen) return;
    const trigger = document.activeElement as HTMLElement | null;
    if (!dialog.open) dialog.showModal();
    return () => {
      dialog.close();
      requestAnimationFrame(() => {
        if (document.querySelector('dialog[open]')) return;
        if (trigger?.isConnected) trigger.focus();
        else document.querySelector<HTMLInputElement>('#global-search-input')?.focus();
      });
    };
  }, [isOpen]);
  const outside = (event: React.PointerEvent<HTMLDialogElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  };
  return <dialog ref={ref} id={id} className={`modal ${size ? `modal--${size}` : ''} ${className}`}
    aria-labelledby={`${id}-title`} aria-describedby={subtitle ? `${id}-subtitle` : undefined}
    onKeyDown={event => {
      if (event.key !== 'Tab') return;
      const dialog = event.currentTarget as HTMLDialogElement;
      const controls = [...dialog.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])')]
        .filter(control => control.checkVisibility() && control.tabIndex >= 0);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (!first) { event.preventDefault(); return; }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === event.currentTarget)) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }}
    onCancel={event => { event.preventDefault(); closeRef.current(); }}
    onPointerDown={event => { pointerStartedOutside.current = outside(event); }}
    onPointerUp={event => { if (pointerStartedOutside.current && outside(event)) closeRef.current(); pointerStartedOutside.current = false; }}>
    {isOpen && <>
      <div className="modal-header">
        <div className="modal-heading"><h2 id={`${id}-title`}>{title}</h2>{subtitle && <p id={`${id}-subtitle`}>{subtitle}</p>}</div>
        <IconButton label="Close" id={id === 'resource-detail-modal' ? 'close-detail-modal-btn' : undefined} onClick={onClose}><X aria-hidden="true" /></IconButton>
      </div>
      <div className={`modal-body ${bodyClassName}`} {...bodyProps}>{children}</div>
      {footer && <div className="modal-footer">{footer}</div>}
    </>}
  </dialog>;
}
export function EmptyState({ icon, title, children, actions }: { icon: React.ReactNode; title: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return <div className="empty-state">{icon}<h3>{title}</h3><p>{children}</p>{actions && <div className="empty-actions">{actions}</div>}</div>;
}
