import { z } from 'zod'

export const WorktreeInfoSchema = z.object({
  path: z.string(),
  branch: z.string().nullable(),
  head: z.string().nullable(),
  isBare: z.boolean()
})

export const RepositorySchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  name: z.string().min(1).max(200),
  path: z.string().min(1).max(1000),
  defaultBranch: z.string().min(1).max(100),
  currentBranch: z.string().min(1).max(100),
  headCommit: z.string().nullable(),
  worktrees: z.array(WorktreeInfoSchema),
  lastScannedAt: z.number().int(),
  createdAt: z.number().int(),
  updatedAt: z.number().int()
})

export type RepositoryDto = z.infer<typeof RepositorySchema>

export const CreateRepositorySchema = z.object({
  projectId: z.string().uuid(),
  path: z.string().min(1).max(1000),
  name: z.string().min(1).max(200).optional()
}).strict()

export type CreateRepositoryInput = z.infer<typeof CreateRepositorySchema>

export const ListRepositoriesSchema = z.object({
  projectId: z.string().uuid()
}).strict()

export type ListRepositoriesInput = z.infer<typeof ListRepositoriesSchema>

export const DeleteRepositorySchema = z.object({
  id: z.string().uuid()
}).strict()

export type DeleteRepositoryInput = z.infer<typeof DeleteRepositorySchema>

export const ScanRepositorySchema = z.object({
  id: z.string().uuid()
}).strict()

export type ScanRepositoryInput = z.infer<typeof ScanRepositorySchema>
