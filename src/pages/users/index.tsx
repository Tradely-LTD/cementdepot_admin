import { useState } from 'react';
import ReactPaginate from 'react-paginate';
import * as yup from 'yup';
import Select from 'react-select';
import { useUsers } from './useUsers';
import {
  useGetUserKycQuery,
  useApproveKycMutation,
  useRejectKycMutation,
} from '@/store/coreApiWithTags';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Form, ControlledFormField } from '@/components/forms';
import { Controller } from 'react-hook-form';
import {
  Plus,
  Users as UsersIcon,
  Mail,
  Phone,
  Building,
  User,
  Edit,
  Trash2,
  FileText,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  ExternalLink,
} from 'lucide-react';

const roleOptions = [
  { value: undefined as undefined, label: 'All Roles' },
  { value: 'admin' as const, label: 'Admin' },
  { value: 'seller' as const, label: 'Seller' },
  { value: 'buyer' as const, label: 'Buyer' },
];

const statusOptions = [
  { value: undefined, label: 'All Status' },
  { value: true, label: 'Active' },
  { value: false, label: 'Inactive' },
];

export function Users() {
  const {
    users,
    isLoading,
    page,
    setPage,
    filters,
    updateFilters,
    clearFilters,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    isCreating,
    isUpdating,
    isDeleting,
  } = useUsers();

  const items = (users as any)?.data || [];
  const pagination = (users as any)?.pagination;

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [kycUserId, setKycUserId] = useState<string | null>(null);

  const openEditDialog = (user: any) => setEditingUser(user);
  const closeEditDialog = () => setEditingUser(null);

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'seller':
        return 'default';
      case 'buyer':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getKycBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'pending':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Users
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage system users including admins, sellers, and buyers
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create User</DialogTitle>
            </DialogHeader>
            <UserForm
              key="create-user-form"
              onSubmit={async data => {
                const result = await handleCreateUser(data);
                if (result.success) {
                  setIsCreateOpen(false);
                }
              }}
              isLoading={isCreating}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <UsersIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filters
            </h3>
          </div>
          {(filters.search ||
            filters.role ||
            filters.isActive !== undefined) && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <Input
              placeholder="Search users..."
              value={filters.search || ''}
              onChange={e =>
                updateFilters({ search: e.target.value || undefined })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <Select
              options={roleOptions}
              value={
                roleOptions.find(option => option.value === filters.role) ||
                roleOptions[0]
              }
              onChange={option =>
                updateFilters({
                  role: option?.value as
                    | 'admin'
                    | 'seller'
                    | 'buyer'
                    | undefined,
                })
              }
              className="react-select-container"
              classNamePrefix="react-select"
              isClearable={false}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <Select
              options={statusOptions}
              value={
                statusOptions.find(
                  option => option.value === filters.isActive
                ) || statusOptions[0]
              }
              onChange={option =>
                updateFilters({
                  isActive:
                    option?.value === undefined
                      ? undefined
                      : Boolean(option.value),
                })
              }
              className="react-select-container"
              classNamePrefix="react-select"
              isClearable={false}
            />
          </div>
        </div>
      </Card>

      <Card className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Business</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              items.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {user.firstName} {user.lastName}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone || '—'}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role?.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {user.businessName || '—'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? 'default' : 'secondary'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        {user.role === 'seller' && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setKycUserId(user.id)}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              View KYC
                              <Badge
                                variant={getKycBadgeVariant(user.kycStatus)}
                                className="ml-2 text-xs"
                              >
                                {user.kycStatus?.toUpperCase()}
                              </Badge>
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeleteUserId(user.id)}
                          className="text-red-600"
                          disabled={isDeleting}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-start">
          <ReactPaginate
            pageCount={pagination.totalPages}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => setPage(selected + 1)}
            forcePage={page - 1}
            containerClassName="flex space-x-2 items-center"
            pageClassName="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            pageLinkClassName="text-gray-700 dark:text-gray-300"
            activeClassName="bg-blue-600 text-white border-blue-600"
            previousClassName="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            previousLabel="Previous"
            nextClassName="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            nextLabel="Next"
            breakLabel="..."
            breakClassName="px-2 text-gray-600 dark:text-gray-400"
          />
        </div>
      )}

      <Dialog
        open={!!editingUser}
        onOpenChange={open => (!open ? closeEditDialog() : null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <UserForm
              key={`edit-user-${editingUser.id}`}
              defaultValues={{
                firstName: editingUser.firstName,
                lastName: editingUser.lastName,
                email: editingUser.email,
                phone: editingUser.phone,
                businessName: editingUser.businessName,
                role: editingUser.role,
                isActive: editingUser.isActive,
              }}
              onSubmit={async data => {
                const result = await handleUpdateUser(editingUser.id, data);
                if (result.success) {
                  closeEditDialog();
                }
              }}
              isLoading={isUpdating}
              isEdit={true}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteUserId}
        onOpenChange={open => (!open ? setDeleteUserId(null) : null)}
        onConfirm={async () => {
          if (deleteUserId) {
            await handleDeleteUser(deleteUserId);
            setDeleteUserId(null);
          }
        }}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        isLoading={isDeleting}
      />

      {kycUserId && (
        <KycDialog userId={kycUserId} onClose={() => setKycUserId(null)} />
      )}
    </div>
  );
}

const userValidationSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: yup
    .string()
    .email('Enter a valid email address')
    .required('Email is required'),
  phone: yup.string().optional(),
  businessName: yup.string().optional(),
  role: yup
    .mixed<'admin' | 'seller' | 'buyer'>()
    .oneOf(['admin', 'seller', 'buyer'], 'Invalid role')
    .required('Role is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .optional(),
  isActive: yup.boolean().optional(),
});

type UserFormData = yup.InferType<typeof userValidationSchema>;

interface UserFormProps {
  defaultValues?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => Promise<void>;
  isLoading: boolean;
  isEdit?: boolean;
}

function UserForm({
  defaultValues,
  onSubmit,
  isLoading,
  isEdit = false,
}: UserFormProps) {
  const roleSelectOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'seller', label: 'Seller' },
    { value: 'buyer', label: 'Buyer' },
  ];

  return (
    <Form
      schema={
        isEdit
          ? userValidationSchema.omit(['password'])
          : userValidationSchema.shape({
              password: yup
                .string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
            })
      }
      defaultValues={{
        firstName: defaultValues?.firstName || '',
        lastName: defaultValues?.lastName || '',
        email: defaultValues?.email || '',
        phone: defaultValues?.phone || '',
        businessName: defaultValues?.businessName || '',
        role: defaultValues?.role || 'buyer',
        password: '',
        isActive: defaultValues?.isActive ?? true,
      }}
      onSubmit={onSubmit}
      submitLabel={isEdit ? 'Update User' : 'Create User'}
      isLoading={isLoading}
      className="space-y-3"
    >
      {() => (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <ControlledFormField
              name="firstName"
              label="First Name"
              placeholder="John"
              icon={User}
              required
            />
            <ControlledFormField
              name="lastName"
              label="Last Name"
              placeholder="Doe"
              icon={User}
              required
            />
          </div>
          <ControlledFormField
            name="email"
            label="Email"
            placeholder="john.doe@example.com"
            icon={Mail}
            type="email"
            required
          />
          <ControlledFormField
            name="phone"
            label="Phone"
            placeholder="+234 800 000 0000"
            icon={Phone}
          />
          <ControlledFormField
            name="businessName"
            label="Business Name"
            placeholder="ABC Company Ltd"
            icon={Building}
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Role <span className="text-red-500 ml-1">*</span>
            </label>
            <Controller
              name="role"
              render={({ field }) => (
                <Select
                  options={roleSelectOptions}
                  value={roleSelectOptions.find(
                    option => option.value === field.value
                  )}
                  onChange={option => field.onChange(option?.value)}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              )}
            />
          </div>
          {!isEdit && (
            <ControlledFormField
              name="password"
              label="Password"
              placeholder="Enter password"
              type="password"
              required
            />
          )}
          <ControlledFormField name="isActive" label="Active" type="checkbox" />
        </div>
      )}
    </Form>
  );
}

interface KycDialogProps {
  userId: string;
  onClose: () => void;
}

