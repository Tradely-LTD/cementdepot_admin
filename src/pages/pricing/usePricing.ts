import { useState } from 'react';
import {
  type OrderPriceCalculation,
  type PostApiV1PricingCalculateApiArg,
  type PostApiV1PricingCalculateOrderApiArg,
  type PriceCalculation,
  useGetApiV1PricingDestinationsByDepotIdQuery,
  useGetApiV1PricingNearestDepotQuery,
  usePostApiV1PricingCalculateMutation,
  usePostApiV1PricingCalculateOrderMutation,
} from '@/store/coreApiWithTags';

export const usePricing = () => {
  const [singleResult, setSingleResult] = useState<PriceCalculation | null>(
    null
  );
  const [orderResult, setOrderResult] = useState<OrderPriceCalculation | null>(
    null
  );
  const [singleError, setSingleError] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [nearestParams, setNearestParams] = useState<{
    productId: string;
    destinationState: string;
  } | null>(null);
  const [destinationsDepotId, setDestinationsDepotId] = useState<string>('');

  const [calculateSingle, singleState] = usePostApiV1PricingCalculateMutation();
  const [calculateOrder, orderState] =
    usePostApiV1PricingCalculateOrderMutation();
  const nearestDepotQuery = useGetApiV1PricingNearestDepotQuery(
    nearestParams ?? ({} as any),
    { skip: !nearestParams }
  );
  const destinationsQuery = useGetApiV1PricingDestinationsByDepotIdQuery(
    { depotId: destinationsDepotId },
    { skip: !destinationsDepotId }
  );

  const runSingleCalculation = async (
    body: PostApiV1PricingCalculateApiArg['body']
  ) => {
    try {
      setSingleError(null);
      const response = await calculateSingle({ body }).unwrap();
      setSingleResult((response as any)?.data ?? null);
    } catch (error: any) {
      setSingleError(error?.data?.message || 'Unable to calculate price');
      setSingleResult(null);
    }
  };

  const runOrderCalculation = async (
    body: PostApiV1PricingCalculateOrderApiArg['body']
  ) => {
    try {
      setOrderError(null);
      const response = await calculateOrder({ body }).unwrap();
      setOrderResult((response as any)?.data ?? null);
    } catch (error: any) {
      setOrderError(error?.data?.message || 'Unable to calculate order price');
      setOrderResult(null);
    }
  };

  const lookupNearestDepot = (params: {
    productId: string;
    destinationState: string;
  }) => {
    setNearestParams(params);
  };

  const lookupDestinations = (depotId: string) => {
    setDestinationsDepotId(depotId);
  };

  return {
    singleResult,
    orderResult,
    singleError,
    orderError,
    isCalculatingSingle: singleState.isLoading,
    isCalculatingOrder: orderState.isLoading,
    isLoadingNearest: nearestDepotQuery.isLoading,
    nearestDepot: (nearestDepotQuery.data as any)?.data,
    nearestError: nearestDepotQuery.error,
    destinations: (destinationsQuery.data as any)?.data ?? [],
    isLoadingDestinations: destinationsQuery.isLoading,
    destinationsError: destinationsQuery.error,
    runSingleCalculation,
    runOrderCalculation,
    lookupNearestDepot,
    lookupDestinations,
  };
};
