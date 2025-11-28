export function formatFileSize(
  bytes: number | null | undefined,
  decimals: number = 0
): string {
  if (bytes === null || bytes === undefined || bytes === 0) {
    return 'Unknown size';
  }

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const decimalPlaces = i === 1 ? decimals : i > 1 ? 1 : 0;
  const value = bytes / Math.pow(k, i);

  return `${value.toFixed(decimalPlaces)} ${sizes[i]}`;
}