function KycDialog({ userId, onClose }: KycDialogProps) {
  const { data: kycData, isLoading } = useGetUserKycQuery({ id: userId });
  const [approveKyc, { isLoading: isApproving }] = useApproveKycMutation();
  const [rejectKyc, { isLoading: isRejecting }] = useRejectKycMutation();
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const handleApprove = async () => {
    try {
      await approveKyc({ id: userId }).unwrap();
      // Don't close the modal, just let it refresh with new data
    } catch (error) {
      console.error('Failed to approve KYC:', error);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) return;

    try {
      await rejectKyc({ id: userId, reason: rejectionReason }).unwrap();
      onClose();
    } catch (error) {
      console.error('Failed to reject KYC:', error);
    }
  };

  const handleRejectKyc = async (reason: string) => {
    try {
      await rejectKyc({ id: userId, reason }).unwrap();
      // Don't close the modal, just let it refresh with new data
    } catch (error) {
      console.error('Failed to reject KYC:', error);
    }
  };

  const getKycBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'pending':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">Loading KYC details...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const user = kycData?.data;
  let kycDocuments = user?.kycDocuments;

  // Fallback: if no parsed documents but kycDocumentUrl exists, try to parse it
  if (!kycDocuments && user?.kycDocumentUrl) {
    try {
      kycDocuments = JSON.parse(user.kycDocumentUrl);
    } catch (error) {
      // If parsing fails, treat it as a single document URL
      kycDocuments = { idDocument: user.kycDocumentUrl };
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>
              KYC Details - {user?.firstName} {user?.lastName}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-sm">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Role</label>
              <p className="text-sm capitalize">{user?.role}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Business Name
              </label>
              <p className="text-sm">{user?.businessName || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                KYC Status
              </label>
              <div className="flex items-center space-x-2">
                <Badge variant={getKycBadgeVariant(user?.kycStatus)}>
                  {user?.kycStatus?.toUpperCase()}
                </Badge>
                {user?.kycStatus === 'approved' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRejectKyc('KYC deactivated by admin')}
                    disabled={isRejecting}
                    className="h-6 text-xs text-red-600 hover:text-red-700"
                  >
                    {isRejecting ? (
                      'Deactivating...'
                    ) : (
                      <>
                        <XCircle className="mr-1 h-3 w-3" />
                        Deactivate KYC
                      </>
                    )}
                  </Button>
                )}
                {user?.kycStatus === 'rejected' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleApprove}
                    disabled={isApproving}
                    className="h-6 text-xs text-green-600 hover:text-green-700"
                  >
                    {isApproving ? (
                      'Activating...'
                    ) : (
                      <>
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Activate KYC
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Account Status
              </label>
              <Badge variant={user?.isActive ? 'default' : 'secondary'}>
                {user?.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>

          {/* KYC Documents */}
          <div>
            <h4 className="font-medium mb-3">KYC Documents</h4>
            {kycDocuments ? (
              <div className="space-y-3">
                {kycDocuments.idDocument && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">ID Document</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        window.open(kycDocuments.idDocument, '_blank')
                      }
                      className="flex items-center space-x-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>View</span>
                    </Button>
                  </div>
                )}
                {kycDocuments.selfiePhoto && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">Selfie Photo</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        window.open(kycDocuments.selfiePhoto, '_blank')
                      }
                      className="flex items-center space-x-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>View</span>
                    </Button>
                  </div>
                )}
                {kycDocuments.businessDocument && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">Business Document</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        window.open(kycDocuments.businessDocument, '_blank')
                      }
                      className="flex items-center space-x-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>View</span>
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                <FileText className="mx-auto h-8 w-8 mb-2 text-gray-400" />
                <p className="text-sm">No KYC documents uploaded yet</p>
              </div>
            )}
          </div>

          {/* Rejection Reason */}
          {user?.kycStatus === 'rejected' && user?.kycRejectionReason && (
            <div>
              <label className="text-sm font-medium text-red-600">
                Rejection Reason
              </label>
              <p className="text-sm text-red-600 mt-1">
                {user.kycRejectionReason}
              </p>
            </div>
          )}

          {/* Verification Info */}
          {user?.kycVerifiedAt && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="font-medium text-gray-600">Verified At</label>
                <p>{new Date(user.kycVerifiedAt).toLocaleString()}</p>
              </div>
              <div>
                <label className="font-medium text-gray-600">Verified By</label>
                <p>{user.kycVerifiedBy || 'N/A'}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          {user?.kycStatus === 'pending' && (
            <div className="flex space-x-3 pt-4 border-t">
              {!showRejectForm ? (
                <>
                  <Button
                    onClick={handleApprove}
                    disabled={isApproving}
                    className="flex-1"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {isApproving ? 'Approving...' : 'Approve KYC'}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setShowRejectForm(true)}
                    className="flex-1"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject KYC
                  </Button>
                </>
              ) : (
                <div className="w-full space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Rejection Reason
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={e => setRejectionReason(e.target.value)}
                      placeholder="Please provide a reason for rejection..."
                      className="w-full p-2 border rounded-md resize-none"
                      rows={3}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="destructive"
                      onClick={handleReject}
                      disabled={isRejecting || !rejectionReason.trim()}
                      className="flex-1"
                    >
                      {isRejecting ? 'Rejecting...' : 'Confirm Rejection'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowRejectForm(false);
                        setRejectionReason('');
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
