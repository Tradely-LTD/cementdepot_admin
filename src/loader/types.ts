export interface SkeletonProps {
  className?: string;
}

export interface ProductCardSkeletonProps extends SkeletonProps {}

export interface TableRowSkeletonProps extends SkeletonProps {
  columns?: number;
}

export interface ButtonSkeletonProps extends SkeletonProps {
  width?: string;
}

export interface ProductGridSkeletonProps extends SkeletonProps {
  count?: number;
}

export interface ListItemSkeletonProps extends SkeletonProps {}

export interface PageHeaderSkeletonProps extends SkeletonProps {}

export interface FormFieldSkeletonProps extends SkeletonProps {}

export interface StatsCardSkeletonProps extends SkeletonProps {}

export interface PageSkeletonProps extends SkeletonProps {}
