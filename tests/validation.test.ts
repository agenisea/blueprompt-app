import { describe, it, expect } from 'vitest'
import {
  validateField,
  validateAllFields,
  bluepromptInputSchema,
  FIELD_LIMITS,
} from '@/lib/blueprompt/validation'

describe('bluepromptInputSchema', () => {
  it('accepts valid input', () => {
    const validInput = {
      appIdea: 'A habit tracking app that helps users build better routines',
      primaryUsers: 'Busy professionals',
      goal: 'Help users stick to their habits',
      constraints: 'Solo founder, limited budget',
      targetBuilder: 'v0' as const,
    }

    const result = bluepromptInputSchema.safeParse(validInput)
    expect(result.success).toBe(true)
  })

  it('accepts input without constraints', () => {
    const validInput = {
      appIdea: 'A habit tracking app that helps users build better routines',
      primaryUsers: 'Busy professionals',
      goal: 'Help users stick to their habits',
      targetBuilder: 'generic' as const,
    }

    const result = bluepromptInputSchema.safeParse(validInput)
    expect(result.success).toBe(true)
  })

  it('rejects appIdea that is too short', () => {
    const invalidInput = {
      appIdea: 'Short',
      primaryUsers: 'Busy professionals',
      goal: 'Help users',
      targetBuilder: 'v0' as const,
    }

    const result = bluepromptInputSchema.safeParse(invalidInput)
    expect(result.success).toBe(false)
  })

  it('rejects invalid targetBuilder', () => {
    const invalidInput = {
      appIdea: 'A habit tracking app that helps users build better routines',
      primaryUsers: 'Busy professionals',
      goal: 'Help users stick to their habits',
      targetBuilder: 'invalid' as const,
    }

    const result = bluepromptInputSchema.safeParse(invalidInput)
    expect(result.success).toBe(false)
  })
})

describe('validateField', () => {
  it('returns undefined for valid appIdea', () => {
    const error = validateField('appIdea', 'A habit tracking app that helps users')
    expect(error).toBeUndefined()
  })

  it('returns error message for appIdea below minimum', () => {
    const error = validateField('appIdea', 'Short')
    expect(error).toBe(`App idea must be at least ${FIELD_LIMITS.appIdea.min} characters`)
  })

  it('returns error message for appIdea above maximum', () => {
    const longText = 'x'.repeat(FIELD_LIMITS.appIdea.max + 1)
    const error = validateField('appIdea', longText)
    expect(error).toBe(`App idea must be less than ${FIELD_LIMITS.appIdea.max} characters`)
  })

  it('returns undefined for valid primaryUsers', () => {
    const error = validateField('primaryUsers', 'Developers and designers')
    expect(error).toBeUndefined()
  })

  it('returns error for primaryUsers below minimum', () => {
    const error = validateField('primaryUsers', 'ab')
    expect(error).toBe(`Primary users must be at least ${FIELD_LIMITS.primaryUsers.min} characters`)
  })

  it('returns undefined for valid goal', () => {
    const error = validateField('goal', 'Help users build habits')
    expect(error).toBeUndefined()
  })

  it('returns undefined for empty constraints (optional field)', () => {
    const error = validateField('constraints', '')
    expect(error).toBeUndefined()
  })

  it('returns error for constraints above maximum', () => {
    const longText = 'x'.repeat(FIELD_LIMITS.constraints.max + 1)
    const error = validateField('constraints', longText)
    expect(error).toBe(`Constraints must be less than ${FIELD_LIMITS.constraints.max} characters`)
  })
})

describe('validateAllFields', () => {
  it('returns empty object for valid input', () => {
    const errors = validateAllFields({
      appIdea: 'A habit tracking app that helps users build better routines',
      primaryUsers: 'Busy professionals',
      goal: 'Help users stick to their habits',
    })
    expect(errors).toEqual({})
  })

  it('returns multiple errors for multiple invalid fields', () => {
    const errors = validateAllFields({
      appIdea: 'Short',
      primaryUsers: 'ab',
      goal: 'x',
    })
    expect(errors.appIdea).toBeDefined()
    expect(errors.primaryUsers).toBeDefined()
    expect(errors.goal).toBeDefined()
  })

  it('validates constraints when provided', () => {
    const longConstraints = 'x'.repeat(FIELD_LIMITS.constraints.max + 1)
    const errors = validateAllFields({
      appIdea: 'A habit tracking app that helps users build better routines',
      primaryUsers: 'Busy professionals',
      goal: 'Help users stick to their habits',
      constraints: longConstraints,
    })
    expect(errors.constraints).toBeDefined()
  })
})
