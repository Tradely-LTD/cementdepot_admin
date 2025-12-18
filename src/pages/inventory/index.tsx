import { useState } from 'react';
import { useInventory } from './useInventory';
import {
  useGetApiV1DepotsQuery,
  useGetApiV1InventoryStatsQuery,
} from '@/store/coreApiWithTags';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Package,
  AlertTriangle,
  Edit,
  TrendingUp,
  TrendingDown,
  Boxes,
  Lock,
} from 'lucide-react';
import Select from 'react-select';
import { StatsCardSkeleton, InventoryGridSkeleton } from '@/loader';

// Inventory adjustment reasons
const INVENTORY_ADJUSTMENT_REASONS = [
  // Stock Additions
  { value: 'new_stock_arrival', label: 'New Stock Arrival' },
  { value: 'stock_transfer_in', label: 'Stock Transfer In' },
  { value: 'return_from_customer', label: 'Return from Customer' },
  { value: 'found_stock', label: 'Found Stock' },
  { value: 'production_received', label: 'Production Received' },
  { value: 'correction_overcount', label: 'Correction - Overcount' },

  // Stock Removals
  { value: 'damaged_goods', label: 'Damaged Goods' },
  { value: 'expired_stock', label: 'Expired Stock' },
  { value: 'quality_rejection', label: 'Quality Rejection' },
  { value: 'theft_loss', label: 'Theft/Loss' },
  { value: 'stock_transfer_out', label: 'Stock Transfer Out' },
  { value: 'return_to_supplier', label: 'Return to Supplier' },
  { value: 'spoilage', label: 'Spoilage' },
  { value: 'correction_undercount', label: 'Correction - Undercount' },
  { value: 'sample_testing', label: 'Sample/Testing' },
  { value: 'donation_writeoff', label: 'Donation/Write-off' },

  // Audit & Corrections
  { value: 'physical_count_adjustment', label: 'Physical Count Adjustment' },
  { value: 'system_error_correction', label: 'System Error Correction' },
  { value: 'reconciliation', label: 'Reconciliation' },
  { value: 'audit_finding', label: 'Audit Finding' },

  // Other
  { value: 'other', label: 'Other' },
] as const;

