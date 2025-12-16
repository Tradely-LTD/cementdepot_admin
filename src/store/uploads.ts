import { baseApi } from '@/store/emptyApi';

// Response types based on backend controller
interface UploadImageResponse {
  success: boolean;
  message: string;
  data: {
    key: string;
    url: string;
    originalName: string;
    size: number;
    mimeType: string;
  };
}

interface UploadImagesResponse {
  success: boolean;
  message: string;
  data: Array<{
    key: string;
    url: string;
    originalName: string;
    size: number;
    mimeType: string;
  }>;
}

interface DeleteImageResponse {
  success: boolean;
  message: string;
  data: null;
}

const injectedUploadsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // Single image upload - aligns with POST /api/v1/upload/image
    uploadImage: builder.mutation<UploadImageResponse, File>({
      query: (file: File) => {
        const formData = new FormData();
        formData.append('image', file); // Backend expects 'image' field name

        return {
          url: `/api/v1/upload/image`,
          method: 'POST',
          body: formData,
        };
      },
    }),

    // Multiple images upload - aligns with POST /api/v1/upload/images
    uploadImages: builder.mutation<UploadImagesResponse, File[]>({
      query: (files: File[]) => {
        const formData = new FormData();
        files.forEach(file => {
          formData.append('images', file); // Backend expects 'images' field name
        });

        return {
          url: `/api/v1/upload/images`,
          method: 'POST',
          body: formData,
        };
      },
    }),

    // Single file upload (legacy support) - uses single image endpoint
    uploadsFile: builder.mutation<UploadImageResponse, File>({
      query: (file: File) => {
        const formData = new FormData();
        formData.append('image', file);

        return {
          url: `/api/v1/upload/image`,
          method: 'POST',
          body: formData,
        };
      },
    }),

    // Delete image - aligns with DELETE /api/v1/upload/image
    deleteImage: builder.mutation<DeleteImageResponse, { key: string }>({
      query: ({ key }) => ({
        url: `/api/v1/upload/image`,
        method: 'DELETE',
        body: { key },
      }),
    }),
  }),
});

export const {
  useUploadImageMutation,
  useUploadImagesMutation,
  useUploadsFileMutation,
  useDeleteImageMutation,
} = injectedUploadsApi;
