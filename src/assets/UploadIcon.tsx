type UploadIconProps = {
  className?: string;
  width?: string | number;
  height?: string | number;
  'aria-hidden'?: boolean;
};

export function UploadIcon({
  className,
  width = '48',
  height = '48',
  'aria-hidden': ariaHidden = true,
}: UploadIconProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden={ariaHidden}
    >
      <path
        d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <polyline
        points='17 8 12 3 7 8'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <line
        x1='12'
        y1='3'
        x2='12'
        y2='15'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
