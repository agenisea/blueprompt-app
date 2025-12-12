'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'

interface AboutSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AboutSheet({ open, onOpenChange }: AboutSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
      <SheetContent side="right" className="w-full max-w-md">
        <SheetHeader>
          <SheetTitle>About Blueprompt</SheetTitle>
          <SheetDescription>Learn what Blueprompt does and how to use it</SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-4 px-6 text-sm text-foreground/90">
          <p>
            Blueprompt is a blueprint and prompt creator for no-code apps and agentic systems.
          </p>
          <p>
            You describe what you want to build. Blueprompt turns that into a structured prompt
            that tools like v0, Lovable, and Replit can use to create UI, flows, and agent
            behavior.
          </p>
          <p className="font-medium text-foreground">It&apos;s designed to:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Clarify what you&apos;re building</li>
            <li>Separate product intent from implementation details</li>
            <li>Give AI builders a clean, opinionated starting point</li>
          </ul>
          <p className="pt-2 text-muted-foreground">
            This is an experiment. Use the prompts as a starting point, not a replacement for
            your judgment.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
