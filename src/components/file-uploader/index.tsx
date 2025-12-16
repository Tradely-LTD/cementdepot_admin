import { useState, useEffect } from 'react';
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import FileIcon from '@/assets/file-folder.svg';
import { Trash2 } from 'lucide-react';
import { useUploadsFileMutation } from '@/store/uploads';

interface FileUploaderProps {
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  uploadsFile: ReturnType<typeof useUploadsFileMutation>[0];
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
  const [uploading, setUploading] = useState(false); // Single file upload status
  const [currentlyUploadingFiles, setCurrentlyUploadingFiles] = useState<
    string[]
  >([]); // Multiple file upload status
  const [preview, setPreview] = useState<string | null>(null); // Single file preview
  const [uploadedFiles, setUploadedFiles] = useState<
    { file: File | null; url: string }[]
  >([]); // Multiple file previews

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

        const uploadPromises = newFiles.map(async file => {
          try {
            const formData = new FormData();
            formData.append('file', file);

            const result = await uploadsFile(file).unwrap();

            if (result.success && result.data) {
              setUploadedFiles(prev => [
                ...prev,
                { file, url: result.data.url },
              ]);
              setValue(arrayFieldName!, [...arrayFieldValue, result.data.url]);
              setCurrentlyUploadingFiles(prev =>
                prev.filter(name => name !== file.name)
              );
              return result.data.url;
            }
            return null;
          } catch (error) {
            console.error('Error uploading file:', error);
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
        setUploading(true);

        try {
          const result = await uploadsFile(file).unwrap();

          if (result.success && result.data) {
            setValue(fieldName!, result.data.url);
            setUploading(false);
          }
        } catch (error) {
          console.error('Error uploading file:', error);
          setUploading(false);
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

  return (
    <div>
      <label className="text-sm font-medium text-gray-700 block mb-2">
        {label}
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-gray-500 cursor-pointer">
        <img src={FileIcon} className="w-8" />
        <p className="text-xs mt-2">
          {isMultiple ? `Upload files (max ${maxFiles})` : 'Upload file'}
        </p>
        <label className="text-blue-600 cursor-pointer text-xs mt-1">
          Click to upload
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept={accept}
            multiple={isMultiple}
            disabled={isMultiple && uploadedFiles.length >= maxFiles}
          />
        </label>
        {(uploading || currentlyUploadingFiles.length > 0) && (
          <p className="text-xs mt-2 text-amber-600">
            {isMultiple
              ? `Uploading ${currentlyUploadingFiles.length} file(s)...`
              : 'Uploading file...'}
          </p>
        )}
      </div>

      {/* Previews */}
      {isMultiple && uploadedFiles.length > 0 && (
        <div className="mt-3 space-y-2">
          {uploadedFiles.map((uploadedFile, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg shadow-sm bg-gray-50"
            >
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
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">
                  {uploadedFile.file
                    ? uploadedFile.file.name
                    : `Existing File ${index + 1}`}
                </p>
                <p className="text-xs text-blue-600 min-w-0 line-clamp-1 mt-1">
                  {uploadedFile.url}
                </p>
              </div>
              <button
                type="button"
                className="text-red-500 hover:bg-red-100 p-2 rounded-full transition-colors"
                onClick={() => removeFile(index)}
                title="Remove image"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {!isMultiple && (preview || fieldValue) && (
        <div className="mt-3 p-3 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
          <div className="flex items-center gap-3">
            <img
              src={preview || fieldValue}
              alt="File Preview"
              className="w-20 h-20 object-cover rounded-lg border border-gray-300 shadow-sm"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 truncate">
                {file?.name || 'Current Image'}
              </p>
              <p className="text-xs text-blue-600 min-w-0 line-clamp-1 mt-1">
                {fieldValue}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Click to view full size
              </p>
            </div>
            <button
              type="button"
              className="text-red-500 hover:bg-red-100 p-2 rounded-full transition-colors"
              onClick={removeSingleFile}
              title="Remove image"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUploader;
