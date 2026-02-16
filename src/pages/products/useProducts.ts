import { useState } from 'react';
import { toast } from 'sonner';
import {
  useGetApiV1ProductsMyQuery,
  usePostApiV1ProductsMutation,
  usePutApiV1ProductsByIdMutation,
  useDeleteApiV1ProductsByIdMutation,
  type ProductCreate,
  type ProductUpdate,
} from '@/store/coreApiWithTags';

interface ProductFilters {
  category?: string;
  brandId?: string;
  depotId?: string;
  isActive?: boolean;
  search?: string;
}

export const useProducts = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filters, setFilters] = useState<ProductFilters>({});

  // Fetch products (role-based: seller sees their products, admin sees all)
  const { data, isLoading, error, refetch, isFetching } =
    useGetApiV1ProductsMyQuery({
      page,
      limit,
      category: filters.category as 'cement' | 'building_materials' | undefined,
      brandId: filters.brandId,
      depotId: filters.depotId,
      isActive: filters.isActive !== undefined ? filters.isActive : undefined,
      search: filters.search,
    });

  // Create product
  const [createProduct, { isLoading: isCreating }] =
    usePostApiV1ProductsMutation();

  // Update product
  const [updateProduct, { isLoading: isUpdating }] =
    usePutApiV1ProductsByIdMutation();

  // Delete product
  const [deleteProduct, { isLoading: isDeleting }] =
    useDeleteApiV1ProductsByIdMutation();

  const handleCreateProduct = async (productData: ProductCreate) => {
    try {
      await createProduct({ productCreate: productData }).unwrap();
      refetch();
      toast.success('Product created successfully');
      return { success: true };
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Failed to create product';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const handleUpdateProduct = async (
    id: string,
    productData: ProductUpdate
  ) => {
    try {
      await updateProduct({ id, productUpdate: productData }).unwrap();
      refetch();
      toast.success('Product updated successfully');
      return { success: true };
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Failed to update product';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct({ id }).unwrap();
      refetch();
      toast.success('Product deleted successfully');
      return { success: true };
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Failed to delete product';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({});
    setPage(1);
  };

  return {
    products: data,
    isLoading: isLoading || isFetching,
    error,
    page,
    setPage,
    limit,
    filters,
    updateFilters,
    clearFilters,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    isCreating,
    isUpdating,
    isDeleting,
    refetch,
  };
};
