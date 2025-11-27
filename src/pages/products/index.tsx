import { useState } from 'react';
import React from 'react';
import { useProducts } from './useProducts';
import {
  useGetApiV1ProductsStatsQuery,
  useGetApiV1ProductsBrandsQuery,
  useGetApiV1ProductsCategoriesQuery,
  useGetApiV1DepotsQuery,
  useGetApiV1UsersQuery,
} from '@/store/coreApiWithTags';
import { useUserSlice } from '@/pages/admin/auth-slice';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Edit,
  Trash2,
  Package,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Filter,
  X,
  Tag,
  DollarSign,
  FileText,
  Image,
  Building2,
  MapPin,
  ShoppingBag,
} from 'lucide-react';
import type { ProductCreate, ProductUpdate } from '@/store/coreApiWithTags';
import Select from 'react-select';
import ReactPaginate from 'react-paginate';
import {
  Form,
  ControlledFormField,
  ControlledSelectField,
  useFormContext,
} from '@/components/forms';
import * as yup from 'yup';

export function Products() {
  const {
    products,
    isLoading,
    page,
    setPage,
    filters,
    updateFilters,
    clearFilters,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    isCreating,
    isUpdating,
    isDeleting,
  } = useProducts();

  // Get current user role and ID
  const authState = useUserSlice();
  const currentUserRole = authState.loginResponse?.data?.user?.role;
  const currentUserId = authState.loginResponse?.data?.user?.id;
  const isAdmin = currentUserRole === 'admin';

  const { data: statsData, isLoading: isLoadingStats } =
    useGetApiV1ProductsStatsQuery(undefined);
  const stats = statsData?.data;

  // Fetch brands, categories, and depots for filters (no pagination - get all)
  const { data: brandsData } = useGetApiV1ProductsBrandsQuery({
    isActive: true,
  });
  const brands = brandsData?.data || [];

  const { data: categoriesData } = useGetApiV1ProductsCategoriesQuery();
  const categories = categoriesData?.data || [];

  // Get all depots without pagination (no page/limit params)
  // Backend automatically filters by sellerId for sellers
  // Admin sees all depots, Seller sees only their own depots
  // The backend controller automatically adds sellerId filter for sellers
  const { data: depotsData } = useGetApiV1DepotsQuery({});
  const depots = (depotsData as any)?.data || [];

  // Fetch sellers for admin dropdown (only if admin) - get all without pagination
  const { data: sellersData } = useGetApiV1UsersQuery(
    { role: 'seller' },
    { skip: !isAdmin }
  );
  const sellers = (sellersData as any)?.data || [];

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const handleProductSubmit = async (
    data: ProductCreate & { isActive?: boolean }
  ) => {
    if (editingProduct) {
      const result = await handleUpdateProduct(
        editingProduct.id,
        data as ProductUpdate
      );
      if (result.success) {
        setEditingProduct(null);
      }
    } else {
      const result = await handleCreateProduct(data as ProductCreate);
      if (result.success) {
        setIsCreateDialogOpen(false);
      }
    }
  };

  const openEditDialog = (product: any) => {
    setEditingProduct(product);
  };

  // Reset form when edit dialog closes
  const handleEditDialogChange = (open: boolean) => {
    if (!open) {
      setEditingProduct(null);
    }
  };

  const handleDelete = (id: string) => {
    setProductToDelete(id);
    setDeleteConfirmOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Products
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your cement products
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
            </DialogHeader>
            <ProductForm
              key="create-product-form"
              defaultValues={{
                name: '',
                brand: '',
                description: '',
                basePrice: '0',
                unit: 'bag',
                imageUrl: '',
                category: 'cement',
                sellerId: isAdmin ? '' : currentUserId || '',
                depotId: '',
                initialStockQuantity: undefined,
              }}
              onSubmit={handleProductSubmit}
              isLoading={isCreating}
              isAdmin={isAdmin}
              sellers={sellers}
              categories={categories}
              depots={depots}
              currentUserId={currentUserId}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Product Stats */}
      {!isLoadingStats && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Products
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.total || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Active Products
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
                  Inactive Products
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
                  Brands
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.byBrand?.length || 0}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filters
            </h3>
          </div>
          {(filters.category ||
            filters.brand ||
            filters.depotId ||
            filters.isActive !== undefined ||
            filters.search) && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <Input
              placeholder="Search products..."
              value={filters.search || ''}
              onChange={e =>
                updateFilters({ search: e.target.value || undefined })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <Select
              value={
                filters.category
                  ? {
                      value: filters.category,
                      label:
                        filters.category.charAt(0).toUpperCase() +
                        filters.category.slice(1).replace('_', ' '),
                    }
                  : { value: '', label: 'All Categories' }
              }
              onChange={option =>
                updateFilters({
                  category: option?.value === '' ? undefined : option?.value,
                })
              }
              options={[
                { value: '', label: 'All Categories' },
                ...categories.map((category: string) => ({
                  value: category,
                  label:
                    category.charAt(0).toUpperCase() +
                    category.slice(1).replace('_', ' '),
                })),
              ]}
              className="react-select-container"
              classNamePrefix="react-select"
              styles={{
                control: (base, state) => ({
                  ...base,
                  backgroundColor: 'var(--select-bg)',
                  borderColor: state.isFocused
                    ? '#3b82f6'
                    : 'var(--select-border)',
                  '&:hover': {
                    borderColor: '#3b82f6',
                  },
                }),
                menu: base => ({
                  ...base,
                  backgroundColor: 'var(--select-bg)',
                }),
                option: (base, state) => ({
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
                singleValue: base => ({
                  ...base,
                  color: 'var(--select-text)',
                }),
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Brand</label>
            <Select
              value={
                filters.brand
                  ? { value: filters.brand, label: filters.brand }
                  : { value: '', label: 'All Brands' }
              }
              onChange={option =>
                updateFilters({
                  brand: option?.value === '' ? undefined : option?.value,
                })
              }
              options={[
                { value: '', label: 'All Brands' },
                ...brands.map((brand: string) => ({
                  value: brand,
                  label: brand,
                })),
              ]}
              className="react-select-container"
              classNamePrefix="react-select"
              styles={{
                control: (base, state) => ({
                  ...base,
                  backgroundColor: 'var(--select-bg)',
                  borderColor: state.isFocused
                    ? '#3b82f6'
                    : 'var(--select-border)',
                  '&:hover': {
                    borderColor: '#3b82f6',
                  },
                }),
                menu: base => ({
                  ...base,
                  backgroundColor: 'var(--select-bg)',
                }),
                option: (base, state) => ({
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
                singleValue: base => ({
                  ...base,
                  color: 'var(--select-text)',
                }),
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Depot</label>
            <Select
              value={
                filters.depotId
                  ? depots.find((d: any) => d.id === filters.depotId)
                    ? {
                        value: filters.depotId,
                        label: depots.find((d: any) => d.id === filters.depotId)
                          .name,
                      }
                    : { value: '', label: 'All Depots' }
                  : { value: '', label: 'All Depots' }
              }
              onChange={option =>
                updateFilters({
                  depotId: option?.value === '' ? undefined : option?.value,
                })
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
              styles={{
                control: (base, state) => ({
                  ...base,
                  backgroundColor: 'var(--select-bg)',
                  borderColor: state.isFocused
                    ? '#3b82f6'
                    : 'var(--select-border)',
                  '&:hover': {
                    borderColor: '#3b82f6',
                  },
                }),
                menu: base => ({
                  ...base,
                  backgroundColor: 'var(--select-bg)',
                }),
                option: (base, state) => ({
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
                singleValue: base => ({
                  ...base,
                  color: 'var(--select-text)',
                }),
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <Select
              value={
                filters.isActive === undefined
                  ? { value: '', label: 'All Status' }
                  : filters.isActive
                    ? { value: 'true', label: 'Active' }
                    : { value: 'false', label: 'Inactive' }
              }
              onChange={option => {
                const value = option?.value || '';
                updateFilters({
                  isActive: value === '' ? undefined : value === 'true',
                });
              }}
              options={[
                { value: '', label: 'All Status' },
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Inactive' },
              ]}
              className="react-select-container"
              classNamePrefix="react-select"
              styles={{
                control: (base, state) => ({
                  ...base,
                  backgroundColor: 'var(--select-bg)',
                  borderColor: state.isFocused
                    ? '#3b82f6'
                    : 'var(--select-border)',
                  '&:hover': {
                    borderColor: '#3b82f6',
                  },
                }),
                menu: base => ({
                  ...base,
                  backgroundColor: 'var(--select-bg)',
                }),
                option: (base, state) => ({
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
                singleValue: base => ({
                  ...base,
                  color: 'var(--select-text)',
                }),
              }}
            />
          </div>
        </div>
      </Card>

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600 dark:text-gray-400">
            Loading products...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products && (products as any).data?.length > 0 ? (
            (products as any).data.map((product: any) => (
              <Card key={product.id} className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {product.name}
                      </h3>
                      {product.brand && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {product.brand}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {product.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {product.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ₦
                      {product.basePrice
                        ? Number(product.basePrice).toLocaleString()
                        : '0'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      per {product.unit || 'bag'}
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(product.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                No products found
              </p>
            </div>
          )}
        </div>
      )}

      {/* Edit Dialog */}
      {editingProduct && (
        <Dialog open={!!editingProduct} onOpenChange={handleEditDialogChange}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <ProductForm
              key={`edit-product-form-${editingProduct?.id}`}
              defaultValues={{
                name: editingProduct?.name || '',
                brand: editingProduct?.brand || '',
                description: editingProduct?.description || '',
                basePrice: editingProduct?.basePrice || '0',
                unit: editingProduct?.unit || 'bag',
                imageUrl: editingProduct?.imageUrl || '',
                category: editingProduct?.category || 'cement',
                sellerId:
                  editingProduct?.sellerId ||
                  (isAdmin ? '' : currentUserId || ''),
                depotId: editingProduct?.depotId || '',
                isActive: editingProduct?.isActive ?? true,
              }}
              onSubmit={handleProductSubmit}
              isLoading={isUpdating}
              isAdmin={isAdmin}
              sellers={sellers}
              categories={categories}
              depots={depots}
              editingProduct={editingProduct}
              currentUserId={currentUserId}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Pagination */}
      {products && (products as any).pagination && (
        <div className="flex justify-start">
          <ReactPaginate
            pageCount={(products as any).pagination.totalPages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={2}
            onPageChange={({ selected }) => setPage(selected + 1)}
            forcePage={page - 1}
            containerClassName="flex space-x-2 items-center"
            pageClassName="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            pageLinkClassName="text-gray-700 dark:text-gray-300"
            activeClassName="bg-blue-600 text-white border-blue-600"
            activeLinkClassName="text-white"
            previousClassName="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            previousLinkClassName="text-gray-700 dark:text-gray-300"
            nextClassName="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            nextLinkClassName="text-gray-700 dark:text-gray-300"
            disabledClassName="opacity-50 cursor-not-allowed"
            breakLabel="..."
            breakClassName="px-2 text-gray-600 dark:text-gray-400"
            previousLabel="Previous"
            nextLabel="Next"
          />
        </div>
      )}

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={async () => {
          if (productToDelete) {
            await handleDeleteProduct(productToDelete);
            setDeleteConfirmOpen(false);
            setProductToDelete(null);
          }
        }}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}

interface ProductFormProps {
  defaultValues?: Partial<ProductCreate & { isActive?: boolean }>;
  onSubmit: (data: ProductCreate & { isActive?: boolean }) => Promise<void>;
  isLoading: boolean;
  isAdmin: boolean;
  sellers: any[];
  categories: string[];
  depots: any[];
  editingProduct?: any;
  currentUserId?: string;
}

const createProductSchema = (isAdmin: boolean) =>
  yup.object({
    name: yup
      .string()
      .required('Product name is required')
      .min(3, 'Product name must be at least 3 characters'),
    brand: yup.string().optional(),
    description: yup.string().optional(),
    basePrice: yup
      .string()
      .required('Base price is required')
      .test('is-positive', 'Price must be greater than 0', value => {
        const num = parseFloat(value || '0');
        return num > 0;
      }),
    unit: yup.string().required('Unit is required').default('bag'),
    imageUrl: yup.string().url('Please enter a valid URL').optional(),
    category: yup.string().required('Category is required'),
    sellerId: isAdmin
      ? yup.string().required('Seller is required')
      : yup.string().optional(),
    depotId: yup.string().required('Depot is required'),
    isActive: yup.boolean().optional(),
    initialStockQuantity: yup
      .number()
      .integer('Stock quantity must be a whole number')
      .min(0, 'Stock quantity cannot be negative')
      .optional(),
  });

type ProductFormData = yup.InferType<ReturnType<typeof createProductSchema>>;

function ProductForm({
  defaultValues,
  onSubmit,
  isLoading,
  isAdmin,
  sellers,
  categories,
  depots,
  editingProduct,
  currentUserId,
}: ProductFormProps) {
  const schema = createProductSchema(isAdmin);

  const categoryOptions = categories.map((cat: string) => ({
    value: cat,
    label: cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' '),
  }));

  const sellerOptions = sellers.map((seller: any) => ({
    value: seller.id,
    label: `${seller.firstName} ${seller.lastName} (${seller.email})`,
  }));

  // Component to render form fields with dynamic depot filtering
  const FormFields = () => {
    const { watch, setValue } = useFormContext();
    const selectedSellerId = watch('sellerId');
    const currentDepotId = watch('depotId');

    // Determine which seller ID to use for filtering
    const filterSellerId = isAdmin ? selectedSellerId : currentUserId;

    // Filter depots by seller ID
    const filteredDepots = filterSellerId
      ? depots.filter((depot: any) => depot.sellerId === filterSellerId)
      : depots;

    const depotOptions = filteredDepots.map((depot: any) => ({
      value: depot.id,
      label: `${depot.name} (${depot.code})`,
    }));

    // Clear depotId if selected depot doesn't belong to the current seller
    React.useEffect(() => {
      if (currentDepotId && filterSellerId) {
        const currentDepot = depots.find((d: any) => d.id === currentDepotId);
        if (currentDepot && currentDepot.sellerId !== filterSellerId) {
          setValue('depotId', '');
        }
      }
    }, [filterSellerId, currentDepotId, depots, setValue]);

    return (
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <ControlledFormField
            name="name"
            label="Product Name"
            placeholder="Dangote Cement 50kg"
            icon={Package}
            required
          />
        </div>

        <div>
          <ControlledFormField
            name="brand"
            label="Brand"
            placeholder="Dangote"
            icon={Tag}
          />
        </div>

        <div>
          <ControlledFormField
            name="unit"
            label="Unit"
            placeholder="bag"
            icon={ShoppingBag}
            required
          />
        </div>

        <div>
          <ControlledFormField
            name="basePrice"
            label="Base Price (₦)"
            type="number"
            placeholder="5500"
            icon={DollarSign}
            required
          />
        </div>

        {isAdmin && (
          <div>
            <ControlledSelectField
              name="sellerId"
              label="Seller"
              options={sellerOptions}
              placeholder="Select Seller"
              icon={Building2}
              isRequired
            />
          </div>
        )}

        <div>
          <ControlledSelectField
            name="category"
            label="Category"
            options={categoryOptions}
            placeholder="Select Category"
            icon={Tag}
            isRequired
          />
        </div>

        <div>
          <ControlledSelectField
            name="depotId"
            label="Depot"
            options={depotOptions}
            placeholder={
              !filterSellerId
                ? isAdmin
                  ? 'Select Seller first'
                  : 'No depots available'
                : depotOptions.length === 0
                  ? 'No depots for this seller'
                  : 'Select Depot'
            }
            icon={MapPin}
            isRequired
            isClearable={false}
            disabled={!filterSellerId}
            helperText={
              !filterSellerId && isAdmin
                ? 'Please select a seller first'
                : undefined
            }
          />
        </div>

        <div>
          <ControlledFormField
            name="initialStockQuantity"
            label="Initial Stock Quantity (Optional)"
            type="number"
            placeholder="0"
            icon={Package}
            helperText="If provided, inventory will be created automatically for this product at the selected depot"
          />
        </div>

        <div className="col-span-2">
          <ControlledFormField
            name="description"
            label="Description"
            placeholder="Product description"
            icon={FileText}
            textarea
            rows={2}
          />
        </div>

        <div className="col-span-2">
          <ControlledFormField
            name="imageUrl"
            label="Image URL"
            type="url"
            placeholder="https://example.com/image.jpg"
            icon={Image}
          />
        </div>

        {isAdmin && editingProduct && (
          <div className="col-span-2">
            <ControlledFormField
              name="isActive"
              label="Active"
              type="checkbox"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <Form
      schema={schema}
      defaultValues={{
        name: defaultValues?.name || '',
        brand: defaultValues?.brand || '',
        description: defaultValues?.description || '',
        basePrice: defaultValues?.basePrice || '0',
        unit: defaultValues?.unit || 'bag',
        imageUrl: defaultValues?.imageUrl || '',
        category: defaultValues?.category || 'cement',
        sellerId: defaultValues?.sellerId || '',
        depotId: defaultValues?.depotId || '',
        isActive: defaultValues?.isActive ?? editingProduct?.isActive ?? true,
        initialStockQuantity: defaultValues?.initialStockQuantity ?? undefined,
      }}
      onSubmit={onSubmit}
      submitLabel="Save Product"
      isLoading={isLoading}
      className="space-y-2"
    >
      {() => <FormFields />}
    </Form>
  );
}
