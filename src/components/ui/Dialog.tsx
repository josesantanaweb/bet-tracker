import { X } from '@boxicons/react'
import { AnimatePresence, motion } from 'framer-motion'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@/lib/cn'

type DialogContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextValue | null>(null)

const useDialogContext = () => {
  const context = React.useContext(DialogContext)

  if (!context) {
    throw new Error('Dialog components must be used inside <Dialog>.')
  }

  return context
}

type DialogProps = {
  children: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

const Dialog = ({ children, open, defaultOpen = false, onOpenChange }: DialogProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isControlled = typeof open === 'boolean'
  const isOpen = isControlled ? open : internalOpen

  const setOpen = (nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen)
    }

    onOpenChange?.(nextOpen)
  }

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen])

  const value = { open: isOpen, setOpen }

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
}

type DialogTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>

const DialogTrigger = ({ onClick, ...props }: DialogTriggerProps) => {
  const { setOpen } = useDialogContext()

  return (
    <button
      type="button"
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          setOpen(true)
        }
      }}
      {...props}
    />
  )
}

type DialogContentProps = React.HTMLAttributes<HTMLDivElement> & {
  maxWidth?: string
}

const DialogContent = ({ className, children, maxWidth, ...props }: DialogContentProps) => {
  const { open, setOpen } = useDialogContext()

  useEffect(() => {
    if (!open) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, setOpen])

  if (typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="dialog-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          onMouseDown={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div
              role="dialog"
              aria-modal="true"
              className={cn(
                'bg-secondary-dark relative w-full min-w-102.5 rounded-2xl p-6 shadow-2xl',
                className,
              )}
              style={maxWidth ? { maxWidth } : undefined}
              {...props}
            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

type DialogTitleProps = React.HTMLAttributes<HTMLHeadingElement>

const DialogTitle = ({ className, ...props }: DialogTitleProps) => {
  return <h2 className={cn('text-lg font-semibold text-white', className)} {...props} />
}

type DialogDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>

const DialogDescription = ({ className, ...props }: DialogDescriptionProps) => {
  return <p className={cn('text-xs text-white/75', className)} {...props} />
}

type DialogCloseProps = React.ButtonHTMLAttributes<HTMLButtonElement>

const DialogClose = ({ className, children, onClick, ...props }: DialogCloseProps) => {
  const { setOpen } = useDialogContext()

  return (
    <button
      type="button"
      className={cn(
        'absolute top-3 right-3 cursor-pointer rounded-full p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white',
        className,
      )}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          setOpen(false)
        }
      }}
      {...props}
    >
      {children ?? <X size="sm" />}
    </button>
  )
}

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn('flex flex-col mb-6', className)} {...props} />
}

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn('flex items-center justify-end gap-2', className)} {...props} />
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
}
