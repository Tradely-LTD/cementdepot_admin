import { useState } from 'react';
import { useDeliveryRoutes } from './useDeliveryRoutes';
import {
  useGetApiV1DepotsQuery,
  useGetApiV1DeliveryRoutesStatsQuery,
} from '@/store/coreApiWithTags';
import type { DeliveryRoute } from '@/store/coreApiWithTags';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Input } from '@/components/ui/input';
import { Route, TrendingUp, TrendingDown, MapPin } from 'lucide-react';
import Select from 'react-select';
import ReactPaginate from 'react-paginate';
import { StatsCardSkeleton, RouteListSkeleton } from '@/loader';

const initialFormState = {
  sourceDepotId: '',
  destinationState: '',
  destinationCity: '',
  truckloadCapacity: 900,
  transportFee: 0,
  isActive: true,
};

export function DeliveryRoutes() {
  const {
    routes,
    pagination,
    isLoading,
    filters,
    setFilters,
    page,
    setPage,
    handleCreateRoute,
    handleUpdateRoute,
    handleDeleteRoute,
    handleToggleStatus,
    setSelectedDepotId,
    depotRoutes,
    isLoadingDepotRoutes,
    destinationFilter,
    setDestinationFilter,
    destinationRoutes,
    isLoadingDestinationRoutes,
    isMutating,
  } = useDeliveryRoutes();

  // Get depots - backend automatically filters by sellerId for sellers
  // Admin sees all depots, Seller sees only their own depots
  // The backend controller automatically adds sellerId filter for sellers
  const { data: depotsData } = useGetApiV1DepotsQuery({});
  const depots = (depotsData as any)?.data || [];

  // Fetch route stats
  const { data: statsData, isLoading: isLoadingStats } =
    useGetApiV1DeliveryRoutesStatsQuery(undefined);
  const stats = statsData?.data;

  // Helper function to get depot name
  const getDepotName = (route: any) => {
    // Backend returns sourceDepot object with name, code, etc.
    if (route.sourceDepot?.name) {
      return `${route.sourceDepot.name}${route.sourceDepot.code ? ` (${route.sourceDepot.code})` : ''}`;
    }
    // Fallback: lookup from depots list
    const depot = depots.find((d: any) => d.id === route.sourceDepotId);
    return depot
      ? `${depot.name}${depot.code ? ` (${depot.code})` : ''}`
      : route.sourceDepotId || 'N/A';
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRouteId, setEditingRouteId] = useState<string | null>(null);
  const [formState, setFormState] = useState(initialFormState);
  const [filterDraft, setFilterDraft] = useState(filters);
  const [depotLookupId, setDepotLookupId] = useState('');
  const [destinationLookup, setDestinationLookup] = useState(destinationFilter);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState<string | null>(null);
  const formatCurrency = (value?: number | null) =>
    `₦${Number(value ?? 0).toLocaleString()}`;

  const openCreateModal = () => {
    setEditingRouteId(null);
    setFormState(initialFormState);
    setIsDialogOpen(true);
  };

  const openEditModal = (route: DeliveryRoute) => {
    setEditingRouteId(route.id || null);
    setFormState({
      sourceDepotId: route.sourceDepotId || '',
      destinationState: route.destinationState || '',
      destinationCity: route.destinationCity || '',
      truckloadCapacity: route.truckloadCapacity || 900,
      transportFee: route.transportFee || 0,
      isActive: route.isActive ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      destinationState: formState.destinationState,
      destinationCity: formState.destinationCity || undefined,
      truckloadCapacity: Number(formState.truckloadCapacity),
      transportFee: Number(formState.transportFee),
      isActive: formState.isActive,
    };

    if (editingRouteId) {
      await handleUpdateRoute(editingRouteId, payload);
    } else {
      await handleCreateRoute({
        sourceDepotId: formState.sourceDepotId,
        destinationState: formState.destinationState,
        destinationCity: formState.destinationCity || undefined,
        truckloadCapacity: Number(formState.truckloadCapacity),
        transportFee: Number(formState.transportFee),
        isActive: formState.isActive,
      });
    }

    setIsDialogOpen(false);
    setFormState(initialFormState);
  };

  const applyFilters = () => {
    setFilters({
      sourceDepotId: filterDraft.sourceDepotId || undefined,
      destinationState: filterDraft.destinationState || undefined,
      destinationCity: filterDraft.destinationCity || undefined,
      isActive: filterDraft.isActive,
    });
    setPage(1);
  };

  const handleDepotLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedDepotId(depotLookupId.trim());
  };

  const handleDestinationLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDestinationFilter({
      state: destinationLookup.state || undefined,
      city: destinationLookup.city || undefined,
    });
  };

  const renderRouteCard = (
    route: DeliveryRoute & {
      sourceDepot?: {
        id: string;
        name: string;
        code: string;
        state: string;
        city: string;
      };
    }
  ) => (
    <Card key={route.id} className="p-5 space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">Destination</p>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {route.destinationState}
            {route.destinationCity ? ` • ${route.destinationCity}` : ''}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Source Depot: {getDepotName(route)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Transport Fee</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(route.transportFee)}
          </p>
          <p className="text-xs text-gray-500">
            Capacity: {route.truckloadCapacity || 0} bags
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            route.isActive
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
          }`}
        >
          {route.isActive ? 'Active' : 'Inactive'}
        </span>
        {route.destinationCity && (
          <span className="px-3 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
            {route.destinationCity}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => openEditModal(route)}
        >
          Edit
        </Button>
        <Button
          variant={route.isActive ? 'secondary' : 'default'}
          size="sm"
          onClick={() => handleToggleStatus(route)}
        >
          {route.isActive ? 'Deactivate' : 'Activate'}
        </Button>
        <Button
          variant="destructive"
          size="sm"
          disabled={!route.id}
          onClick={() => {
            if (route.id) {
              setRouteToDelete(route.id);
              setDeleteConfirmOpen(true);
            }
          }}
        >
          Delete
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Delivery Routes
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage transport routes and pricing between depots and destinations.
            <span className="block text-xs mt-1 text-gray-500">
              Note: Admin sees all routes. Sellers see only routes for their own
              depots.
            </span>
          </p>
        </div>
        <Button onClick={openCreateModal}>Create Route</Button>
      </div>

      {/* Route Stats */}
      {isLoadingStats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <StatsCardSkeleton key={index} />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Routes
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.total || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Route className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Active Routes
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.active || 0}
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
                  Inactive Routes
                </p>
                <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                  {stats.inactive || 0}
                </p>
              </div>
              <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
                <TrendingDown className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Destination States
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.byState?.length || 0}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </Card>
        </div>
      ) : null}

      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Filters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Source Depot
            </label>
            <Select<{ value: string; label: string }>
              value={
                filterDraft.sourceDepotId
                  ? {
                      value: filterDraft.sourceDepotId,
                      label:
                        depots.find(
                          (d: any) => d.id === filterDraft.sourceDepotId
                        )?.name || filterDraft.sourceDepotId,
                    }
                  : null
              }
              onChange={(option: { value: string; label: string } | null) =>
                setFilterDraft(prev => ({
                  ...prev,
                  sourceDepotId: option?.value || undefined,
                }))
              }
              options={[
                { value: '', label: 'All Depots' },
                ...depots.map((depot: any) => ({
                  value: depot.id,
                  label: depot.name,
                })),
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
          <Input
            placeholder="Destination State"
            value={filterDraft.destinationState || ''}
            onChange={e =>
              setFilterDraft(prev => ({
                ...prev,
                destinationState: e.target.value,
              }))
            }
          />
          <Input
            placeholder="Destination City"
            value={filterDraft.destinationCity || ''}
            onChange={e =>
              setFilterDraft(prev => ({
                ...prev,
                destinationCity: e.target.value,
              }))
            }
          />
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <Select<{ value: string; label: string }>
              value={
                filterDraft.isActive === undefined
                  ? { value: '', label: 'All statuses' }
                  : filterDraft.isActive === 'true'
                    ? { value: 'true', label: 'Active only' }
                    : { value: 'false', label: 'Inactive only' }
              }
              onChange={(option: { value: string; label: string } | null) =>
                setFilterDraft(prev => ({
                  ...prev,
                  isActive:
                    option?.value === ''
                      ? undefined
                      : (option?.value as 'true' | 'false'),
                }))
              }
              options={[
                { value: '', label: 'All statuses' },
                { value: 'true', label: 'Active only' },
                { value: 'false', label: 'Inactive only' },
              ]}
              className="react-select-container"
              classNamePrefix="react-select"
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
        </div>
        <div className="flex gap-3">
          <Button onClick={applyFilters}>Apply Filters</Button>
          <Button
            variant="ghost"
            onClick={() => {
              setFilterDraft({});
              setFilters({});
            }}
          >
            Reset
          </Button>
        </div>
      </Card>

      {isLoading ? (
        <RouteListSkeleton count={4} />
      ) : routes.length === 0 ? (
        <Card className="p-12 text-center text-gray-600 dark:text-gray-400">
          No routes match the current filters.
        </Card>
      ) : (
        <div className="space-y-4">
          {routes.map(renderRouteCard)}
          {pagination?.totalPages > 1 && (
            <div className="flex justify-start mt-4">
              <ReactPaginate
                previousLabel="Previous"
                nextLabel="Next"
                breakLabel="..."
                breakClassName="break-me"
                pageCount={pagination.totalPages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={selectedItem =>
                  setPage(selectedItem.selected + 1)
                }
                containerClassName="flex items-center space-x-2"
                pageClassName="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                pageLinkClassName="text-gray-700 dark:text-gray-300"
                previousClassName="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                previousLinkClassName="text-gray-700 dark:text-gray-300"
                nextClassName="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                nextLinkClassName="text-gray-700 dark:text-gray-300"
                activeClassName="bg-blue-500 text-white"
                activeLinkClassName="text-white"
                disabledClassName="opacity-50 cursor-not-allowed"
                forcePage={page - 1}
              />
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Depot Routes Lookup
          </h3>
          <form className="space-y-3" onSubmit={handleDepotLookupSubmit}>
            <Input
              placeholder="Enter Depot ID"
              value={depotLookupId}
              onChange={e => setDepotLookupId(e.target.value)}
            />
            <Button type="submit" disabled={!depotLookupId}>
              Load Routes
            </Button>
          </form>
          {isLoadingDepotRoutes ? (
            <p className="text-sm text-gray-500">Loading depot routes…</p>
          ) : depotRoutes ? (
            <ul className="space-y-2">
              {(depotRoutes.data ?? []).map((route: any) => (
                <li
                  key={route.id}
                  className="text-sm text-gray-700 dark:text-gray-200"
                >
                  {route.destinationState} •{' '}
                  {route.destinationCity || 'All cities'} —{' '}
                  {formatCurrency(route.transportFee)}
                </li>
              ))}
            </ul>
          ) : null}
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Destination Availability
          </h3>
          <form className="space-y-3" onSubmit={handleDestinationLookupSubmit}>
            <Input
              placeholder="Destination State"
              value={destinationLookup.state || ''}
              onChange={e =>
                setDestinationLookup(prev => ({
                  ...prev,
                  state: e.target.value,
                }))
              }
            />
            <Input
              placeholder="Destination City (optional)"
              value={destinationLookup.city || ''}
              onChange={e =>
                setDestinationLookup(prev => ({
                  ...prev,
                  city: e.target.value,
                }))
              }
            />
            <Button type="submit" disabled={!destinationLookup.state}>
              Find Routes
            </Button>
          </form>
          {isLoadingDestinationRoutes ? (
            <p className="text-sm text-gray-500">Loading destination routes…</p>
          ) : destinationRoutes ? (
            <ul className="space-y-2">
              {(destinationRoutes.data ?? []).map((route: any) => (
                <li
                  key={route.id}
                  className="text-sm text-gray-700 dark:text-gray-200"
                >
                  {getDepotName(route)} — {formatCurrency(route.transportFee)}
                </li>
              ))}
            </ul>
          ) : null}
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRouteId
                ? 'Update Delivery Route'
                : 'Create Delivery Route'}
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {!editingRouteId && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Source Depot *
                </label>
                <Select<{ value: string; label: string }>
                  value={
                    formState.sourceDepotId
                      ? {
                          value: formState.sourceDepotId,
                          label:
                            depots.find(
                              (d: any) => d.id === formState.sourceDepotId
                            )?.name || formState.sourceDepotId,
                        }
                      : null
                  }
                  onChange={(option: { value: string; label: string } | null) =>
                    setFormState(prev => ({
                      ...prev,
                      sourceDepotId: option?.value || '',
                    }))
                  }
                  options={depots.map((depot: any) => ({
                    value: depot.id,
                    label: depot.name,
                  }))}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Select Depot"
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
            )}
            <div>
              <label className="block text-sm font-medium mb-2">
                Destination State
              </label>
              <Input
                required
                value={formState.destinationState}
                onChange={e =>
                  setFormState(prev => ({
                    ...prev,
                    destinationState: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Destination City
              </label>
              <Input
                value={formState.destinationCity}
                onChange={e =>
                  setFormState(prev => ({
                    ...prev,
                    destinationCity: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Truckload Capacity
                </label>
                <Input
                  type="number"
                  min={1}
                  value={formState.truckloadCapacity}
                  onChange={e =>
                    setFormState(prev => ({
                      ...prev,
                      truckloadCapacity: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Transport Fee (₦)
                </label>
                <Input
                  type="number"
                  min={0}
                  value={formState.transportFee}
                  onChange={e =>
                    setFormState(prev => ({
                      ...prev,
                      transportFee: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <Select<{ value: string; label: string }>
                value={
                  formState.isActive
                    ? { value: 'active', label: 'Active' }
                    : { value: 'inactive', label: 'Inactive' }
                }
                onChange={(option: { value: string; label: string } | null) =>
                  setFormState(prev => ({
                    ...prev,
                    isActive: option?.value === 'active',
                  }))
                }
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                ]}
                className="react-select-container"
                classNamePrefix="react-select"
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
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isMutating}>
                {editingRouteId ? 'Update Route' : 'Create Route'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={async () => {
          if (routeToDelete) {
            await handleDeleteRoute(routeToDelete);
            setDeleteConfirmOpen(false);
            setRouteToDelete(null);
          }
        }}
        title="Delete Delivery Route"
        description="Are you sure you want to delete this delivery route? This action cannot be undone."
        confirmText="Delete"
        isLoading={isMutating}
      />
    </div>
  );
}
