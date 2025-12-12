# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Blueprompt, please report it responsibly:

1. **Do not** open a public issue
2. Email the maintainers directly or use GitHub's private vulnerability reporting feature
3. Include a detailed description of the vulnerability
4. Provide steps to reproduce if possible

We will respond within 48 hours and work with you to understand and address the issue.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| Latest  | Yes                |

## Security Considerations

### API Keys

- Never commit API keys to the repository
- Use `.env.local` for local development (gitignored by default)
- In production, use environment variables from your hosting provider

### Rate Limiting

The app includes rate limiting to prevent abuse. Default limits:
- 10 requests per minute per IP
- 50 requests per hour per IP

### CSRF Protection

API routes validate the request origin against allowed domains to prevent cross-site request forgery.

### Input Validation

All user inputs are validated using Zod schemas before processing.

## Best Practices for Deployment

1. Set `NEXT_PUBLIC_APP_URL` to your production domain
2. Use HTTPS in production
3. Configure your hosting provider's security headers
4. Monitor API usage and costs
5. Consider adding authentication for production use

## Anthropic API Costs

This app uses the Anthropic Claude API, which has usage costs:
- Each prompt creation uses approximately 4,000 tokens
- Monitor your Anthropic dashboard for usage
- Consider implementing user-level rate limits for public deployments
