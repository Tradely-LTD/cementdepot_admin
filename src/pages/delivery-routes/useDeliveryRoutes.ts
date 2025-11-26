import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  type CreateDeliveryRoute,
  type DeliveryRoute,
  type UpdateDeliveryRoute,
  useDeleteApiV1DeliveryRoutesByIdMutation,
  useGetApiV1DeliveryRoutesDestinationQuery,
  useGetApiV1DeliveryRoutesDepotByDepotIdQuery,
  useGetApiV1DeliveryRoutesQuery,
  usePostApiV1DeliveryRoutesByIdActivateMutation,
  usePostApiV1DeliveryRoutesByIdDeactivateMutation,
  usePostApiV1DeliveryRoutesMutation,
  usePutApiV1DeliveryRoutesByIdMutation,
} from '@/store/coreApiWithTags';

type Filters = {
  sourceDepotId?: string;
  destinationState?: string;
  destinationCity?: string;
  isActive?: 'true' | 'false' | undefined;
};

const DEFAULT_PAGINATION = { page: 1, limit: 10 };

export const useDeliveryRoutes = () => {
  const [page, setPage] = useState(DEFAULT_PAGINATION.page);
  const [limit] = useState(DEFAULT_PAGINATION.limit);
  const [filters, setFilters] = useState<Filters>({});
  const [selectedDepotId, setSelectedDepotId] = useState<string>('');
  const [destinationFilter, setDestinationFilter] = useState<{
    state?: string;
    city?: string;
  }>({});

  const routesQuery = useGetApiV1DeliveryRoutesQuery({
    page,
    limit,
    sourceDepotId: filters.sourceDepotId || undefined,
    destinationState: filters.destinationState || undefined,
    destinationCity: filters.destinationCity || undefined,
    isActive: filters.isActive,
  });

  const depotRoutesQuery = useGetApiV1DeliveryRoutesDepotByDepotIdQuery(
    { depotId: selectedDepotId },
    { skip: !selectedDepotId }
  );

  const destinationRoutesQuery = useGetApiV1DeliveryRoutesDestinationQuery(
    {
      state: destinationFilter.state || '',
      city: destinationFilter.city || undefined,
    },
    { skip: !destinationFilter.state }
  );

  const [createRoute, createState] = usePostApiV1DeliveryRoutesMutation();
  const [updateRoute, updateState] = usePutApiV1DeliveryRoutesByIdMutation();
  const [deleteRoute, deleteState] = useDeleteApiV1DeliveryRoutesByIdMutation();
  const [activateRoute, activateState] =
    usePostApiV1DeliveryRoutesByIdActivateMutation();
  const [deactivateRoute, deactivateState] =
    usePostApiV1DeliveryRoutesByIdDeactivateMutation();

  const list = useMemo<DeliveryRoute[]>(() => {
    return (routesQuery.data as any)?.data ?? [];
  }, [routesQuery.data]);

  const pagination = (routesQuery.data as any)?.pagination;

  const handleCreate = async (payload: CreateDeliveryRoute) => {
    try {
      await createRoute({ createDeliveryRoute: payload }).unwrap();
      routesQuery.refetch();
      toast.success('Delivery route created successfully');
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || 'Failed to create delivery route';
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleUpdate = async (id: string, payload: UpdateDeliveryRoute) => {
    try {
      await updateRoute({ id, updateDeliveryRoute: payload }).unwrap();
      routesQuery.refetch();
      toast.success('Delivery route updated successfully');
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || 'Failed to update delivery route';
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRoute({ id }).unwrap();
      routesQuery.refetch();
      toast.success('Delivery route deleted successfully');
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || 'Failed to delete delivery route';
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleToggleStatus = async (route: DeliveryRoute) => {
    if (!route.id) return;
    try {
      if (route.isActive) {
        await deactivateRoute({ id: route.id }).unwrap();
        toast.success('Delivery route deactivated successfully');
      } else {
        await activateRoute({ id: route.id }).unwrap();
        toast.success('Delivery route activated successfully');
      }
      routesQuery.refetch();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || 'Failed to update delivery route status';
      toast.error(errorMessage);
      throw error;
    }
  };

  return {
    routes: list,
    pagination,
    isLoading: routesQuery.isLoading,
    error: routesQuery.error,
    page,
    setPage,
    limit,
    filters,
    setFilters,
    selectedDepotId,
    setSelectedDepotId,
    depotRoutes: depotRoutesQuery.data as any,
    isLoadingDepotRoutes: depotRoutesQuery.isLoading,
    destinationFilter,
    setDestinationFilter,
    destinationRoutes: destinationRoutesQuery.data as any,
    isLoadingDestinationRoutes: destinationRoutesQuery.isLoading,
    handleCreateRoute: handleCreate,
    handleUpdateRoute: handleUpdate,
    handleDeleteRoute: handleDelete,
    handleToggleStatus,
    isMutating:
      createState.isLoading ||
      updateState.isLoading ||
      deleteState.isLoading ||
      activateState.isLoading ||
      deactivateState.isLoading,
  };
};
