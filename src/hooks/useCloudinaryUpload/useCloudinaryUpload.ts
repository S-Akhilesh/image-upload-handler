import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { formatFileSize } from '../../utils/formatFileSize';
import * as types from './useCloudinaryUpload.types';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function useCloudinaryUpload() {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const [selections, setSelections] = useState<types.SelectedUpload[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadResults, setUploadResults] = useState<types.CompletedUpload[]>(
    []
  );
  const [uploadStatuses, setUploadStatuses] = useState<
    Record<string, types.UploadStatus>
  >({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});

  const selectionsRef = useRef(selections);

  useEffect(() => {
    selectionsRef.current = selections;
  }, [selections]);

  useEffect(() => {
    return () => {
      selectionsRef.current.forEach(({ previewUrl }) => {
        URL.revokeObjectURL(previewUrl);
      });
    };
  }, []);

  const cld = useMemo(() => {
    if (!cloudName) return null;
    return new Cloudinary({
      cloud: { cloudName },
    });
  }, [cloudName]);

  const uploadedImages = useMemo<types.UploadedImage[]>(() => {
    if (!cld || !uploadResults.length) return [];
    return uploadResults.map((result) => ({
      id: result.id,
      result,
      image: cld.image(result.public_id),
    }));
  }, [cld, uploadResults]);

  const appendSelections = useCallback((nextFiles: File[]) => {
    if (!nextFiles.length) return;

    const newSelections = nextFiles.map((file) => {
      const id =
        crypto.randomUUID() || `${file.name}-${Date.now()}-${Math.random()}`;
      const validationError =
        file.size > MAX_FILE_SIZE
          ? `File size exceeds 2MB limit (${formatFileSize(file.size)})`
          : undefined;

      return {
        id,
        file,
        previewUrl: URL.createObjectURL(file),
        validationError,
      };
    });

    setSelections((current) => [...current, ...newSelections]);

    setUploadStatuses((current) => {
      const updated = { ...current };
      newSelections.forEach(({ id, validationError }) => {
        updated[id] = validationError ? 'error' : 'idle';
      });
      return updated;
    });

    setUploadErrors((current) => {
      const updated = { ...current };
      newSelections.forEach(({ id, validationError }) => {
        if (validationError) {
          updated[id] = validationError;
        }
      });
      return updated;
    });

    setUploadResults([]);
    setErrorMessage('');
  }, []);

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      appendSelections(Array.from(event.target.files ?? []));
      event.target.value = '';
    },
    [appendSelections]
  );

  const handleUpload = useCallback(async () => {
    const validSelections = selections.filter(
      (selection) => !selection.validationError
    );

    if (!validSelections.length) {
      setErrorMessage('No valid files to upload. Please check for errors.');
      return;
    }

    setIsUploading(true);
    setErrorMessage('');

    const initialStatuses: Record<string, types.UploadStatus> = {};
    const initialProgress: Record<string, number> = {};
    validSelections.forEach(({ id }) => {
      initialStatuses[id] = 'uploading';
      initialProgress[id] = 0;
    });
    setUploadStatuses(initialStatuses);
    setUploadProgress(initialProgress);
    setUploadErrors({});

    try {
      const successful: types.CompletedUpload[] = [];
      let failedCount = 0;

      await Promise.allSettled(
        validSelections.map(async ({ file, id }) => {
          const progressInterval = setInterval(() => {
            setUploadProgress((current) => {
              const currentProgress = current[id] || 0;
              if (currentProgress < 90) {
                return { ...current, [id]: currentProgress + 10 };
              }
              return current;
            });
          }, 200);

          try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset!);

            const response = await fetch(
              `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
              {
                method: 'POST',
                body: formData,
              }
            );

            clearInterval(progressInterval);
            setUploadProgress((current) => ({ ...current, [id]: 100 }));

            const data = (await response.json()) as types.UploadResponse & {
              error?: { message: string };
            };

            if (!response.ok) {
              throw new Error(
                data.error?.message ?? 'Upload failed. Please try again.'
              );
            }

            const result = { ...data, id };

            setUploadStatuses((current) => ({
              ...current,
              [id]: 'success',
            }));
            setUploadResults((current) => [...current, result]);
            successful.push(result);

            return result;
          } catch (error) {
            clearInterval(progressInterval);

            const errorMessage =
              error instanceof Error
                ? error.message
                : 'Upload failed. Please try again.';
            setUploadStatuses((current) => ({
              ...current,
              [id]: 'error',
            }));
            setUploadErrors((current) => ({
              ...current,
              [id]: errorMessage,
            }));
            failedCount++;

            throw error;
          }
        })
      );

      setErrorMessage(
        failedCount > 0 ? `${failedCount} image(s) failed to upload.` : ''
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unexpected error. Please try again.';
      setErrorMessage(message);
    } finally {
      setIsUploading(false);
    }
  }, [cloudName, selections, uploadPreset]);

  const handleRetry = useCallback(async () => {
    const failedSelections = selections.filter(
      (selection) =>
        uploadStatuses[selection.id] === 'error' &&
        !selection.validationError &&
        !uploadResults.find((result) => result.id === selection.id)
    );

    if (!failedSelections.length) {
      return;
    }

    setIsUploading(true);
    setErrorMessage('');

    const initialStatuses: Record<string, types.UploadStatus> = {};
    const initialProgress: Record<string, number> = {};
    failedSelections.forEach(({ id }) => {
      initialStatuses[id] = 'uploading';
      initialProgress[id] = 0;
    });
    setUploadStatuses((current) => ({ ...current, ...initialStatuses }));
    setUploadProgress((current) => ({ ...current, ...initialProgress }));
    setUploadErrors((current) => {
      const updated = { ...current };
      failedSelections.forEach(({ id }) => {
        delete updated[id];
      });
      return updated;
    });

    try {
      const successful: types.CompletedUpload[] = [];
      let failedCount = 0;

      await Promise.allSettled(
        failedSelections.map(async ({ file, id }) => {
          const progressInterval = setInterval(() => {
            setUploadProgress((current) => {
              const currentProgress = current[id] || 0;
              if (currentProgress < 90) {
                return { ...current, [id]: currentProgress + 10 };
              }
              return current;
            });
          }, 200);

          try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset!);

            const response = await fetch(
              `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
              {
                method: 'POST',
                body: formData,
              }
            );

            clearInterval(progressInterval);
            setUploadProgress((current) => ({ ...current, [id]: 100 }));

            const data = (await response.json()) as types.UploadResponse & {
              error?: { message: string };
            };

            if (!response.ok) {
              throw new Error(
                data.error?.message ?? 'Upload failed. Please try again.'
              );
            }

            const result = { ...data, id };

            setUploadStatuses((current) => ({
              ...current,
              [id]: 'success',
            }));
            setUploadResults((current) => [...current, result]);
            successful.push(result);

            return result;
          } catch (error) {
            clearInterval(progressInterval);

            const errorMessage =
              error instanceof Error
                ? error.message
                : 'Upload failed. Please try again.';
            setUploadStatuses((current) => ({
              ...current,
              [id]: 'error',
            }));
            setUploadErrors((current) => ({
              ...current,
              [id]: errorMessage,
            }));
            failedCount++;

            throw error;
          }
        })
      );

      setErrorMessage(
        failedCount > 0 ? `${failedCount} image(s) failed to upload.` : ''
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unexpected error. Please try again.';
      setErrorMessage(message);
    } finally {
      setIsUploading(false);
    }
  }, [cloudName, selections, uploadPreset, uploadStatuses, uploadResults]);

  const handleReset = useCallback(() => {
    selections.forEach(({ previewUrl }) => {
      URL.revokeObjectURL(previewUrl);
    });
    setSelections([]);
    setUploadResults([]);
    setErrorMessage('');
    setUploadStatuses({});
    setUploadProgress({});
    setUploadErrors({});
  }, [selections]);

  return {
    cloudName,
    uploadPreset,
    selections,
    isUploading,
    errorMessage,
    uploadResults,
    uploadedImages,
    uploadStatuses,
    uploadProgress,
    uploadErrors,
    handleFileChange,
    appendSelections,
    handleUpload,
    handleRetry,
    handleReset,
  };
}
