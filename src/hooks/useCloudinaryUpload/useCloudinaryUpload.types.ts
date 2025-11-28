import type { CloudinaryImage } from '@cloudinary/url-gen/assets/CloudinaryImage';

export type UploadResponse = {
  public_id: string;
  secure_url: string;
  bytes: number;
  width: number;
  height: number;
  format: string;
};

export type SelectedUpload = {
  id: string;
  file: File;
  previewUrl: string;
  validationError?: string;
};

export type CompletedUpload = UploadResponse & { id: string };

export type UploadedImage = {
  id: string;
  image: CloudinaryImage;
  result: CompletedUpload;
};
