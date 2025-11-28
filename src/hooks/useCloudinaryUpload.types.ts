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
};

export type CompletedUpload = UploadResponse & { id: string };