export function Inventory() {
  const [selectedDepotId, setSelectedDepotId] = useState<string>('');
  const {
    inventory,
    lowStock,
    isLoadingInventory,
    isLoadingLowStock,
    handleAdjustInventory,
    isAdjusting,
    threshold,
    setThreshold,
    debouncedThreshold,
  } = useInventory(selectedDepotId);

  // Get depots - backend automatically filters by sellerId for sellers
  // Admin sees all depots, Seller sees only their own depots
  // The backend controller automatically adds sellerId filter for sellers
  const { data: depotsData } = useGetApiV1DepotsQuery({ page: 1, limit: 100 });

  // Fetch inventory stats (using debounced threshold)
  const { data: statsData, isLoading: isLoadingStats } =
    useGetApiV1InventoryStatsQuery({ threshold: debouncedThreshold });
  const stats = statsData?.data;

  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);
  const [adjustFormData, setAdjustFormData] = useState({
    depotId: '',
    productId: '',
    quantityChange: 0,
    reason: '',
    customReason: '',
  });

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate: if "Other" is selected, custom reason is required
    if (
      adjustFormData.reason === 'other' &&
      !adjustFormData.customReason.trim()
    ) {
      return; // Form validation will handle this
    }

    // Validate: reason must be selected
    if (!adjustFormData.reason) {
      return;
    }

    // Use custom reason if "Other" is selected, otherwise use selected reason label
    const finalReason =
      adjustFormData.reason === 'other'
        ? adjustFormData.customReason.trim()
        : INVENTORY_ADJUSTMENT_REASONS.find(
            r => r.value === adjustFormData.reason
          )?.label || adjustFormData.reason;

    const result = await handleAdjustInventory(
      adjustFormData.depotId,
      adjustFormData.productId,
      adjustFormData.quantityChange,
      finalReason
    );
    if (result.success) {
      setIsAdjustDialogOpen(false);
      setAdjustFormData({
        depotId: '',
        productId: '',
        quantityChange: 0,
        reason: '',
        customReason: '',
      });
    }
  };

  const openAdjustDialog = (item: any) => {
    setAdjustFormData({
      depotId: item.depotId,
      productId: item.productId,
      quantityChange: 0,
      reason: '',
      customReason: '',
    });
    setIsAdjustDialogOpen(true);
  };

  const selectedReasonOption = adjustFormData.reason
    ? INVENTORY_ADJUSTMENT_REASONS.find(r => r.value === adjustFormData.reason)
    : null;

  const isOtherSelected = adjustFormData.reason === 'other';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Inventory Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and manage stock levels
          </p>
        </div>
      </div>

      {/* Inventory Stats */}
      {isLoadingStats ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <StatsCardSkeleton key={index} />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <StatsCardSkeleton key={index} />
            ))}
          </div>
        </>
      ) : stats ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Items
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalItems || 0}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <Boxes className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Quantity
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalQuantity?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Available
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats.totalAvailable?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Low Stock Items
                  </p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {stats.lowStockItems || 0}
                  </p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </Card>
          </div>

          {/* Additional Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Reserved Quantity
                  </p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {stats.totalReserved?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                  <Lock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Depots
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.byDepot?.length || 0}
                  </p>
                </div>
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full">
                  <Boxes className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
            </Card>
          </div>
        </>
      ) : null}

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Depot
            </label>
            <Select<{ value: string; label: string }>
              value={
                selectedDepotId
                  ? {
                      value: selectedDepotId,
                      label:
                        (depotsData as any)?.data?.find(
                          (d: any) => d.id === selectedDepotId
                        )?.name || selectedDepotId,
                    }
                  : null
              }
              onChange={(option: { value: string; label: string } | null) =>
                setSelectedDepotId(option?.value || '')
              }
              options={[
                { value: '', label: 'All Depots' },
                ...((depotsData as any)?.data?.map((depot: any) => ({
                  value: depot.id,
                  label: depot.name,
                })) || []),
              ]}
              className="react-select-container"
              classNamePrefix="react-select"
              isClearable
              styles={{
                control: (base: any, state: any) => ({
                  ...base,
                  backgroundColor: 'var(--select-bg)',
                  borderColor: state.isFocused
                    ? '#3b82f6'
                    : 'var(--select-border)',
                  '&:hover': { borderColor: '#3b82f6' },
                }),
                menu: (base: any) => ({
                  ...base,
                  backgroundColor: 'var(--select-bg)',
                }),
                option: (base: any, state: any) => ({
                  ...base,
                  backgroundColor: state.isFocused
                    ? '#3b82f6'
                    : state.isSelected
                      ? '#2563eb'
                      : 'transparent',
                  color:
                    state.isFocused || state.isSelected
                      ? 'white'
                      : 'var(--select-text)',
                }),
                singleValue: (base: any) => ({
                  ...base,
                  color: 'var(--select-text)',
                }),
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Low Stock Threshold
            </label>
            <Input
              type="number"
              value={threshold}
              onChange={e => setThreshold(Number(e.target.value))}
              placeholder="50"
            />
          </div>
        </div>
      </Card>

      {/* Low Stock Alert */}
      {!isLoadingLowStock && lowStock && (lowStock as any).data?.length > 0 && (
        <Card className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                Low Stock Alert
              </h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                {(lowStock as any).data.length} items are running low on stock
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Inventory Grid */}
      {selectedDepotId ? (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Depot Inventory
          </h3>
          {isLoadingInventory ? (
            <InventoryGridSkeleton count={6} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inventory && (inventory as any).data?.length > 0 ? (
                (inventory as any).data.map((item: any) => (
                  <Card
                    key={`${item.depotId}-${item.productId}`}
                    className="p-6 space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                          <Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {item.product?.name || 'Product'}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.depot?.name || 'Depot'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Quantity
                        </span>
                        <span
                          className={`text-2xl font-bold ${
                            item.quantity < threshold
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {item.quantity}
                        </span>
                      </div>
                      {item.quantity < threshold && (
                        <span className="text-xs text-red-600 dark:text-red-400 flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Low stock
                        </span>
                      )}
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openAdjustDialog(item)}
                        className="w-full"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Adjust Stock
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    No inventory found
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Please select a depot to view inventory
          </p>
        </Card>
      )}

      {/* Adjust Inventory Dialog */}
      <Dialog open={isAdjustDialogOpen} onOpenChange={setIsAdjustDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Inventory</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdjustSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Quantity Change *
              </label>
              <Input
                type="number"
                value={adjustFormData.quantityChange}
                onChange={e =>
                  setAdjustFormData({
                    ...adjustFormData,
                    quantityChange: Number(e.target.value),
                  })
                }
                placeholder="e.g., 100 or -50"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Use positive for addition, negative for subtraction
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Reason *</label>
              <Select<{ value: string; label: string }>
                value={
                  selectedReasonOption
                    ? {
                        value: selectedReasonOption.value,
                        label: selectedReasonOption.label,
                      }
                    : null
                }
                onChange={(option: { value: string; label: string } | null) =>
                  setAdjustFormData({
                    ...adjustFormData,
                    reason: option?.value || '',
                    customReason:
                      option?.value !== 'other'
                        ? ''
                        : adjustFormData.customReason,
                  })
                }
                options={INVENTORY_ADJUSTMENT_REASONS}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Select a reason..."
                isSearchable
                required
                styles={{
                  control: (base: any, state: any) => ({
                    ...base,
                    backgroundColor: 'var(--select-bg)',
                    borderColor: state.isFocused
                      ? '#3b82f6'
                      : 'var(--select-border)',
                    '&:hover': { borderColor: '#3b82f6' },
                  }),
                  menu: (base: any) => ({
                    ...base,
                    backgroundColor: 'var(--select-bg)',
                  }),
                  option: (base: any, state: any) => ({
                    ...base,
                    backgroundColor: state.isFocused
                      ? '#3b82f6'
                      : state.isSelected
                        ? '#2563eb'
                        : 'transparent',
                    color:
                      state.isFocused || state.isSelected
                        ? 'white'
                        : 'var(--select-text)',
                  }),
                  singleValue: (base: any) => ({
                    ...base,
                    color: 'var(--select-text)',
                  }),
                }}
              />
            </div>

            {isOtherSelected && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Specify Reason *
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  rows={3}
                  value={adjustFormData.customReason}
                  onChange={e =>
                    setAdjustFormData({
                      ...adjustFormData,
                      customReason: e.target.value,
                    })
                  }
                  placeholder="Please specify the reason for adjustment..."
                  required={isOtherSelected}
                />
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAdjustDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isAdjusting}>
                {isAdjusting ? 'Adjusting...' : 'Adjust Inventory'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
