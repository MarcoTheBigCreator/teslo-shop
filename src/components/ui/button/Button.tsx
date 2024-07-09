import { cn } from '@/lib';
import { cva, VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { ButtonHTMLAttributes } from 'react';

export const buttonVariants = cva(
  'rounded font-medium py-2 px-4 mt-3 inline-flex items-center justify-center transition-color focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default:
          'bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded transition-all',
        ghost:
          'bg-gray-100 hover:bg-gray-200 text-black py-2 px-4 rounded transition-all',
        disabled: 'bg-gray-600 text-white',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-black',
        danger: 'bg-red-500 hover:bg-red-700 text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = ({
  className,
  children,
  variant,
  isLoading,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(buttonVariants({ variant, className }))}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
};
