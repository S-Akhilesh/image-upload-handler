type RefreshIconProps = {
  className?: string;
  width?: string | number;
  height?: string | number;
  'aria-hidden'?: boolean;
};

export function RefreshIcon({
  className,
  width = '20',
  height = '20',
  'aria-hidden': ariaHidden = true,
}: RefreshIconProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden={ariaHidden}
    >
      <path
        d='M10 3.33334V1.66667L13.3333 5.00001L10 8.33334V6.66667C6.775 6.66667 4.16667 9.27501 4.16667 12.5C4.16667 15.725 6.775 18.3333 10 18.3333C13.225 18.3333 15.8333 15.725 15.8333 12.5C15.8333 12.1583 15.575 11.875 15.2333 11.875C14.8917 11.875 14.6333 12.1333 14.6333 12.475C14.6333 15.0167 12.5417 17.1083 10 17.1083C7.45833 17.1083 5.36667 15.0167 5.36667 12.475C5.36667 9.93334 7.45833 7.84167 10 7.84167V10.5083L13.3333 7.17501L10 3.33334Z'
        fill='currentColor'
      />
    </svg>
  );
}
