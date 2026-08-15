import React from 'react'
import {
  Monitor,
  HardDrive,
  ShieldCheck
} from 'lucide-react'

export const ArchitectureDeepDive: React.FC = () => {
  return (
    <section id="architecture" className="py-24 bg-background relative border-b border-border/40">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground">
            Under the Hood: Zero AI Cost, Pure Evidence
          </h2>
        </div>

        {/* Multi-Layer Flow Architecture Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-14">
          {/* Layer 1: Observers */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
            <div className="flex items-center gap-2 text-muted-foreground font-mono text-[11px] mb-3">
              <span>LAYER 01</span>
              <span>•</span>
              <span>OBSERVERS</span>
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">Passive Watchers</h3>
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              Listens to system signals without modifying agent processes or repository code.
            </p>
          </div>

          {/* Layer 2: Event Normalization */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
            <div className="flex items-center gap-2 text-muted-foreground font-mono text-[11px] mb-3">
              <span>LAYER 02</span>
              <span>•</span>
              <span>NORMALIZER</span>
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">Canonical Event Bus</h3>
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              Transforms raw Git diffs and stdout traces into standardized domain events.
            </p>
          </div>

          {/* Layer 3: Deterministic Inference */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
            <div className="flex items-center gap-2 text-muted-foreground font-mono text-[11px] mb-3">
              <span>LAYER 03</span>
              <span>•</span>
              <span>INFERENCE</span>
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">Rule Engine</h3>
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              Validates allowable transitions using strict state machine rules and confidence scoring.
            </p>
          </div>

          {/* Layer 4: SQLite & Desktop UI */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
            <div className="flex items-center gap-2 text-muted-foreground font-mono text-[11px] mb-3">
              <span>LAYER 04</span>
              <span>•</span>
              <span>PERSISTENCE</span>
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">Embedded SQLite</h3>
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              Instant ACID storage inside Electron. Accessible concurrently via MCP CLI.
            </p>
          </div>
        </div>

        {/* Feature Highlights Bento Grid (Clean Titles & Icons) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl border border-border bg-card shadow-xs flex items-center gap-4">
            <div className="size-11 rounded-2xl bg-muted grid place-items-center text-foreground shrink-0 border border-border">
              <ShieldCheck className="size-5" />
            </div>
            <h4 className="text-base font-semibold text-foreground">Zero AI API Token Costs</h4>
          </div>

          <div className="p-6 rounded-3xl border border-border bg-card shadow-xs flex items-center gap-4">
            <div className="size-11 rounded-2xl bg-muted grid place-items-center text-foreground shrink-0 border border-border">
              <Monitor className="size-5" />
            </div>
            <h4 className="text-base font-semibold text-foreground">Desktop Native Productivity</h4>
          </div>

          <div className="p-6 rounded-3xl border border-border bg-card shadow-xs flex items-center gap-4">
            <div className="size-11 rounded-2xl bg-muted grid place-items-center text-foreground shrink-0 border border-border">
              <HardDrive className="size-5" />
            </div>
            <h4 className="text-base font-semibold text-foreground">Zero Cloud Vendor Lock-In</h4>
          </div>
        </div>
      </div>
    </section>
  )
}
