'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TextareaField } from '@/components/ui/textarea-field'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { BuilderSelector } from './builder-selector'
import { EXAMPLE_INPUT, EXAMPLE_OUTPUT } from '@/lib/blueprompt/example-output'
import { validateField, validateAllFields, FIELD_LIMITS, type FieldErrors } from '@/lib/blueprompt/validation'
import { TARGET_BUILDER_LABELS } from '@/lib/blueprompt/constants'
import type { BluepromptInput, BluepromptOutput } from '@/types/blueprompt'

type ConfirmAction = 'example' | 'reset' | null

interface BluepromptFormProps {
  value: BluepromptInput
  onChange: (value: BluepromptInput) => void
  onSubmit: () => void
  onTryExample: (input: BluepromptInput, output: BluepromptOutput) => void
  onReset: () => void
  loading: boolean
  hasOutput: boolean
  shortTitle?: boolean
}

export function BluepromptForm({
  value,
  onChange,
  onSubmit,
  onTryExample,
  onReset,
  loading,
  hasOutput,
  shortTitle,
}: BluepromptFormProps) {
  const [errors, setErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [formKey, setFormKey] = useState(0)
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)
  const [constraintsOpen, setConstraintsOpen] = useState('')

  function handleChange(field: keyof BluepromptInput, val: string) {
    onChange({ ...value, [field]: val })

    if (touched[field]) {
      const error = validateField(field as keyof FieldErrors, val)
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  function handleBlur(field: keyof FieldErrors) {
    setTouched(prev => ({ ...prev, [field]: true }))
    const error = validateField(field, value[field] || '')
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const allErrors = validateAllFields(value)
    setErrors(allErrors)
    setTouched({ appIdea: true, primaryUsers: true, goal: true, constraints: true })

    if (Object.keys(allErrors).length === 0) {
      onSubmit()
    }
  }

  const hasUserInput =
    value.appIdea.length > 0 ||
    value.primaryUsers.length > 0 ||
    value.goal.length > 0 ||
    (value.constraints?.length ?? 0) > 0

  function handleTryExample() {
    if (hasUserInput) {
      setConfirmAction('example')
      return
    }
    executeTryExample()
  }

  function executeTryExample() {
    setErrors({})
    setTouched({})
    if (EXAMPLE_INPUT.constraints) {
      setConstraintsOpen('constraints')
    }
    onTryExample(EXAMPLE_INPUT, EXAMPLE_OUTPUT)
  }

  function handleResetForm() {
    if (hasUserInput) {
      setConfirmAction('reset')
      return
    }
    executeReset()
  }

  function executeReset() {
    setErrors({})
    setTouched({})
    setFormKey(k => k + 1)
    onReset()
  }

  function handleConfirm() {
    if (confirmAction === 'example') {
      executeTryExample()
    } else if (confirmAction === 'reset') {
      executeReset()
    }
    setConfirmAction(null)
  }

  const hasErrors = Object.values(errors).some(error => error !== undefined)

  const isValid =
    value.appIdea.length >= 10 &&
    value.primaryUsers.length >= 3 &&
    value.goal.length >= 3 &&
    !hasErrors

  const hasContent =
    value.appIdea.length > 0 ||
    value.primaryUsers.length > 0 ||
    value.goal.length > 0 ||
    (value.constraints?.length ?? 0) > 0 ||
    hasOutput

  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-lg">{shortTitle ? 'Your idea' : 'Describe your idea'}</CardTitle>
          <div className="flex shrink-0 gap-2">
            {hasContent && (
              <Button
                type="button"
                size="sm"
                onClick={handleResetForm}
                disabled={loading}
                className="text-xs"
              >
                Reset
              </Button>
            )}
            <Button
              type="button"
              size="sm"
              onClick={handleTryExample}
              disabled={loading}
              className="text-xs"
            >
              Try Example
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Share your app concept and we&apos;ll create a blueprint and prompt you can build
          with no-code tools
        </p>
      </CardHeader>
      <CardContent>
        <form key={formKey} onSubmit={handleSubmit} className="space-y-4">
          {/* App idea - always full width */}
          <TextareaField
            id="appIdea"
            label="App idea"
            value={value.appIdea}
            onChange={(val) => handleChange('appIdea', val)}
            onBlur={() => handleBlur('appIdea')}
            placeholder="An app that helps builders evaluate new product ideas before committing resources..."
            rows={3}
            minHeight="5rem"
            required
            disabled={loading}
            error={errors.appIdea}
            min={FIELD_LIMITS.appIdea.min}
            max={FIELD_LIMITS.appIdea.max}
          />

          {/* Primary users + Goal - 2 columns on desktop */}
          <div className="grid gap-4 lg:grid-cols-2">
            <TextareaField
              id="primaryUsers"
              label="Primary users"
              value={value.primaryUsers}
              onChange={(val) => handleChange('primaryUsers', val)}
              onBlur={() => handleBlur('primaryUsers')}
              placeholder="Adults, teens, interested in AI..."
              rows={2}
              minHeight="2.5rem"
              required
              disabled={loading}
              error={errors.primaryUsers}
              min={FIELD_LIMITS.primaryUsers.min}
              max={FIELD_LIMITS.primaryUsers.max}
            />

            <TextareaField
              id="goal"
              label="Goal"
              value={value.goal}
              onChange={(val) => handleChange('goal', val)}
              onBlur={() => handleBlur('goal')}
              placeholder="Validate ideas quickly, get actionable recommendations..."
              rows={2}
              minHeight="2.5rem"
              required
              disabled={loading}
              error={errors.goal}
              min={FIELD_LIMITS.goal.min}
              max={FIELD_LIMITS.goal.max}
            />
          </div>

          {/* Target builder + Constraints - side by side on desktop, stacked on mobile */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Accordion type="single" collapsible defaultValue="builder" className="pb-4 lg:pb-0">
              <AccordionItem value="builder" className="border-0">
                <AccordionTrigger className="py-0 hover:no-underline">
                  <span className="text-sm font-medium text-foreground">
                    Target builder
                    <span className="font-normal text-muted-foreground ml-2">
                      {TARGET_BUILDER_LABELS[value.targetBuilder]}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-2">
                    <BuilderSelector
                      value={value.targetBuilder}
                      onChange={(builder) => handleChange('targetBuilder', builder)}
                      disabled={loading}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible value={constraintsOpen} onValueChange={setConstraintsOpen} className="pb-4 lg:pb-0">
              <AccordionItem value="constraints" className="border-0">
                <AccordionTrigger className="py-0 hover:no-underline">
                  <span className="text-sm font-medium text-foreground">
                    Constraints{' '}
                    <span className="font-normal text-muted-foreground">(optional)</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-2">
                    <TextareaField
                      id="constraints"
                      label=""
                      value={value.constraints ?? ''}
                      onChange={(val) => handleChange('constraints', val)}
                      onBlur={() => handleBlur('constraints')}
                      placeholder="Solo builder, limited budget, need MVP in 2 weeks..."
                      rows={4}
                      minHeight="6rem"
                      disabled={loading}
                      error={errors.constraints}
                      min={FIELD_LIMITS.constraints.min}
                      max={FIELD_LIMITS.constraints.max}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <Button type="submit" disabled={loading || !isValid} className="w-full mt-2">
            {loading ? (
              <>
                Creating
                <span className="text-loading-dots">
                  <span />
                  <span />
                  <span />
                </span>
              </>
            ) : (
              'Create Blueprompt'
            )}
          </Button>
        </form>
      </CardContent>

      <ConfirmDialog
        open={confirmAction !== null}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title={confirmAction === 'reset' ? 'Clear form?' : 'Load example?'}
        description={
          confirmAction === 'reset'
            ? 'This will clear all your input, so you can start fresh.'
            : 'This will replace your current input with an example.'
        }
        confirmLabel={confirmAction === 'reset' ? 'Clear' : 'Load example'}
        onConfirm={handleConfirm}
        variant={confirmAction === 'reset' ? 'destructive' : 'default'}
      />
    </Card>
  )
}
