import { describe, it, expect } from 'vitest'
import { evaluateOutput, assertValidOutput } from '@/lib/blueprompt/output-eval'

const validOutput = `# Full Blueprompt

### Core Concept
A habit tracking app that helps users build better daily routines.

### Core Flows
1. User signs up
2. User creates habits
3. User tracks progress

### Screens
#### Dashboard
- Shows habit list
- Progress indicators

### Data Model
- User: id, email, name
- Habit: id, userId, name, frequency

### Agent Design
The AI acts as a supportive coach.

**What the AI does:**
- Provides encouragement
- Suggests improvements

### Implementation Notes
Start with MVP focusing on core habit tracking.

---

## App-Only Prompt

You are an expert front-end engineer.
Design and implement a habit tracking web app with the following properties:

Core concept:
- Simple habit tracker for daily routines

Build the following screens:
1. Dashboard - habit list with progress
2. Habit Editor - create/edit habits

Implementation notes:
- Mobile-first design
- Use React components

---

## Agent-Only Prompt

You are HabitCoach, a supportive habit tracking assistant.

Your personality:
- Encouraging and positive
- Non-judgmental

Your scope:
- Help users track habits
- Provide motivation

Your rules:
- Be supportive
- Keep responses concise
`

describe('evaluateOutput', () => {
  it('returns valid for complete output', () => {
    const result = evaluateOutput(validOutput)

    expect(result.valid).toBe(true)
    expect(result.missingHeadings).toEqual([])
  })

  it('detects missing # Full Blueprompt heading', () => {
    const incomplete = validOutput.replace('# Full Blueprompt', '# Something Else')
    const result = evaluateOutput(incomplete)

    expect(result.valid).toBe(false)
    expect(result.missingHeadings).toContain('# Full Blueprompt')
  })

  it('detects missing ## App-Only Prompt heading', () => {
    const incomplete = validOutput.replace('## App-Only Prompt', '## App Prompt')
    const result = evaluateOutput(incomplete)

    expect(result.valid).toBe(false)
    expect(result.missingHeadings).toContain('## App-Only Prompt')
  })

  it('detects missing ## Agent-Only Prompt heading', () => {
    const incomplete = validOutput.replace('## Agent-Only Prompt', '## Agent Prompt')
    const result = evaluateOutput(incomplete)

    expect(result.valid).toBe(false)
    expect(result.missingHeadings).toContain('## Agent-Only Prompt')
  })

  it('detects multiple missing headings', () => {
    const minimal = 'Just some random text without proper structure'
    const result = evaluateOutput(minimal)

    expect(result.valid).toBe(false)
    expect(result.missingHeadings).toHaveLength(3)
  })

  it('warns about missing recommended sections', () => {
    const withoutDataModel = validOutput.replace('### Data Model', '### Database')
    const result = evaluateOutput(withoutDataModel)

    expect(result.valid).toBe(true) // Still valid, just warnings
    expect(result.warnings).toContain('Missing recommended section: ### Data Model')
  })

  it('warns about suspiciously short output', () => {
    const short = `# Full Blueprompt
Short.

## App-Only Prompt
Brief.

## Agent-Only Prompt
Minimal.`

    const result = evaluateOutput(short)

    expect(result.valid).toBe(true)
    expect(result.warnings.some((w) => w.includes('suspiciously short'))).toBe(true)
  })

  it('warns about short App-Only section', () => {
    const shortAppOnly = validOutput.replace(
      /## App-Only Prompt[\s\S]*?(?=---\s*## Agent-Only)/,
      '## App-Only Prompt\n\nShort.\n\n---\n\n'
    )
    const result = evaluateOutput(shortAppOnly)

    expect(result.warnings.some((w) => w.includes('App-Only Prompt section appears too short'))).toBe(true)
  })
})

describe('assertValidOutput', () => {
  it('does not throw for valid output', () => {
    expect(() => assertValidOutput(validOutput)).not.toThrow()
  })

  it('throws for invalid output with missing headings', () => {
    const invalid = 'No proper structure here'

    expect(() => assertValidOutput(invalid)).toThrow('Invalid output: missing required sections')
  })

  it('throws with list of missing sections', () => {
    const partial = `# Full Blueprompt
Some content but missing other sections.`

    expect(() => assertValidOutput(partial)).toThrow('## App-Only Prompt')
    expect(() => assertValidOutput(partial)).toThrow('## Agent-Only Prompt')
  })
})
