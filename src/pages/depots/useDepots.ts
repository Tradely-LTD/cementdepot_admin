import { useState } from 'react';
import { toast } from 'sonner';
import {
  useGetApiV1DepotsQuery,
  usePostApiV1DepotsMutation,
  usePutApiV1DepotsByIdMutation,
  useDeleteApiV1DepotsByIdMutation,
  usePostApiV1DepotsByIdVerifyMutation,
} from '@/store/coreApiWithTags';

interface DepotFilters {
  search?: string;
  state?: string;
  city?: string;
  sellerId?: string;
  isActive?: boolean;
  isVerified?: boolean;
}

export const useDepots = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filters, setFilters] = useState<DepotFilters>({});

  // Fetch depots
  // Backend automatically filters by sellerId for sellers
  // Admin sees all depots, Seller sees only their own depots
  // The backend controller automatically adds sellerId filter for sellers
  const { data, isLoading, error, refetch } = useGetApiV1DepotsQuery({
    page,
    limit,
    search: filters.search,
    state: filters.state,
    city: filters.city,
    sellerId: filters.sellerId,
    isActive:
      filters.isActive !== undefined ? String(filters.isActive) : undefined,
    isVerified:
      filters.isVerified !== undefined ? String(filters.isVerified) : undefined,
  });

  // Create depot
  const [createDepot, { isLoading: isCreating }] = usePostApiV1DepotsMutation();

  // Update depot
  const [updateDepot, { isLoading: isUpdating }] =
    usePutApiV1DepotsByIdMutation();

  // Delete depot
  const [deleteDepot, { isLoading: isDeleting }] =
    useDeleteApiV1DepotsByIdMutation();

  // Verify depot
  const [verifyDepot, { isLoading: isVerifying }] =
    usePostApiV1DepotsByIdVerifyMutation();

  const handleCreateDepot = async (depotData: any) => {
    try {
      await createDepot({ body: depotData }).unwrap();
      refetch();
      toast.success('Depot created successfully');
      return { success: true };
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Failed to create depot';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const handleUpdateDepot = async (id: string, depotData: any) => {
    try {
      await updateDepot({ id, body: depotData }).unwrap();
      refetch();
      toast.success('Depot updated successfully');
      return { success: true };
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Failed to update depot';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const handleDeleteDepot = async (id: string) => {
    try {
      await deleteDepot({ id }).unwrap();
      refetch();
      toast.success('Depot deleted successfully');
      return { success: true };
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Failed to delete depot';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const handleVerifyDepot = async (id: string) => {
    try {
      await verifyDepot({ id }).unwrap();
      refetch();
      toast.success('Depot verified successfully');
      return { success: true };
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Failed to verify depot';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateFilters = (newFilters: Partial<DepotFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({});
    setPage(1);
  };

  return {
    depots: data,
    isLoading,
    error,
    page,
    setPage,
    limit,
    filters,
    updateFilters,
    clearFilters,
    handleCreateDepot,
    handleUpdateDepot,
    handleDeleteDepot,
    handleVerifyDepot,
    isCreating,
    isUpdating,
    isDeleting,
    isVerifying,
    refetch,
  };
};
