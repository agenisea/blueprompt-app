# Blueprompt for Claude Code - Installation Instructions

## Installation

### Option 1: Install globally (available in all projects)

```bash
curl -o ~/.claude/commands/blueprompt.md https://blueprompt.app/blueprompt.md
```

### Option 2: Install per-project

```bash
mkdir -p .claude/commands && curl -o .claude/commands/blueprompt.md https://blueprompt.app/blueprompt.md
```

### Option 3: Manual download

Download blueprompt.md from https://blueprompt.app/blueprompt.md and save it to:
- `~/.claude/commands/` (global)
- `.claude/commands/` (per-project)

## Usage

Run the slash command:

```
/blueprompt
```

Then describe your app idea:

```
What: A habit tracking app for developers who want to build consistent coding practices

Who: Solo developers, bootcamp grads, career switchers

Goal: Help users build daily coding habits with streaks and gentle reminders

Constraints: MVP only, no backend yet

Target: v0
```

## What You Get

Blueprompt generates three outputs tailored to your target builder:

1. **Full Blueprompt** - Detailed specs with core concept, user flows, screens, data model, and agent design
2. **App-Only Prompt** - Condensed, copy-paste ready prompt for v0, Lovable, or Replit
3. **Agent-Only Prompt** - Standalone system prompt for AI agent configuration

## Supported Targets

- `v0` - UI-focused, component-level specs for Vercel's v0
- `lovable` - Full-stack specs for Lovable.dev
- `replit` - Code-centric specs for Replit Agent
- `generic` - Tool-agnostic, concept-first output

---

Learn more at https://blueprompt.app
