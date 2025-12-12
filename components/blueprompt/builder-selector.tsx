'use client'

import { Check } from 'lucide-react'
import { TARGET_BUILDERS, TARGET_BUILDER_LABELS } from '@/lib/blueprompt/constants'
import type { TargetBuilder } from '@/types/blueprompt'

const BUILDER_DESCRIPTIONS: Record<TargetBuilder, string> = {
  v0: 'UI-first apps with integrations',
  lovable: 'Full-stack apps with integrations',
  replit: 'End-to-end apps with instant deployment',
  generic: 'Works with any no-code or AI builder',
}

interface BuilderSelectorProps {
  value: TargetBuilder
  onChange: (value: TargetBuilder) => void
  disabled?: boolean
}

export function BuilderSelector({ value, onChange, disabled }: BuilderSelectorProps) {
  return (
    <div className="rounded-lg border border-input bg-background p-2">
      {TARGET_BUILDERS.map((builder) => {
        const isSelected = value === builder

        return (
          <button
            key={builder}
            type="button"
            onClick={() => onChange(builder)}
            disabled={disabled}
            className={`flex items-start gap-3 px-3 py-2.5 rounded-md transition-colors text-left w-full ${
              isSelected
                ? 'bg-primary/10'
                : 'hover:bg-muted active:bg-muted'
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">
                {TARGET_BUILDER_LABELS[builder]}
              </div>
              <div className="text-xs text-muted-foreground">
                {BUILDER_DESCRIPTIONS[builder]}
              </div>
            </div>
            {isSelected && (
              <Check className="size-4 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
            )}
          </button>
        )
      })}
    </div>
  )
}
