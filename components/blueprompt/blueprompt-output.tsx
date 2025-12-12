'use client'

import { useRef, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/ui/copy-button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sparkles, Download, ChevronDown, CheckCircle2, AlertTriangle } from 'lucide-react'
import { STRIPE_PAYMENT_LINK, TARGET_BUILDER_LABELS } from '@/lib/blueprompt/constants'
import type { BluepromptInput, BluepromptOutput, TargetBuilder } from '@/types/blueprompt'

function getHelperText(builder: TargetBuilder): string {
  if (builder === 'generic') {
    return 'Paste into your preferred AI builder\nto kick-start your build'
  }
  return `Paste into ${TARGET_BUILDER_LABELS[builder]}\nto kick-start your build`
}

interface BluepromptOutputPanelProps {
  input: BluepromptInput
  output: BluepromptOutput | null
  streamingText?: string
  loading: boolean
  error: string | null
  onOpenSupport: () => void
}

function formatInputForExport(input: BluepromptInput): string {
  return `## Input

**App Idea:**
${input.appIdea}

**Primary Users:**
${input.primaryUsers}

**Goal:**
${input.goal}

**Constraints:**
${input.constraints || 'None specified'}

**Target Builder:**
${input.targetBuilder}

---

`
}

function downloadTextFile(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function BluepromptOutputPanel({
  input,
  output,
  streamingText,
  loading,
  error,
  onOpenSupport,
}: BluepromptOutputPanelProps) {
  const [showStatus, setShowStatus] = useState<'complete' | 'incomplete' | null>(null)
  const streamingContainerRef = useRef<HTMLDivElement>(null)
  const wasLoadingRef = useRef(false)

  useEffect(() => {
    if (streamingText && streamingContainerRef.current) {
      streamingContainerRef.current.scrollTop = streamingContainerRef.current.scrollHeight
    }
  }, [streamingText])

  useEffect(() => {
    let showTimer: ReturnType<typeof setTimeout> | undefined
    let hideTimer: ReturnType<typeof setTimeout> | undefined

    if (wasLoadingRef.current && !loading && output) {
      const isIncomplete = output.eval && !output.eval.valid
      const status = isIncomplete ? 'incomplete' : 'complete'
      const hideDelay = isIncomplete ? 8000 : 3000

      showTimer = setTimeout(() => setShowStatus(status), 0)
      hideTimer = setTimeout(() => setShowStatus(null), hideDelay)
    }
    wasLoadingRef.current = loading

    return () => {
      if (showTimer) clearTimeout(showTimer)
      if (hideTimer) clearTimeout(hideTimer)
    }
  }, [loading, output])

  function handleDownload(type: 'full' | 'app' | 'agent' | 'with-input') {
    if (!output) return
    const date = new Date().toISOString().slice(0, 10)

    switch (type) {
      case 'with-input':
        downloadTextFile(
          `blueprompt-complete-${date}.txt`,
          formatInputForExport(input) + output.fullPrompt
        )
        break
      case 'full':
        downloadTextFile(`blueprompt-${date}.txt`, output.fullPrompt)
        break
      case 'app':
        if (output.appOnlyPrompt) {
          downloadTextFile(`blueprompt-app-${date}.txt`, output.appOnlyPrompt)
        }
        break
      case 'agent':
        if (output.agentOnlyPrompt) {
          downloadTextFile(`blueprompt-agent-${date}.txt`, output.agentOnlyPrompt)
        }
        break
    }
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Blueprint & Prompt</CardTitle>
          <div className="flex items-center gap-2">
            {showStatus === 'complete' && (
              <div className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400 animate-in fade-in slide-in-from-right-2 duration-300">
                <CheckCircle2 className="size-4" />
                <span>Complete</span>
              </div>
            )}
            {showStatus === 'incomplete' && (
              <div className="flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400 animate-in fade-in slide-in-from-right-2 duration-300">
                <AlertTriangle className="size-4" />
                <span>Incomplete</span>
              </div>
            )}
          </div>
        </div>
        {output && (
          <div className="flex flex-wrap items-center gap-2">
            <CopyButton text={output.fullPrompt} label="Full" />
            {output.appOnlyPrompt && (
              <CopyButton text={output.appOnlyPrompt} label="App" />
            )}
            {output.agentOnlyPrompt && (
              <CopyButton text={output.agentOnlyPrompt} label="Agent" />
            )}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="h-8 px-2 text-xs">
                  <Download className="size-3" />
                  <span className="ml-1">Download</span>
                  <ChevronDown className="ml-1 size-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleDownload('with-input')}>
                  Complete (with input)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownload('full')}>
                  Full Blueprompt
                </DropdownMenuItem>
                {output.appOnlyPrompt && (
                  <DropdownMenuItem onClick={() => handleDownload('app')}>
                    App only
                  </DropdownMenuItem>
                )}
                {output.agentOnlyPrompt && (
                  <DropdownMenuItem onClick={() => handleDownload('agent')}>
                    Agent only
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {loading && (
          <>
            {streamingText ? (
              <div className="space-y-4">
                <div className="overflow-hidden rounded-lg border border-border bg-muted/30">
                  <div
                    ref={streamingContainerRef}
                    className="max-h-[60vh] overflow-y-auto p-4"
                  >
                    <pre className="whitespace-pre-wrap text-sm text-foreground font-mono leading-relaxed">
                      {streamingText}
                      <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-0.5" />
                    </pre>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="size-4 animate-pulse text-primary" />
                  <span>Creating...</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Sparkles className="mx-auto size-8 animate-pulse text-primary" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    Creating Blueprompt
                    <span className="text-loading-dots">
                      <span />
                      <span />
                      <span />
                    </span>
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {error && !loading && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {output && !loading && (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-border bg-muted/30">
              <div className="max-h-[60vh] overflow-y-auto p-4">
                <pre className="whitespace-pre-wrap text-sm text-foreground font-mono leading-relaxed">
                  {output.fullPrompt.trim()}
                </pre>
              </div>
            </div>

            <div className="flex items-end justify-between border-t border-border pt-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground whitespace-pre-line">{getHelperText(input.targetBuilder)}</p>
                {output.usage && (
                  <p className="text-xs text-muted-foreground/70">
                    Tokens: {output.usage.totalTokens.toLocaleString()} ({output.usage.promptTokens.toLocaleString()} in / {output.usage.completionTokens.toLocaleString()} out)
                  </p>
                )}
              </div>
              {STRIPE_PAYMENT_LINK && (
                <Button size="sm" onClick={onOpenSupport} className="text-xs">
                  Support Blueprompt
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
