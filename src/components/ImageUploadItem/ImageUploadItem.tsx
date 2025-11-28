import './ImageUploadItem.css';
import * as types from './ImageUploadItem.types';
import { formatFileSize } from '../../utils/formatFileSize';
import { useState } from 'react';

export function ImageUploadItem({
  previewUrl,
  file,
  uploadStatus,
  uploadProgress,
  errorMessage,
  uploadedUrl,
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
          {isSuccess && (
            <div
              className='status-badge success-badge'
              aria-label='Upload successful'
            >
              <svg
                className='status-badge-icon'
                width='20'
                height='20'
                viewBox='0 0 20 20'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M16.7071 5.29289C17.0976 5.68342 17.0976 6.31658 16.7071 6.70711L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071L3.29289 10.7071C2.90237 10.3166 2.90237 9.68342 3.29289 9.29289C3.68342 8.90237 4.31658 8.90237 4.70711 9.29289L8 12.5858L15.2929 5.29289C15.6834 4.90237 16.3166 4.90237 16.7071 5.29289Z'
                  fill='currentColor'
                />
              </svg>
            </div>
          )}
          {(isError || (errorMessage && uploadStatus === 'idle')) && (
            <div className='status-badge error-badge' aria-label='Upload error'>
              <svg
                className='status-badge-icon'
                width='20'
                height='20'
                viewBox='0 0 20 20'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M10 8.58579L13.2929 5.29289C13.6834 4.90237 14.3166 4.90237 14.7071 5.29289C15.0976 5.68342 15.0976 6.31658 14.7071 6.70711L11.4142 10L14.7071 13.2929C15.0976 13.6834 15.0976 14.3166 14.7071 14.7071C14.3166 15.0976 13.6834 15.0976 13.2929 14.7071L10 11.4142L6.70711 14.7071C6.31658 15.0976 5.68342 15.0976 5.29289 14.7071C4.90237 14.3166 4.90237 13.6834 5.29289 13.2929L8.58579 10L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L10 8.58579Z'
                  fill='currentColor'
                />
              </svg>
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
