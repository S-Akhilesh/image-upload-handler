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
