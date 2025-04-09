import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

export interface ToastProps {
  open?: boolean;
  variant?: ToastVariant;
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

export interface ToastActionElement {
  altText?: string;
  action: React.ReactNode;
}

export const Toast: React.FC<{
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  open: boolean;
  variant?: ToastVariant;
  onOpenChange?: (open: boolean) => void;
  onDismiss: () => void;
}> = ({ title, description, action, open, variant = "default", onDismiss }) => {
  React.useEffect(() => {
    return () => {};
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed bottom-4 right-4 max-w-sm rounded-lg shadow-lg p-4 ${
            variant === "success"
              ? "bg-green-100 text-green-800"
              : variant === "error"
              ? "bg-red-100 text-red-800"
              : variant === "warning"
              ? "bg-yellow-100 text-yellow-800"
              : variant === "info"
              ? "bg-blue-100 text-blue-800"
              : "bg-white text-gray-800"
          }`}
          role="alert"
        >
          <div className="flex justify-between">
            <div>
              {title && <div className="font-medium">{title}</div>}
              {description && <div className="text-sm">{description}</div>}
            </div>
            <div className="flex items-start ml-2">
              {action && <div className="mr-2">{action.action}</div>}
              <button
                onClick={onDismiss}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const Toaster: React.FC<{ toasts: any[] }> = ({ toasts }) => {
  return (
    <div className="fixed bottom-0 right-0 p-4 flex flex-col items-end space-y-2 z-50">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          title={toast.title}
          description={toast.description}
          action={toast.action}
          open={toast.open}
          variant={toast.variant}
          onOpenChange={toast.onOpenChange}
          onDismiss={() => toast.onOpenChange?.(false)}
        />
      ))}
    </div>
  );
};
