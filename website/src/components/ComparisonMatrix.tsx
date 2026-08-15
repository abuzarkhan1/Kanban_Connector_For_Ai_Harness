import React from 'react'
import { Check, X, Trophy } from 'lucide-react'

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
    <section id="comparison" className="py-20 bg-[#07080a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-[#0d0f12] text-xs font-mono text-[#c4c9d0] mb-4">
            <Trophy className="size-3.5 text-yellow-400" />
            <span>Competitive Benchmark</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Built for Modern AI-Assisted Workflows
          </h2>
          <p className="text-base text-[#a0a5ad] leading-relaxed">
            Traditional project management tools were built for manual human ticket updates. AI Harness Project
            Manager is purpose-built to observe and orchestrate autonomous AI agents.
          </p>
        </div>

        {/* Matrix Table */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0d0f12] shadow-2xl overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#14171c]/80 text-[13px] font-mono">
                <th className="p-4 sm:p-5 text-white font-semibold min-w-[280px]">Feature Capability</th>
                <th className="p-4 sm:p-5 text-emerald-400 font-semibold bg-emerald-500/[0.05] min-w-[170px]">
                  AI Harness PM
                </th>
                <th className="p-4 sm:p-5 text-[#a0a5ad] min-w-[110px]">Linear</th>
                <th className="p-4 sm:p-5 text-[#a0a5ad] min-w-[110px]">Jira</th>
                <th className="p-4 sm:p-5 text-[#a0a5ad] min-w-[110px]">GitHub</th>
                <th className="p-4 sm:p-5 text-[#a0a5ad] min-w-[110px]">Plane</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-[13px]">
              {rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 sm:p-5 font-medium text-white/90">{row.feature}</td>

                  {/* AI Harness PM */}
                  <td className="p-4 sm:p-5 bg-emerald-500/[0.03]">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono text-[12px]">
                      <Check className="size-4 stroke-[3]" />
                      <span>Native</span>
                    </div>
                  </td>

                  {/* Linear */}
                  <td className="p-4 sm:p-5">
                    {row.linear ? (
                      <Check className="size-4 text-emerald-400" />
                    ) : (
                      <X className="size-4 text-white/20" />
                    )}
                  </td>

                  {/* Jira */}
                  <td className="p-4 sm:p-5">
                    {row.jira ? (
                      <Check className="size-4 text-emerald-400" />
                    ) : (
                      <X className="size-4 text-white/20" />
                    )}
                  </td>

                  {/* GitHub Projects */}
                  <td className="p-4 sm:p-5">
                    {row.github ? (
                      <Check className="size-4 text-emerald-400" />
                    ) : (
                      <X className="size-4 text-white/20" />
                    )}
                  </td>

                  {/* Plane */}
                  <td className="p-4 sm:p-5">
                    {row.plane ? (
                      <Check className="size-4 text-emerald-400" />
                    ) : (
                      <X className="size-4 text-white/20" />
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
