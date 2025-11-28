import './App.css';
import { Hero, UploadPanel, ErrorBoundary } from './components';
import { useCloudinaryUpload } from './hooks/useCloudinaryUpload/useCloudinaryUpload';
import { useDragAndDrop } from './hooks/useDragAndDrop/useDragAndDrop';

function App() {
  const {
    selections,
    isUploading,
    uploadResults,
    uploadStatuses,
    uploadProgress,
    uploadErrors,
    handleFileChange,
    appendSelections,
    handleUpload,
    handleRetry,
    handleReset,
  } = useCloudinaryUpload();

  const selectionLabel = selections.length
    ? `${selections.length} image${selections.length > 1 ? 's' : ''} selected`
    : 'Choose images';

  const { isDragging, handlers } = useDragAndDrop({
    onDropFiles: appendSelections,
    disabled: isUploading,
  });

  return (
    <ErrorBoundary>
      <main className='app'>
        <Hero />
        <UploadPanel
          selectionLabel={selectionLabel}
          selections={selections}
          isDragging={isDragging}
          dragHandlers={handlers}
          isUploading={isUploading}
          uploadResults={uploadResults}
          uploadStatuses={uploadStatuses}
          uploadProgress={uploadProgress}
          uploadErrors={uploadErrors}
          onBrowseChange={handleFileChange}
          onUpload={handleUpload}
          onRetry={handleRetry}
          onReset={handleReset}
        />
      </main>
    </ErrorBoundary>
  );
}

export default App;
