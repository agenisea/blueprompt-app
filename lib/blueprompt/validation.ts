import { z } from 'zod'

export const FIELD_LIMITS = {
  appIdea: { min: 10, max: 1600 },
  primaryUsers: { min: 3, max: 300 },
  goal: { min: 3, max: 400 },
  constraints: { min: 0, max: 800 },
} as const

export const bluepromptInputSchema = z.object({
  appIdea: z
    .string()
    .min(FIELD_LIMITS.appIdea.min, `App idea must be at least ${FIELD_LIMITS.appIdea.min} characters`)
    .max(FIELD_LIMITS.appIdea.max, `App idea must be less than ${FIELD_LIMITS.appIdea.max} characters`),
  primaryUsers: z
    .string()
    .min(FIELD_LIMITS.primaryUsers.min, `Primary users must be at least ${FIELD_LIMITS.primaryUsers.min} characters`)
    .max(FIELD_LIMITS.primaryUsers.max, `Primary users must be less than ${FIELD_LIMITS.primaryUsers.max} characters`),
  goal: z
    .string()
    .min(FIELD_LIMITS.goal.min, `Goal must be at least ${FIELD_LIMITS.goal.min} characters`)
    .max(FIELD_LIMITS.goal.max, `Goal must be less than ${FIELD_LIMITS.goal.max} characters`),
  constraints: z
    .string()
    .max(FIELD_LIMITS.constraints.max, `Constraints must be less than ${FIELD_LIMITS.constraints.max} characters`)
    .optional()
    .or(z.literal('')),
  targetBuilder: z.enum(['v0', 'lovable', 'replit', 'generic']),
})

export type BluepromptInputSchema = z.infer<typeof bluepromptInputSchema>

export type FieldErrors = {
  appIdea?: string
  primaryUsers?: string
  goal?: string
  constraints?: string
}

export function validateField(
  field: keyof FieldErrors,
  value: string
): string | undefined {
  const fieldSchemas = {
    appIdea: bluepromptInputSchema.shape.appIdea,
    primaryUsers: bluepromptInputSchema.shape.primaryUsers,
    goal: bluepromptInputSchema.shape.goal,
    constraints: bluepromptInputSchema.shape.constraints,
  }

  const schema = fieldSchemas[field]
  if (!schema) return undefined

  const result = schema.safeParse(value)
  if (result.success) return undefined

  return result.error.errors[0]?.message
}

export function validateAllFields(data: {
  appIdea: string
  primaryUsers: string
  goal: string
  constraints?: string
}): FieldErrors {
  const errors: FieldErrors = {}

  const appIdeaError = validateField('appIdea', data.appIdea)
  if (appIdeaError) errors.appIdea = appIdeaError

  const primaryUsersError = validateField('primaryUsers', data.primaryUsers)
  if (primaryUsersError) errors.primaryUsers = primaryUsersError

  const goalError = validateField('goal', data.goal)
  if (goalError) errors.goal = goalError

  if (data.constraints) {
    const constraintsError = validateField('constraints', data.constraints)
    if (constraintsError) errors.constraints = constraintsError
  }

  return errors
}
