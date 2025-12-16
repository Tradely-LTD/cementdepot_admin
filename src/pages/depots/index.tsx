import { useState } from 'react';
import { useDepots } from './useDepots';
import {
  useGetApiV1DepotsStatsQuery,
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
  MapPin,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Filter,
  X,
  Building2,
  Hash,
  MapPinned,
  Mail,
  Phone,
  Navigation,
} from 'lucide-react';
import ReactPaginate from 'react-paginate';
import Select from 'react-select';
import {
  Form,
  ControlledFormField,
  ControlledSelectField,
} from '@/components/forms';
import * as yup from 'yup';

// Nigerian states list
const NIGERIAN_STATES = [
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'FCT',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
];

export function Depots() {
  const {
    depots,
    isLoading,
    page,
    setPage,
    filters,
    updateFilters,
    clearFilters,
    handleCreateDepot,
    handleUpdateDepot,
    handleDeleteDepot,
    handleVerifyDepot,
    isCreating,
    isUpdating,
    isDeleting,
    isVerifying,
  } = useDepots();

  // Get current user role
  const authState = useUserSlice();
  const currentUserRole = authState.loginResponse?.data?.user?.role;
  const isAdmin = currentUserRole === 'admin';

  // Fetch depot stats
  const { data: statsData, isLoading: isLoadingStats } =
    useGetApiV1DepotsStatsQuery(undefined);
  const stats = statsData?.data;

  // Fetch sellers for admin dropdown (only if admin) - get all without pagination
  const { data: sellersData } = useGetApiV1UsersQuery(
    { role: 'seller' },
    { skip: !isAdmin }
  );
  const sellers = (sellersData as any)?.data || [];

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingDepot, setEditingDepot] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    state: '',
    lga: '',
    city: '',
    address: '',
    latitude: '',
    longitude: '',
    phone: '',
    email: '',
    sellerId: '',
    managerId: '',
  });
  const formatCoordinate = (value?: number | null) =>
    typeof value === 'number' ? value.toFixed(4) : 'N/A';

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      state: '',
      lga: '',
      city: '',
      address: '',
      latitude: '',
      longitude: '',
      phone: '',
      email: '',
      sellerId: '',
      managerId: '',
    });
    setEditingDepot(null);
  };

  const handleDepotSubmit = async (data: any) => {
    if (editingDepot) {
      const result = await handleUpdateDepot(editingDepot.id, data);
      if (result.success) {
        setEditingDepot(null);
        resetForm();
      }
    } else {
      const result = await handleCreateDepot(data);
      if (result.success) {
        setIsCreateDialogOpen(false);
        resetForm();
      }
    }
  };

  const openEditDialog = (depot: any) => {
    setEditingDepot(depot);
    setFormData({
      name: depot.name || '',
      code: depot.code || '',
      state: depot.state || '',
      lga: depot.lga || '',
      city: depot.city || '',
      address: depot.address || '',
      latitude: depot.latitude || '',
      longitude: depot.longitude || '',
      phone: depot.phone || '',
      email: depot.email || '',
      sellerId: depot.sellerId || '',
      managerId: depot.managerId || '',
    });
  };

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [depotToDelete, setDepotToDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setDepotToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleVerify = async (id: string) => {
    if (window.confirm('Are you sure you want to verify this depot?')) {
      await handleVerifyDepot(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Depots
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage depot locations
          </p>
        </div>

        <div className="flex space-x-4">
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Depot
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Depot</DialogTitle>
              </DialogHeader>
              <DepotForm
                defaultValues={formData}
                onSubmit={handleDepotSubmit}
                isLoading={isCreating}
                isAdmin={isAdmin}
                sellers={sellers}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Depot Stats */}
      {!isLoadingStats && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Depots
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.total || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Active Depots
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
                  Inactive Depots
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
                  Verified Depots
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.verified || 0}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Unverified Depots
                </p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {stats.unverified || 0}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
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
          {(filters.search ||
            filters.sellerId ||
            filters.isActive !== undefined ||
            filters.isVerified !== undefined) && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <Input
              placeholder="Search depots..."
              value={filters.search || ''}
              onChange={e =>
                updateFilters({ search: e.target.value || undefined })
              }
            />
          </div>

          {isAdmin && (
            <div>
              <label className="block text-sm font-medium mb-2">Seller</label>
              <Select<{ value: string; label: string }>
                value={
                  filters.sellerId
                    ? sellers.find((s: any) => s.id === filters.sellerId)
                      ? {
                          value: filters.sellerId,
                          label:
                            sellers.find((s: any) => s.id === filters.sellerId)
                              .businessName ||
                            `${sellers.find((s: any) => s.id === filters.sellerId).firstName} ${sellers.find((s: any) => s.id === filters.sellerId).lastName}`,
                        }
                      : { value: '', label: 'All Sellers' }
                    : { value: '', label: 'All Sellers' }
                }
                onChange={(option: { value: string; label: string } | null) =>
                  updateFilters({
                    sellerId: option?.value === '' ? undefined : option?.value,
                  })
                }
                options={[
                  { value: '', label: 'All Sellers' },
                  ...sellers.map((seller: any) => ({
                    value: seller.id,
                    label:
                      seller.businessName ||
                      `${seller.firstName} ${seller.lastName}`,
                  })),
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
                    '&:hover': {
                      borderColor: '#3b82f6',
                    },
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
            <label className="block text-sm font-medium mb-2">Status</label>
            <Select<{ value: string; label: string }>
              value={
                filters.isActive === undefined
                  ? { value: 'all', label: 'All Status' }
                  : filters.isActive
                    ? { value: 'active', label: 'Active' }
                    : { value: 'inactive', label: 'Inactive' }
              }
              onChange={(option: { value: string; label: string } | null) => {
                const value = option?.value || 'all';
                if (value === 'all') updateFilters({ isActive: undefined });
                else updateFilters({ isActive: value === 'active' });
              }}
              options={[
                { value: 'all', label: 'All Status' },
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
                  '&:hover': {
                    borderColor: '#3b82f6',
                  },
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
              Verification
            </label>
            <Select<{ value: string; label: string }>
              value={
                filters.isVerified === undefined
                  ? { value: 'all', label: 'All' }
                  : filters.isVerified
                    ? { value: 'verified', label: 'Verified' }
                    : { value: 'unverified', label: 'Unverified' }
              }
              onChange={(option: { value: string; label: string } | null) => {
                const value = option?.value || 'all';
                if (value === 'all') updateFilters({ isVerified: undefined });
                else updateFilters({ isVerified: value === 'verified' });
              }}
              options={[
                { value: 'all', label: 'All' },
                { value: 'verified', label: 'Verified' },
                { value: 'unverified', label: 'Unverified' },
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
                  '&:hover': {
                    borderColor: '#3b82f6',
                  },
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
      </Card>

      {/* Depots Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600 dark:text-gray-400">Loading depots...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {depots && (depots as any).data?.length > 0 ? (
            (depots as any).data.map((depot: any) => (
              <Card key={depot.id} className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {depot.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        {depot.isVerified ? (
                          <span className="flex items-center text-xs text-green-600 dark:text-green-400">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </span>
                        ) : (
                          <span className="flex items-center text-xs text-yellow-600 dark:text-yellow-400">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <p className="text-gray-600 dark:text-gray-400 flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    {depot.address}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    📞 {depot.contactPhone}
                  </p>
                  {depot.contactEmail && (
                    <p className="text-gray-600 dark:text-gray-400">
                      ✉️ {depot.contactEmail}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Coordinates: {formatCoordinate(depot.latitude)},{' '}
                    {formatCoordinate(depot.longitude)}
                  </p>
                </div>

                <div className="flex space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {!depot.isVerified && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVerify(depot.id)}
                      disabled={isVerifying}
                      className="flex-1"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Verify
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(depot)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(depot.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <MapPin className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                No depots found
              </p>
            </div>
          )}
        </div>
      )}

      {/* Edit Dialog */}
      {editingDepot && (
        <Dialog
          open={!!editingDepot}
          onOpenChange={() => setEditingDepot(null)}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Depot</DialogTitle>
            </DialogHeader>
            <DepotForm
              defaultValues={formData}
              onSubmit={handleDepotSubmit}
              isLoading={isUpdating}
              isAdmin={isAdmin}
              sellers={sellers}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Pagination */}
      {depots && (depots as any).pagination && (
        <div className="flex justify-start">
          <ReactPaginate
            pageCount={(depots as any).pagination.totalPages}
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
          if (depotToDelete) {
            await handleDeleteDepot(depotToDelete);
            setDeleteConfirmOpen(false);
            setDepotToDelete(null);
          }
        }}
        title="Delete Depot"
        description="Are you sure you want to delete this depot? This action cannot be undone."
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}

interface DepotFormProps {
  defaultValues?: any;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  isAdmin?: boolean;
  sellers?: any[];
}

const depotSchema = yup.object({
  name: yup
    .string()
    .required('Depot name is required')
    .min(3, 'Depot name must be at least 3 characters'),
  code: yup
    .string()
    .required('Depot code is required')
    .min(2, 'Depot code must be at least 2 characters'),
  sellerId: yup.string().optional(),
  state: yup.string().required('State is required'),
  lga: yup.string().required('LGA is required'),
  city: yup.string().required('City is required'),
  address: yup.string().required('Address is required'),
  latitude: yup.string().optional(),
  longitude: yup.string().optional(),
  phone: yup.string().required('Phone is required'),
  email: yup.string().email('Please enter a valid email').optional(),
});

function DepotForm({
  defaultValues,
  onSubmit,
  isLoading,
  isAdmin,
  sellers,
}: DepotFormProps) {
  const stateOptions = NIGERIAN_STATES.map(state => ({
    value: state,
    label: state,
  }));

  const sellerOptions =
    sellers?.map((seller: any) => ({
      value: seller.id,
      label: seller.businessName || `${seller.firstName} ${seller.lastName}`,
    })) || [];

  return (
    <Form
      schema={depotSchema}
      defaultValues={{
        name: defaultValues?.name || '',
        code: defaultValues?.code || '',
        sellerId: defaultValues?.sellerId || '',
        state: defaultValues?.state || '',
        lga: defaultValues?.lga || '',
        city: defaultValues?.city || '',
        address: defaultValues?.address || '',
        latitude: defaultValues?.latitude || '',
        longitude: defaultValues?.longitude || '',
        phone: defaultValues?.phone || '',
        email: defaultValues?.email || '',
      }}
      onSubmit={onSubmit}
      submitLabel="Save Depot"
      isLoading={isLoading}
      className="space-y-4"
    >
      {() => (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <ControlledFormField
              name="name"
              label="Depot Name"
              placeholder="Lagos Main Depot"
              icon={Building2}
              required
            />
          </div>

          <div>
            <ControlledFormField
              name="code"
              label="Depot Code"
              placeholder="LAG001"
              icon={Hash}
              required
            />
          </div>

          {isAdmin && sellers && sellers.length > 0 && (
            <div>
              <ControlledSelectField
                name="sellerId"
                label="Seller"
                options={sellerOptions}
                placeholder="Select Seller"
                icon={Building2}
                isClearable
              />
            </div>
          )}

          <div>
            <ControlledSelectField
              name="state"
              label="State"
              options={stateOptions}
              placeholder="Select State"
              icon={MapPinned}
              isRequired
            />
          </div>

          <div>
            <ControlledFormField
              name="lga"
              label="LGA"
              placeholder="Ikeja"
              icon={MapPinned}
              required
            />
          </div>

          <div>
            <ControlledFormField
              name="city"
              label="City"
              placeholder="Ikeja"
              icon={MapPinned}
              required
            />
          </div>

          <div className="col-span-2">
            <ControlledFormField
              name="address"
              label="Address"
              placeholder="123 Main Street, Lagos"
              icon={MapPin}
              required
            />
          </div>

          <div>
            <ControlledFormField
              name="latitude"
              label="Latitude"
              type="number"
              step="any"
              placeholder="6.5244"
              icon={Navigation}
            />
          </div>

          <div>
            <ControlledFormField
              name="longitude"
              label="Longitude"
              type="number"
              step="any"
              placeholder="3.3792"
              icon={Navigation}
            />
          </div>

          <div>
            <ControlledFormField
              name="phone"
              label="Phone"
              placeholder="+234 123 456 7890"
              icon={Phone}
              required
            />
          </div>

          <div>
            <ControlledFormField
              name="email"
              label="Email"
              type="email"
              placeholder="depot@example.com"
              icon={Mail}
            />
          </div>
        </div>
      )}
    </Form>
  );
}
