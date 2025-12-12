# Contributing to Blueprompt

Thanks for your interest in contributing to Blueprompt! This document outlines how to get started.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Install dependencies with `pnpm install`
4. Copy `.env.local.example` to `.env.local` and add your Anthropic API key
5. Run `pnpm dev` to start the development server

## Development Workflow

```bash
# Start development server
pnpm dev

# Run linter
pnpm lint

# Build for production
pnpm build
```

## How to Contribute

### Reporting Bugs

- Check existing issues first to avoid duplicates
- Use a clear, descriptive title
- Include steps to reproduce the issue
- Describe expected vs actual behavior

### Suggesting Features

- Open an issue describing the feature
- Explain the use case and why it would be valuable
- Be open to discussion about implementation approaches

### Pull Requests

1. Create a branch from `main` for your changes
2. Make your changes with clear, focused commits
3. Ensure `pnpm lint` and `pnpm build` pass
4. Open a PR with a clear description of changes
5. Link any related issues

## Code Style

- Use TypeScript for all new code
- Follow existing patterns in the codebase
- Keep components focused and single-purpose
- Use meaningful variable and function names

## Areas for Contribution

- **Target builders**: Add support for more no-code tools
- **Prompt improvements**: Enhance the system prompt for better output
- **Features**: History, saved prompts, templates, sharing
- **UI/UX**: Accessibility improvements, mobile experience
- **Documentation**: Tutorials, examples, API documentation

## Questions?

Open an issue or reach out to the maintainers. We're happy to help!
