import React from 'react'
import { Check, X } from 'lucide-react'

export const ComparisonMatrix: React.FC = () => {
  const rows = [
    {
      feature: '100% Local-First & Private (No Cloud Server)',
      aiHarness: true,
      linear: false,
      jira: false,
      github: false,
      plane: false
    },
    {
      feature: 'Native Model Context Protocol (MCP) Server',
      aiHarness: true,
      linear: false,
      jira: false,
      github: false,
      plane: false
    },
    {
      feature: 'Automatic AI Agent State Transitions',
      aiHarness: true,
      linear: false,
      jira: false,
      github: false,
      plane: false
    },
    {
      feature: 'Background Git & Filesystem Observation',
      aiHarness: true,
      linear: false,
      jira: false,
      github: false,
      plane: false
    },
    {
      feature: 'Zero AI Token Costs ($0 / mo)',
      aiHarness: true,
      linear: false,
      jira: false,
      github: false,
      plane: false
    },
    {
      feature: '0ms Query Latency (Embedded SQLite)',
      aiHarness: true,
      linear: false,
      jira: false,
      github: false,
      plane: false
    },
    {
      feature: 'Multi-Repo Simultaneous Tracking',
      aiHarness: true,
      linear: false,
      jira: false,
      github: false,
      plane: false
    },
    {
      feature: 'System Tray & Global OS Shortcuts',
      aiHarness: true,
      linear: false,
      jira: false,
      github: false,
      plane: false
    },
    {
      feature: 'Full Transactional Database Snapshot & Restore',
      aiHarness: true,
      linear: false,
      jira: false,
      github: false,
      plane: false
    }
  ]

  return (
    <section id="comparison" className="py-24 bg-background relative border-b border-border/40">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground">
            Built for Modern AI-Assisted Workflows
          </h2>
        </div>

        {/* Matrix Table with Clean Monochromatic & Transparent Styling */}
        <div className="rounded-3xl border border-border bg-card shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-[13px] font-mono">
                <th className="p-4 sm:p-5 text-foreground font-medium min-w-[280px]">Feature Capability</th>
                <th className="p-4 sm:p-5 text-foreground font-semibold bg-foreground/[0.04] min-w-[170px] border-x border-border/60">
                  AI Harness PM
                </th>
                <th className="p-4 sm:p-5 text-muted-foreground min-w-[110px]">Linear</th>
                <th className="p-4 sm:p-5 text-muted-foreground min-w-[110px]">Jira</th>
                <th className="p-4 sm:p-5 text-muted-foreground min-w-[110px]">GitHub</th>
                <th className="p-4 sm:p-5 text-muted-foreground min-w-[110px]">Plane</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-[13px]">
              {rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 sm:p-5 font-medium text-foreground">{row.feature}</td>

                  {/* AI Harness PM (Clean white/transparent badge) */}
                  <td className="p-4 sm:p-5 bg-foreground/[0.02] border-x border-border/40">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted/60 text-foreground font-mono text-[11px] font-medium border border-border/60">
                      <Check className="size-3.5 stroke-[2.5]" />
                      <span>Native</span>
                    </div>
                  </td>

                  {/* Linear */}
                  <td className="p-4 sm:p-5">
                    {row.linear ? (
                      <Check className="size-4 text-foreground" />
                    ) : (
                      <X className="size-4 text-muted-foreground/30" />
                    )}
                  </td>

                  {/* Jira */}
                  <td className="p-4 sm:p-5">
                    {row.jira ? (
                      <Check className="size-4 text-foreground" />
                    ) : (
                      <X className="size-4 text-muted-foreground/30" />
                    )}
                  </td>

                  {/* GitHub Projects */}
                  <td className="p-4 sm:p-5">
                    {row.github ? (
                      <Check className="size-4 text-foreground" />
                    ) : (
                      <X className="size-4 text-muted-foreground/30" />
                    )}
                  </td>

                  {/* Plane */}
                  <td className="p-4 sm:p-5">
                    {row.plane ? (
                      <Check className="size-4 text-foreground" />
                    ) : (
                      <X className="size-4 text-muted-foreground/30" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
