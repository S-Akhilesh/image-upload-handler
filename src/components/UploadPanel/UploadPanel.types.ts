import type { ChangeEventHandler } from 'react';
import type {
  CompletedUpload,
  SelectedUpload,
} from '../../hooks/useCloudinaryUpload/useCloudinaryUpload.types';
import type { DragHandlers } from '../../hooks/useDragAndDrop/useDragAndDrop.types';

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export type UploadPanelProps = {
  selectionLabel: string;
  selections: SelectedUpload[];
  isDragging: boolean;
  dragHandlers: DragHandlers;
  isUploading: boolean;
  uploadResults: CompletedUpload[];
  uploadStatuses: Record<string, UploadStatus>;
  uploadProgress: Record<string, number>;
  uploadErrors: Record<string, string>;
  onBrowseChange: ChangeEventHandler<HTMLInputElement>;
  onUpload: () => void;
  onReset: () => void;
};
