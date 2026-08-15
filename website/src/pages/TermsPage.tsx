import React from 'react'
import { ArrowLeft, Scale, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const TermsPage: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
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
            <Scale className="size-4 text-foreground" />
            <span className="font-semibold text-sm text-foreground">Terms of Service</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-3">
            Terms of Service
          </h1>
          <p className="text-xs font-mono text-muted-foreground">
            Effective Date: {new Date().getFullYear()} · Open Source MIT License
          </p>
        </div>

        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-2.5">
            <h2 className="text-base font-semibold text-foreground">1. Open Source License</h2>
            <p>
              AI Harness Project Manager is free and open-source software provided under the <strong>MIT License</strong>.
              You are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
              subject to the conditions of the MIT License.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-semibold text-foreground">2. Local-First Operation & Data Ownership</h2>
            <p>
              AI Harness Project Manager operates entirely on your local machine. All project metadata, task contents, Git
              traces, and SQLite databases remain exclusively under your control and ownership. We do not host, store, or
              have access to your data.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-semibold text-foreground">3. Disclaimer of Warranty</h2>
            <p>
              THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
              TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT. IN NO EVENT SHALL
              THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-semibold text-foreground">4. Autonomous Agent Interactions</h2>
            <p>
              You acknowledge that connecting AI coding harnesses (such as Google Antigravity, Claude Desktop, or Cursor)
              to the Model Context Protocol (MCP) server allows those autonomous agents to read and modify local tasks
              within the bounds of your configured workspace permissions.
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
