import { useState } from 'react';
import ReactPaginate from 'react-paginate';
import * as yup from 'yup';
import Select from 'react-select';
import { useBrands } from './useBrands';
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
import {
  Plus,
  Tag,
  FileText,
  ExternalLink,
  Edit,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';
import FileUploader from '@/components/file-uploader';
import { useUploadsFileMutation } from '@/store/uploads';

const statusOptions = [
  { value: undefined, label: 'All Status' },
  { value: true, label: 'Active' },
  { value: false, label: 'Inactive' },
];

export function Brands() {
  const {
    brands,
    isLoading,
    page,
    setPage,
    filters,
    updateFilters,
    clearFilters,
    handleCreateBrand,
    handleUpdateBrand,
    handleDeleteBrand,
    isCreating,
    isUpdating,
    isDeleting,
  } = useBrands();

  const items = (brands as any)?.data || [];
  const pagination = (brands as any)?.pagination;

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any>(null);
  const [deleteBrandId, setDeleteBrandId] = useState<string | null>(null);

  const openEditDialog = (brand: any) => setEditingBrand(brand);
  const closeEditDialog = () => setEditingBrand(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Brands
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage the catalog of cement brands available to sellers
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Brand
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Brand</DialogTitle>
            </DialogHeader>
            <BrandForm
              key="create-brand-form"
              onSubmit={async data => {
                const result = await handleCreateBrand(data);
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
            <Tag className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filters
            </h3>
          </div>
          {(filters.search || filters.isActive !== undefined) && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <Input
              placeholder="Search brands..."
              value={filters.search || ''}
              onChange={e =>
                updateFilters({ search: e.target.value || undefined })
              }
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
              <TableHead>Slug</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  Loading brands...
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No brands found
                </TableCell>
              </TableRow>
            ) : (
              items.map((brand: any) => (
                <TableRow key={brand.id}>
                  <TableCell>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {brand.name}
                    </div>
                  </TableCell>
                  <TableCell>{brand.slug}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {brand.description || '—'}
                  </TableCell>
                  <TableCell>
                    {brand.websiteUrl ? (
                      <a
                        href={brand.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-blue-600 hover:underline"
                      >
                        Visit <ExternalLink className="ml-1 h-4 w-4" />
                      </a>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={brand.isActive ? 'default' : 'secondary'}>
                      {brand.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {brand.updatedAt
                      ? new Date(brand.updatedAt).toLocaleDateString()
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
                        <DropdownMenuItem onClick={() => openEditDialog(brand)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Brand
                        </DropdownMenuItem>
                        {brand.websiteUrl && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                window.open(brand.websiteUrl, '_blank')
                              }
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Visit Website
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeleteBrandId(brand.id)}
                          className="text-red-600"
                          disabled={isDeleting}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Brand
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
        open={!!editingBrand}
        onOpenChange={open => (!open ? closeEditDialog() : null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
          </DialogHeader>
          {editingBrand && (
            <BrandForm
              key={`edit-brand-${editingBrand.id}`}
              defaultValues={{
                name: editingBrand.name,
                description: editingBrand.description,
                logoUrl: editingBrand.logoUrl,
                websiteUrl: editingBrand.websiteUrl,
                isActive: editingBrand.isActive,
              }}
              onSubmit={async data => {
                const result = await handleUpdateBrand(editingBrand.id, data);
                if (result.success) {
                  closeEditDialog();
                }
              }}
              isLoading={isUpdating}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteBrandId}
        onOpenChange={open => (!open ? setDeleteBrandId(null) : null)}
        onConfirm={async () => {
          if (deleteBrandId) {
            await handleDeleteBrand(deleteBrandId);
            setDeleteBrandId(null);
          }
        }}
        title="Delete Brand"
        description="Are you sure you want to delete this brand? This action cannot be undone."
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}

const brandValidationSchema = yup.object({
  name: yup
    .string()
    .required('Brand name is required')
    .min(2, 'Brand name must be at least 2 characters'),
  description: yup.string().optional(),
  logoUrl: yup.string().url('Enter a valid logo URL').optional(),
  websiteUrl: yup.string().url('Enter a valid website URL').optional(),
  isActive: yup.boolean().optional(),
});

type BrandFormData = yup.InferType<typeof brandValidationSchema>;

interface BrandFormProps {
  defaultValues?: BrandFormData;
  onSubmit: (data: BrandFormData) => Promise<void>;
  isLoading: boolean;
}

function BrandForm({ defaultValues, onSubmit, isLoading }: BrandFormProps) {
  const [uploadsFile] = useUploadsFileMutation();

  return (
    <Form
      schema={brandValidationSchema}
      defaultValues={{
        name: defaultValues?.name || '',
        description: defaultValues?.description || '',
        logoUrl: defaultValues?.logoUrl || '',
        websiteUrl: defaultValues?.websiteUrl || '',
        isActive: defaultValues?.isActive ?? true,
      }}
      onSubmit={onSubmit}
      submitLabel="Save Brand"
      isLoading={isLoading}
      className="space-y-3"
    >
      {({ watch, setValue }) => (
        <div className="space-y-3">
          <ControlledFormField
            name="name"
            label="Brand Name"
            placeholder="Dangote"
            icon={Tag}
            required
          />
          <ControlledFormField
            name="description"
            label="Description"
            placeholder="Describe the brand"
            icon={FileText}
            textarea
          />
          <div>
            <FileUploader
              watch={watch}
              setValue={setValue}
              uploadsFile={uploadsFile}
              existingData={defaultValues}
              fieldName="logoUrl"
              isMultiple={false}
              label="Brand Logo"
              accept="image/*"
            />
          </div>
          <ControlledFormField
            name="websiteUrl"
            label="Website"
            placeholder="https://example.com"
            icon={ExternalLink}
          />
          <ControlledFormField name="isActive" label="Active" type="checkbox" />
        </div>
      )}
    </Form>
  );
}
