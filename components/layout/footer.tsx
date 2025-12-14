export function Footer() {
  return (
    <footer className="full-bleed py-8 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Blueprompt • Built by <a
            href="https://agenisea.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >Agenisea™</a> 🪼
        </p>
      </div>
    </footer>
  )
}
