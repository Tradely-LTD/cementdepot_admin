import * as React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import type { FieldPath } from 'react-hook-form';
import { FormField } from './FormField';
import type { FormFieldProps } from './FormField';

export interface ControlledFormFieldProps<
  T extends Record<string, any> = Record<string, any>,
> extends Omit<FormFieldProps, 'error'> {
  name: FieldPath<T>;
  icon?: React.ComponentType<{ className?: string }>;
}

function ControlledFormField<
  T extends Record<string, any> = Record<string, any>,
>({ name, icon, ...props }: ControlledFormFieldProps<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const error = errors[name]?.message as string | undefined;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormField
          {...props}
          {...field}
          icon={icon}
          error={error}
          value={props.type === 'checkbox' ? field.value : (field.value ?? '')}
          checked={props.type === 'checkbox' ? field.value : undefined}
        />
      )}
    />
  );
}

export { ControlledFormField };
