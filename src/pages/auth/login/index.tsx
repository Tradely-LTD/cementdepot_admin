import { useLogin } from './useLogin';
import { Card } from '@/components/ui/card';
import { Form, ControlledFormField } from '@/components/forms';
import * as yup from 'yup';
import { Mail, Lock } from 'lucide-react';

const loginSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

export function Login() {
  const { handleLogin, isLoading, error } = useLogin();

  const onSubmit = async (data: LoginFormData) => {
    await handleLogin(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">C</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            CementDepot
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to your admin account
          </p>
        </div>

        <Form
          schema={loginSchema}
          onSubmit={onSubmit}
          submitLabel="Sign In"
          isLoading={isLoading}
          className="space-y-4"
        >
          {() => (
            <>
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded">
                  {typeof error === 'string'
                    ? error
                    : 'An error occurred. Please try again.'}
                </div>
              )}

              <ControlledFormField
                name="email"
                label="Email Address"
                type="email"
                placeholder="admin@cementdepot.com"
                icon={Mail}
                disabled={isLoading}
              />

              <ControlledFormField
                name="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                disabled={isLoading}
              />
            </>
          )}
        </Form>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Admin access only</p>
        </div>
      </Card>
    </div>
  );
}
