'use client'

import { X } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  onConfirm: () => void
  variant?: 'default' | 'destructive'
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Continue',
  onConfirm,
  variant = 'default',
}: ConfirmDialogProps) {
  function handleConfirm() {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogCancel autoFocus className="absolute top-4 right-4 h-auto w-auto rounded-sm border-0 bg-transparent p-1.5 opacity-70 shadow-none transition-all hover:bg-muted hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-ring active:bg-muted active:opacity-100 disabled:pointer-events-none">
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </AlertDialogCancel>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <Button
          onClick={handleConfirm}
          variant={variant}
          className="w-full"
        >
          {confirmLabel}
        </Button>
      </AlertDialogContent>
    </AlertDialog>
  )
}
