'use client'

import { useState } from 'react'
import { Claude } from '@lobehub/icons'
import { BluepromptHeader } from '@/components/blueprompt/blueprompt-header'
import { AboutSheet } from '@/components/blueprompt/about-sheet'
import { SupportSheet } from '@/components/blueprompt/support-sheet'
import { Footer } from '@/components/layout/footer'

export default function ClaudeCodePage() {
  const [aboutOpen, setAboutOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)

  return (
    <>
      <AboutSheet open={aboutOpen} onOpenChange={setAboutOpen} />
      <SupportSheet open={supportOpen} onOpenChange={setSupportOpen} />

      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1 mx-auto w-full max-w-5xl px-4 pb-12 pt-6 sm:px-6 sm:pt-10 lg:px-8">
          <BluepromptHeader
            onOpenAbout={() => setAboutOpen(true)}
            onOpenSupport={() => setSupportOpen(true)}
          />

          <main className="mt-8">
            {/* Title */}
            <div className="flex items-center gap-3 mb-6">
              <span className="pointer-events-none">
                <Claude size={32} color="currentColor" />
              </span>
              <h1 className="text-2xl font-semibold tracking-tight">
                <span className="sm:hidden">Use Blueprompt<br />with Claude Code</span>
                <span className="hidden sm:inline">Use Blueprompt with Claude Code</span>
              </h1>
            </div>

            <p className="text-muted-foreground mb-4">
              Run Blueprompt directly from your terminal as a Claude Code slash command.
              Generate structured app blueprints and agent prompts without leaving your workflow.
            </p>

            <p className="text-sm text-muted-foreground mb-8">
              <a
                href="/blueprompt-instructions.md"
                download="blueprompt-instructions.md"
                className="text-foreground underline underline-offset-2 hover:text-foreground/80"
              >
                Download instructions
              </a>
              {' '}for offline reference.
            </p>

            {/* Installation */}
            <section className="mb-10">
              <h2 className="text-lg font-medium mb-4">Installation</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong className="text-foreground">Option 1:</strong> Install globally (available in all projects)
                  </p>
                  <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
                    <code>curl -o ~/.claude/commands/blueprompt.md https://blueprompt.app/blueprompt.md</code>
                  </pre>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong className="text-foreground">Option 2:</strong> Install per-project
                  </p>
                  <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
                    <code>mkdir -p .claude/commands && curl -o .claude/commands/blueprompt.md https://blueprompt.app/blueprompt.md</code>
                  </pre>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong className="text-foreground">Option 3:</strong> Manual download
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <a
                      href="/blueprompt.md"
                      download="blueprompt.md"
                      className="text-foreground underline underline-offset-2 hover:text-foreground/80"
                    >
                      Download blueprompt.md
                    </a>
                    {' '}and save it to <code className="bg-muted px-1.5 py-0.5 rounded text-xs">~/.claude/commands/</code> or <code className="bg-muted px-1.5 py-0.5 rounded text-xs">.claude/commands/</code>
                  </p>
                </div>
              </div>
            </section>

            {/* Usage */}
            <section className="mb-10">
              <h2 className="text-lg font-medium mb-4">Usage</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Run the slash command:</p>
                  <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
                    <code>/blueprompt</code>
                  </pre>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Then describe your app idea:</p>
                  <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto whitespace-pre-wrap">
                    <code>{`What: A habit tracking app for developers who want to build consistent coding practices

Who: Solo developers, bootcamp grads, career switchers

Goal: Help users build daily coding habits with streaks and gentle reminders

Constraints: MVP only, no backend yet

Target: v0`}</code>
                  </pre>
                </div>
              </div>
            </section>

            {/* What you get */}
            <section className="mb-10">
              <h2 className="text-lg font-medium mb-4">What you get</h2>

              <p className="text-sm text-muted-foreground mb-4">
                Blueprompt generates three outputs tailored to your target builder:
              </p>

              <ul className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="text-muted-foreground">1.</span>
                  <div>
                    <strong className="text-foreground">Full Blueprompt</strong>
                    <span className="text-muted-foreground"> — Detailed specs with core concept, user flows, screens, data model, and agent design</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-muted-foreground">2.</span>
                  <div>
                    <strong className="text-foreground">App-Only Prompt</strong>
                    <span className="text-muted-foreground"> — Condensed, copy-paste ready prompt for v0, Lovable, or Replit</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-muted-foreground">3.</span>
                  <div>
                    <strong className="text-foreground">Agent-Only Prompt</strong>
                    <span className="text-muted-foreground"> — Standalone system prompt for AI agent configuration</span>
                  </div>
                </li>
              </ul>
            </section>

            {/* Target builders */}
            <section className="mb-10">
              <h2 className="text-lg font-medium mb-4">Supported targets</h2>

              <p className="text-sm text-muted-foreground mb-4">
                Specify your target builder to get optimized output:
              </p>

              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><code className="bg-muted px-1.5 py-0.5 rounded text-xs text-foreground">v0</code> — UI-focused, component-level specs for Vercel&apos;s v0</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded text-xs text-foreground">lovable</code> — Full-stack specs for Lovable.dev</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded text-xs text-foreground">replit</code> — Code-centric specs for Replit Agent</li>
                <li><code className="bg-muted px-1.5 py-0.5 rounded text-xs text-foreground">generic</code> — Tool-agnostic, concept-first output</li>
              </ul>
            </section>

          </main>
        </div>

        <Footer />
      </div>
    </>
  )
}
