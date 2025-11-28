type DeleteIconProps = {
  className?: string;
  width?: string | number;
  height?: string | number;
  'aria-hidden'?: boolean;
};

export function DeleteIcon({
  className,
  width = '20',
  height = '20',
  'aria-hidden': ariaHidden = true,
}: DeleteIconProps) {
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
        d='M8.33333 2.5V3.33333H4.16667V5H5V15.8333C5 16.2754 5.17559 16.6993 5.48816 17.0118C5.80072 17.3244 6.22464 17.5 6.66667 17.5H13.3333C13.7754 17.5 14.1993 17.3244 14.5118 17.0118C14.8244 16.6993 15 16.2754 15 15.8333V5H15.8333V3.33333H11.6667V2.5H8.33333ZM6.66667 5H13.3333V15.8333H6.66667V5ZM8.33333 7.5V14.1667H10V7.5H8.33333ZM10 7.5V14.1667H11.6667V7.5H10Z'
        fill='currentColor'
      />
    </svg>
  );
}
