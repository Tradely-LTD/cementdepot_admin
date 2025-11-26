import * as React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import type { FieldPath } from 'react-hook-form';
import Select from 'react-select';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

export interface ControlledSelectFieldProps<
  T extends Record<string, any> = Record<string, any>,
> {
  name: FieldPath<T>;
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  isClearable?: boolean;
  isRequired?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  helperText?: string;
  className?: string;
  disabled?: boolean;
}

function ControlledSelectField<
  T extends Record<string, any> = Record<string, any>,
>({
  name,
  label,
  options,
  placeholder = 'Select...',
  isClearable = false,
  isRequired = false,
  icon: Icon,
  helperText,
  className,
  disabled = false,
}: ControlledSelectFieldProps<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const error = errors[name]?.message as string | undefined;
  const hasError = !!error;

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label
          className={cn(
            'block text-sm font-medium',
            hasError
              ? 'text-red-600 dark:text-red-400'
              : 'text-gray-700 dark:text-gray-300'
          )}
        >
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <div className="relative">
            {Icon && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-gray-400 dark:text-gray-500">
                <Icon className="h-4 w-4" />
              </div>
            )}
            <Select
              value={options.find(opt => opt.value === field.value) || null}
              onChange={option => field.onChange(option?.value || '')}
              options={options}
              placeholder={placeholder}
              isClearable={isClearable}
              isDisabled={disabled}
              className="react-select-container"
              classNamePrefix="react-select"
              styles={{
                control: (base, state) => ({
                  ...base,
                  backgroundColor: disabled
                    ? 'var(--select-bg)'
                    : 'var(--select-bg)',
                  opacity: disabled ? 0.6 : 1,
                  cursor: disabled ? 'not-allowed' : 'default',
                  borderColor: hasError
                    ? '#ef4444'
                    : state.isFocused
                      ? '#3b82f6'
                      : 'var(--select-border)',
                  paddingLeft: Icon ? '2.5rem' : '0.75rem',
                  '&:hover': {
                    borderColor: disabled
                      ? 'var(--select-border)'
                      : hasError
                        ? '#ef4444'
                        : '#3b82f6',
                  },
                }),
                menu: base => ({
                  ...base,
                  backgroundColor: 'var(--select-bg)',
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused
                    ? '#3b82f6'
                    : state.isSelected
                      ? '#2563eb'
                      : 'transparent',
                  color:
                    state.isFocused || state.isSelected
                      ? 'white'
                      : 'var(--select-text)',
                }),
                singleValue: base => ({
                  ...base,
                  color: 'var(--select-text)',
                }),
              }}
            />
          </div>
        )}
      />

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <span>⚠</span>
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
}

export { ControlledSelectField };
