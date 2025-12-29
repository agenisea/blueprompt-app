'use client'

import { useState, useEffect, useRef } from 'react'
import type { BluepromptInput, BluepromptOutput } from '@/types/blueprompt'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useSSEStream } from '@/lib/streaming/client'
import { STREAMING_PHASE, type StreamingPhase } from '@/lib/streaming/constants'
import type { StreamUpdate } from '@/lib/streaming/types'
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
  const accumulatedTextRef = useRef<string>('')

  const [aboutOpen, setAboutOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('input')

  const { state, start, reset: resetStream } = useSSEStream<
    BluepromptInput,
    BluepromptOutput,
    StreamUpdate,
    StreamingPhase
  >({
    endpoint: '/api/blueprompt/create',
    method: 'POST',
    streamQueryParam: true,
    initialPhase: STREAMING_PHASE.CREATING,
    completePhase: STREAMING_PHASE.COMPLETE,
    errorPhase: STREAMING_PHASE.ERROR,
    extractResult: (update) => update.result,
    extractError: (update) => update.error,
    isComplete: (update) => update.phase === STREAMING_PHASE.COMPLETE,
    isError: (update) => update.phase === STREAMING_PHASE.ERROR,
    onUpdate: (update) => {
      if (update.phase === STREAMING_PHASE.CREATING && update.delta) {
        accumulatedTextRef.current += update.delta
        setStreamingText(accumulatedTextRef.current)
      }
    },
    onComplete: (result) => {
      setOutput(result)
      setStreamingText('')
      accumulatedTextRef.current = ''
    },
    onError: (error) => {
      // Preserve partial content on error
      if (accumulatedTextRef.current.trim()) {
        setOutput({
          fullPrompt: accumulatedTextRef.current.trim(),
          appOnlyPrompt: null,
          agentOnlyPrompt: null,
        })
        setStreamingText('')
      }
      console.error('[SSE] Stream error:', error)
    },
    warnOnUnload: true,
  })

  const loading = state.isStreaming
  const error = state.error

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
    resetStream()
    setStreamingText('')
    accumulatedTextRef.current = ''
    setActiveTab('output')
  }

  function handleReset() {
    setInput(DEFAULT_INPUT)
    clearDraft()
    setOutput(null)
    resetStream()
    setStreamingText('')
    accumulatedTextRef.current = ''
    setActiveTab('input')
  }

  async function handleGenerate() {
    setOutput(null)
    setStreamingText('')
    accumulatedTextRef.current = ''
    await start(input)
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
