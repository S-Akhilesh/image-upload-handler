import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import * as types from './useCloudinaryUpload.types';

export function useCloudinaryUpload() {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const [selections, setSelections] = useState<types.SelectedUpload[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadResults, setUploadResults] = useState<types.CompletedUpload[]>(
    []
  );

  const selectionsRef = useRef(selections);

  useEffect(() => {
    selectionsRef.current = selections;
  }, [selections]);

  const missingConfig = !cloudName || !uploadPreset;

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

  const uploadedImages = useMemo(() => {
    if (!cld || !uploadResults.length) return [];
    return uploadResults.map((result) => ({
      id: result.id,
      result,
      image: cld.image(result.public_id),
    }));
  }, [cld, uploadResults]);

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const nextFiles = Array.from(event.target.files ?? []);
      if (!nextFiles.length) return;

      setSelections((current) => [
        ...current,
        ...nextFiles.map((file) => ({
          id:
            crypto.randomUUID() ||
            `${file.name}-${Date.now()}-${Math.random()}`,
          file,
          previewUrl: URL.createObjectURL(file),
        })),
      ]);
      setUploadResults([]);
      setErrorMessage('');
    },
    []
  );

  const handleUpload = useCallback(async () => {
    if (!selections.length || missingConfig) return;
    setIsUploading(true);
    setErrorMessage('');

    try {
      const results = await Promise.allSettled(
        selections.map(async ({ file, id }) => {
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

          const data = (await response.json()) as types.UploadResponse & {
            error?: { message: string };
          };

          if (!response.ok) {
            throw new Error(
              data.error?.message ?? 'Upload failed. Please try again.'
            );
          }

          return { ...data, id };
        })
      );

      const successful = results.filter(
        (result): result is PromiseFulfilledResult<types.CompletedUpload> =>
          result.status === 'fulfilled'
      );
      const failed = results.length - successful.length;

      if (!successful.length) {
        const failure = results.find((result) => result.status === 'rejected');
        throw (
          (failure?.reason as Error | string | undefined) ??
          new Error('Upload failed. Please try again.')
        );
      }

      setUploadResults(successful.map((item) => item.value));
      setErrorMessage(failed ? `Uploaded with ${failed} failure(s).` : '');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unexpected error. Please try again.';
      setErrorMessage(message);
      setUploadResults([]);
    } finally {
      setIsUploading(false);
    }
  }, [cloudName, missingConfig, selections, uploadPreset]);

  const handleReset = useCallback(() => {
    selections.forEach(({ previewUrl }) => {
      URL.revokeObjectURL(previewUrl);
    });
    setSelections([]);
    setUploadResults([]);
    setErrorMessage('');
  }, [selections]);

  return {
    cloudName,
    uploadPreset,
    selections,
    isUploading,
    errorMessage,
    uploadResults,
    uploadedImages,
    missingConfig,
    handleFileChange,
    handleUpload,
    handleReset,
  };
}
