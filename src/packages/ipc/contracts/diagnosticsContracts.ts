import { z } from 'zod'

export const DiagnosticsInfoSchema = z.object({
  version: z.string(),
  platform: z.string(),
  arch: z.string(),
  nodeVersion: z.string(),
  electronVersion: z.string(),
  uptimeSeconds: z.number(),
  memoryUsageMb: z.number(),
  dbPath: z.string(),
  dbSizeKb: z.number(),
  counts: z.object({
    projects: z.number(),
    tasks: z.number(),
    repositories: z.number(),
    sessions: z.number(),
    events: z.number()
  }),
  observers: z.object({
    git: z.string(),
    filesystem: z.string(),
    process: z.string(),
    mcp: z.string()
  }),
  recentLogs: z.array(
    z.object({
      ts: stringOrNumber(),
      level: z.string(),
      component: z.string(),
      message: z.string()
    })
  )
})

function stringOrNumber(): z.ZodType<string | number> {
  return z.union([z.string(), z.number()])
}

export type DiagnosticsInfoDto = z.infer<typeof DiagnosticsInfoSchema>
