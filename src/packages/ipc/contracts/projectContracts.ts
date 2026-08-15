import { z } from 'zod'

export const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  createdAt: z.number().int(),
  updatedAt: z.number().int()
})

export type ProjectDto = z.infer<typeof ProjectSchema>

export const CreateProjectSchema = z.object({
  name: z.string().trim().min(1).max(200)
}).strict()

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>

export const UpdateProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1).max(200)
}).strict()

export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>

export const DeleteProjectSchema = z.object({
  id: z.string().uuid()
}).strict()

export type DeleteProjectInput = z.infer<typeof DeleteProjectSchema>
