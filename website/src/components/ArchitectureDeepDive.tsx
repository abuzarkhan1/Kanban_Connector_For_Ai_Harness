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
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground mb-4">
            Under the Hood: Zero AI Cost, Pure Evidence
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Instead of spending millions of tokens on LLM prompts to update task status, AI Harness Project Manager
            uses a deterministic state machine powered by multi-channel file and Git observers.
          </p>
        </div>

        {/* Multi-Layer Flow Architecture Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-14">
          {/* Layer 1: Observers */}
          <div className="rounded-3xl border border-border bg-card p-5 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground font-mono text-[11px] mb-3">
                <span>LAYER 01</span>
                <span>•</span>
                <span>OBSERVERS</span>
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">Passive Watchers</h3>
              <p className="text-[12px] text-muted-foreground leading-relaxed mb-4">
                Listens to system signals without modifying agent processes or repository code.
              </p>
            </div>
            <ul className="space-y-2 font-mono text-[11px] text-foreground/80 border-t border-border pt-3">
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-foreground/60" />
                <span>Git 8s Polling Loop</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-foreground/60" />
                <span>Filesystem Watcher</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-foreground/60" />
                <span>Vitest / Jest Process</span>
              </li>
            </ul>
          </div>

          {/* Layer 2: Event Normalization */}
          <div className="rounded-3xl border border-border bg-card p-5 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground font-mono text-[11px] mb-3">
                <span>LAYER 02</span>
                <span>•</span>
                <span>NORMALIZER</span>
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">Canonical Event Bus</h3>
              <p className="text-[12px] text-muted-foreground leading-relaxed mb-4">
                Transforms raw Git diffs and stdout traces into standardized domain events.
              </p>
            </div>
            <ul className="space-y-2 font-mono text-[11px] text-foreground/80 border-t border-border pt-3">
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-foreground/60" />
                <span>COMMIT_CREATED</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-foreground/60" />
                <span>BRANCH_CHANGED</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-foreground/60" />
                <span>TEST_RUN_PASSED</span>
              </li>
            </ul>
          </div>

          {/* Layer 3: Deterministic Inference */}
          <div className="rounded-3xl border border-border bg-card p-5 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground font-mono text-[11px] mb-3">
                <span>LAYER 03</span>
                <span>•</span>
                <span>INFERENCE</span>
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">Rule Engine</h3>
              <p className="text-[12px] text-muted-foreground leading-relaxed mb-4">
                Validates allowable transitions using strict state machine rules and confidence scoring.
              </p>
            </div>
            <ul className="space-y-2 font-mono text-[11px] text-foreground/80 border-t border-border pt-3">
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-foreground/60" />
                <span>Confidence ≥ 0.90</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-foreground/60" />
                <span>Atomic Transitions</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-foreground/60" />
                <span>Full Evidence Audit Log</span>
              </li>
            </ul>
          </div>

          {/* Layer 4: SQLite & Desktop UI */}
          <div className="rounded-3xl border border-border bg-card p-5 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground font-mono text-[11px] mb-3">
                <span>LAYER 04</span>
                <span>•</span>
                <span>PERSISTENCE</span>
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">Embedded SQLite</h3>
              <p className="text-[12px] text-muted-foreground leading-relaxed mb-4">
                Instant ACID storage inside Electron. Accessible concurrently via MCP CLI.
              </p>
            </div>
            <ul className="space-y-2 font-mono text-[11px] text-foreground/80 border-t border-border pt-3">
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-foreground/60" />
                <span>0.2ms Query Latency</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-foreground/60" />
                <span>Transactional Backups</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-foreground/60" />
                <span>Concurrent CLI Access</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Feature Highlights Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl border border-border bg-card shadow-xs">
            <ShieldCheck className="size-6 text-foreground mb-3" />
            <h4 className="text-base font-semibold text-foreground mb-2">Zero AI API Token Costs</h4>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Never pay Claude or OpenAI API bills just to organize your sprint board. All inferences are derived
              deterministically from raw developer artifacts.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-border bg-card shadow-xs">
            <Monitor className="size-6 text-foreground mb-3" />
            <h4 className="text-base font-semibold text-foreground mb-2">Desktop Native Productivity</h4>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Global hotkeys (Cmd+N, Cmd+1-7), system tray controls, OS notifications on state changes, and
              instant multi-channel toast feedback.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-border bg-card shadow-xs">
            <HardDrive className="size-6 text-foreground mb-3" />
            <h4 className="text-base font-semibold text-foreground mb-2">Zero Cloud Vendor Lock-In</h4>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Export and restore full JSON snapshots with single-click transactional SQLite migrations. Your code and
              sprint data stay 100% on your machine.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
