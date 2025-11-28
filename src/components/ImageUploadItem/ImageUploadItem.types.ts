export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export type ImageUploadItemProps = {
  previewUrl: string;
  file: File;
  uploadStatus: UploadStatus;
  uploadProgress?: number;
  errorMessage?: string;
  uploadedUrl?: string;
  onDelete?: () => void;
};
