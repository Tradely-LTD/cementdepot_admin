# Skeleton Loaders

This directory contains reusable skeleton loading components for the application.

## Available Components

### Product Card Skeleton

```tsx
import { ProductCardSkeleton } from '@/loader';

// Single product card
<ProductCardSkeleton />

// Grid of product cards
<ProductGridSkeleton count={8} />
```

### Table Skeleton

```tsx
import { TableRowSkeleton } from '@/loader';

// In your table body
<tbody>
  {Array.from({ length: 5 }).map((_, index) => (
    <TableRowSkeleton key={index} columns={6} />
  ))}
</tbody>;
```

### Page Elements

```tsx
import {
  PageHeaderSkeleton,
  FormFieldSkeleton,
  ButtonSkeleton,
  StatsCardSkeleton
} from '@/loader';

// Page header
<PageHeaderSkeleton />

// Form fields
<FormFieldSkeleton />

// Buttons
<ButtonSkeleton width="120px" />

// Dashboard stats
<StatsCardSkeleton />
```

### Full Page Skeleton

```tsx
import { PageSkeleton } from '@/loader';

// Complete page loading state
<PageSkeleton />;
```

## Usage in Components

### With Loading State

```tsx
import { ProductGridSkeleton, StatsCardSkeleton } from '@/loader';

const ProductsPage = () => {
  const { data: products, isLoading } = useGetProductsQuery();
  const { data: stats, isLoading: isLoadingStats } = useGetStatsQuery();

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      {isLoadingStats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <StatsCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        // Your actual stats cards
      )}

      {/* Products Grid */}
      {isLoading ? (
        <ProductGridSkeleton count={9} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
```

### Conditional Rendering

```tsx
import { ProductCardSkeleton } from '@/loader';

const ProductCard = ({ product, isLoading }) => {
  if (isLoading) {
    return <ProductCardSkeleton />;
  }

  return <Card>{/* Your product card content */}</Card>;
};
```

## Customization

All skeleton components use Tailwind CSS classes and can be customized by:

1. **Theme Colors**: Modify the `SkeletonTheme` baseColor and highlightColor in the wrapper
2. **Dimensions**: Pass custom width/height props where available
3. **Layout**: Extend components for specific use cases

## Dependencies

- `react-loading-skeleton` - Main skeleton library
- Existing UI components (`Card`, `CardContent`, etc.)
- Tailwind CSS for styling
