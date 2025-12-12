export type TargetBuilder = 'v0' | 'lovable' | 'replit' | 'generic'

export interface BluepromptInput {
  appIdea: string
  primaryUsers: string
  goal: string
  constraints?: string
  targetBuilder: TargetBuilder
}

export interface TokenUsage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
}

export interface OutputEval {
  valid: boolean
  missingHeadings: string[]
  warnings: string[]
}

export interface BluepromptOutput {
  fullPrompt: string
  appOnlyPrompt: string | null
  agentOnlyPrompt: string | null
  usage?: TokenUsage
  eval?: OutputEval
}
