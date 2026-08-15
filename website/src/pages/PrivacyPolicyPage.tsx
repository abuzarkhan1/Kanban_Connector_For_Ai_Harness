import React from 'react'
import { ArrowLeft, ShieldCheck, Lock, EyeOff } from 'lucide-react'

export const PrivacyPolicyPage: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-3xl">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer font-medium"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Home</span>
          </button>
          <div className="flex items-center gap-2">
            <Lock className="size-4 text-foreground" />
            <span className="font-semibold text-sm text-foreground">Privacy Policy</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-3">
            Privacy Policy
          </h1>
          <p className="text-xs font-mono text-muted-foreground">
            Effective Date: {new Date().getFullYear()} · Zero-Telemetry Guarantee
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card flex items-start gap-4">
          <ShieldCheck className="size-6 text-foreground shrink-0 mt-0.5" />
          <div className="space-y-1 text-sm">
            <div className="font-semibold text-foreground">Zero Telemetry & 100% Local Processing</div>
            <p className="text-muted-foreground leading-relaxed">
              AI Harness Project Manager does not collect, transmit, or store any personal data, source code, or task
              information on remote servers. Everything runs locally on your machine.
            </p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-2.5">
            <h2 className="text-base font-semibold text-foreground">1. Information We Do Not Collect</h2>
            <p>
              Unlike cloud-hosted project management tools, AI Harness Project Manager does not maintain user accounts,
              does not log IP addresses, does not use tracking cookies, and does not send diagnostic telemetry to external servers.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-semibold text-foreground">2. Local Storage & SQLite Database</h2>
            <p>
              All projects, sprint cards, activity logs, and evidence traces are stored locally in an encrypted/atomic
              SQLite database at <code>~/.ai-harness/kanban.sqlite</code> on your local file system.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-semibold text-foreground">3. AI Model & API Key Privacy</h2>
            <p>
              AI Harness Project Manager does not require or collect your OpenAI, Anthropic, or Google API keys.
              The deterministic inference engine processes state transitions locally on your CPU with zero external API calls.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-semibold text-foreground">4. GDPR & CCPA Compliance</h2>
            <p>
              Because we do not store, process, or transmit personal data to any external server, AI Harness PM is
              naturally compliant with European GDPR, California CCPA, and international data privacy regulations by design.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} AI Harness Project Manager. Open source under MIT License.</p>
      </footer>
    </div>
  )
}
