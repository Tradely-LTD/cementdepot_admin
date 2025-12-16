import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import {
  useCreateUserMutation,
  useGetApiV1UsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from '@/store/coreApiWithTags';

interface UserFilters {
  search?: string;
  role?: 'admin' | 'seller' | 'buyer';
  isActive?: boolean;
}

export function useUsers() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<UserFilters>({});

  // RTK Query hooks
  const {
    data: users,
    isLoading,
    refetch,
  } = useGetApiV1UsersQuery({
    page,
    limit: 20,
    ...filters,
  });

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const updateFilters = useCallback((newFilters: Partial<UserFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setPage(1);
  }, []);

  const handleCreateUser = useCallback(
    async (userData: any) => {
      try {
        await createUser(userData).unwrap();
        toast.success('User created successfully');
        refetch();
        return { success: true };
      } catch (error: any) {
        const message = error?.data?.message || 'Failed to create user';
        toast.error(message);
        return { success: false, error: message };
      }
    },
    [createUser, refetch]
  );

  const handleUpdateUser = useCallback(
    async (id: string, userData: any) => {
      try {
        await updateUser({ id, ...userData }).unwrap();
        toast.success('User updated successfully');
        refetch();
        return { success: true };
      } catch (error: any) {
        const message = error?.data?.message || 'Failed to update user';
        toast.error(message);
        return { success: false, error: message };
      }
    },
    [updateUser, refetch]
  );

  const handleDeleteUser = useCallback(
    async (id: string) => {
      try {
        await deleteUser({ id }).unwrap();
        toast.success('User deleted successfully');
        refetch();
        return { success: true };
      } catch (error: any) {
        const message = error?.data?.message || 'Failed to delete user';
        toast.error(message);
        return { success: false, error: message };
      }
    },
    [deleteUser, refetch]
  );

  return {
    users,
    isLoading,
    page,
    setPage,
    filters,
    updateFilters,
    clearFilters,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    isCreating,
    isUpdating,
    isDeleting,
    refetch,
  };
}
