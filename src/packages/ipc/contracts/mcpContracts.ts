import { z } from 'zod'

export const SUPPORTED_HARNESSES = [
  'antigravity',
  'antigravity_desktop',
  'antigravity_ide',
  'claude_code',
  'claude_desktop',
  'cursor',
  'windsurf',
  'vscode_roo',
  'vscode_cline',
  'custom'
] as const

export type SupportedHarness = (typeof SUPPORTED_HARNESSES)[number]

export const McpDiagnosticStepSchema = z.object({
  step: z.enum(['config', 'runtime', 'handshake', 'tools', 'database']),
  status: z.enum(['ok', 'warn', 'error']),
  message: z.string()
})

export type McpDiagnosticStep = z.infer<typeof McpDiagnosticStepSchema>

export const McpVerificationResultSchema = z.object({
  success: z.boolean(),
  latencyMs: z.number().optional(),
  toolsDiscovered: z.number().optional(),
  tools: z.array(z.string()).optional(),
  testedAt: z.number(),
  serverInfo: z
    .object({
      name: z.string(),
      version: z.string()
    })
    .optional(),
  diagnostics: z.array(McpDiagnosticStepSchema),
  error: z.string().optional()
})

export type McpVerificationResultDto = z.infer<typeof McpVerificationResultSchema>

export const McpHarnessStatusSchema = z.object({
  id: z.string(),
  harness: z.string(),
  name: z.string(),
  configPath: z.string(),
  category: z.enum(['antigravity', 'claude', 'editor', 'custom']),
  detected: z.boolean(),
  configured: z.boolean(),
  isCustom: z.boolean().optional(),
  verification: McpVerificationResultSchema.optional()
})

export type McpHarnessStatusDto = z.infer<typeof McpHarnessStatusSchema>

export const McpToolCallDtoSchema = z.object({
  id: z.string(),
  tool: z.string(),
  taskId: z.string().nullable().optional(),
  source: z.string(),
  payload: z.record(z.string(), z.unknown()),
  timestamp: z.number()
})

export type McpToolCallDto = z.infer<typeof McpToolCallDtoSchema>

export const McpStatusSchema = z.object({
  serverRunning: z.boolean(),
  socketPath: z.string(),
  harnesses: z.array(McpHarnessStatusSchema),
  recentToolCalls: z.array(McpToolCallDtoSchema),
  lastActiveSession: z
    .object({
      tool: z.string(),
      timestamp: z.number(),
      source: z.string()
    })
    .optional()
})

export type McpStatusDto = z.infer<typeof McpStatusSchema>

export const ConfigureHarnessSchema = z.object({
  harness: z.string(),
  configPath: z.string().optional()
}).strict()

export type ConfigureHarnessInput = z.infer<typeof ConfigureHarnessSchema>

export const UnconfigureHarnessSchema = z.object({
  harness: z.string(),
  configPath: z.string().optional()
}).strict()

export type UnconfigureHarnessInput = z.infer<typeof UnconfigureHarnessSchema>

export const VerifyHarnessSchema = z.object({
  harness: z.string(),
  configPath: z.string().optional()
}).strict()

export type VerifyHarnessInput = z.infer<typeof VerifyHarnessSchema>

export const AddCustomHarnessSchema = z.object({
  name: z.string().min(1),
  configPath: z.string().min(1)
}).strict()

export type AddCustomHarnessInput = z.infer<typeof AddCustomHarnessSchema>

export const RemoveCustomHarnessSchema = z.object({
  id: z.string().min(1)
}).strict()

export type RemoveCustomHarnessInput = z.infer<typeof RemoveCustomHarnessSchema>
