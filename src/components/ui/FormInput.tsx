import React from 'react';
import { cn } from '@/src/lib/utils';

interface FormInputProps {
  label: string;
  error?: string;
  textarea?: boolean;
  rows?: number;
  id?: string;
  name?: string;
  type?: string;
  required?: boolean;
  value?: string | number | readonly string[];
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  className?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, FormInputProps>(
  ({ label, error, className, textarea, rows, id: propId, name, type, required, value, onChange }, ref) => {
    const id = propId || name;

    return (
      <div className="space-y-1.5">
        <label htmlFor={id} className="block text-sm font-bold text-slate-200 mb-1.5 pl-1">
          {label}
        </label>
        {textarea ? (
          <textarea
            id={id}
            name={name}
            required={required}
            value={value}
            onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
            rows={rows}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={cn(
              "w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 glass-input outline-none",
              "focus:ring-2 focus:ring-primary-500/30",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-red-500/50 focus:ring-red-500/30",
              className
            )}
          />
        ) : (
          <input
            id={id}
            name={name}
            type={type}
            required={required}
            value={value}
            onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
            ref={ref as React.Ref<HTMLInputElement>}
            className={cn(
              "w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 glass-input outline-none",
              "focus:ring-2 focus:ring-primary-500/30",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-red-500/50 focus:ring-red-500/30",
              className
            )}
          />
        )}
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
