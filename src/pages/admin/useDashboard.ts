import {
  useGetApiV1ReportsDashboardQuery,
  useGetApiV1ReportsSalesQuery,
} from '@/store/coreApiWithTags';
import { useState } from 'react';

export const useDashboard = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  // Fetch dashboard data with date range for charts
  const {
    data: dashboardData,
    isLoading: isLoadingDashboard,
    refetch: refetchDashboard,
  } = useGetApiV1ReportsDashboardQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  // Fetch sales report
  const {
    data: salesData,
    isLoading: isLoadingSales,
    refetch: refetchSales,
  } = useGetApiV1ReportsSalesQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  return {
    dashboardData,
    salesData,
    isLoadingDashboard,
    isLoadingSales,
    dateRange,
    setDateRange,
    refetchDashboard,
    refetchSales,
  };
};
