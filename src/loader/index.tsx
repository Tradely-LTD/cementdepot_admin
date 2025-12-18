import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Card, CardContent } from '@/components/ui/card';

// Base skeleton wrapper with theme
const SkeletonWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
    {children}
  </SkeletonTheme>
);

// Product Card Skeleton Loader
export const ProductCardSkeleton: React.FC = () => (
  <SkeletonWrapper>
    <Card className="p-4 space-y-3">
      {/* Header section with image and title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Skeleton circle height={40} width={40} />
          <div>
            <Skeleton height={16} width={120} className="mb-1" />
            <Skeleton height={12} width={80} />
          </div>
        </div>
        <Skeleton height={20} width={60} />
      </div>

      {/* Price and actions section */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton height={28} width={100} className="mb-1" />
          <Skeleton height={14} width={60} />
        </div>
        <div className="flex space-x-2">
          <Skeleton height={32} width={32} />
          <Skeleton height={32} width={32} />
        </div>
      </div>
    </Card>
  </SkeletonWrapper>
);

// Table Row Skeleton Loader
export const TableRowSkeleton: React.FC<{ columns?: number }> = ({
  columns = 4,
}) => (
  <SkeletonWrapper>
    <tr>
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="p-4">
          <Skeleton height={20} />
        </td>
      ))}
    </tr>
  </SkeletonWrapper>
);

// Page Header Skeleton Loader
export const PageHeaderSkeleton: React.FC = () => (
  <SkeletonWrapper>
    <div className="mb-8">
      <Skeleton height={32} width="30%" className="mb-2" />
      <Skeleton height={16} width="50%" />
    </div>
  </SkeletonWrapper>
);

// Form Field Skeleton Loader
export const FormFieldSkeleton: React.FC = () => (
  <SkeletonWrapper>
    <div className="space-y-2">
      <Skeleton height={16} width="25%" />
      <Skeleton height={40} />
    </div>
  </SkeletonWrapper>
);

// List Item Skeleton Loader
export const ListItemSkeleton: React.FC = () => (
  <SkeletonWrapper>
    <div className="flex items-center space-x-4 p-4">
      <Skeleton circle height={40} width={40} />
      <div className="flex-1">
        <Skeleton height={16} className="mb-1" />
        <Skeleton height={14} width="60%" />
      </div>
    </div>
  </SkeletonWrapper>
);

// Button Skeleton Loader
export const ButtonSkeleton: React.FC<{ width?: string }> = ({
  width = '100px',
}) => (
  <SkeletonWrapper>
    <Skeleton height={40} width={width} />
  </SkeletonWrapper>
);

// Grid Skeleton Loader (for product grids)
export const ProductGridSkeleton: React.FC<{ count?: number }> = ({
  count = 8,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </div>
);

// Dashboard Stats Skeleton
export const StatsCardSkeleton: React.FC = () => (
  <SkeletonWrapper>
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton height={14} width="80px" className="mb-2" />
            <Skeleton height={28} width="60px" />
          </div>
          <Skeleton circle height={40} width={40} />
        </div>
      </CardContent>
    </Card>
  </SkeletonWrapper>
);

// Full Page Skeleton Loader
export const PageSkeleton: React.FC = () => (
  <div className="container mx-auto p-6">
    <PageHeaderSkeleton />
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: 4 }).map((_, index) => (
        <StatsCardSkeleton key={index} />
      ))}
    </div>
    <ProductGridSkeleton />
  </div>
);

// Dashboard Stats Grid Skeleton (4 columns)
export const DashboardStatsSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: 4 }).map((_, index) => (
      <StatsCardSkeleton key={index} />
    ))}
  </div>
);

// Table Skeleton Loader (full table with multiple rows)
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 6,
}) => (
  <SkeletonWrapper>
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="flex-1">
              <Skeleton height={40} />
            </div>
          ))}
        </div>
      ))}
    </div>
  </SkeletonWrapper>
);

// Inventory Card Skeleton
export const InventoryCardSkeleton: React.FC = () => (
  <SkeletonWrapper>
    <Card className="p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <Skeleton circle height={48} width={48} />
          <div>
            <Skeleton height={18} width={140} className="mb-1" />
            <Skeleton height={14} width={100} />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Skeleton height={14} width={60} />
          <Skeleton height={28} width={50} />
        </div>
      </div>
      <div className="pt-4 border-t">
        <Skeleton height={36} />
      </div>
    </Card>
  </SkeletonWrapper>
);

