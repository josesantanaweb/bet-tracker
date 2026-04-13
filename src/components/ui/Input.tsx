import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/cn'

const inputVariants = cva(
  'border-stroke text-foreground placeholder:text-muted w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60',
  {
    variants: {
      inputSize: {
        default: 'h-10',
        sm: 'h-9 text-xs',
        lg: 'h-11 text-base',
      },
    },
    defaultVariants: {
      inputSize: 'default',
    },
  },
)

export interface InputProps
  extends
    React.InputHTMLAttributes<HTMLInputElement>,
    Omit<VariantProps<typeof inputVariants>, 'size'> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, inputSize, ...props }, ref) => {
    return <input ref={ref} className={cn(inputVariants({ inputSize, className }))} {...props} />
  },
)

Input.displayName = 'Input'
