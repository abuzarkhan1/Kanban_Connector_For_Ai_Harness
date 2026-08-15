import React from 'react'
import { ArrowLeft, CheckCircle2, ShieldCheck, FileText, Cpu, Lock } from 'lucide-react'

export const CompliancePage: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const compliances = [
    {
      title: 'SOC 2 Type II Readiness by Design',
      desc: 'Zero data egress guarantees that no customer source code or task metadata leaves your company perimeter.',
      status: 'Compliant'
    },
    {
      title: 'HIPAA & Protected Health Information (PHI)',
      desc: 'Because zero cloud transmission occurs, developers working in healthcare environments can safely organize code without BAA overhead.',
      status: 'Compliant'
    },
    {
      title: 'GDPR / CCPA / International Data Sovereignty',
      desc: 'All data resides strictly in local SQLite storage within the jurisdiction and hardware boundary of the local machine.',
      status: 'Compliant'
    },
    {
      title: 'Cryptographic Binary Verification',
      desc: 'Every official release binary is signed and accompanied by verifiable SHA-256 checksums published on GitHub.',
      status: 'Verified'
    },
    {
      title: 'Air-Gapped & Offline Environment Support',
      desc: 'Functions 100% identically without any internet connection or external network access.',
      status: 'Supported'
    }
  ]

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
            <ShieldCheck className="size-4 text-foreground" />
            <span className="font-semibold text-sm text-foreground">Compliance & Security</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-3">
            Security & Compliance Standards
          </h1>
          <p className="text-xs font-mono text-muted-foreground">
            Architecture Verification · Enterprise Security Profile
          </p>
        </div>

        {/* Security Overview Card */}
        <div className="p-6 rounded-3xl border border-border bg-card space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Local-First Compliance Model</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Traditional enterprise compliance struggles with SaaS cloud tools because sensitive source code,
            commit messages, and architectural blueprints are sent to external databases. AI Harness PM completely
            eliminates this threat surface by executing 100% locally on user hardware.
          </p>
        </div>

        {/* Compliance Items Grid */}
        <div className="space-y-3">
          {compliances.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-border bg-card flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="font-semibold text-sm text-foreground">{item.title}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{item.desc}</div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full border border-border bg-muted/60 text-foreground font-mono text-[11px] shrink-0 font-medium flex items-center gap-1">
                <CheckCircle2 className="size-3 text-foreground" />
                <span>{item.status}</span>
              </span>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} AI Harness Project Manager. Open source under MIT License.</p>
      </footer>
    </div>
  )
}
