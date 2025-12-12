'use client'

import { useState, useEffect } from 'react'
import type { BluepromptInput, BluepromptOutput } from '@/types/blueprompt'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { createSSEParser } from '@/lib/streaming/client'
import { STREAMING_PHASE } from '@/lib/streaming/constants'
import { BluepromptHeader } from './blueprompt-header'
import { BluepromptForm } from './blueprompt-form'
import { BluepromptOutputPanel } from './blueprompt-output'
import { AboutSheet } from './about-sheet'
import { SupportSheet } from './support-sheet'
import { Footer } from '@/components/layout/footer'

const DEFAULT_INPUT: BluepromptInput = {
  appIdea: '',
  primaryUsers: '',
  goal: '',
  constraints: '',
  targetBuilder: 'generic',
}

const STORAGE_KEY = 'blueprompt-draft'

export function BluepromptPage() {
  const [input, setInput, clearDraft] = useLocalStorage<BluepromptInput>(STORAGE_KEY, DEFAULT_INPUT)
  const [output, setOutput] = useState<BluepromptOutput | null>(null)
  const [streamingText, setStreamingText] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [aboutOpen, setAboutOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('input')

  const hasContent = loading || output !== null || error !== null

  // Auto-switch to output tab when generation starts
  useEffect(() => {
    if (loading) {
      setActiveTab('output')
    }
  }, [loading])

  function handleTryExample(exampleInput: BluepromptInput, exampleOutput: BluepromptOutput) {
    setInput(exampleInput)
    setOutput(exampleOutput)
    setError(null)
    setStreamingText('')
    setActiveTab('output')
  }

  function handleReset() {
    setInput(DEFAULT_INPUT)
    clearDraft()
    setOutput(null)
    setError(null)
    setStreamingText('')
    setActiveTab('input')
  }

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    setOutput(null)
    setStreamingText('')

    let accumulatedText = ''

    try {
      const res = await fetch('/api/blueprompt/create?stream=true', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Something went wrong.')
        return
      }

      const reader = res.body?.getReader()
      if (!reader) {
        setError('Streaming not supported')
        return
      }

      const decoder = new TextDecoder()

      const parser = createSSEParser({
        onMessage: (update) => {
          if (update.phase === STREAMING_PHASE.CREATING && update.delta) {
            accumulatedText += update.delta
            setStreamingText(accumulatedText)
          } else if (update.phase === STREAMING_PHASE.COMPLETE && update.result) {
            setOutput(update.result)
            setStreamingText('')
          } else if (update.phase === STREAMING_PHASE.ERROR) {
            setError(update.error ?? 'Creation failed')
          }
        },
        onError: (err) => {
          console.error('[SSE] Parse error:', err)
        },
      })

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        parser(decoder.decode(value, { stream: true }))
      }
    } catch (err) {
      console.error(err)
      // Preserve partial content on network error so user can copy it
      if (accumulatedText.trim()) {
        setOutput({
          fullPrompt: accumulatedText.trim(),
          appOnlyPrompt: null,
          agentOnlyPrompt: null,
        })
        setStreamingText('')
        setError('Network error interrupted creation, see partial content below.')
      } else {
        setError('Network error. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AboutSheet open={aboutOpen} onOpenChange={setAboutOpen} />
      <SupportSheet open={supportOpen} onOpenChange={setSupportOpen} />

      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1 mx-auto w-full max-w-5xl px-4 pb-12 pt-6 sm:px-6 sm:pt-10 lg:px-8">
          <BluepromptHeader
            onOpenAbout={() => setAboutOpen(true)}
            onOpenSupport={() => setSupportOpen(true)}
          />

          <main id="main-content" className="mt-8">
            {/* Mobile: stacked layout */}
            <div className="md:hidden space-y-6">
              <BluepromptForm
                value={input}
                onChange={setInput}
                onSubmit={handleGenerate}
                onTryExample={handleTryExample}
                onReset={handleReset}
                loading={loading}
                hasOutput={output !== null || error !== null}
              />
              {hasContent && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <BluepromptOutputPanel
                    input={input}
                    output={output}
                    streamingText={streamingText}
                    loading={loading}
                    error={error}
                    onOpenSupport={() => setSupportOpen(true)}
                  />
                </div>
              )}
            </div>

            {/* Desktop: toggle between input and output */}
            <div className="hidden md:block">
              {/* Toggle header */}
              <div className="flex gap-1 mb-6 p-1 bg-muted rounded-lg w-fit">
                <button
                  onClick={() => setActiveTab('input')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'input'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Describe your idea
                </button>
                <button
                  onClick={() => setActiveTab('output')}
                  disabled={!hasContent}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'output'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Blueprint & Prompt
                </button>
              </div>

              {/* Content */}
              <div className={activeTab === 'input' || !hasContent ? 'block' : 'hidden'}>
                <BluepromptForm
                  value={input}
                  onChange={setInput}
                  onSubmit={handleGenerate}
                  onTryExample={handleTryExample}
                  onReset={handleReset}
                  loading={loading}
                  hasOutput={output !== null || error !== null}
                  shortTitle
                />
              </div>

              {hasContent && (
                <div className={activeTab === 'output' ? 'block' : 'hidden'}>
                  <BluepromptOutputPanel
                    input={input}
                    output={output}
                    streamingText={streamingText}
                    loading={loading}
                    error={error}
                    onOpenSupport={() => setSupportOpen(true)}
                  />
                </div>
              )}
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </>
  )
}
