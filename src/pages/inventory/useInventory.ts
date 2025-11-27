import { useState, useEffect } from 'react';
import {
  useGetApiV1InventoryDepotByDepotIdQuery,
  useGetApiV1InventoryLowStockQuery,
  usePutApiV1InventoryMutation,
  usePostApiV1InventoryAdjustMutation,
} from '@/store/coreApiWithTags';

export const useInventory = (selectedDepotId?: string) => {
  const [threshold, setThreshold] = useState(50);
  const [debouncedThreshold, setDebouncedThreshold] = useState(50);

  // Debounce threshold changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedThreshold(threshold);
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer);
  }, [threshold]);

  // Fetch inventory by depot
  const {
    data: inventoryData,
    isLoading: isLoadingInventory,
    refetch: refetchInventory,
  } = useGetApiV1InventoryDepotByDepotIdQuery(
    { depotId: selectedDepotId || '' },
    { skip: !selectedDepotId }
  );

  // Fetch low stock items (using debounced threshold)
  const {
    data: lowStockData,
    isLoading: isLoadingLowStock,
    refetch: refetchLowStock,
  } = useGetApiV1InventoryLowStockQuery({ threshold: debouncedThreshold });

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
    quantityChange: number,
    reason: string
  ) => {
    try {
      // Determine adjustment type based on quantity change
      // Positive = STOCK_IN, Negative = STOCK_OUT
      // For manual adjustments, we'll use MANUAL_ADJUSTMENT
      const adjustmentType =
        quantityChange > 0
          ? 'stock_in'
          : quantityChange < 0
            ? 'stock_out'
            : 'manual_adjustment';

      await adjustInventory({
        body: {
          depotId,
          productId,
          type: adjustmentType,
          quantityChange,
          reason,
        },
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
    debouncedThreshold,
    handleUpdateInventory,
    handleAdjustInventory,
    refetchInventory,
    refetchLowStock,
  };
};
