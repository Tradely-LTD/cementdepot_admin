import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export interface FormFieldProps extends React.ComponentProps<'input'> {
  label?: string;
  error?: string;
  icon?: React.ComponentType<{ className?: string }>;
  textarea?: boolean;
  helperText?: string;
}

const FormField = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FormFieldProps
>(
  (
    {
      label,
      error,
      icon: Icon,
      textarea = false,
      helperText,
      className,
      id,
      type,
      ...props
    },
    ref
  ) => {
    const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const isCheckbox = type === 'checkbox';

    const inputClasses = cn(
      hasError && !isCheckbox && 'border-red-500 focus-visible:ring-red-500',
      Icon && !isCheckbox && 'pl-10',
      className
    );

    if (isCheckbox) {
      return (
        <div className="space-y-1.5">
          <label
            htmlFor={fieldId}
            className={cn(
              'flex items-center space-x-2 cursor-pointer',
              hasError
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-700 dark:text-gray-300'
            )}
          >
            <input
              id={fieldId}
              type="checkbox"
              ref={ref as React.ForwardedRef<HTMLInputElement>}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              {...(props as React.ComponentProps<'input'>)}
            />
            <span className="text-sm font-medium">{label}</span>
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <span>⚠</span>
              {error}
            </p>
          )}

          {helperText && !error && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {helperText}
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={fieldId}
            className={cn(
              'block text-sm font-medium',
              hasError
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-700 dark:text-gray-300'
            )}
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <Icon className="h-4 w-4" />
            </div>
          )}
          {textarea ? (
            <Textarea
              id={fieldId}
              ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
              className={inputClasses}
              {...(props as React.ComponentProps<'textarea'>)}
            />
          ) : (
            <Input
              id={fieldId}
              type={type}
              ref={ref as React.ForwardedRef<HTMLInputElement>}
              className={inputClasses}
              {...props}
            />
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
            <span>⚠</span>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export { FormField };
