import type { DragEventHandler } from 'react';

export type UseDragAndDropOptions = {
  onDropFiles: (files: File[]) => void;
  accept?: string[];
  disabled?: boolean;
};

export type DragHandlers = {
  onDragEnter: DragEventHandler<HTMLElement>;
  onDragOver: DragEventHandler<HTMLElement>;
  onDragLeave: DragEventHandler<HTMLElement>;
  onDrop: DragEventHandler<HTMLElement>;
};
