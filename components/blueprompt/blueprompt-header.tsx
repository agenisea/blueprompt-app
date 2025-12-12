'use client'

import Image from 'next/image'
import { Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { COPY_TEXT, STRIPE_PAYMENT_LINK } from '@/lib/blueprompt/constants'

const GITHUB_URL = 'https://github.com/agenisea/blueprompt-app'

interface BluepromptHeaderProps {
  onOpenAbout: () => void
  onOpenSupport: () => void
}

export function BluepromptHeader({ onOpenAbout, onOpenSupport }: BluepromptHeaderProps) {
  return (
    <header className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-end sm:items-start gap-3">
          <Image
            src="/logo.png"
            alt="Blueprompt Logo"
            width={1200}
            height={800}
            className="h-12 w-auto shrink-0"
            priority
          />
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-primary">
              {COPY_TEXT.headerTitle}
            </h1>
            <span className="w-fit rounded-full bg-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-primary">
              {COPY_TEXT.headerBadge}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mr-2"
            aria-label="View on GitHub"
          >
            <Github className="size-5 text-black" fill="black" />
          </a>
          <Button size="sm" onClick={onOpenAbout}>
            About
          </Button>
          {STRIPE_PAYMENT_LINK && (
            <Button size="sm" onClick={onOpenSupport}>
              Support
            </Button>
          )}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{COPY_TEXT.tagline}</p>
    </header>
  )
}
