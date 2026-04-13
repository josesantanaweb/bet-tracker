import { ChevronDown } from '@boxicons/react'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/cn'

const selectVariants = cva(
  'border-stroke text-foreground w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60',
  {
    variants: {
      selectSize: {
        default: 'h-10',
        sm: 'h-9 text-xs',
        lg: 'h-11 text-base',
      },
    },
    defaultVariants: {
      selectSize: 'default',
    },
  },
)

interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends Omit<VariantProps<typeof selectVariants>, 'size'> {
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  className?: string
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      className,
      selectSize,
      value,
      onChange,
      onBlur,
      options,
      placeholder = 'Selecciona una opcion',
      disabled = false,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const rootRef = React.useRef<HTMLDivElement | null>(null)
    const listRef = React.useRef<HTMLDivElement | null>(null)

    React.useImperativeHandle(ref, () => rootRef.current as HTMLDivElement)

    React.useEffect(() => {
      const handleOutsideClick = (event: MouseEvent) => {
        const target = event.target as Node
        if (!rootRef.current?.contains(target)) {
          setIsOpen(false)
        }
      }

      document.addEventListener('mousedown', handleOutsideClick)
      return () => document.removeEventListener('mousedown', handleOutsideClick)
    }, [])

    const selectedOption = options.find((option) => option.value === value)
    const triggerId = React.useId()
    const listboxId = React.useId()

    const handleSelect = (nextValue: string) => {
      onChange?.(nextValue)
      setIsOpen(false)
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) {
        return
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        setIsOpen((open) => !open)
      }

      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    return (
      <div className="relative" ref={rootRef}>
        <button
          id={triggerId}
          type="button"
          disabled={disabled}
          onBlur={onBlur}
          onClick={() => setIsOpen((open) => !open)}
          onKeyDown={handleKeyDown}
          className={cn(
            selectVariants({ selectSize }),
            'flex items-center justify-between text-left',
            !selectedOption && 'text-muted',
            className,
          )}
          role="combobox"
          aria-controls={listboxId}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className="truncate">{selectedOption?.label ?? placeholder}</span>
          <ChevronDown size="sm" className={cn('transition-transform', isOpen && 'rotate-180')} />
        </button>

        {isOpen && (
          <div
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-labelledby={triggerId}
            className="bg-secondary-dark border-stroke absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border p-1 shadow-lg"
          >
            {options.map((option) => {
              const isSelected = option.value === value

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm transition-colors',
                    isSelected
                      ? 'bg-primary-dark text-white'
                      : 'text-foreground hover:bg-secondary',
                  )}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  },
)

Select.displayName = 'Select'