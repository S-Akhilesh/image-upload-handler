import './UploadPanel.css';
import { ImageUploadItem } from '../ImageUploadItem/ImageUploadItem';
import * as types from './UploadPanel.types';
import { UploadIcon } from '../../assets/UploadIcon';
import { useRef, useMemo } from 'react';

export function UploadPanel({
  selectionLabel,
  selections,
  isDragging,
  dragHandlers,
  isUploading,
  uploadResults,
  uploadStatuses,
  uploadProgress,
  uploadErrors,
  onBrowseChange,
  onUpload,
  onRetry,
  onReset,
}: types.UploadPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate overall progress from individual upload progress values
  const overallProgress = useMemo(() => {
    if (!isUploading || !Object.keys(uploadProgress).length) {
      return 0;
    }
    const progressValues = Object.values(uploadProgress);
    const totalProgress = progressValues.reduce(
      (sum, progress) => sum + progress,
      0
    );
    return Math.round(totalProgress / progressValues.length);
  }, [isUploading, uploadProgress]);

  // Calculate failed uploads count (excluding validation errors)
  const failedUploadsCount = useMemo(() => {
    return selections.filter(
      (selection) =>
        uploadStatuses[selection.id] === 'error' &&
        !selection.validationError &&
        !uploadResults.find((result) => result.id === selection.id)
    ).length;
  }, [selections, uploadStatuses, uploadResults]);

  return (
    <section className='upload-panel'>
      <div className='panel-top'>
        <div className='panel-title'>
          <span className='icon-ring' aria-hidden='true'>
            📤
          </span>
          <div>
            <p className='panel-label'>Queue</p>
            <h2>Ready when you are</h2>
          </div>
        </div>
        <button
          type='button'
          className='chip-button'
          onClick={onReset}
          disabled={!selections.length && !uploadResults.length}
        >
          Reset
        </button>
      </div>

      <label
        htmlFor='file-input'
        className={`dropzone${isDragging ? ' is-dragging' : ''}`}
        {...dragHandlers}
      >
        <div className='dropzone-content'>
          <div className='dropzone-icon-wrapper'>
            <UploadIcon className='dropzone-icon' />
          </div>
          <div className='dropzone-text'>
            <h3 className='dropzone-title'>{selectionLabel}</h3>
            <div className='dropzone-actions'>
              <span className='dropzone-action-text'>
                Drag and drop your images here
              </span>
              <span className='dropzone-divider'>or</span>
              <button
                type='button'
                className={`dropzone-action-button${
                  isUploading ? ' is-uploading' : ''
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                disabled={isUploading}
              >
                {isUploading && (
                  <span
                    className='dropzone-action-button-progress'
                    style={{ width: `${overallProgress}%` }}
                  />
                )}
                <span className='button-text-desktop'>Browse files</span>
                <span className='button-text-mobile'>Upload from gallery</span>
              </button>
            </div>
            <p className='dropzone-hint'>
              <span className='hint-label'>Supported formats:</span>
              <span className='hint-formats'>PNG, JPG, GIF</span>
              <span className='hint-separator'>•</span>
              <span className='hint-label'>Max size:</span>
              <span className='hint-formats'>5MB per file</span>
            </p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          id='file-input'
          type='file'
          accept='image/*'
          multiple
          onChange={onBrowseChange}
          disabled={isUploading}
        />
      </label>

      <div className='panel-actions'>
        <div className='action-buttons-group'>
          <button
            type='button'
            className='primary-button'
            onClick={onUpload}
            disabled={
              !selections.length ||
              isUploading ||
              selections.some((selection) => selection.validationError)
            }
          >
            {isUploading ? (
              <>
                <span className='button-spinner'></span>
                <span>Uploading…</span>
              </>
            ) : (
              <>
                <UploadIcon className='button-icon' width='20' height='20' />
                <span>Upload all</span>
                {selections.length > 0 && (
                  <span className='button-count'>{selections.length}</span>
                )}
              </>
            )}
          </button>

          {failedUploadsCount > 0 && (
            <button
              type='button'
              className='retry-button'
              onClick={onRetry}
              disabled={isUploading}
            >
              <svg
                className='button-icon'
                width='20'
                height='20'
                viewBox='0 0 20 20'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M10 3.33334V1.66667L13.3333 5.00001L10 8.33334V6.66667C6.775 6.66667 4.16667 9.27501 4.16667 12.5C4.16667 15.725 6.775 18.3333 10 18.3333C13.225 18.3333 15.8333 15.725 15.8333 12.5C15.8333 12.1583 15.575 11.875 15.2333 11.875C14.8917 11.875 14.6333 12.1333 14.6333 12.475C14.6333 15.0167 12.5417 17.1083 10 17.1083C7.45833 17.1083 5.36667 15.0167 5.36667 12.475C5.36667 9.93334 7.45833 7.84167 10 7.84167V10.5083L13.3333 7.17501L10 3.33334Z'
                  fill='currentColor'
                />
              </svg>
              <span>Retry failed</span>
              {failedUploadsCount > 0 && (
                <span className='button-count'>{failedUploadsCount}</span>
              )}
            </button>
          )}
        </div>

        {selections.length > 0 && (
          <div className='preview-rail fade-in'>
            {selections.map(({ id, previewUrl, file, validationError }) => {
              const uploadResult = uploadResults.find(
                (result) => result.id === id
              );
              const errorMessage = validationError || uploadErrors[id];
              return (
                <ImageUploadItem
                  key={id}
                  previewUrl={previewUrl}
                  file={file}
                  uploadStatus={uploadStatuses[id] || 'idle'}
                  uploadProgress={uploadProgress[id]}
                  errorMessage={errorMessage}
                  uploadedUrl={uploadResult?.secure_url}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
