import './ImageUploadItem.css';
import * as types from './ImageUploadItem.types';
import { formatFileSize } from '../../utils/formatFileSize';
import { useState } from 'react';
import { CheckIcon } from '../../assets/CheckIcon';
import { ErrorIcon } from '../../assets/ErrorIcon';
import { DeleteIcon } from '../../assets/DeleteIcon';

export function ImageUploadItem({
  previewUrl,
  file,
  uploadStatus,
  uploadProgress,
  errorMessage,
  uploadedUrl,
  onDelete,
}: types.ImageUploadItemProps) {
  const isUploading = uploadStatus === 'uploading';
  const isSuccess = uploadStatus === 'success';
  const isError = uploadStatus === 'error';
  const [copyFeedback, setCopyFeedback] = useState(false);

  const imageUrl = isSuccess && uploadedUrl ? uploadedUrl : previewUrl;

  const handlePreview = () => {
    if (imageUrl) {
      window.open(imageUrl, '_blank');
    }
  };

  const handleCopyUrl = async () => {
    if (imageUrl) {
      try {
        await navigator.clipboard.writeText(imageUrl);
        setCopyFeedback(true);
        setTimeout(() => setCopyFeedback(false), 2000);
      } catch (err) {
        console.error('Failed to copy URL:', err);
      }
    }
  };

  return (
    <div className='image-upload-item fade-in'>
      <figure className='image-preview-card'>
        <div className='image-wrapper'>
          <img src={imageUrl} alt={`Selected file ${file.name}`} />
          {onDelete && (
            <button
              type='button'
              className='delete-button'
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              aria-label='Delete image'
              title='Delete image'
            >
              <DeleteIcon className='delete-icon' />
            </button>
          )}
          {isSuccess && (
            <div
              className='status-badge success-badge'
              aria-label='Upload successful'
            >
              <CheckIcon className='status-badge-icon' />
            </div>
          )}
          {(isError || (errorMessage && uploadStatus === 'idle')) && (
            <div className='status-badge error-badge' aria-label='Upload error'>
              <ErrorIcon className='status-badge-icon' />
            </div>
          )}
          {isUploading && (
            <div className='image-overlay'>
              <div className='upload-loader'>
                <div className='loader-spinner'></div>
                <span className='loader-text'>
                  {uploadProgress && uploadProgress > 0
                    ? `${uploadProgress}%`
                    : 'Uploading...'}
                </span>
              </div>
            </div>
          )}
        </div>
        <figcaption>
          <div className='file-info'>
            <span className='file-name' title={file.name}>
              {file.name}
            </span>
            <span className='file-size'>{formatFileSize(file.size)}</span>
          </div>
          {isUploading &&
            uploadProgress !== undefined &&
            uploadProgress > 0 && (
              <div className='progress-bar-container'>
                <div
                  className='progress-bar'
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          {errorMessage && (isError || uploadStatus === 'idle') && (
            <p className='item-error'>{errorMessage}</p>
          )}
          {isSuccess && uploadedUrl && (
            <div className='action-buttons'>
              <button
                type='button'
                className='action-btn preview-btn'
                onClick={handlePreview}
                title='Preview image'
              >
                Preview
              </button>
              <button
                type='button'
                className={`action-btn copy-btn ${
                  copyFeedback ? 'copied' : ''
                }`}
                onClick={handleCopyUrl}
                title='Copy image URL'
              >
                {copyFeedback ? 'Copied!' : 'Copy URL'}
              </button>
            </div>
          )}
        </figcaption>
      </figure>
    </div>
  );
}