// Inventory Grid Skeleton
export const InventoryGridSkeleton: React.FC<{ count?: number }> = ({
  count = 6,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <InventoryCardSkeleton key={index} />
    ))}
  </div>
);

// Report Card Skeleton (for Analysis page)
export const ReportCardSkeleton: React.FC = () => (
  <SkeletonWrapper>
    <Card>
      <CardContent className="p-6">
        <Skeleton height={20} width="40%" className="mb-4" />
        <Skeleton height={16} width="60%" className="mb-6" />
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index}>
                <Skeleton height={14} width="80%" className="mb-2" />
                <Skeleton height={28} width="60%" />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} height={60} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  </SkeletonWrapper>
);

// Order Card Skeleton
export const OrderCardSkeleton: React.FC = () => (
  <SkeletonWrapper>
    <Card className="hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Skeleton height={24} width={120} />
            <Skeleton height={20} width={80} />
          </div>
          <div className="text-right">
            <Skeleton height={24} width={100} className="mb-1" />
            <Skeleton height={14} width={80} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <Skeleton circle height={16} width={16} />
              <Skeleton height={14} width={120} />
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Skeleton height={36} className="flex-1" />
          <Skeleton height={36} width={80} />
        </div>
      </div>
    </Card>
  </SkeletonWrapper>
);

// Order List Skeleton
export const OrderListSkeleton: React.FC<{ count?: number }> = ({
  count = 5,
}) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, index) => (
      <OrderCardSkeleton key={index} />
    ))}
  </div>
);

// Route Card Skeleton
export const RouteCardSkeleton: React.FC = () => (
  <SkeletonWrapper>
    <Card className="p-5 space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <Skeleton height={14} width={80} className="mb-1" />
          <Skeleton height={24} width={200} className="mb-2" />
          <Skeleton height={14} width={150} />
        </div>
        <div className="text-right">
          <Skeleton height={14} width={80} className="mb-1" />
          <Skeleton height={28} width={100} className="mb-1" />
          <Skeleton height={12} width={120} />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Skeleton height={24} width={60} />
        <Skeleton height={24} width={80} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Skeleton height={32} width={60} />
        <Skeleton height={32} width={80} />
        <Skeleton height={32} width={70} />
      </div>
    </Card>
  </SkeletonWrapper>
);

// Route List Skeleton
export const RouteListSkeleton: React.FC<{ count?: number }> = ({
  count = 4,
}) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, index) => (
      <RouteCardSkeleton key={index} />
    ))}
  </div>
);

// Depot Card Skeleton
export const DepotCardSkeleton: React.FC = () => (
  <SkeletonWrapper>
    <Card className="p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <Skeleton circle height={48} width={48} />
          <div>
            <Skeleton height={18} width={140} className="mb-1" />
            <Skeleton height={14} width={80} />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Skeleton height={14} width="100%" />
        <Skeleton height={14} width="80%" />
        <Skeleton height={14} width="90%" />
        <Skeleton height={12} width="70%" />
      </div>

      <div className="flex space-x-2 pt-4 border-t">
        <Skeleton height={32} width={80} />
        <Skeleton height={32} width={40} />
        <Skeleton height={32} width={40} />
      </div>
    </Card>
  </SkeletonWrapper>
);

// Depot Grid Skeleton
export const DepotGridSkeleton: React.FC<{ count?: number }> = ({
  count = 6,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <DepotCardSkeleton key={index} />
    ))}
  </div>
);

// Export all loaders as default
export default {
  ProductCardSkeleton,
  TableRowSkeleton,
  PageHeaderSkeleton,
  FormFieldSkeleton,
  ListItemSkeleton,
  ButtonSkeleton,
  ProductGridSkeleton,
  StatsCardSkeleton,
  PageSkeleton,
  SkeletonWrapper,
  DashboardStatsSkeleton,
  TableSkeleton,
  InventoryCardSkeleton,
  InventoryGridSkeleton,
  ReportCardSkeleton,
  OrderCardSkeleton,
  OrderListSkeleton,
  RouteCardSkeleton,
  RouteListSkeleton,
  DepotCardSkeleton,
  DepotGridSkeleton,
};
