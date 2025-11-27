import { useState } from 'react';
import { toast } from 'sonner';
import {
  useGetApiV1BrandsQuery,
  usePostApiV1BrandsMutation,
  usePutApiV1BrandsByIdMutation,
  useDeleteApiV1BrandsByIdMutation,
  type BrandCreate,
  type BrandUpdate,
} from '@/store/coreApiWithTags';

interface BrandFilters {
  search?: string;
  isActive?: boolean;
}

export const useBrands = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filters, setFilters] = useState<BrandFilters>({});

  const { data, isLoading, refetch } = useGetApiV1BrandsQuery({
    page,
    limit,
    search: filters.search,
    isActive: filters.isActive,
  });

  const [createBrand, { isLoading: isCreating }] = usePostApiV1BrandsMutation();
  const [updateBrand, { isLoading: isUpdating }] =
    usePutApiV1BrandsByIdMutation();
  const [deleteBrand, { isLoading: isDeleting }] =
    useDeleteApiV1BrandsByIdMutation();

  const handleCreateBrand = async (payload: BrandCreate) => {
    try {
      await createBrand({ brandCreate: payload }).unwrap();
      toast.success('Brand created successfully');
      refetch();
      return { success: true };
    } catch (error: any) {
      const message = error?.data?.message || 'Failed to create brand';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const handleUpdateBrand = async (id: string, payload: BrandUpdate) => {
    try {
      await updateBrand({ id, brandUpdate: payload }).unwrap();
      toast.success('Brand updated successfully');
      refetch();
      return { success: true };
    } catch (error: any) {
      const message = error?.data?.message || 'Failed to update brand';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const handleDeleteBrand = async (id: string) => {
    try {
      await deleteBrand({ id }).unwrap();
      toast.success('Brand deleted successfully');
      refetch();
      return { success: true };
    } catch (error: any) {
      const message = error?.data?.message || 'Failed to delete brand';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const updateFilters = (newFilters: Partial<BrandFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setPage(1);
  };

  return {
    brands: data,
    isLoading,
    page,
    limit,
    setPage,
    filters,
    updateFilters,
    clearFilters,
    handleCreateBrand,
    handleUpdateBrand,
    handleDeleteBrand,
    isCreating,
    isUpdating,
    isDeleting,
    refetch,
  };
};
