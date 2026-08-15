import { z } from 'zod'

export type SupportedHarness = 'antigravity' | 'claude_code' | 'claude_desktop' | 'cursor' | 'windsurf'

export const McpHarnessStatusSchema = z.object({
  harness: z.enum(['antigravity', 'claude_code', 'claude_desktop', 'cursor', 'windsurf']),
  name: z.string(),
  configPath: z.string(),
  detected: z.boolean(),
  configured: z.boolean()
})

export type McpHarnessStatusDto = z.infer<typeof McpHarnessStatusSchema>

export const McpStatusSchema = z.object({
  serverRunning: z.boolean(),
  socketPath: z.string(),
  harnesses: z.array(McpHarnessStatusSchema),
  recentToolCalls: z.array(
    z.object({
      id: z.string(),
      tool: z.string(),
      args: z.record(z.string(), z.unknown()),
      timestamp: z.number()
    })
  )
})

export type McpStatusDto = z.infer<typeof McpStatusSchema>

export const ConfigureHarnessSchema = z.object({
  harness: z.enum(['antigravity', 'claude_code', 'claude_desktop', 'cursor', 'windsurf'])
}).strict()

export type ConfigureHarnessInput = z.infer<typeof ConfigureHarnessSchema>
