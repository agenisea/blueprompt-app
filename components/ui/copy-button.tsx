'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CopyButtonProps {
  text: string | null | undefined
  label: string
  className?: string
}

export function CopyButton({ text, label, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (!text) return
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      size="sm"
      onClick={handleCopy}
      disabled={!text}
      className={className ?? 'h-8 px-2 text-xs'}
    >
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
      <span className="ml-1">{label}</span>
    </Button>
  )
}
