export interface OutputEvalResult {
  valid: boolean
  missingHeadings: string[]
  warnings: string[]
}

const REQUIRED_HEADINGS = ['# Full Blueprompt', '## App-Only Prompt', '## Agent-Only Prompt']

const EXPECTED_SECTIONS = [
  { heading: '### Core Concept', parent: '# Full Blueprompt' },
  { heading: '### Core Flows', parent: '# Full Blueprompt' },
  { heading: '### Screens', parent: '# Full Blueprompt' },
  { heading: '### Data Model', parent: '# Full Blueprompt' },
  { heading: '### Agent Design', parent: '# Full Blueprompt' },
]

export function evaluateOutput(content: string): OutputEvalResult {
  const missingHeadings: string[] = []
  const warnings: string[] = []

  for (const heading of REQUIRED_HEADINGS) {
    if (!content.includes(heading)) {
      missingHeadings.push(heading)
    }
  }

  for (const section of EXPECTED_SECTIONS) {
    if (!content.includes(section.heading)) {
      warnings.push(`Missing recommended section: ${section.heading}`)
    }
  }

  const minLength = 500
  if (content.length < minLength) {
    warnings.push(`Output is suspiciously short (${content.length} chars, expected >${minLength})`)
  }

  const appOnlyStart = content.indexOf('## App-Only Prompt')
  const agentOnlyStart = content.indexOf('## Agent-Only Prompt')

  if (appOnlyStart !== -1 && agentOnlyStart !== -1) {
    const appOnlyLength = agentOnlyStart - appOnlyStart
    if (appOnlyLength < 200) {
      warnings.push('App-Only Prompt section appears too short')
    }

    const agentOnlyLength = content.length - agentOnlyStart
    if (agentOnlyLength < 200) {
      warnings.push('Agent-Only Prompt section appears too short')
    }
  }

  return {
    valid: missingHeadings.length === 0,
    missingHeadings,
    warnings,
  }
}

export function assertValidOutput(content: string): void {
  const result = evaluateOutput(content)

  if (!result.valid) {
    throw new Error(
      `Invalid output: missing required sections: ${result.missingHeadings.join(', ')}`
    )
  }

  if (result.warnings.length > 0) {
    console.warn('[output-eval] Warnings:', result.warnings)
  }
}
