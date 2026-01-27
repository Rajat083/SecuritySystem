import React from 'react';
import { cn } from '../../utils/cn';
import { X } from 'lucide-react';
import { Button } from './Button';

/**
 * Modal component with overlay
 */
export const Modal = ({ isOpen, onClose, children, className }) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div
        className={cn(
          'relative z-50 w-full max-w-lg rounded-lg bg-card shadow-lg animate-fade-in',
          'mx-4 p-4 sm:p-6',
          'max-h-[90vh] overflow-y-auto',
          className
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        {children}
      </div>
    </div>
  );
};

export const ModalHeader = ({ children, className }) => (
  <div className={cn('mb-4', className)}>{children}</div>
);

export const ModalTitle = ({ children, className }) => (
  <h2 className={cn('text-2xl font-semibold', className)}>{children}</h2>
);

export const ModalContent = ({ children, className }) => (
  <div className={cn('mb-4', className)}>{children}</div>
);

export const ModalFooter = ({ children, className }) => (
  <div className={cn('flex justify-end gap-2', className)}>{children}</div>
);
