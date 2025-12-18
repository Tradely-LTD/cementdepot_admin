import { useState, useEffect } from 'react';
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form';

import {
  Trash2,
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useUploadsFileMutation } from '@/store/uploads';

interface FileUploaderProps {
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  uploadsFile: ReturnType<typeof useUploadsFileMutation>[0];
  uploadState: ReturnType<typeof useUploadsFileMutation>[1]; // Add mutation state
  existingData?: any; // Existing data for editing (e.g., product, brand, etc.)
  fieldName?: string; // For single file uploads (e.g., thumbnail, certificationfiles)
  arrayFieldName?: string; // For multiple file uploads (e.g., images, documents)
  isMultiple?: boolean; // Toggle between single and multiple file uploads
  maxFiles?: number; // Maximum number of files for multiple uploads
  label: string; // UI label (e.g., "Product Thumbnail", "Product Images")
  accept?: string; // File input accept attribute (e.g., "image/*")
}

function FileUploader({
  watch,
  setValue,
  uploadsFile,
  uploadState,
  existingData,
  fieldName,
  arrayFieldName,
  isMultiple = false,
  maxFiles = Infinity,
  label,
  accept = '*/*',
}: FileUploaderProps) {
  // File Upload State Management
  const [file, setFile] = useState<File | null>(null); // For single file
  const [files, setFiles] = useState<File[]>([]); // For multiple files
  // Use RTK Query loading state instead of local state
  const isUploading = uploadState.isLoading;
  const [currentlyUploadingFiles, setCurrentlyUploadingFiles] = useState<
    string[]
  >([]); // Multiple file upload status
  const [preview, setPreview] = useState<string | null>(null); // Single file preview
  const [uploadedFiles, setUploadedFiles] = useState<
    {
      file: File | null;
      url: string;
      status?: 'uploading' | 'success' | 'error';
    }[]
  >([]); // Multiple file previews
  const [uploadErrors, setUploadErrors] = useState<{
    [fileName: string]: string;
  }>({});
  const [uploadProgress, setUploadProgress] = useState<{
    [fileName: string]: number;
  }>({});

  // Watch form field values
  const fieldValue = fieldName ? watch(fieldName) : null;
  const arrayFieldValue = arrayFieldName ? watch(arrayFieldName) || [] : [];

  // Initialize existing files from existingData
  useEffect(() => {
    if (
      isMultiple &&
      existingData?.[arrayFieldName!] &&
      existingData[arrayFieldName!].length > 0
    ) {
      const existingFiles = existingData[arrayFieldName!].map(
        (url: string) => ({
          file: null,
          url,
        })
      );
      setUploadedFiles(existingFiles);
    } else if (!isMultiple && existingData?.[fieldName!]) {
      setPreview(existingData[fieldName!]);
    }
  }, [existingData, fieldName, arrayFieldName, isMultiple]);

  // Update preview when form field value changes (for single file uploads)
  useEffect(() => {
    if (!isMultiple && fieldValue && fieldValue !== preview) {
      setPreview(fieldValue);
      // Clear the local file state since we now have a server URL
      setFile(null);
    }
  }, [fieldValue, isMultiple, preview]);

  // Handle File Upload
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      if (isMultiple) {
        // Multiple file upload
        const newFiles = Array.from(event.target.files);
        const totalFiles = arrayFieldValue.length + newFiles.length;
        if (totalFiles > maxFiles) {
          alert(`You can only upload up to ${maxFiles} files in total.`);
          return;
        }

        setFiles([...files, ...newFiles]);
        const fileNames = newFiles.map(file => file.name);
        setCurrentlyUploadingFiles([...currentlyUploadingFiles, ...fileNames]);

        // Add uploading placeholders immediately
        const uploadingPlaceholders = newFiles.map(file => ({
          file,
          url: '',
          status: 'uploading' as const,
        }));
        setUploadedFiles(prev => [...prev, ...uploadingPlaceholders]);

        const uploadPromises = newFiles.map(async file => {
          try {
            const result = await uploadsFile(file).unwrap();

            if (result.success && result.data) {
              // Update the specific file with success status
              setUploadedFiles(prev =>
                prev.map(item =>
                  item.file === file
                    ? {
                        ...item,
                        url: result.data.url,
                        status: 'success' as const,
                      }
                    : item
                )
              );
              setValue(arrayFieldName!, [...arrayFieldValue, result.data.url]);
              setCurrentlyUploadingFiles(prev =>
                prev.filter(name => name !== file.name)
              );
              // Clear any previous errors for this file
              setUploadErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[file.name];
                return newErrors;
              });
              return result.data.url;
            }
            return null;
          } catch (error) {
            console.error('Error uploading file:', error);
            // Update the specific file with error status
            setUploadedFiles(prev =>
              prev.map(item =>
                item.file === file
                  ? { ...item, status: 'error' as const }
                  : item
              )
            );
            setUploadErrors(prev => ({
              ...prev,
              [file.name]:
                error instanceof Error ? error.message : 'Upload failed',
            }));
            setCurrentlyUploadingFiles(prev =>
              prev.filter(name => name !== file.name)
            );
            return null;
          }
        });

        await Promise.all(uploadPromises);
      } else {
        // Single file upload
        const file = event.target.files[0];
        setFile(file);
        setPreview(URL.createObjectURL(file));

        try {
          // Initialize progress
          setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

          const result = await uploadsFile(file).unwrap();

          if (result.success && result.data) {
            // Update progress to 100%
            setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));

            setValue(fieldName!, result.data.url);
            // Clear any previous errors
            setUploadErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors[file.name];
              return newErrors;
            });

            // Clean up progress after a delay
            setTimeout(() => {
              setUploadProgress(prev => {
                const newProgress = { ...prev };
                delete newProgress[file.name];
                return newProgress;
              });
            }, 1000);
          }
        } catch (error) {
          console.error('Error uploading file:', error);
          setUploadErrors(prev => ({
            ...prev,
            [file.name]:
              error instanceof Error ? error.message : 'Upload failed',
          }));
          // Clean up progress
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[file.name];
            return newProgress;
          });
        }
      }
    }
  };

  // Remove a file (for multiple uploads)
  const removeFile = (index: number) => {
    const fileToRemove = uploadedFiles[index];
    const newUploadedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newUploadedFiles);

    const newUrls = arrayFieldValue.filter(
      (url: string) => url !== fileToRemove.url
    );
    setValue(arrayFieldName!, newUrls);

    if (fileToRemove.file) {
      const newFiles = files.filter(
        file => !uploadedFiles.some(f => f.file && f.file.name === file.name)
      );
      setFiles(newFiles);
    }
  };

  // Remove single file
  const removeSingleFile = () => {
    setFile(null);
    setPreview(null);
    setValue(fieldName!, null);
  };

  const isUploadingFiles = isUploading || currentlyUploadingFiles.length > 0;
  const hasErrors = Object.keys(uploadErrors).length > 0;

  return (
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
        {label}
      </label>
      <div
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 transition-colors ${
          isUploadingFiles
            ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20'
            : hasErrors
              ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer'
        }`}
      >
        {isUploadingFiles ? (
          <>
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-sm mt-2 text-blue-600 dark:text-blue-400 font-medium">
              {isMultiple
                ? `Uploading ${currentlyUploadingFiles.length} file(s)...`
                : 'Uploading file...'}
            </p>
          </>
        ) : hasErrors ? (
          <>
            <AlertCircle className="w-8 h-8 text-red-500" />
            <p className="text-sm mt-2 text-red-600 dark:text-red-400">
              Upload failed. Please try again.
            </p>
          </>
        ) : (
          <>
            <Upload className="w-8 h-8 text-gray-400" />
            <p className="text-sm mt-2 font-medium">
              {isMultiple ? `Upload files (max ${maxFiles})` : 'Upload file'}
            </p>
          </>
        )}

        <label
          className={`text-blue-600 dark:text-blue-400 cursor-pointer text-sm mt-2 px-4 py-2 rounded-md border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors ${
            isUploadingFiles || (isMultiple && uploadedFiles.length >= maxFiles)
              ? 'opacity-50 cursor-not-allowed'
              : ''
          }`}
        >
          {isUploadingFiles ? 'Uploading...' : 'Choose files'}
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept={accept}
            multiple={isMultiple}
            disabled={
              isUploadingFiles ||
              (isMultiple && uploadedFiles.length >= maxFiles)
            }
          />
        </label>
      </div>

      {/* Error Messages */}
      {hasErrors && (
        <div className="mt-2 space-y-1">
          {Object.entries(uploadErrors).map(([fileName, error]) => (
            <p
              key={fileName}
              className="text-xs text-red-600 dark:text-red-400"
            >
              {fileName}: {error}
            </p>
          ))}
        </div>
      )}

      {/* Previews */}
      {isMultiple && uploadedFiles.length > 0 && (
        <div className="mt-3 space-y-2">
          {uploadedFiles.map((uploadedFile, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 border rounded-lg shadow-sm transition-colors ${
                uploadedFile.status === 'uploading'
                  ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/20'
                  : uploadedFile.status === 'error'
                    ? 'border-red-200 bg-red-50 dark:bg-red-900/20'
                    : uploadedFile.status === 'success'
                      ? 'border-green-200 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 bg-gray-50 dark:bg-gray-800'
              }`}
            >
              {uploadedFile.status === 'uploading' ? (
                <div className="w-16 h-16 rounded-lg border border-gray-300 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                </div>
              ) : uploadedFile.status === 'error' ? (
                <div className="w-16 h-16 rounded-lg border border-red-300 bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={
                      uploadedFile.file
                        ? URL.createObjectURL(uploadedFile.file)
                        : uploadedFile.url
                    }
                    alt={
                      uploadedFile.file
                        ? uploadedFile.file.name
                        : `File ${index + 1}`
                    }
                    className="w-16 h-16 object-cover rounded-lg border border-gray-300 shadow-sm"
                  />
                  {uploadedFile.status === 'success' && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              )}

              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    uploadedFile.status === 'error'
                      ? 'text-red-700 dark:text-red-300'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {uploadedFile.file
                    ? uploadedFile.file.name
                    : `Existing File ${index + 1}`}
                </p>
                {uploadedFile.url && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 min-w-0 line-clamp-1 mt-1">
                    {uploadedFile.url}
                  </p>
                )}
                {uploadedFile.status === 'uploading' && (
                  <div className="mt-1">
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Uploading...
                    </p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300 ease-out"
                        style={{
                          width: `${uploadedFile.file ? uploadProgress[uploadedFile.file.name] || 0 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
                {uploadedFile.status === 'error' && uploadedFile.file && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    {uploadErrors[uploadedFile.file.name] || 'Upload failed'}
                  </p>
                )}
              </div>

              {uploadedFile.status !== 'uploading' && (
                <button
                  type="button"
                  className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 p-2 rounded-full transition-colors"
                  onClick={() => removeFile(index)}
                  title="Remove file"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {!isMultiple && (isUploading || preview || fieldValue) && (
        <div
          className={`mt-3 p-3 border rounded-lg shadow-sm transition-colors ${
            isUploading
              ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/20'
              : file && uploadErrors[file.name]
                ? 'border-red-200 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-200 bg-gray-50 dark:bg-gray-800'
          }`}
        >
          <div className="flex items-center gap-3">
            {isUploading ? (
              <div className="w-20 h-20 rounded-lg border border-gray-300 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : file && uploadErrors[file.name] ? (
              <div className="w-20 h-20 rounded-lg border border-red-300 bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            ) : (
              <div className="relative">
                <img
                  src={preview || fieldValue}
                  alt="File Preview"
                  className="w-20 h-20 object-cover rounded-lg border border-gray-300 shadow-sm"
                />
                {!isUploading && fieldValue && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            )}

            <div className="flex-1">
              <p
                className={`text-sm font-medium truncate ${
                  file && uploadErrors[file.name]
                    ? 'text-red-700 dark:text-red-300'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {isUploading ? 'Uploading...' : file?.name || 'Current Image'}
              </p>
              {fieldValue && (
                <p className="text-xs text-blue-600 dark:text-blue-400 min-w-0 line-clamp-1 mt-1">
                  {fieldValue}
                </p>
              )}
              {isUploading && (
                <div className="mt-1">
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    Please wait...
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300 ease-out"
                      style={{
                        width: `${file ? uploadProgress[file.name] || 0 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              )}
              {file && uploadErrors[file.name] && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {uploadErrors[file.name]}
                </p>
              )}
              {!isUploading && !uploadErrors[file?.name || ''] && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Click to view full size
                </p>
              )}
            </div>

            {!isUploading && (
              <button
                type="button"
                className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 p-2 rounded-full transition-colors"
                onClick={removeSingleFile}
                title="Remove image"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUploader;
