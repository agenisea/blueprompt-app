'use client'

import { QRCodeSVG } from 'qrcode.react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { STRIPE_PAYMENT_LINK } from '@/lib/blueprompt/constants'

interface SupportSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SupportSheet({ open, onOpenChange }: SupportSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
      <SheetContent
        side="bottom"
        className="mx-auto w-full max-w-xl rounded-t-2xl border border-border/60"
      >
        <SheetHeader>
          <SheetTitle>Support Blueprompt</SheetTitle>
          <SheetDescription>Help keep the project running</SheetDescription>
        </SheetHeader>
        <div className="mt-1 space-y-4 px-6 pb-10 text-sm text-muted-foreground">
          <p>
            Each prompt uses paid AI infrastructure. If this helped, you can support the
            next one.
          </p>
          <div className="flex items-start gap-6">
            <div className="space-y-3">
              <p className="text-2xl font-semibold text-foreground">
                $1 <span className="text-xs uppercase tracking-wide text-muted-foreground">suggested / Blueprompt creation</span>
              </p>
              <Button size="sm" asChild>
                <a href={STRIPE_PAYMENT_LINK} target="_blank" rel="noopener noreferrer">
                  Contribute $1
                </a>
              </Button>
            </div>
            <div className="hidden sm:flex flex-col items-center gap-1">
              <div className="rounded-lg bg-white p-2">
                <QRCodeSVG
                  value={STRIPE_PAYMENT_LINK}
                  size={80}
                  level="M"
                />
              </div>
              <span className="text-xs text-muted-foreground/60">Scan QR code to support</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground/80">
            Powered by your $1 tips — thank you.
          </p>
          <p className="text-xs text-muted-foreground/60">
            No subscriptions. No tracking. Just enough support to keep experimenting with
            human-first tools.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
