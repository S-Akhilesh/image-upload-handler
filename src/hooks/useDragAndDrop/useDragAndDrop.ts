import { useCallback, useRef, useState } from 'react';
import type { DragEventHandler } from 'react';

import * as types from './useDragAndDrop.types';

function matchesType(fileType: string, acceptRule: string) {
  if (acceptRule.endsWith('/*')) {
    return fileType.startsWith(acceptRule.slice(0, -1));
  }

  if (acceptRule.endsWith('/')) {
    return fileType.startsWith(acceptRule);
  }

  return fileType === acceptRule;
}

export function useDragAndDrop({
  onDropFiles,
  accept = ['image/*'],
  disabled = false,
}: types.UseDragAndDropOptions) {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const filterAccepted = useCallback(
    (files: File[]) => {
      if (!accept.length) return files;
      return files.filter((file) =>
        accept.some((type) => matchesType(file.type, type))
      );
    },
    [accept]
  );

  const resetDragState = useCallback(() => {
    dragCounter.current = 0;
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback<DragEventHandler<HTMLElement>>(
    (event) => {
      if (disabled) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
    },
    [disabled]
  );

  const handleDragEnter = useCallback<DragEventHandler<HTMLElement>>(
    (event) => {
      if (disabled) return;
      event.preventDefault();
      dragCounter.current += 1;
      setIsDragging(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback<DragEventHandler<HTMLElement>>(
    (event) => {
      if (disabled) return;
      event.preventDefault();
      dragCounter.current -= 1;
      if (dragCounter.current <= 0) {
        resetDragState();
      }
    },
    [disabled, resetDragState]
  );

  const handleDrop = useCallback<DragEventHandler<HTMLElement>>(
    (event) => {
      if (disabled) return;
      event.preventDefault();
      const dropped = Array.from(event.dataTransfer?.files ?? []);
      const acceptedFiles = filterAccepted(dropped);
      if (acceptedFiles.length) {
        onDropFiles(acceptedFiles);
      }
      resetDragState();
    },
    [disabled, filterAccepted, onDropFiles, resetDragState]
  );

  const handlers: types.DragHandlers = {
    onDragEnter: handleDragEnter,
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop,
  };

  return { isDragging, handlers };
}
