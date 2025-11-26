import { useState } from 'react';
import {
  useGetApiV1InventoryDepotByDepotIdQuery,
  useGetApiV1InventoryLowStockQuery,
  usePutApiV1InventoryMutation,
  usePostApiV1InventoryAdjustMutation,
} from '@/store/coreApiWithTags';

export const useInventory = (selectedDepotId?: string) => {
  const [threshold, setThreshold] = useState(50);

  // Fetch inventory by depot
  const {
    data: inventoryData,
    isLoading: isLoadingInventory,
    refetch: refetchInventory,
  } = useGetApiV1InventoryDepotByDepotIdQuery(
    { depotId: selectedDepotId || '' },
    { skip: !selectedDepotId }
  );

  // Fetch low stock items
  const {
    data: lowStockData,
    isLoading: isLoadingLowStock,
    refetch: refetchLowStock,
  } = useGetApiV1InventoryLowStockQuery({ threshold });

  // Update inventory
  const [updateInventory, { isLoading: isUpdating }] =
    usePutApiV1InventoryMutation();

  // Adjust inventory
  const [adjustInventory, { isLoading: isAdjusting }] =
    usePostApiV1InventoryAdjustMutation();

  const handleUpdateInventory = async (
    depotId: string,
    productId: string,
    quantity: number
  ) => {
    try {
      await updateInventory({
        body: { depotId, productId, quantity },
      }).unwrap();
      refetchInventory();
      refetchLowStock();
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error?.data?.message || 'Failed to update inventory',
      };
    }
  };

  const handleAdjustInventory = async (
    depotId: string,
    productId: string,
    adjustment: number,
    reason: string
  ) => {
    try {
      await adjustInventory({
        body: { depotId, productId, adjustment, reason },
      }).unwrap();
      refetchInventory();
      refetchLowStock();
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error?.data?.message || 'Failed to adjust inventory',
      };
    }
  };

  return {
    inventory: inventoryData,
    lowStock: lowStockData,
    isLoadingInventory,
    isLoadingLowStock,
    isUpdating,
    isAdjusting,
    threshold,
    setThreshold,
    handleUpdateInventory,
    handleAdjustInventory,
    refetchInventory,
    refetchLowStock,
  };
};
