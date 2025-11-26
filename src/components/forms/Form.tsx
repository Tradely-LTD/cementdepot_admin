import * as React from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface FormProps<
  T extends Record<string, any> = Record<string, any>,
> {
  schema: yup.ObjectSchema<any>;
  defaultValues?: Partial<T>;
  onSubmit: (data: T) => void | Promise<void>;
  children: (methods: UseFormReturn<T>) => React.ReactNode;
  className?: string;
  submitLabel?: string;
  isLoading?: boolean;
  resetOnSubmit?: boolean;
}

function Form<T extends Record<string, any> = Record<string, any>>({
  schema,
  defaultValues,
  onSubmit,
  children,
  className,
  submitLabel = 'Submit',
  isLoading = false,
  resetOnSubmit = false,
}: FormProps<T>) {
  const methods = useForm<T>({
    resolver: yupResolver(schema),
    defaultValues: defaultValues as any,
    mode: 'onChange',
  });

  const handleSubmit = methods.handleSubmit(async data => {
    await onSubmit(data);
    if (resetOnSubmit) {
      methods.reset();
    }
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className={cn('space-y-3', className)}>
        {children(methods)}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => methods.reset()}
            disabled={isLoading}
          >
            Reset
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Submitting...' : submitLabel}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

export { Form };
export { useFormContext };
