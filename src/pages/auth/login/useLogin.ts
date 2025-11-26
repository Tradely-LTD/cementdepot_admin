import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  usePostApiV1AuthLoginMutation,
  type PostApiV1AuthLoginApiArg,
} from '@/store/coreApiWithTags';
import { useDispatch } from 'react-redux';
import { setLoginResponse, type LoginResponse } from '@/pages/admin/auth-slice';

const ALLOWED_ROLES = ['seller', 'admin'];

export const useLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading, error }] = usePostApiV1AuthLoginMutation();
  const [formError, setFormError] = useState<string | null>(null);

  const handleLogin = async (credentials: PostApiV1AuthLoginApiArg['body']) => {
    try {
      setFormError(null);
      const response = (await login({
        body: credentials,
      }).unwrap()) as LoginResponse;
      const role = response?.data?.user?.role;

      if (!role || !ALLOWED_ROLES.includes(role)) {
        const errorMessage =
          'Only seller and admin roles can access this portal.';
        setFormError(errorMessage);
        toast.error(errorMessage);
        return;
      }

      dispatch(setLoginResponse(response));
      toast.success('Login successful');
      navigate('/');
    } catch (err: any) {
      console.error('Login failed:', err);
      const errorMessage =
        err?.data?.message || 'Login failed. Please check your credentials.';
      setFormError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return {
    handleLogin,
    isLoading,
    error: formError || error,
  };
};
